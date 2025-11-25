import type { Metadata } from "next";
import { CarRentalSearch } from "@/app/_components/CarRentalSearch";
import RouteInfoSection from "@/app/_components/Routeinfo";
import Link from "next/link";
import Image from "next/image";
import { Users, ArrowRight } from "lucide-react";
import { AccordionItem } from "@/app/_components/FAQ";

/******************************
 * TYPES
 ******************************/
type PageParams = { slug: string };

interface BaseCarData {
  category: string;
  image: string;
  name: string;
  capacity: number;
  description: string;
}

interface FixedPrice {
  cabs: string;
  price: number;
  distance: number;
  per_kms_extra_charge: number;
}

interface FetchedCarData {
  category: string;
  image: string;
  price: number;
  seats: number;
  description: string;
  name?: string;
  pickup: string;
  drop: string;
}

interface InitialValues {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
  dropoffDate: Date | undefined;
}

type DynamicRouteInfo = { distance: string; time: string };

/******************************
 * HELPERS
 ******************************/
function parseSlug(slug: string) {
  const parts = slug.split("-to-");
  const pickup = parts[0] || "";
  const drop = (parts[1] || "").replace("-cabs", "");
  const routeKey = `${pickup}-${drop}`.toLowerCase();
  return { pickup, drop, routeKey };
}

function createSlug(pickup: string, drop: string) {
  return `${pickup}-to-${drop}-cabs`;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/******************************
 * STATIC PARAMS
 ******************************/
export async function generateStaticParams(): Promise<PageParams[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/seo/list`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data.map((item: any) => ({
      slug: createSlug(item.slug.split("-")[0], item.slug.split("-")[1]),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

/******************************
 * METADATA
 ******************************/
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const { pickup, drop } = parseSlug(resolved.slug);
  const pCap = capitalize(pickup);
  const dCap = capitalize(drop);
  return {
    title: `${pCap} to ${dCap} Cabs | BlazeCab`,
    description: `Book affordable ${pCap} to ${dCap} cab services. Compare prices, choose from Sedans, SUVs, or Tempo Travellers, and book instantly.`,
    alternates: {
      canonical: `https://blazecab.in/location/${resolved.slug}`,
    },
  };
}

/******************************
 * OSRM HELPERS
 ******************************/
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
}

function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(0)} km`;
}

async function getCoordinates(location: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "BlazeCab/1.0" } });
    const data = await res.json();
    if (!data[0]) return null;
    return `${data[0].lon},${data[0].lat}`;
  } catch {
    return null;
  }
}

async function fetchDynamicRouteInfo(
  pickup: string,
  drop: string
): Promise<DynamicRouteInfo | null> {
  const p = await getCoordinates(pickup);
  const d = await getCoordinates(drop);
  if (!p || !d) return null;

  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${p};${d}?overview=false`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();
    if (!json.routes?.[0]) return null;

    return {
      distance: formatDistance(json.routes[0].distance),
      time: formatDuration(json.routes[0].duration),
    };
  } catch (e) {
    console.error("OSRM Error", e);
    return null;
  }
}

/******************************
 * FETCH CAR PRICES
 ******************************/
async function fetchDynamicCarPrices(pickup: string, drop: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const [carRes, priceRes] = await Promise.all([
      fetch(`${baseUrl}/api/car`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/routes?pickup=${pickup}&drop=${drop}`, {
        cache: "no-store",
      }),
    ]);

    if (!carRes.ok || !priceRes.ok) return { cars: [], minPrice: null };

    const baseCars: BaseCarData[] = await carRes.json();
    const fixedPrices: FixedPrice[] = await priceRes.json();

    const dynamicCars = baseCars
      .map((car) => {
        const match = fixedPrices.find(
          (f) =>
            car.category.toLowerCase().includes(f.cabs.toLowerCase()) ||
            f.cabs.toLowerCase().includes(car.category.toLowerCase())
        );
        return match
          ? {
              category: car.category,
              image: car.image,
              name: car.name,
              price: match.price,
              seats: car.capacity,
              description: car.description,
              pickup,
              drop,
            }
          : null;
      })
      .filter(Boolean) as FetchedCarData[];

    return {
      cars: dynamicCars,
      minPrice: dynamicCars.length
        ? Math.min(...dynamicCars.map((c) => c.price))
        : null,
    };
  } catch (e) {
    console.error("Price fetch error", e);
    return { cars: [], minPrice: null };
  }
}

/******************************
 * MAIN PAGE
 ******************************/
export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolved = await params;
  const { pickup, drop, routeKey } = parseSlug(resolved.slug);

  const pickupCap = capitalize(pickup);
  const dropCap = capitalize(drop);
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  /*************************************
   * FETCH SEO + FAQ FROM DB
   *************************************/
  let rawSeoContent: string | null = null;
  let faqs: { question: string; answer: string }[] = [];

  try {
    const seoRes = await fetch(`${baseUrl}/api/seo/${routeKey}/get`, {
      cache: "no-store",
    });

    if (seoRes.ok) {
      const seoData = await seoRes.json();
      const data = seoData.data || seoData;
      rawSeoContent = data?.seoContent || null;
      faqs = data?.faqs || [];
    }
  } catch (e) {
    console.error("SEO Fetch Error", e);
  }

  // 🔹 FIX: Replace literal '\n' and '\\n' with <br/> tags to fix formatting issues
  const seoContent = rawSeoContent
    ? rawSeoContent.replace(/\\n/g, "<br />").replace(/\n/g, "<br />")
    : null;

  /*************************************
   * FETCH PRICE & DISTANCE
   *************************************/
  const [dynamicInfo, { cars: dynamicCars, minPrice }] = await Promise.all([
    fetchDynamicRouteInfo(pickupCap, dropCap),
    fetchDynamicCarPrices(pickupCap, dropCap),
  ]);

  const routeInfo = {
    distance: dynamicInfo?.distance || "N/A",
    time: dynamicInfo?.time || "N/A",
    startingFare: minPrice || 0,
  };

  /*************************************
   * INITIAL FORM VALUES
   *************************************/
  const pickupDate = new Date();
  pickupDate.setDate(pickupDate.getDate() + 1);
  const pickupTime = pickupDate;

  const initialValues: InitialValues = {
    pickupLocation: pickup,
    dropoffLocation: drop,
    pickupDate,
    pickupTime,
    dropoffDate: pickupDate,
  };

  /*************************************
   * GRID LOGIC
   *************************************/
  let gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // Default

  if (dynamicCars.length === 3) {
    gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  } else if (dynamicCars.length === 2) {
    gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto";
  } else if (dynamicCars.length === 1) {
    gridClass = "grid-cols-1 max-w-md mx-auto";
  }

  /*************************************
   * RETURN UI
   *************************************/
  return (
    <main className="min-h-screen ">
      {/* HEADER SECTION */}
      <div className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              <span className="text-[#6aa4e0]">{pickupCap}</span> to{" "}
              <span className="text-[#6aa4e0]">{dropCap}</span> Cabs
            </h1>
            <p className="mt-4 text-gray-500 text-lg">
              Book premium outstation cabs with transparent pricing. Zero hidden
              charges.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border  max-w-7xl mx-auto">
            <CarRentalSearch initialValues={initialValues} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-12 py-12">
        {/* ROUTE INFO */}
        <RouteInfoSection
          distance={routeInfo.distance}
          time={routeInfo.time}
          startingFare={routeInfo.startingFare}
        />

        {/* CAR GRID */}
        <section>
          <div className="flex items-center justify-between my-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Vehicles
            </h2>
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              {dynamicCars.length} options available
            </div>
          </div>

          <div className={`grid gap-6 ${gridClass}`}>
            {dynamicCars.map((car) => (
              <Link
                href={{
                  pathname: "/carride",
                  query: {
                    pickupLocation: pickup,
                    dropoffLocation: drop,
                    pickupDate: pickupDate.toISOString(),
                    pickupTime: pickupTime.toISOString(),
                    rideType: "One Way",
                  },
                }}
                className="group block h-full"
                key={car.category}
              >
                <div className="h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#6aa4e0]/40 flex flex-col relative">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gray-900/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                      {car.category}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full bg-gray-50 p-4 flex items-center justify-center">
                    <Image
                      src={car.image}
                      alt={car.category}
                      width={240}
                      height={160}
                      className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {car.name || car.category}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {car.seats} Seats
                          </span>
                          {/* <span>•</span> */}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {car.description}
                    </p>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">
                          One Way Price
                        </p>
                        <p className="text-xl font-extrabold text-[#6aa4e0]">
                          ₹{car.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="bg-gray-900 text-white p-2 rounded-lg group-hover:bg-[#6aa4e0] transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {dynamicCars.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                We couldn't find any specific cabs for this route at the moment.
              </p>
              <Link
                href="/"
                className="text-[#6aa4e0] font-semibold mt-2 inline-block"
              >
                Search all routes
              </Link>
            </div>
          )}
        </section>

        {/* SEO CONTENT */}
        {seoContent && (
          <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div
              className="
                 max-w-none text-gray-700
                 /* Headings */
                 [&>h1]:text-2xl sm:[&>h1]:text-3xl
                 [&>h1]:font-bold
                 [&>h1]:text-gray-900
                 [&>h1]:mb-5 sm:[&>h1]:mb-6

                 [&>h2]:text-xl sm:[&>h2]:text-3xl
                 [&>h2]:font-semibold
                 [&>h2]:text-gray-900
                 [&>h2]:mb-4 sm:[&>h2]:mb-5

                 [&>h3]:text-lg sm:[&>h3]:text-2xl
                 [&>h3]:font-semibold
                 [&>h3]:text-gray-900
                 [&>h3]:mb-3 sm:[&>h3]:mb-4

                 /* Paragraphs */
                 [&>p]:text-base sm:[&>p]:text-lg
                 [&>p]:text-gray-700
                 [&>p]:leading-relaxed
                 [&>p]:mb-3 sm:[&>p]:mb-4

                 /* Lists */
                 [&>ul]:list-disc
                 [&>ul]:pl-5 sm:[&>ul]:pl-6
                 [&>ul]:mb-3 sm:[&>ul]:mb-4
                 [&>li]:marker:text-[#6aa4e0]
                 [&>li]:text-gray-700
                 [&>li]:text-base sm:[&>li]:text-lg
                 [&>li]:leading-relaxed
                 [&>li]:mb-1 sm:[&>li]:mb-2

                 /* Strong text */
                 [&>strong]:text-gray-900
                 [&>strong]:font-semibold

                 /* Links */
                 [&>a]:text-[#6aa4e0]
                 [&>a]:font-semibold
                 hover:[&>a]:underline
               "
              dangerouslySetInnerHTML={{ __html: seoContent }}
            />
          </section>
        )}

        {/* FAQ FROM DB */}
        {faqs.length > 0 && (
          <section>
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4">
                <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
                  <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    FAQ
                  </span>
                  <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
                    Any Questions? Look Here
                  </h2>
                  <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
                    Find quick answers to the most common questions about
                    BlazeCab rides, pricing, and policies.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 max-w-7xl mx-auto">
              {faqs.map((f) => (
                <AccordionItem header={f.question} text={f.answer} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
