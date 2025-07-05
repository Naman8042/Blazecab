import { Suspense } from "react";
import { JSX } from "react";
import Editcar from "@/app/_components/Editcar";
import Loading from "../loading";
import CarList from "@/app/_components/Carlist"; // adjust import if needed


function restoreISODate(dateStr: string) {
  if (!dateStr) return null;

  // Replace the dashes in the time portion (HH-mm-ss) with colons (HH:mm:ss)
  return dateStr.replace(/T(\d{2})-(\d{2})-(\d{2})/, "T$1:$2:$3");
}



type Params = Promise<{ slug:string }>;


export default async function Page(props: { params: Params }): Promise<JSX.Element> {
   const {slug} = await props.params;
 
  const [
    rideTypeRaw = "",
    pickupLocation = "",
    dropoffLocation = "",
    pickupDate = "",
    pickupTime = "",
    dropoffDate = ""
  ] = slug;


  const rideType = rideTypeRaw.replace(/-/g, " ");
const restoredPickupDate = restoreISODate(pickupDate);
const pickupDateUpdated = restoredPickupDate ? new Date(restoredPickupDate) : undefined;
const restoreddropOffDate = restoreISODate(dropoffDate);
const dropOffDateUpdated = restoreddropOffDate ? new Date(restoreddropOffDate) : undefined;


// pickupTime was encoded like "1121AM" (no colon or spaces), parse manually:
function parseTime(timeStr: string) {
  if (!timeStr) return undefined;
  
  // Example: "1121AM" or "0925PM"
  const match = timeStr.match(/^(\d{1,2})(\d{2})(AM|PM)$/i);
  if (!match) return undefined;
  
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

const pickupTimeUpdated = parseTime(pickupTime);

const initialValues = {
  pickupLocation,
  dropoffLocation,
  pickupDateUpdated,
  pickupTimeUpdated,
  dropOffDateUpdated,
  rideType,
};

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

// interface PageProps {
//   params: {
//     params: string[]; // the catch-all params as array
//   };
// }

// export default async function Page({ params }: PageProps) {
//   // e.g. /carride/oneway/NewYork/Chicago => ['oneway', 'NewYork', 'Chicago']
//   const [rideType = "", pickupLocation = "", dropoffLocation = ""] = params.params || [];

//   // You can now build your initialValues and do fetching logic as before
//   const initialValues = {
//     pickupLocation,
//     dropoffLocation,
//     rideType,
//     // you may want to set pickupDate, pickupTime, dropoffDate from elsewhere (query or defaults)
//   };

//   // For demonstration, you can console log or fetch your car list based on these

//   return (
//     <div>
//       <h1>Ride Type: {rideType}</h1>
//       <h2>Pickup: {pickupLocation}</h2>
//       <h2>Dropoff: {dropoffLocation}</h2>

//       {/* Render your Editcar and CarList components here, passing extracted params */}
//     </div>
//   );
// }
