// app/carride/CarList.tsx
import axios from "axios";
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
  params: string[];
}

type FixedPrice = {
  cabs: string;
  price: number;
  distance: number;
  per_kms_extra_charge: number;
};

type RoundTrip = {
  cabs: string;
  distance: number;
  per_kms_charge: number;
};

type LocalTrip = {
  cabs: string;
  distance: number;
  time: number;
  perkmextra_charge: number;
  price: number;
};

interface initialValues {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateUpdated: Date | undefined;
  pickupTime: Date | undefined;
  dropOffDateUpdated: Date | undefined;
  rideType: string;
}

interface PageProps {
  initialValues: initialValues;
}

export default async function CarList({ initialValues }: PageProps) {
  const rideType = initialValues.rideType;

  const pickupLocation = initialValues.pickupLocation;

  const dropoffLocation = initialValues.dropoffLocation;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let cars: CarCategoryCardProps[] = [];
  let error = false;

  try {
    const carResponse = await axios.get(`${baseUrl}/api/car`);
    const carData = carResponse.data;

    if (rideType === "One Way" && pickupLocation && dropoffLocation) {
      const fixedResponse = await axios.get(
        `${baseUrl}/api/routes?pickup=${pickupLocation}&drop=${dropoffLocation}`
      );
      const fixedPrices = fixedResponse.data;

      if (!fixedPrices.length) {
        error = true;
      } else {
        cars = carData
          .map((car: CarCategoryCardProps) => {
            const match = fixedPrices.find(
              (f: FixedPrice) =>
                f.cabs.toLowerCase() === car.category.toLowerCase()
            );
            return match
              ? {
                  ...car,
                  price: match.price,
                  inclusions: [
                    ...car.inclusions,
                    "State Tax & Toll",
                    `${match.distance} km included`,
                  ],
                  exclusions: [
                    ...car.exclusions,
                    `If you exceed the given kms limit, you will have to pay ₹${match.per_kms_extra_charge} per km as extra charge`,
                    "Airport Entry/Parking",
                  ],
                  termscondition: [
                    "Cab may be CNG. Refueling stop possible.",
                    "Multiple pickups/drops not allowed.",
                    "AC will remain off in hilly areas",
                  ],
                  distance: match.distance,
                }
              : null;
          })
          .filter(Boolean) as CarCategoryCardProps[];
      }
    } else if (rideType === "Round Trip" && pickupLocation && dropoffLocation) {
      const res = await axios.get(
        `${baseUrl}/api/twoway?pickup=${pickupLocation}&drop=${dropoffLocation}`
      );
      const data = res.data;

      if (!data.length) {
        error = true;
      } else {
        cars = carData
          .map((car: CarCategoryCardProps) => {
            const match = data.find(
              (r: RoundTrip) =>
                r.cabs.toLowerCase() === car.category.toLowerCase()
            );

            if (!match) return null;

            const roundTripDistance = match.distance * 2;
            const chargeableDistance = Math.max(
              roundTripDistance,
              match.minimum_per_day_km
            );
            const distanceCost = chargeableDistance * match.per_kms_charge;
            const totalPrice = distanceCost + match.driver_allowance;

            return {
              ...car,
              price: totalPrice,
              inclusions: [
                ...car.inclusions,
                `${chargeableDistance} km billed (${roundTripDistance} km actual round trip)`,
              ],
              exclusions: [
                "Toll",
                "State Tax",
                "Parking",
                `Extra: ₹${match.per_kms_charge}/km`,
              ],
              termscondition: [
                "AC Usage: Air Conditioner (AC) will be turned off in hilly areas to ensure vehicle performance and passenger safety.",

                `Minimum Kilometers per Day: A minimum billing of ${match.minimum_per_day_km} kilometers per day is applicable, even if the vehicle travels less than ${match.minimum_per_day_km} km`,

                `Night Driving Charges: If the driver is required to drive between 10:00 PM and 6:00 AM, an additional ₹${match.driver_allowance} night charge must be paid directly to the driver.`,

                "One Day Means: One day means one calendar day — i.e., from 12:00 AM to 11:59 PM. If the vehicle runs beyond 11:59 PM, it will be counted as the next day and additional day charges will apply.",
              ],
              distance: roundTripDistance,
            };
          })
          .filter(Boolean) as CarCategoryCardProps[];
      }
    } else if (rideType === "Local" && pickupLocation) {
      const res = await axios.get(
        `${baseUrl}/api/localroute?city=${pickupLocation}`
      );
      const data = res.data;

      if (!data.length) {
        error = true;
      } else {
        cars = carData
          .map((car: CarCategoryCardProps) => {
            const match = data.find(
              (r: LocalTrip) =>
                r.cabs.toLowerCase() === car.category.toLowerCase()
            );
            return match
              ? {
                  ...car,
                  price: match.price,
                  inclusions: [
                    ...car.inclusions,
                    `Includes ${match.distance} Km and ${match.time} hours`,
                    `Extra: ₹${match.perkmextra_charge}/km`,
                  ],
                  distance: match.distance,
                }
              : null;
          })
          .filter(Boolean) as CarCategoryCardProps[];
      }
    } else {
      error = true;
    }
  } catch (e) {
    console.error("Error in CarList:", e);
    error = true;
  }

  if (error || !cars.length) {
    return (
      <div className="text-center text-gray-600 mt-12">
        <p>No cars available for this route.</p>
      </div>
    );
  }
  console.log(initialValues);
  return (
    <div className="grid gap-6">
      {[...cars]
        .sort((a, b) => a.price - b.price)
        .map((car, idx) => (
          <CarCategoryCard
            key={idx}
            category={car.category}
            image={car.image}
            name={car.name}
            price={car.price}
            inclusions={car.inclusions}
            exclusions={car.exclusions}
            termscondition={car.termscondition}
            distance={car.distance}
            initialValues={initialValues}
          />
        ))}
    </div>
  );
}
