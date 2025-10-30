import type { Metadata } from "next";
import { CarRentalSearch } from "@/app/_components/CarRentalSearch";
import cabFares from "@/data/cabFares.json";
import RouteInfoSection from "@/app/_components/Routeinfo";
import Link from "next/link";
import Image from "next/image";
import { AccordionItem } from "@/app/_components/FAQ";

// ⬅️ UPDATED: Page params type
type PageParams = {
  slug: string;
};

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

// --- START: NEW SLUG HELPER FUNCTIONS ---

/**
 * Parses a slug like "delhi-to-agra-cabs" into its components.
 */
function parseSlug(slug: string): { pickup: string; drop: string; routeKey: string } {
  const parts = slug.split('-to-');
  const pickup = parts[0] || "default"; // Handle potential error
  
  // Removes "-cabs" from the end of the second part
  const dropPart = parts[1] || "default-cabs"; 
  const drop = dropPart.replace('-cabs', '');
  
  // Re-create the key for cabFares.json (e.g., "delhi-agra")
  const routeKey = `${pickup}-${drop}`;
  
  return { pickup, drop, routeKey };
}

/**
 * Creates a slug like "delhi-to-agra-cabs" from "delhi" and "agra".
 */
function createSlug(pickup: string, drop: string): string {
  return `${pickup}-to-${drop}-cabs`;
}

// --- END: NEW SLUG HELPER FUNCTIONS ---


// 🔹 Generate static params (UPDATED)
export async function generateStaticParams(): Promise<PageParams[]> {
  return Object.keys(cabFares).map((key) => {
    // key is "delhi-agra"
    const [pickup, drop] = key.split("-");
    return { 
      slug: createSlug(pickup, drop) // Returns "delhi-to-agra-cabs"
    };
  });
}

// 🔹 Generate SEO metadata (FIXED)
export async function generateMetadata(
  // 1. Rename prop to await it
  { params: paramsPromise }: { params: Promise<PageParams> }
): Promise<Metadata> {
  
  // 2. Await the params promise
  const params = await paramsPromise;

  // 3. Parse the slug
  const { pickup, drop } = parseSlug(params.slug);

  // 4. Capitalize
  const pickupCap = capitalize(pickup);
  const dropCap = capitalize(drop);

  return {
    title: `${pickupCap} to ${dropCap} Cabs | BlazeCab`,
    description: `Book ${pickupCap} to ${dropCap} cab service with BlazeCab. Transparent pricing, clean cars, and professional drivers.`,
    openGraph: {
      title: `${pickupCap} to ${dropCap} Cabs | BlazeCab`,
      description: `Enjoy affordable and comfortable rides from ${pickupCap} to ${dropCap} with BlazeCab.`,
      // 5. Update the URL to use the new structure
      url: `https://blazecab.in/location/${params.slug}`,
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

// --- START: OSRM/Nominatim API Helpers (Unchanged) ---
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

// --- START: DYNAMIC CAR PRICE FETCHER (Unchanged) ---
/**
 * Fetches dynamic car prices by merging /api/car and /api/routes
 */
async function fetchDynamicCarPrices(
  pickup: string,
  drop: string
): Promise<{ cars: FetchedCarData[]; minPrice: number | null }> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

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

// 🔹 Main dynamic route page (FIXED)
export default async function Page(
  // 1. Rename prop to await it
  { params: paramsPromise }: { params: Promise<PageParams> }
) {
  
  // 2. Await the params promise
  const params = await paramsPromise;

  // 3. Parse the slug to get pickup, drop, and routeKey
  const { pickup, drop, routeKey } = parseSlug(params.slug);
  
  // 4. Capitalize
  const pickupCap = capitalize(pickup);
  const dropCap = capitalize(drop);

  // Define dates and times for the page
  const pickupDate = new Date(new Date().setDate(new Date().getDate() + 1));
  const pickupTime = getDefaultPickupTime();
  const dropoffDate = new Date(new Date().setDate(new Date().getDate() + 1));

  const initialValues: InitialValues = {
    pickupLocation: pickup, // Use parsed (lowercase) pickup
    dropoffLocation: drop, // Use parsed (lowercase) drop
    pickupDate,
    pickupTime,
    dropoffDate,
  };

  // 1. Get STATIC data from JSON (use parsed routeKey)
  const staticRouteData = (cabFares as CabFaresData)[routeKey];
  const faqs: FaqItem[] = staticRouteData?.faq || [];
  const seoContent: string | null = staticRouteData?.seoContent || null;

  // 2. Fetch DYNAMIC data (use capitalized, parsed values)
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
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${
        dynamicCars.length === 2 ? 'md:grid-cols-2' :
        dynamicCars.length === 3 ? 'md:grid-cols-3' :
        'md:grid-cols-4'
      } gap-6`}>
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
  <section className="mt-8 sm:mt-12 border-t border-gray-200 pt-8 sm:pt-10 px-4 sm:px-0">
    <div
      className="
        max-w-none text-gray-700

        /* Headings */
        [&>h1]:text-2xl sm:[&>h1]:text-4xl
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

// 🔹 CarCategoryCard Component (Unchanged from your version)
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

