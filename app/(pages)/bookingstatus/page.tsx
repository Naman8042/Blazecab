"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookingSuccessPage() {
  const params = useSearchParams();

  const name = params.get("name");
  const rideType = params.get("rideType");
  const from = params.get("from");
  const to = params.get("to");
  const date = params.get("date");
  const time = params.get("time");
  const carType = params.get("carType");
//   const km = params.get("km");
  const fare = params.get("fare");
  const paid = params.get("paid");
  const status = params.get("status");
  const payment = params.get("payment");

  return (
    <div className="w-full mt-[9.75vh] sm:mt-0 min-h-[90vh] flex items-center justify-center bg-gray-100 px-3 py-6">
  <Card className="w-full max-w-lg shadow-lg rounded-xl border border-gray-200 bg-white">
    <CardHeader className="text-center space-y-1 px-4 py-3">
      <h2 className="text-xl sm:text-2xl font-bold text-[#6aa4e0] flex items-center justify-center gap-2">
        🎉 Booking Successful!
      </h2>
      <p className="text-gray-600 text-xs sm:text-sm">
        Thank you, <span className="font-semibold text-gray-800">{name}</span>.  
        Your ride is confirmed.
      </p>
    </CardHeader>

    <CardContent className="space-y-4 text-xs sm:text-sm p-4">
      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gray-50 p-2.5 rounded-lg">
          <span className="text-gray-500 text-[11px]">Status</span>
          <p className="font-semibold text-[#6aa4e0]">{status}</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg">
          <span className="text-gray-500 text-[11px]">Payment</span>
          <p className="font-semibold">{payment} (₹{paid})</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg">
          <span className="text-gray-500 text-[11px]">Ride Type</span>
          <p className="font-semibold">{rideType}</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg">
          <span className="text-gray-500 text-[11px]">Car</span>
          <p className="font-semibold">{carType}</p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg sm:col-span-2">
          <span className="text-gray-500 text-[11px]">Itinerary</span>
          <p className="font-semibold">
            {from} {to !== "Not Available" && `→ ${to}`}
          </p>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg sm:col-span-2">
          <span className="text-gray-500 text-[11px]">Pickup</span>
          <p className="font-semibold">{date} at {time}</p>
        </div>
      </div>

      {/* Fare Section */}
      <div className="border-t pt-3 flex justify-between items-center">
        <span className="font-bold text-gray-800 text-sm sm:text-base">Total Fare</span>
        <span className="font-extrabold text-[#6aa4e0] text-base sm:text-lg">₹ {fare}</span>
      </div>

      {/* Button */}
      <div className="pt-4 flex justify-center">
        <Button 
          onClick={() => (window.location.href = "/")} 
          className=""
        >
          Go Back Home
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

  );
}
