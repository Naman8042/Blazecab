"use client";

import { CarRentalSearch } from "./CarRentalSearch"; // adjust path as needed
import { useState } from "react";
import { Button } from "@/components/ui/button";

type FormData = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  pickupTime: Date;
  dropoffDate: Date;
};

interface Props {
  pickupLocation: string;
  dropoffLocation?: string;
  rideType: string;
  formattedDate: string | null;
  initialValues?: Partial<FormData> & { rideType?: string };
}

const Editcar = ({
  pickupLocation,
  dropoffLocation,
  rideType,
  formattedDate,
  initialValues,
}: Props) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  return (
    <>
      {showForm ? (
        <CarRentalSearch
          initialValues={initialValues}
          source="carride"
          setShowForm={setShowForm}
          showForm={showForm}
        />
      ) : (
        <div className="bg-white shadow-md rounded-md border border-gray-200 mb-6 max-w-7xl">
          {/* Mobile Layout */}
          <div className="flex justify-between items-center p-4 md:hidden">
            <div>
              <p className="text-xs text-gray-500">One Way</p>
              <p className="text-sm font-bold text-gray-800">
                {pickupLocation}{" "}
                {rideType !== "Local" ? `- ${dropoffLocation}` : ""}
              </p>

              <p className="text-xs text-gray-600">
                Pickup Date : {formattedDate}
              </p>
            </div>
            <div className="">
              <Button
                onClick={() => setShowForm(true)}
                className="text-sm px-3 py-1 rounded-full border border-[#6aa4e0] text-[#6aa4e0] bg-transparent hover:bg-[#6aa4e0] hover:text-white"
              >
                Modify Booking
              </Button>
            </div>
          </div>

          {/* Desktop / md+ Layout */}
          <div className="hidden md:flex flex-col sm:flex-row items-stretch w-full divide-x divide-gray-200">
            {/* Ride Type */}
            <div className="px-4 py-3 flex flex-col justify-center flex-1">
              <p className="text-xs font-medium text-gray-500">Ride Type</p>
              <p className="text-lg font-bold text-gray-800">{rideType}</p>
              {rideType === "Local" && (
                <p className="text-sm text-gray-600">80 kms & 8 Hours</p>
              )}
            </div>

            {/* From */}
            <div className="px-4 py-3 flex flex-col justify-center flex-1">
              <p className="text-xs font-medium text-gray-500">From</p>
              <p className="text-lg font-bold text-gray-800 truncate">
                {pickupLocation}
              </p>
            </div>

            {/* To */}
            {rideType !== "Local" && (
              <div className="px-4 py-3 flex flex-col justify-center flex-1">
                <p className="text-xs font-medium text-gray-500">
                  {rideType === "Round Trip" ? "Destination" : "To"}
                </p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  {dropoffLocation}
                </p>
              </div>
            )}

            {/* Date & Time */}
            <div className="px-4 py-3 flex flex-col justify-center flex-1">
              <p className="text-xs font-medium text-gray-500">
                Pick-Up Date & Time
              </p>
              <p className="text-lg font-bold text-gray-800">{formattedDate}</p>
              {/* <p className="text-sm text-gray-600">{formattedTime}</p> */}
            </div>

            {/* Edit Button */}
            <div className="flex items-center justify-center sm:w-36 rounded-b-md sm:rounded-l-none sm:rounded-r-md bg-[#6aa4e0]">
              <Button
                onClick={() => setShowForm(true)}
                className="shadow-none text-white font-bold text-lg w-full h-full"
              >
                EDIT
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Editcar;
