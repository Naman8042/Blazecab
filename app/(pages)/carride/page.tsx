import { Suspense } from "react";
import { JSX } from "react";
import Editcar from "@/app/_components/Editcar";
import Loading from "./loading";
import CarList from "@/app/_components/Carlist";

function restoreISODate(dateStr: string | null) { // dateStr can be null now
  if (!dateStr) return null;
  // Replace the dashes in the time portion (HH-mm-ss) with colons (HH:mm:ss)
  return dateStr.replace(/T(\d{2})-(\d{2})-(\d{2})/, "T$1:$2:$3");
}

// Updated props type to include searchParams
export default async function Page(props: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<JSX.Element> {
  const { searchParams } = await props;

  // Accessing query parameters directly
  const rideTypeRaw = searchParams.rideType as string || "";
  const pickupLocation = searchParams.pickupLocation as string || "";
  const dropoffLocation = searchParams.dropoffLocation as string || "";
  const pickupDate = searchParams.pickupDate as string || "";
  const pickupTime = searchParams.pickupTime as string || ""; // This will be a string representing milliseconds
  const dropoffDate = searchParams.dropoffDate as string || "";

  const rideType = rideTypeRaw.replace(/-/g, " ");

  // Date parsing
  const restoredPickupDate = restoreISODate(pickupDate);
  const pickupDateUpdated = restoredPickupDate ? new Date(restoredPickupDate) : undefined;

  const restoreddropOffDate = restoreISODate(dropoffDate);
  const dropOffDateUpdated = restoreddropOffDate ? new Date(restoreddropOffDate) : undefined;

  // Ensure pickupTime is a valid number before converting to Date
  const rawTime = pickupTime ? new Date(Number(pickupTime)) : undefined;
  console.log("Parsed rawTime:", rawTime); // Log to check if parsing is correct

  const initialValues = {
    pickupLocation,
    dropoffLocation,
    pickupDateUpdated,
    pickupTime: rawTime, // rawTime is already a Date object or undefined
    dropOffDateUpdated,
    rideType,
  };

  console.log("Initial Values:", initialValues); // Log to verify all values

  const formattedDate = initialValues.pickupDateUpdated?.toLocaleDateString() || null;

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
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