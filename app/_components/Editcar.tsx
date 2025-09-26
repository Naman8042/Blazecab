"use client";

import { CarRentalSearch } from "./CarRentalSearch"; // adjust path as needed
import { useState } from "react";
import { Button } from "@/components/ui/button";

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM"; // force uppercase AM/PM
  const adjustedHours = hours % 12 || 12; // convert 0 → 12
  const formattedMinutes = minutes.toString().padStart(2, "0");
  console.log(`${adjustedHours}:${formattedMinutes} ${ampm}`);
  return `${adjustedHours}:${formattedMinutes} ${ampm}`;
}

type FormData = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
  dropOffDate?: Date;
  rideType?: string;
};

interface Props {
  formattedDate: string | null;
  initialValues: FormData;
}

const Editcar = ({ formattedDate, initialValues }: Props) => {
  console.log("initial Values");
  console.log(initialValues);
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
              <p className="text-xs text-gray-500">{initialValues.rideType}</p>
              <p className="text-sm font-bold text-gray-800">
                {initialValues.pickupLocation}{" "}
                {initialValues.rideType !== "Local"
                  ? `- ${initialValues.dropoffLocation}`
                  : ""}
              </p>

              <p className="text-[10px] text-gray-600">
                Pickup Date : {formattedDate || "N/A"} At{" "}
                {initialValues?.pickupTime
                  ? formatTime(new Date(initialValues.pickupTime))
                  : "N/A"}
              </p>

              {initialValues.rideType === "Round Trip" ? (
                <p className="text-[10px] text-gray-600">
                  Return Date :{" "}
                  {initialValues.dropOffDate
                    ? `${String(initialValues.dropOffDate.getDate()).padStart(
                        2,
                        "0"
                      )}/${String(
                        initialValues.dropOffDate.getMonth() + 1
                      ).padStart(
                        2,
                        "0"
                      )}/${initialValues.dropOffDate.getFullYear()}`
                    : "N/A"}
                </p>
              ) : null}
            </div>
            <div className="">
              <Button
                onClick={() => setShowForm(true)}
                className="text-[12px] px-2 py-1 rounded-full border border-[#6aa4e0] text-[#6aa4e0] bg-transparent hover:bg-[#6aa4e0] hover:text-white"
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
              <p className="text-lg font-bold text-gray-800">
                {initialValues.rideType}
              </p>
              {initialValues.rideType === "Local" && (
                <p className="text-sm text-gray-600">80 kms & 8 Hours</p>
              )}
            </div>

            {/* From */}
            <div className="px-4 py-3 flex flex-col justify-center flex-1">
              <p className="text-xs font-medium text-gray-500">From</p>
              <p className="text-lg font-bold text-gray-800 truncate">
                {initialValues.pickupLocation}
              </p>
            </div>

            {/* To */}
            {initialValues.rideType !== "Local" && (
              <div className="px-4 py-3 flex flex-col justify-center flex-1">
                <p className="text-xs font-medium text-gray-500">
                  {initialValues.rideType === "Round Trip"
                    ? "Destination"
                    : "To"}
                </p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  {initialValues.dropoffLocation}
                </p>
              </div>
            )}

            {/* Date & Time */}
            <div className="px-4 py-3 flex flex-col justify-center flex-1">
              <p className="text-xs font-medium text-gray-500">
                Pick-Up Date & Time
              </p>
              <p className="text-lg font-bold text-gray-800">
                {formattedDate} at{" "}
                {initialValues?.pickupTime
                  ? formatTime(new Date(initialValues.pickupTime))
                  : "N/A"}
              </p>
              {/* <p className="text-sm text-gray-600">{formattedTime}</p> */}
            </div>
            {initialValues.rideType === "Round Trip" ? (
              <div className="px-4 py-3 flex flex-col justify-center flex-1">
                <p className="text-xs font-medium text-gray-500">Return Date</p>
                <p className="text-lg font-bold text-gray-800">
                  {initialValues.dropOffDate
                    ? `${String(initialValues.dropOffDate.getDate()).padStart(
                        2,
                        "0"
                      )}/${String(
                        initialValues.dropOffDate.getMonth() + 1
                      ).padStart(
                        2,
                        "0"
                      )}/${initialValues.dropOffDate.getFullYear()}`
                    : "N/A"}
                </p>
              </div>
            ) : null}

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
