"use client";
import { useState, useEffect } from "react";
import { Book, Menu } from "lucide-react";
import axios from "axios";
import Image from "next/image";

const Sidebar = ({ setActive }: { setActive: (val: string) => void }) => {
  return (
    <div className="w-80 h-screen bg-[#6aa4e0] text-white p-4 hidden sm:block">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-8">
        {/* <button
          onClick={() => setActive("home")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Home size={20} /> Home
        </button>
        <button
          onClick={() => setActive("routes")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Menu size={20} /> Routes
        </button> */}
        <button
          onClick={() => setActive("bookings")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Book size={20} /> Bookings
        </button>
        <button
          onClick={() => setActive("cars")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Menu size={20} /> Cars
        </button>
      </nav>
    </div>
  );
};

const Content = ({ active }: { active: string }) => {
  return (
    <div className="p-6 w-full">
      {/* {active === "home" && <div>Welcome to the Admin Dashboard</div>} */}
      {/* {active === "routes" && <RoutesView />} */}
      {active === "bookings" && <BookingsView />}
      {active === "cars" && <CarsView />}
    </div>
  );
};

// const RoutesView = () => {
//   const [routes, setRoutes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRoutes = async () => {
//       try {
//         // const response = await axios.get("/api/routes"); // replace with your backend API endpoint
//         const data = [
//           {
//             pickupLocation: "New York",
//             dropoffLocation: "Boston",
//             pickupDate: "2025-06-30T00:00:00.000Z",
//             pickupTime: "10:30 AM",
//             dropoffDate: "2025-07-01T00:00:00.000Z",
//             rideType: "Round Trip",
//           },
//           {
//             pickupLocation: "San Francisco",
//             dropoffLocation: "Los Angeles",
//             pickupDate: "2025-07-02T00:00:00.000Z",
//             pickupTime: "09:00 AM",
//             dropoffDate: null,
//             rideType: "One Way",
//           },
//         ];

//         setRoutes(data);
//       } catch (error) {
//         console.error("Error fetching routes:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoutes();
//   }, []);

//   if (loading) return <div>Loading routes...</div>;

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Submitted Routes</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border">Pickup</th>
//               <th className="p-2 border">Dropoff</th>
//               <th className="p-2 border">Pickup Date</th>
//               <th className="p-2 border">Pickup Time</th>
//               <th className="p-2 border">Dropoff Date</th>
//               <th className="p-2 border">Ride Type</th>
//             </tr>
//           </thead>
//           <tbody>
//             {routes.length > 0 &&
//               routes.map((route, index) => (
//                 <tr key={index} className="odd:bg-white even:bg-gray-50">
//                   <td className="p-2 border">{route.pickupLocation}</td>
//                   <td className="p-2 border">{route.dropoffLocation}</td>
//                   <td className="p-2 border">
//                     {new Date(route.pickupDate).toLocaleDateString()}
//                   </td>
//                   <td className="p-2 border">{route.pickupTime}</td>
//                   <td className="p-2 border">
//                     {route.dropoffDate
//                       ? new Date(route.dropoffDate).toLocaleDateString()
//                       : "-"}
//                   </td>
//                   <td className="p-2 border">{route.rideType}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

interface CarInterface {
  image: string;
  name: string;
  price: number;
  _id: string;
}

interface Forminterface {
  _id: string;
  name: string;
  image: string;
  price: number;
}

const CarsView = () => {
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Forminterface>({
    _id: "",
    name: "",
    image: "",
    price: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/car");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editIndex !== null) {
      await axios.put(`/api/car?id=${cars[editIndex]._id}`, form);
      const updated = [...cars];
      updated[editIndex] = form;
      setCars(updated);
    } else {
      const response = await axios.post("/api/cars", form);
      setCars([...cars, response.data]);
    }

    setForm({
      name: "",
      image: "",
      price: 0,
      _id: "",
    });
    setEditIndex(null);
  };

  const handleEdit = (car: CarInterface, index: number) => {
    setForm(car);
    setEditIndex(index);
  };

  if (loading) return <div>Loading cars...</div>;

  const fields: (keyof Forminterface)[] = ["name", "image"]; // example

  return (
    <div className="overflow-y-auto h-[83vh]">
      <h2 className="text-xl font-semibold mb-4">Car Management</h2>

      {/* Car Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded mb-6"
      >
        {fields.map((field) => (
          <input
            key={field}
            className="p-2 border rounded"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <input
          className="p-2 border rounded"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) })
          }
        />

        <button
          type="submit"
          className="col-span-2 bg-[#6aa4e0] text-white py-2 rounded"
        >
          {editIndex !== null ? "Update Car" : "Add Car"}
        </button>
      </form>

      {/* Car Table */}
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price/Km</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border text-center align-middle">
                  <Image
                    src={car.image}
                    alt={car.name}
                    className="w-16 h-10 mx-auto"
                  />
                </td>
                <td className="p-2 border text-center align-middle">
                  {car.name}
                </td>
                <td className="p-2 border text-center align-middle">
                  ₹{car.price}
                </td>
                <td className="p-2 border text-center align-middle">
                  <button
                    onClick={() => handleEdit(car, index)}
                    className="text-[#6aa4e0] hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface Booking {
  id: string;
  type: string;
  pickupCity: string;
  destinationCity: string;
  createdAt: string;
  pickupDate: string;
  customerName: string;
  customerPhone: string;
  status: string;
}

const BookingsView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = [
          {
            id: "BKG12345",
            type: "Two Way",
            pickupCity: "Delhi",
            destinationCity: "Jaipur",
            createdAt: "2024-06-27T09:30:00Z",
            pickupDate: "2024-06-28T14:00:00Z",
            customerName: "Rajesh Kumar",
            customerPhone: "+91-9876543210",
            status: "Confirmed",
          },
          {
            id: "BKG12346",
            type: "One Way",
            pickupCity: "Delhi",
            destinationCity: "Jaipur",
            createdAt: "2024-06-27T09:30:00Z",
            pickupDate: "2024-06-28T14:00:00Z",
            customerName: "Rajesh Kumar",
            customerPhone: "+91-9876543210",
            status: "Confirmed",
          },
          {
            id: "BKG12347",
            type: "One Way",
            pickupCity: "Delhi",
            destinationCity: "Jaipur",
            createdAt: "2024-06-27T09:30:00Z",
            pickupDate: "2024-06-28T14:00:00Z",
            customerName: "Rajesh Kumar",
            customerPhone: "+91-9876543210",
            status: "Confirmed",
          },
        ];

        setBookings(response);
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

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Today&apos;s and Tomorrow&apos;s Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-xs sm:text-lg">
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
                  className="odd:bg-white even:bg-gray-50 cursor-pointer hover:bg-gray-200 text-xs sm:text-lg"
                  onClick={() =>
                    setSelectedBooking(isSelected ? null : booking)
                  }
                >
                  <td className="p-2 border text-[#6aa4e0] underline text-center align-middle">
                    {booking.id}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.type}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.pickupCity}
                  </td>
                  <td className="p-2 border text-center align-middle">
                    {booking.destinationCity}
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
                    {booking.customerPhone}
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
                          <strong>Booking ID:</strong> {booking.id}
                        </p>
                        <p>
                          <strong>Type:</strong> {booking.type}
                        </p>
                        <p>
                          <strong>Pickup City:</strong> {booking.pickupCity}
                        </p>
                        <p>
                          <strong>Destination:</strong>{" "}
                          {booking.destinationCity}
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
                          <strong>Phone:</strong> {booking.customerPhone}
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

export default function Dashboard() {
  const [active, setActive] = useState("bookings");

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar setActive={setActive} />
      <header className="sm:hidden bg-[#6aa4e0] text-white p-4 flex justify-between items-center w-full">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setActive("bookings")}
            className={`${
              active === "bookings" ? "underline font-semibold" : ""
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActive("cars")}
            className={`${active === "cars" ? "underline font-semibold" : ""}`}
          >
            Cars
          </button>
        </nav>
      </header>
      <Content active={active} />
    </div>
  );
}
