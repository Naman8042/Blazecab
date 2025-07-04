"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { CarRentalSearch } from "../../_components/CarRentalSearch";
import axios from "axios";
import Loading from "../../loading";
import CarCategoryCard from "@/app/_components/CarCategoryCard";

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

type FixedPrice = {
  cabs: string;
  price: number;
  distance: number;
  per_kms_extra_charge: number;
};


const CarList = () => {
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<CarCategoryCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const rideType = searchParams.get("rideType") || "One Way";
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || "";
  const pickupDateStr = searchParams.get("pickupDate");
  const pickupTimeStr = parseTimeStringToDate("pickupTime");
  const dropoffDateStr = searchParams.get("dropoffDate");
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

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

  useEffect(() => {
    if (initialValues.pickupDate) {
      setFormattedDate(initialValues.pickupDate.toLocaleDateString());
    }
  }, [initialValues.pickupDate]);

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
                (f: FixedPrice) =>
                  f.cabs.toLowerCase() === car.category.toLowerCase()
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
        } else if(rideType === "Round Trip") {
          const roundTripResponse = await axios.get(
            `/api/twoway?pickup=${pickupLocation}&drop=${dropoffLocation}`
          );
          const roundTripData = roundTripResponse.data;

          if (!roundTripData || roundTripData.length === 0) {
            setError(true);
            return;
          }

          const enrichedCars = carData
            .map((car: CarCategoryCardProps) => {
              const match = roundTripData.find(
                (r: any) => r.cabs?.toLowerCase() === car.category.toLowerCase()
              );

              if (!match) return null;

              return {
                ...car,
                price: match.distance * 2 * match.per_kms_charge,
                inclusions: [
                  ...car.inclusions,
                  `${match.distance * 2} km round trip`,
                  `Extra: ₹${match.per_kms_charge}/km`,
                ],
                distance: match.distance * 2,
              };
            })
            .filter(Boolean);

          setCars(enrichedCars);
        }
        else{
          const roundTripResponse = await axios.get(
            `/api/localroute?city=${pickupLocation}`
          );
          const roundTripData = roundTripResponse.data;

          if (!roundTripData || roundTripData.length === 0) {
            setError(true);
            return;
          }

          const enrichedCars = carData
            .map((car: CarCategoryCardProps) => {
              const match = roundTripData.find(
                (r: any) => r.cabs?.toLowerCase() === car.category.toLowerCase()
              );

              if (!match) return null;

              return {
                ...car,
                price: match.price,
                inclusions: [
                  ...car.inclusions,
                  `Includes ${match.distance} Km and ${match.time} hours`,
                  `Extra: ₹${match.perkmextra_charge}/km`,
                ],
                distance: match.distance * 2,
              };
            })
            .filter(Boolean);

          setCars(enrichedCars);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [pickupLocation, dropoffLocation, rideType]);

  if (error) {
    return (
      <div className="flex h-[90vh] items-center justify-center bg-gray-50">
        <div className="text-center p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-2xl font-semibold text-[#6aa4e0] mb-2">
            No Cars Available
          </h2>
          <p className="text-gray-600">
            We couldn&apos;t find any cars for this route. Please try a
            different search.
          </p>
        </div>
      </div>
    );
  }

  if (!rideType) return null; // or a loader


  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
      {showForm ? (
        <CarRentalSearch initialValues={initialValues} source="carride" setShowForm={setShowForm} showForm={showForm}/>
      ) : (
        <div className="bg-white shadow-md rounded-2xl px-6 py-5 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 gap-x-6 w-full">
            <div className={`grid grid-cols-2 ${rideType === "Local" ? "sm:grid-cols-3" : "sm:grid-cols-4"}  gap-x-8 gap-y-2 text-sm sm:text-base text-gray-800  w-full sm:w-1/2`}>
              <div>
                <p className="font-medium text-gray-500">Pickup</p>
                <p className="font-semibold">{pickupLocation}</p>
              </div>
              {
                dropoffLocation && <div>
              <p className="font-medium text-gray-500">Dropoff</p>
                <p className="font-semibold">{dropoffLocation}</p>
                
              </div>
              }
              <div>
                <p className="font-medium text-gray-500">Date</p>
                <p className="font-semibold">
                  {formattedDate}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Ride Type</p>
                <p className="font-semibold">{rideType}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-1/5 h-10"
            >
              Edit
            </Button>
          </div>
        </div>
      )}

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 my-8">
        Explore Our Car Categories
      </h1>

      {cars.length && !loading ? (
        [...cars]
          .sort((a, b) => a.price - b.price)
          .map((car, index) => (
            <CarCategoryCard
              key={index}
              category={car.category}
              image={car.image}
              name={car.name}
              price={car.price}
              inclusions={car.inclusions}
              exclusions={car.exclusions}
              termscondition={car.termscondition}
              distance={car.distance}
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
