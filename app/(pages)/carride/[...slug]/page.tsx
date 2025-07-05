import { Suspense } from "react";
import { JSX } from "react";
import Editcar from "@/app/_components/Editcar";
import Loading from "../loading";
import CarList from "@/app/_components/Carlist";

function restoreISODate(dateStr: string) {
  if (!dateStr) return null;
  // Replace the dashes in the time portion (HH-mm-ss) with colons (HH:mm:ss)
  return dateStr.replace(/T(\d{2})-(\d{2})-(\d{2})/, "T$1:$2:$3");
}

type Params = Promise<{ slug: string }>;

export default async function Page(props: { params: Params }): Promise<JSX.Element> {
  const { slug } = await props.params;
  
  const [
    rideTypeRaw = "",
    pickupLocation = "",
    dropoffLocation = "",
    pickupDate = "",
    pickupTime = "",
    dropoffDate = ""
  ] = slug;

  const rideType = rideTypeRaw.replace(/-/g, " ");
  
  // Date parsing
  const restoredPickupDate = restoreISODate(pickupDate);
  const pickupDateUpdated = restoredPickupDate ? new Date(restoredPickupDate) : undefined;
  
  const restoreddropOffDate = restoreISODate(dropoffDate);
  const dropOffDateUpdated = restoreddropOffDate ? new Date(restoreddropOffDate) : undefined;
  
  const rawTime = new Date(Number(pickupTime));
  console.log(rawTime)

  const initialValues = {
    pickupLocation,
    dropoffLocation,
    pickupDateUpdated,
    pickupTime: rawTime, 
    dropOffDateUpdated,
    rideType,
  };
  
  console.log(initialValues)
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