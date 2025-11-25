import { getServerSession ,type Session } from "next-auth";
import { option } from "@/app/api/auth/[...nextauth]/option";
import axios from "axios";
// import Logoutbutton from "@/app/_components/Logoutbutton";
import { 
  Calendar, 
  MapPin, 
  Car, 
  Navigation, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";

interface Booking {
  id: string;
  type: string;
  pickupCity: string;
  pickupDate: string;
  status: string;
  destination?: string;
}

async function getBookings(userEmail: string): Promise<Booking[]> {
  try {
    const { data } = await axios.get(
      `${process.env.NEXTAUTH_URL}/api/user?email=${userEmail}`
    );
    return data.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

const Dashboard = async () => {
  const session:Session| null = await getServerSession(option);

  if (!session || !session.user || !session.user.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">
            You must be logged in to view your booking history.
          </p>
          <a
            href="/login"
            className="inline-block bg-[#6aa4e0] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a94d0] transition-colors"
          >
            Log In Now
          </a>
        </div>
      </div>
    );
  }

  const userEmail = session.user.email;
  const bookings = await getBookings(userEmail);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, <span className="text-[#6aa4e0]">{session.user.name || "User"}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {userEmail}
            </p>
          </div>
          <Logoutbutton />
        </div> */}

        {/* Bookings Section */}
        <BookingsList bookings={bookings} />
      </div>
    </div>
  );
};

// Component to display the list of bookings
const BookingsList = ({ bookings }: { bookings: Booking[] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-7xl">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Car className="text-[#6aa4e0]" size={20} /> Booking History
        </h2>
        <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
          {bookings.length} Total
        </span>
      </div>

      <div className="p-6">
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-[#6aa4e0]/40"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-4 items-center">
                  
                  {/* Service Type */}
                  <div className="col-span-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
                      Service Type
                    </p>
                    <p className="font-bold text-gray-800 capitalize text-sm sm:text-base">
                      {booking.type}
                    </p>
                  </div>

                  {/* Pickup */}
                  <div className="col-span-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Pickup
                    </p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate" title={booking.pickupCity}>
                      {booking.pickupCity}
                    </p>
                  </div>

                  {/* Destination */}
                  <div className="col-span-1">
                    {booking.destination ? (
                      <>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
                          <Navigation size={12} /> Drop
                        </p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate" title={booking.destination}>
                          {booking.destination}
                        </p>
                      </>
                    ) : (
                      <span className="hidden md:block text-gray-300 text-sm">-</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar size={12} /> Date
                    </p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {new Date(booking.pickupDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2 md:col-span-1 flex justify-start md:justify-end mt-2 md:mt-0">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <AlertCircle className="text-gray-300 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
              You haven't made any bookings yet. Your future trips will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStyle(
        status
      )}`}
    >
      {status === "Completed" && <CheckCircle2 size={12} className="mr-1.5" />}
      {status === "Cancelled" && <XCircle size={12} className="mr-1.5" />}
      {status === "Pending" && <Clock size={12} className="mr-1.5" />}
      {status}
    </span>
  );
};

export default Dashboard;