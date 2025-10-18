"use client";

import { useState, useEffect } from "react";
import Loading from "@/app/loading";

export interface Booking {
  id:string
  type: string;
  pickupCity: string;
  destination: string;
  createdAt: Date;
  pickupDate: Date;
  customerName: string;
  phone: string;
  status: string;
  bookingId: string; 
}

 const BookingsView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
  try {
    const response = await fetch("/api/booking");
    const json = await response.json();
    console.log(json.data)
    setBookings(json.data || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    setLoading(false);
  }
};

    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === "Confirmed")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>Confirmed</span>
      );
    if (status === "Pending")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>
      );
    return (
      <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full">
        <Loading/>
      </div>
    );

  return (
    <div className="h-full w-full p-4">
      <h2 className="text-xl font-semibold mb-4">
        Today&apos;s and Tomorrow&apos;s Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-xs sm:text-base">
            <tr>
              <th className="p-2 border text-center align-middle">
                Booking ID
              </th>
              <th className="p-2 border text-center align-middle">Type</th>
              <th className="p-2 border text-center align-middle">
                Pickup City
              </th>
              <th className="p-2 border text-center align-middle">
                Destination
              </th>
              <th className="p-2 border text-center align-middle">
                Created At
              </th>
              <th className="p-2 border text-center align-middle">
                Pickup Date
              </th>
              <th className="p-2 border text-center align-middle">
                Customer Name
              </th>
              <th className="p-2 border text-center align-middle">Phone</th>
              <th className="p-2 border text-center align-middle">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              const isSelected = selectedBooking?.id === booking.id;
              return [
                <tr
                  key={`row-${index}`}
                  className="odd:bg-white even:bg-gray-50 cursor-pointer hover:bg-gray-200 text-xs sm:text-base"
                  onClick={() =>
                    setSelectedBooking(isSelected ? null : booking)
                  }
                >
                  <td className="p-2 border text-[#6aa4e0] underline text-center align-middle">
                    {booking.bookingId}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.type}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.pickupCity}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.destination}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.customerName}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.phone}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {getStatusBadge(booking.status)}
                  </td>
                </tr>,
                isSelected && (
                  <tr key={`detail-${index}`}>
                    <td colSpan={9} className="p-4 bg-gray-50 border-t">
                      <div className="text-xs sm:text-lg">
                        <h3 className="font-bold mb-2">Booking Details</h3>
                        <p>
                          <strong>Booking ID:</strong> {booking.bookingId}
                        </p>
                        <p>
                          <strong>Type:</strong> {booking.type}
                        </p>
                        <p>
                          <strong>Pickup City:</strong> {booking.pickupCity}
                        </p>
                        <p>
                          <strong>Destination:</strong>{" "}
                          {booking.destination}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {new Date(booking.createdAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Pickup Date:</strong>{" "}
                          {new Date(booking.pickupDate).toLocaleString()}
                        </p>
                        <p>
                          <strong>Customer Name:</strong> {booking.customerName}
                        </p>
                        <p>
                          <strong>Phone:</strong> {booking.phone}
                        </p>
                        <p>
                          <strong>Status:</strong> {booking.status}
                        </p>
                        <button
                          className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setSelectedBooking(null)}
                        >
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              ];
            })}
          </tbody>
        </table>
      </div>

      {/* Optional detail drawer */}
    </div>
  );
};


export default BookingsView