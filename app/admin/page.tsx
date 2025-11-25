"use client";

import { useState, useEffect, Fragment } from "react";
import Loading from "@/app/loading";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  User, 
  RefreshCcw 
} from "lucide-react";

export interface Booking {
  id: string;
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
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/booking");
      const json = await response.json();
      setBookings(json.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const toggleRow = (id: string) => {
    if (selectedBooking === id) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(id);
    }
  };

  // Helper to format dates cleanly
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold border";
    switch (status.toLowerCase()) {
      case "confirmed":
        return <span className={`${base} bg-green-50 text-green-700 border-green-200`}>Confirmed</span>;
      case "pending":
        return <span className={`${base} bg-yellow-50 text-yellow-700 border-yellow-200`}>Pending</span>;
      case "cancelled":
        return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-50 text-gray-600 border-gray-200`}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 min-h-screen">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bookings</h2>
          <p className="text-sm text-gray-500">Manage today&apos;s and upcoming trips</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* --- Table Container --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Type", "Pickup", "Destination", "Pickup Date", "Customer", "Status", ""].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const isExpanded = selectedBooking === booking.id;
                  
                  return (
                    <Fragment key={booking.id}>
                      {/* Main Row */}
                      <tr 
                        onClick={() => toggleRow(booking.id)}
                        className={`
                          cursor-pointer transition-colors hover:bg-gray-50
                          ${isExpanded ? "bg-gray-50" : ""}
                        `}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-[#6aa4e0]">#{booking.bookingId}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {booking.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {booking.pickupCity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {booking.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(booking.pickupDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {booking.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-0 border-b border-gray-100">
                            <div className="bg-[#6aa4e0]/5 p-6 border-l-4 border-[#6aa4e0]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Column 1: Trip Details */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <MapPin size={16} className="text-[#6aa4e0]"/> Trip Details
                                  </h4>
                                  <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">From:</span>
                                      <span className="font-medium">{booking.pickupCity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">To:</span>
                                      <span className="font-medium">{booking.destination}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Date:</span>
                                      <span className="font-medium">{formatDate(booking.pickupDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Type:</span>
                                      <span className="font-medium">{booking.type}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Column 2: Customer & Metadata */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <User size={16} className="text-[#6aa4e0]"/> Customer Info
                                  </h4>
                                  <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Name:</span>
                                      <span className="font-medium">{booking.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Phone:</span>
                                      <a href={`tel:${booking.phone}`} className="text-[#6aa4e0] hover:underline font-medium">
                                        {booking.phone}
                                      </a>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                      <span className="text-gray-500">Booked On:</span>
                                      <span className="text-gray-600">{formatDate(booking.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Internal ID:</span>
                                      <span className="font-mono text-xs text-gray-400">{booking.id}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 flex justify-end">
                                <button
                                  onClick={() => toggleRow(booking.id)}
                                  className="text-sm text-gray-500 hover:text-gray-800 underline"
                                >
                                  Collapse Details
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsView;