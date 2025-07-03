"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CarRentalSearch } from "../../_components/CarRentalSearch";
import axios from "axios";
import Loading from "../../loading";

interface CarCategoryCardProps {
  category: string;
  image: string;
  name: string;
  price: number;
  inclusions: string[];
  exclusions: string[];
  termscondition: string[];
  distance?: number | null;
  searchParams: URLSearchParams;
}

const CarCategoryCard = ({
  category,
  image,
  name,
  price,
  inclusions,
  exclusions,
  termscondition,
  searchParams,
  distance,
}: CarCategoryCardProps) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-[#6aa4e0] mb-4 text-center sm:text-left">
      {category}
    </h2>

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row sm:items-center p-5 gap-6 transition-all hover:shadow-xl">
      {/* Car Image */}
      <div className="flex justify-center sm:w-1/3">
        <img src={image} alt={name} className="w-48 h-32 object-contain" />
      </div>

      {/* Car Info and Tabs */}
      <div className="flex-1 w-full sm:w-2/3">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            <p className="text-[#6aa4e0] font-bold text-xl flex items-center gap-2 justify-center sm:justify-start">
              ₹{price}{" "}
              <span className="text-xs font-medium text-gray-500">
                All Inclusive
              </span>
            </p>
          </div>

          <Link
            href={{
              pathname: "/bookingpage",
              query: {
                startLocation: searchParams.get("pickupLocation") || "",
                endLocation: searchParams.get("dropoffLocation") || "",
                date: searchParams.get("pickupDate") || "",
                carType: name,
                totalKm: distance?.toFixed(2) || "0",
                price: price,
              },
            }}
            className="mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto"
          >
            <Button className="w-full sm:w-64 md:w-72 lg:w-80 px-6 py-2">
              Select Car
            </Button>
          </Link>
        </div>

        {/* Tabs Section */}
        <Card className="p-0 border-none ring-0 bg-gray-50">
          <Tabs defaultValue="inclusions">
            <TabsList className="flex justify-around bg-gray-200 rounded-lg p-1 w-full text-sm font-medium">
              <TabsTrigger value="inclusions" className="w-full">
                Inclusions
              </TabsTrigger>
              <TabsTrigger value="exclusions" className="w-full">
                Exclusions
              </TabsTrigger>
              <TabsTrigger value="tac" className="w-full">
                T&C
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-4 text-sm text-gray-700  relative">
              <TabsContent value="inclusions" className="space-y-1">
                {inclusions.map((item, index) => (
                  <p key={index}>✅ {item}</p>
                ))}
              </TabsContent>
              <TabsContent value="exclusions" className="space-y-1">
                {exclusions.map((item, index) => (
                  <p key={index}>❌ {item}</p>
                ))}
              </TabsContent>
              <TabsContent value="tac" className="space-y-1">
                {termscondition.map((item, index) => (
                  <p key={index}>📜 {item}</p>
                ))}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  </div>
);

const getCoordinates = async (placeName: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      placeName
    )}`
  );
  const data = await response.json();
  if (data && data[0]) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  throw new Error("Location not found: " + placeName);
};

type Coordinates = {
  lat: number;
  lon: number;
};

const getDistance = async (
  start: Coordinates,
  end: Coordinates
): Promise<number> => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
  const response = await fetch(url);
  const data = await response.json();

  if (data?.routes?.[0]) {
    return data.routes[0].distance; // distance in meters
  }

  throw new Error("Failed to fetch distance");
};

const CarList = () => {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<CarCategoryCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);

  const rideType = searchParams.get("rideType") || "One Way";
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || "";

  const pickupDateStr = searchParams.get("pickupDate");
  const pickupTimeStr = parseTimeStringToDate("pickupTime");
  const dropoffDateStr = searchParams.get("dropoffDate");

  const initialValues = {
    pickupLocation,
    dropoffLocation,
    pickupDate: pickupDateStr ? new Date(pickupDateStr) : undefined,
    pickupTime: pickupTimeStr
      ? new Date(`1970-01-01T${pickupTimeStr}`)
      : undefined,
    dropoffDate: dropoffDateStr ? new Date(dropoffDateStr) : undefined,
    rideType,
  };

  type FixedPrice = {
  cabs: string;
  price: number;
  distance: number;
  per_kms_extra_charge: number;
};

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const carResponse = await axios.get("/api/car");
        const carData = carResponse.data;

        if (rideType === "One Way") {
          const fixedResponse = await axios.get(
            `/api/routes?pickup=${pickupLocation}&drop=${dropoffLocation}`
          );
          console.log(fixedResponse.data);
          if (fixedResponse.data.length == 0) {
            setError(true);
            return;
          }
          const fixedPrices = fixedResponse.data;

          // Match fixed price to car name
         const enrichedCars = carData
  .map((car: CarCategoryCardProps) => {
    const fixedMatch = fixedPrices.find(
      (f: FixedPrice) => f.cabs.toLowerCase() === car.category.toLowerCase()
    );

    if (!fixedMatch) return null;

    return {
      ...car,
      price: fixedMatch.price,
      inclusions: [
        ...car.inclusions,
        `${fixedMatch.distance} km included`,
        `Extra: ₹${fixedMatch.per_kms_extra_charge}/km`,
      ],
      distance: fixedMatch.distance,
    };
  })
  .filter(Boolean);


          console.log(enrichedCars);
          setCars(enrichedCars);
        } else {
          setCars(carData);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [pickupLocation, dropoffLocation, rideType]);

  useEffect(() => {
    const fetchDistance = async () => {
      if (!pickupLocation || !dropoffLocation || rideType === "One Way") return;
      try {
        setLoading(true);
        const pickupCoords = await getCoordinates(pickupLocation);
        const dropoffCoords = await getCoordinates(dropoffLocation);

        let dist = await getDistance(pickupCoords, dropoffCoords);
        dist = dist / 1000; // meters to km
        setDistance(dist);
      } catch (error) {
        console.error("Error calculating distance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistance();
  }, [pickupLocation, dropoffLocation, rideType]);

  if (error) {
    return (
      <div className="flex h-[90vh] items-center justify-center bg-gray-50">
        <div className="text-center p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-2xl font-semibold text-[#6aa4e0] mb-2">
            No Cars Available
          </h2>
          <p className="text-gray-600">
            We couldn't find any cars for this route. Please try a different
            search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      <CarRentalSearch initialValues={initialValues} source="carride" />

      <h1 className="text-3xl font-bold text-center text-gray-800 my-8">
        Explore Our Car Categories
      </h1>

      {cars.length && !loading ? (
        cars.map((car, index) => (
          <CarCategoryCard
            key={index}
            category={car.category}
            image={car.image}
            name={car.name}
            price={
              rideType === "One Way"
                ? car.price
                : distance
                ? Math.round(car.price * distance)
                : car.price
            }
            inclusions={car.inclusions}
            exclusions={car.exclusions}
            termscondition={car.termscondition}
            distance={rideType === "One Way" ? car.distance : distance}
            searchParams={searchParams}
          />
        ))
      ) : (
        <div className="flex justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CarList;

// utils/parseTimeStringToDate.ts
function parseTimeStringToDate(timeStr: string): Date | undefined {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return undefined;

  const [_, hourStr, minuteStr, meridian] = match;
  console.log(_);
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (meridian.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
