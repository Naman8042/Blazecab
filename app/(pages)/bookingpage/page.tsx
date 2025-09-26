// app/(pages)/bookingpage/page.tsx

// This is a Server Component, so no "use client" directive is needed.

import { BookingFormClient } from "@/app/_components/Bookingform"; // Import your client component
import { JSX } from "react";
import { Suspense } from "react";
import Loading from "../carride/loading"; // Adjust path if loading.tsx is elsewhere

// Define the props for your Server Component.
// CRITICAL FIX: The 'searchParams' property itself is expected to be a Promise.
interface BookingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function formatTimeFromMillis(ms: string): string {
  if (!ms) return "";
  const date = new Date(Number(ms));
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12; // convert 0 → 12
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${adjustedHours}:${formattedMinutes} ${ampm}`;
}


export const metadata = {
  title: "Booking Page | BlazeCab",
  description:
    "Read BlazeCab's terms and conditions for cab rentals: booking, pricing, cancellations, refunds, liabilities, and user responsibilities.",
};


// Your page component, accepting 'props' with the specified searchParams type
export default async function Page(props: BookingPageProps): Promise<JSX.Element> {
  
  
  // Await searchParams to resolve the Promise.
  // This is now explicitly typed as a Promise, matching the error's expectation.
  const resolvedSearchParams = await props.searchParams;

  console.log(resolvedSearchParams)

  // Extract and parse search parameters from the resolved object.
  // Add 'as string' to cast the value, ensuring it's treated as a single string.
  // The '|| ""' provides a default empty string if the param is undefined.
  const startLocation = (resolvedSearchParams.startLocation || "") as string;
  const endLocation = (resolvedSearchParams.endLocation || "") as string;
  // For 'date', it can be null, so cast to 'string | null'
  const date = (resolvedSearchParams.date || null) as string | null;
  const rideType = (resolvedSearchParams.rideType || null) as string | null;
  const carType = (resolvedSearchParams.carType || "") as string;
  const totalKm = (resolvedSearchParams.totalKm || "0") as string;
  const price = (resolvedSearchParams.price || "0") as string;

  // Safely parse JSON strings for arrays, providing default empty arrays.
  const inclusions: string[] = JSON.parse(
    (resolvedSearchParams.inclusions || "[]") as string
  );
  const exclusions: string[] = JSON.parse(
    (resolvedSearchParams.exclusions || "[]") as string
  );
  const termscondition: string[] = JSON.parse(
    (resolvedSearchParams.termscondition || "[]") as string
  );
  const rawTime = (resolvedSearchParams.time || "") as string; // Cast to string

  // Format dates and times for display.
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : "";

  let formattedTime = formatTimeFromMillis(rawTime);


    // formattedTime = formatTime(formattedTime)

  return (
    <Suspense fallback={<Loading />}>
      {/* Pass all extracted and formatted data to the client component */}
      <BookingFormClient
        startLocation={startLocation}
        endLocation={endLocation}
        date={date}
        carType={carType}
        rideType={rideType}
        totalKm={totalKm}
        price={price}
        inclusions={inclusions}
        exclusions={exclusions}
        termscondition={termscondition}
        rawTime={rawTime}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
      />
    </Suspense>
  );
}