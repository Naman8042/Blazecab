import type { Metadata } from "next";
import { CarRentalSearch } from "@/app/_components/CarRentalSearch";
import cabFares from "@/data/cabFares.json";
import RouteInfoSection from "@/app/_components/Routeinfo";
import Link from "next/link";
import Image from "next/image";
import { AccordionItem } from "@/app/_components/FAQ";

type Params = { pickup: string; drop: string };

// --- START: Type Definitions ---

type FaqItem = {
  question: string;
  answer: string;
};

type FareItem = {
  type: string;
  capacity: string;
  baseFare: number;
  maxFare: number;
};

type RouteInfo = {
  distance: string;
  time: string;
  startingFare: number;
};

// 1. THIS IS THE FIX: Made 'fares' optional by adding a '?'
// This allows routes in your JSON to exist without a 'fares' array.
type RouteData = {
  info: RouteInfo;
  cars: CarCategoryCardProps[];
  faq: FaqItem[];
  fares?: FareItem[]; // <--- Changed
};

type CabFaresData = Record<string, RouteData>;

// --- END: Type Definitions ---

// 🔹 Generate static params based on available routes in JSON
export async function generateStaticParams(): Promise<Params[]> {
  return Object.keys(cabFares).map((key) => {
    const [pickup, drop] = key.split("-");
    return { pickup, drop };
  });
}

// 🔹 Generate SEO metadata dynamically
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

// 🔹 Main dynamic route page
export default async function Page({ params }: { params: Promise<Params> }) {
  const { pickup, drop } = await params;
  const pickupCap = capitalize(pickup);
  const dropCap = capitalize(drop);
  const routeKey = `${pickup}-${drop}`.toLowerCase();

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

  // This cast is now correct because 'fares' is optional
  const routeData = (cabFares as CabFaresData)[routeKey];
  const routeInfo = routeData?.info || null;

  const cars: CarCategoryCardProps[] = routeData?.cars || [];
  const faqs: FaqItem[] = routeData?.faq || [];
  const fares: FareItem[] | null = routeData?.fares || null; // This line is fine

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
        {cars.map((car) => (
          <CarCategoryCard
            key={car.category}
            category={car.category}
            image={car.image}
            price={car.price}
            seats={car.seats}
            description={car.description}
          />
        ))}
      </div>

      {/* 🔹 Dynamic Content - Fares Table */}
      {fares && fares.length > 0 ? (
        <section className="space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            BlazeCab’s Cab Options from {pickupCap} to {dropCap}
          </h1>

          <p>
            Planning a trip from {pickupCap} to {dropCap}? With{" "}
            <strong>BlazeCab</strong>, you can easily book an outstation cab and
            enjoy a smooth, hassle-free journey. Whether you’re traveling solo,
            with family, or in a group, we’ve got the perfect cab for you.
          </p>

          <p>
            Our fares are <strong>transparent</strong>,{" "}
            <strong>affordable</strong>, and <strong>all-inclusive</strong>. You
            only pay what you see — no hidden charges or last-minute surprises.
          </p>

          <p>
            Below are BlazeCab’s estimated round-trip fares for the {pickupCap}{" "}
            → {dropCap} route:
          </p>

          {/* Added overflow wrapper for table responsiveness */}
          <div className="overflow-x-auto">
            {/* Added min-width to table to force scroll on mobile */}
            <table className="w-full border border-gray-200 text-left text-sm min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">Cab Type</th>
                  <th className="p-3 border-b">Capacity</th>
                  <th className="p-3 border-b">Round Trip Fare (Approx)</th>
                </tr>
              </thead>
              <tbody>
                {fares.map((fare) => (
                  <tr key={fare.type}>
                    <td className="p-3 border-b">{fare.type}</td>
                    <td className="p-3 border-b">{fare.capacity}</td>
                    <td className="p-3 border-b">
                      ₹{fare.baseFare.toLocaleString()} – ₹
                      {fare.maxFare.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 text-sm">
            *Fares are approximate and may vary based on travel date, time, and
            vehicle availability.
          </p>
        </section>
      ) : (
        <section className="text-center py-10">
          <h2 className="text-xl font-semibold">
            Sorry! We don’t have fare data for {pickupCap} → {dropCap} yet.
          </h2>
          <p>We’re constantly adding new routes. Check back soon!</p>
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

interface InitialValues {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
  dropoffDate: Date | undefined;
}

interface CarCategoryCardProps {
  category: string; // e.g., "AC Hatchback"
  image: string; // e.g., "Indica, Swift" (used for query param)
  price: number;
  seats: number; // e.g., 4
  description: string; // e.g., "Economy Cabs"
  name?: string; // Also added 'name' as optional since your error showed it
}

const CarCategoryCard = ({
  category,
  image,
  price,
  seats,
  description,
}: CarCategoryCardProps) => (
  <Link
    href={{
      pathname: "/bookingpage",
    }}
    className="block"
  >
    {/* This layout is responsive: row on mobile, column on sm+ */}
    <div className="flex sm:flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="relative w-48 h-32 mb-4">
        <Image src={image} alt={category} layout="fill" objectFit="contain" />
      </div>

      <div className="flex flex-col items-center">
        {/* This layout is responsive: column on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900">{category}</h3>
          <span className="bg-[#FFB300] text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            {seats} seats
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