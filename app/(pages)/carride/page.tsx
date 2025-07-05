import { Suspense } from "react";
import Editcar from "@/app/_components/Editcar";
import Loading from "../../loading";
import CarList from "@/app/_components/Carlist"; // adjust import if needed

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  const params = await searchParams;
  // Basic params for Editcar
  const rideType = Array.isArray(params.rideType) ? params.rideType[0] : params.rideType || "";
  const pickupLocation = Array.isArray(params.pickupLocation) ? params.pickupLocation[0] : params.pickupLocation || "";
  const dropoffLocation = Array.isArray(params.dropoffLocation) ? params.dropoffLocation[0] : params.dropoffLocation || "";

  const initialValues = {
    pickupLocation,
    dropoffLocation,
    pickupDate: params.pickupDate ? new Date(params.pickupDate as string) : undefined,
    pickupTime: params.pickupTime ? new Date(params.pickupTime as string) : undefined,
    dropoffDate: params.dropoffDate ? new Date(params.dropoffDate as string) : undefined,
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

      <Suspense key={JSON.stringify(params)} fallback={<Loading />}>
        <CarList params={params} />
      </Suspense>
    </div>
  );
}
