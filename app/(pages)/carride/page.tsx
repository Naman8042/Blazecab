import { Suspense } from "react";
import { JSX } from "react";
import Editcar from "@/app/_components/Editcar";
import Loading from "./loading";
import CarList from "@/app/_components/Carlist";
import { Metadata } from "next";

export async function generateMetadata(props: CarListPageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const pickupLocation = (searchParams.pickupLocation || "") as string;
  const dropoffLocation = (searchParams.dropoffLocation || "") as string;

  const fromCity = pickupLocation || "Your City";
  let toCity = dropoffLocation || "Destination";

  if(toCity == "Not Available"){
    toCity = "";
  }

  const title = fromCity && toCity
    ? `${fromCity} to ${toCity} Cab Rentals | BlazeCab`
    : `Cab Rentals | BlazeCab`;
  return {
    title,description: `Book affordable and reliable cabs from ${fromCity} to ${toCity} with BlazeCab. Enjoy safe rides, on-time service, and transparent pricing.`,
  };
}


function restoreISODate(dateStr: string | null) {
  if (!dateStr) return null;
  // Replace the dashes in the time portion (HH-mm-ss) with colons (HH:mm:ss)
  return dateStr.replace(/T(\d{2})-(\d{2})-(\d{2})/, "T$1:$2:$3");
}

// Define the type for the Page component's props
interface CarListPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: CarListPageProps): Promise<JSX.Element> {
  // Await the searchParams promise to get the resolved search parameters object.
  const searchParams = await props.searchParams;

  // Accessing query parameters directly from the awaited object.
  // Add 'as string' to cast values from 'string | string[] | undefined' to 'string'.
  const rideTypeRaw = (searchParams.rideType || "") as string;
  const pickupLocation = (searchParams.pickupLocation || "") as string;
  const dropoffLocation = (searchParams.dropoffLocation || "") as string;
  const pickupDate = (searchParams.pickupDate || "") as string;
  const pickupTime = (searchParams.pickupTime || "") as string;
  const dropoffDate = (searchParams.dropoffDate || "") as string;

  const rideType = rideTypeRaw.replace(/-/g, " ");

  // Date parsing
  const restoredPickupDate = restoreISODate(pickupDate);
  const pickupDateUpdated = restoredPickupDate ? new Date(restoredPickupDate) : undefined;

  const restoreddropOffDate = restoreISODate(dropoffDate);
  const dropOffDateUpdated = restoreddropOffDate ? new Date(restoreddropOffDate) : undefined;

  // Ensure pickupTime is a valid number before converting to Date
  const rawTime = pickupTime ? new Date(Number(pickupTime)) : undefined;
  console.log("Parsed rawTime:", rawTime);

  const initialValues = {
    pickupLocation,
    dropoffLocation,
    pickupDateUpdated,
    pickupTime: rawTime,
    dropOffDateUpdated,
    rideType,
  };

  console.log("Initial Values:", initialValues);

  const formattedDate = initialValues.pickupDateUpdated?.toLocaleDateString() || null;

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto pt-20 sm:pt-5">
      <Editcar
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        initialValues={initialValues}
        rideType={rideType}
        formattedDate={formattedDate}
      />
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 my-8">
        Explore Our Car Categories
      </h1>

      <Suspense key={JSON.stringify(initialValues)} fallback={<Loading />}>
        <CarList initialValues={initialValues} />
      </Suspense>
    </div>
  );
}