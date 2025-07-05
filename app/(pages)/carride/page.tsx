import { Suspense } from "react";
import Editcar from "@/app/_components/Editcar";
import Loading from "../../loading";
import CarList from "@/app/_components/Carlist"; // adjust import if needed

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Basic params for Editcar
  const rideType = Array.isArray(searchParams.rideType) ? searchParams.rideType[0] : searchParams.rideType || "";
  const pickupLocation = Array.isArray(searchParams.pickupLocation) ? searchParams.pickupLocation[0] : searchParams.pickupLocation || "";
  const dropoffLocation = Array.isArray(searchParams.dropoffLocation) ? searchParams.dropoffLocation[0] : searchParams.dropoffLocation || "";

  const initialValues = {
    pickupLocation,
    dropoffLocation,
    pickupDate: searchParams.pickupDate ? new Date(searchParams.pickupDate as string) : undefined,
    pickupTime: searchParams.pickupTime ? new Date(searchParams.pickupTime as string) : undefined,
    dropoffDate: searchParams.dropoffDate ? new Date(searchParams.dropoffDate as string) : undefined,
    rideType,
  };

  const formattedDate = initialValues.pickupDate?.toLocaleDateString() || null;

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

      <Suspense key={JSON.stringify(searchParams)} fallback={<Loading />}>
        <CarList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
