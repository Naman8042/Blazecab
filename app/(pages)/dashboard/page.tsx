
import { getServerSession } from "next-auth";
import { option } from "@/app/api/auth/[...nextauth]/option";
import axios from "axios";


interface Booking {
  id: string;
  type: string;
  pickupCity: string;
  pickupDate: string;
  status: string;
  destination?: string;
}
async function getBookings(userEmail: string): Promise<Booking[]> {

  const {data} = await axios.get(`${process.env.NEXTAUTH_URL}/api/user?email=${userEmail}`);
  return data.bookings || [];
}

const Dashboard = async () => {
  const session = await getServerSession(option);

  if (!session || !session.user || !session.user.email) {
    return (
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4 font-sans">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
          Access Denied
        </h1>
        <p className="text-center text-gray-500">Please log in to view your bookings.</p>
      </div>
    );
  }

  const userEmail = session.user.email;
  const bookings = await getBookings(userEmail);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto h-[83vh] sm:h-[91vh]">
      <div className="container mx-auto">
        <BookingsList bookings={bookings} />
      </div>
    </div>
  );
};

// Component to display the list of bookings
const BookingsList = ({ bookings }: { bookings: Booking[] }) => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        All Bookings
      </h2>
      {bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((booking, index) => (
            <li
              key={index}
              className="p-4 bg-gray-50 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-md"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
                {/* Each item uses a flex column to stack label and value, centered horizontally */}
                <div className="flex flex-col items-center flex-1 min-w-[80px]">
                  <p className="text-gray-500">Type</p>
                  <p className="font-semibold text-gray-800 capitalize text-center">
                    {booking.type}
                  </p>
                </div>
                <div className="flex flex-col items-center flex-1 min-w-[80px]">
                  <p className="text-gray-500">Pickup</p>
                  <p className="font-semibold text-gray-800 text-center">
                    {booking.pickupCity}
                  </p>
                </div>
                {booking.destination && (
                  <div className="flex flex-col items-center flex-1 min-w-[80px]">
                    <p className="text-gray-500">Destination</p>
                    <p className="font-semibold text-gray-800 text-center">
                      {booking.destination}
                    </p>
                  </div>
                )}
                <div className="flex flex-col items-center flex-1 min-w-[80px]">
                  <p className="text-gray-500">Date</p>
                  <p className="font-semibold text-gray-800 text-center">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </p>
                </div>
                {/* The status block is now a flex column and centered */}
                <div className="flex flex-col items-center flex-1 min-w-[80px]">
                  <p className="text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 p-6">
          <p>No bookings found. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;