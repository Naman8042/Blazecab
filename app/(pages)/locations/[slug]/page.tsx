import type { Metadata } from "next";
import { CarRentalSearch } from "@/app/_components/CarRentalSearch";
import cabFares from "@/data/cabFares.json";
import RouteInfoSection from "@/app/_components/Routeinfo";
import Link from "next/link";
import Image from "next/image";
import { AccordionItem } from "@/app/_components/FAQ";

type Params = { pickup: string; drop: string };

// --- START: Consolidated Type Definitions ---

type FaqItem = {
  question: string;
  answer: string;
};

// 1. This is the data from your /api/car response
interface BaseCarData {
  category: string;
  image: string;
  name: string;
  capacity: number;
  description: string;
  // It can have inclusions/exclusions here, but we will ignore them
  inclusions?: string[];
  exclusions?: string[];
  termscondition?: string[];
}

// 2. This is the data from your /api/routes response
type FixedPrice = {
  cabs: string;
  price: number;
  distance: number;
  per_kms_extra_charge: number;
};

// 3. This is the props interface for the CarCategoryCard component
// It needs all data to pass to the booking page
interface CarCategoryCardProps {
  category: string;
  image: string;
  price: number;
  seats: number;
  description: string;
  name?: string;
  pickup: string;
  drop: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
}

// 4. This is the interface for the data returned by our fetcher
// It includes car data + pickup/drop, but NOT date/time.
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

// 5. This is the main type for the cabFares.json file
type RouteData = {
  faq: FaqItem[];
  seoContent?: string;
};

type CabFaresData = Record<string, RouteData>;

// 6. Type for the search component
interface InitialValues {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
  dropoffDate: Date | undefined;
}

// 7. Type for OSRM API response
type DynamicRouteInfo = { distance: string; time: string };

// --- END: Consolidated Type Definitions ---

// 🔹 Generate static params
export async function generateStaticParams(): Promise<Params[]> {
  return Object.keys(cabFares).map((key) => {
    const [pickup, drop] = key.split("-");
    return { pickup, drop };
  });
}

// 🔹 Generate SEO metadata
export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props.params;
  const pickup = capitalize(params.pickup);
  const drop = capitalize(params.drop);

  return {
    title: `${pickup} to ${drop} Cabs | BlazeCab`,
    description: `Book ${pickup} to ${drop} cab service with BlazeCab. Transparent pricing, clean cars, and professional drivers.`,
    openGraph: {
      title: `${pickup} to ${drop} Cabs | BlazeCab`,
      description: `Enjoy affordable and comfortable rides from ${pickup} to ${drop} with BlazeCab.`,
      url: `https://blazecab.in/${params.pickup}/${params.drop}`,
      siteName: "BlazeCab",
      type: "website",
    },
  };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🔹 Default pickup time helper
const getDefaultPickupTime = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0); // 6 AM default
  return tomorrow;
};

// --- START: OSRM/Nominatim API Helpers ---
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
}
function formatDistance(meters: number): string {
  const km = (meters / 1000).toFixed(0);
  return `${km} km`;
}
async function getCoordinates(location: string): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "BlazeCab-App/1.0 (contact@blazecab.in)" },
      next: { revalidate: 3600 * 24 },
    });
    if (!res.ok) throw new Error(`Nominatim API error: ${res.statusText}`);
    const data = await res.json();
    if (!data || data.length === 0)
      throw new Error(`No coordinates found for ${location}`);
    return `${data[0].lon},${data[0].lat}`;
  } catch (error) {
    console.error(`Failed to geocode ${location}:`, (error as Error).message);
    return null;
  }
}

async function fetchDynamicRouteInfo(
  pickup: string,
  drop: string
): Promise<DynamicRouteInfo | null> {
  const pickupCoords = await getCoordinates(pickup);
  const dropCoords = await getCoordinates(drop);
  if (!pickupCoords || !dropCoords) return null;
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${pickupCoords};${dropCoords}?overview=false`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`OSRM API error: ${res.statusText}`);
    const data = await res.json();
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0)
      throw new Error("OSRM could not find a route");
    const route = data.routes[0];
    return {
      distance: formatDistance(route.distance),
      time: formatDuration(route.duration),
    };
  } catch (error) {
    console.error(`Failed to fetch route info:`, (error as Error).message);
    return null;
  }
}
// --- END: OSRM/Nominatim API Helpers ---

// --- START: DYNAMIC CAR PRICE FETCHER (UPDATED) ---
/**
 * Fetches dynamic car prices by merging /api/car and /api/routes
 */
async function fetchDynamicCarPrices(
  pickup: string,
  drop: string
): Promise<{ cars: FetchedCarData[]; minPrice: number | null }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // 1. Fetch Base Car Data
    const carRes = await fetch(`${baseUrl}/api/car`, { cache: "no-store" });
    if (!carRes.ok) {
      throw new Error(`API error (cars): ${carRes.statusText}`);
    }
    const baseCars: BaseCarData[] = await carRes.json();

    // 2. Fetch Dynamic Price Data
    const priceRes = await fetch(
      `${baseUrl}/api/routes?pickup=${encodeURIComponent(
        pickup
      )}&drop=${encodeURIComponent(drop)}`,
      {
        cache: "no-store",
      }
    );

    if (!priceRes.ok) {
      throw new Error(`API error (routes): ${priceRes.statusText}`);
    }
    const fixedPrices: FixedPrice[] = await priceRes.json();

    if (!fixedPrices || !fixedPrices.length) {
      console.warn(`No fixed prices found for ${pickup} to ${drop}`);
      return { cars: [], minPrice: null };
    }

    // 3. Merge Base Car Data with Dynamic Prices
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
              pickup: pickup, // Add pickup
              drop: drop,     // Add drop
            }
          : null;
      })
      .filter(Boolean) as FetchedCarData[]; // Cast to our new type

    // 4. Find the minimum price
    const minPrice =
      dynamicCars.length > 0
        ? Math.min(...dynamicCars.map((c) => c.price))
        : null;

    return { cars: dynamicCars, minPrice: minPrice }; // This is now type-safe
  } catch (error) {
    console.error(
      `Failed to fetch dynamic car prices:`,
      (error as Error).message
    );
    return { cars: [], minPrice: null };
  }
}
// --- END: DYNAMIC CAR PRICE FETCHER ---

// 🔹 Main dynamic route page
export default async function Page({ params }: { params: Promise<Params> }) {
  const { pickup, drop } = await params;
  const pickupCap = capitalize(pickup);
  const dropCap = capitalize(drop);
  const routeKey = `${pickup}-${drop}`.toLowerCase();

  // Define dates and times for the page
  const pickupDate = new Date(new Date().setDate(new Date().getDate() + 1));
  const pickupTime = getDefaultPickupTime();
  const dropoffDate = new Date(new Date().setDate(new Date().getDate() + 1));

  const initialValues: InitialValues = {
    pickupLocation: pickup,
    dropoffLocation: drop,
    pickupDate,
    pickupTime,
    dropoffDate,
  };

  // 1. Get STATIC data from JSON
  const staticRouteData = (cabFares as CabFaresData)[routeKey];
  const faqs: FaqItem[] = staticRouteData?.faq || [];
  const seoContent: string | null = staticRouteData?.seoContent || null;

  // 2. Fetch DYNAMIC data
  const dynamicInfo = await fetchDynamicRouteInfo(pickupCap, dropCap);
  const { cars: dynamicCars, minPrice: dynamicMinPrice } =
    await fetchDynamicCarPrices(pickupCap, dropCap);

  // 3. Combine data
  const routeInfo = {
    distance: dynamicInfo?.distance || "N/A",
    time: dynamicInfo?.time || "N/A",
    startingFare: dynamicMinPrice || 0,
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 pt-26">
      {/* 🔹 Search Component */}
      <h1 className="text-xl sm:text-2xl md:text-3xl uppercase text-center font-bold text-[#6aa4e0]">
        Book {pickupCap} to {dropCap} Cabs
      </h1>
      <CarRentalSearch initialValues={initialValues} />

      {/* 🔹 Route Summary Section */}
      {routeInfo && (
        <RouteInfoSection
          distance={routeInfo.distance}
          time={routeInfo.time}
          startingFare={routeInfo.startingFare}
        />
      )}

      {/* 🔹 Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dynamicCars.length > 0 ? (
          dynamicCars.map((car) => (
            <CarCategoryCard
              key={car.category}
              {...car} // Spread all props from FetchedCarData
              
              // Add the missing props to satisfy CarCategoryCardProps
              pickupDate={pickupDate}
              pickupTime={pickupTime}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h2 className="text-xl font-semibold">
              Sorry! We couldn’t find any available cabs for this route.
            </h2>
            <p>Please try searching for a different route.</p>
          </div>
        )}
      </div>

      {/* 🔹 SEO Content Section (Styled as requested) */}
      {seoContent && (
        <section className="mt-12 px-4">
          <div
            className="
              prose max-w-none 
              
              /* Larger Heading Styles */
              prose-headings:font-bold
              prose-headings:text-gray-900 
              prose-h2:text-4xl 
              prose-h3:text-3xl 
              prose-h3:mb-4

              /* Body & Link Styles */
              prose-p:text-gray-700
              prose-p:my-4
              prose-strong:text-gray-900
              prose-a:text-[#6aa4e0]
              prose-a:font-semibold
              hover:prose-a:underline
              
              /* List Styles (No Bullets) */
              prose-ul:list-none
              prose-ul:p-0
              prose-li:my-3
            "
            dangerouslySetInnerHTML={{ __html: seoContent }}
          />
        </section>
      )}

      {/* 🔹 FAQs */}
      <h1 className="text-xl sm:text-2xl font-bold">
        FAQs for {pickupCap} to {dropCap} Cabs
      </h1>
      {faqs.length > 0 &&
        faqs.map((faq, index) => (
          <AccordionItem key={index} header={faq.question} text={faq.answer} />
        ))}
    </main>
  );
}

// 🔹 CarCategoryCard Component (UPDATED)
const CarCategoryCard = ({
  category,
  image,
  price,
  seats,
  description,
  pickup,
  drop,
  pickupDate,
  pickupTime,
}: CarCategoryCardProps) => (
  <Link
    href={{
      pathname: "/bookingpage",
      // Pass all relevant data to the booking page
      query: {
        pickup,
        drop,
        pickupDate: pickupDate?.toISOString(),
        pickupTime: pickupTime?.toISOString(),
        category,
        price,
        seats,
      },
    }}
    className="block"
  >
    <div className="flex sm:flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="relative w-48 h-32 mb-4">
        <Image src={image} alt={category} layout="fill" objectFit="contain" />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900">{category}</h3>
          <span className="bg-[#FFB300] text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            {seats} Seats
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">{description}</p>

        <p className="text-2xl font-bold text-[#6aa4e0]">
          ₹{price.toLocaleString()}
        </p>
      </div>
    </div>
  </Link>
);
