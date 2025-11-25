import { MapPin, Clock, IndianRupee } from "lucide-react";

interface RouteInfoProps {
  distance: string;
  time: string;
  startingFare: number;
}

const RouteInfoSection = ({ distance, time, startingFare }: RouteInfoProps) => {
  return (
    // Section wrapper styled like Featuresection
    <section className="">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header copied from Featuresection */}
        <div className="mb-10 text-center md:mb-14">
          <span className="bg-[#FFB300] text-white px-3 py-1 rounded-full text-xs font-semibold">
            Trip Details
          </span>
          <h2 className="text-2xl font-bold text-[#6aa4e0] py-4 md:text-4xl">
            Your Route at a Glance
          </h2>
          <p className="text-sm font-normal text-gray-500 max-w-xl mx-auto md:text-lg">
            Here are the key details for your upcoming trip, including distance,
            estimated time, and starting fare.
          </p>
        </div>

        {/* Grid layout (from original RouteInfo) */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
          {/* Item 1: Distance */}
          <div className="flex flex-col items-center">
            {/* Reduced margin and size for mobile */}
            <div className="rounded-lg flex justify-center items-center mb-2 md:mb-4 w-12 h-12 md:w-16 md:h-10 mx-auto">
              {/* Reduced icon size for mobile */}
              <MapPin className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            {/* Reduced text size and margin for mobile */}
            <h4 className="text-sm md:text-lg font-medium text-[#6aa4e0] mb-1 md:mb-2">
              Distance
            </h4>
            {/* Reduced text size for mobile */}
            <h3 className="text-sm md:text-2xl font-bold text-gray-900">
              {distance}
            </h3>
          </div>

          {/* Item 2: Time */}
          <div className="flex flex-col items-center">
            <div className="rounded-lg flex justify-center items-center mb-2 md:mb-4 w-12 h-12 md:w-16 md:h-10 mx-auto">
              <Clock className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h4 className="text-sm md:text-lg font-medium text-[#6aa4e0] mb-1 md:mb-2">
              Time
            </h4>
            <h3 className="text-sm md:text-2xl font-bold text-gray-900">
              {time}
            </h3>
          </div>

          {/* Item 3: Fare */}
          <div className="flex flex-col items-center">
            <div className="rounded-lg flex justify-center items-center mb-2 md:mb-4 w-12 h-12 md:w-16 md:h-10 mx-auto">
              <IndianRupee className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            {/* I made this text slightly smaller to help "Starting from" fit */}
            <h4 className="text-sm md:text-lg font-medium text-[#6aa4e0] mb-1 md:mb-2">
              Starting from
            </h4>
            <h3 className="text-sm md:text-2xl font-bold text-gray-900">
              ₹{startingFare.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteInfoSection;
