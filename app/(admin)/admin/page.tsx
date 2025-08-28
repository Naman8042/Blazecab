"use client";
import { useState, useEffect } from "react";
import { Book, Menu } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import Loading from "../../loading";
import OnewayRoute from "@/app/_components/OnewayRoute";
import RoundtripRoute from "@/app/_components/TwowayRoute";
import LocalRoute from "@/app/_components/LocalRoute";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const Sidebar = ({ setActive }: { setActive: (val: string) => void }) => {
  return (
    <div className="w-80 h-full bg-[#6aa4e0] text-white p-4 hidden sm:block overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <nav className="space-y-8">
        <button
          onClick={() => setActive("routes")}
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <Menu size={20} /> Routes
        </button>
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
  const [routeType, setRouteType] = useState<
    "oneway" | "roundtrip" | "localtrip"
  >("oneway");

  return (
    <div className=" w-full">
      {/* {active === "home" && <div>Welcome to the Admin Dashboard</div>} */}
      {active === "routes" && (
        <div className="p-4 h-full ">
          <Tabs
            defaultValue="oneway"
            className=" w-full flex   items-center sm:items-start"
            onValueChange={(val) =>
              setRouteType(val as "oneway" | "roundtrip" | "localtrip")
            }
          >
            <TabsList className="mb-4">
              <TabsTrigger value="oneway">One Way</TabsTrigger>
              <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
              <TabsTrigger value="localtrip">Local Trip</TabsTrigger>
            </TabsList>
          </Tabs>

          {routeType === "oneway" && <OnewayRoute />}
          {routeType === "roundtrip" && <RoundtripRoute />}
          {routeType === "localtrip" && <LocalRoute />}
        </div>
      )}

      {active === "bookings" && <BookingsView />}
      {active === "cars" && <CarsView />}
    </div>
  );
};

interface CarInterface {
  _id?: string;
  category: string;
  name: string;
  capacity: string;
  image: string;
  inclusions: string[];
  exclusions: string[];
  termscondition: string[];
}

function CarsView() {
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CarInterface>({
    category: "",
    name: "",
    capacity: "",
    image: "",
    inclusions: [],
    exclusions: [],
    termscondition: [],
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (["inclusions", "exclusions", "termscondition"].includes(name)) {
      setForm({ ...form, [name]: value.split(",").map((item) => item.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editIndex !== null && cars[editIndex]._id) {
      await axios.put(`/api/car?id=${cars[editIndex]._id}`, form);
      const updated = [...cars];
      updated[editIndex] = form;
      setCars(updated);
    } else {
      const response = await axios.post("/api/cars", form);
      setCars([...cars, response.data]);
    }

    setForm({
      category: "",
      name: "",
      capacity: "",
      image: "",
      inclusions: [],
      exclusions: [],
      termscondition: [],
    });
    setEditIndex(null);
  };

  const handleEdit = (car: CarInterface, index: number) => {
    setForm(car);
    setEditIndex(index);
  };

  if (loading)
    return (
      <div className="flex justify-center h-full">
        <Loading />
      </div>
    );

  return (
    <div className="overflow-y-auto h-full px-4 pt-4">
      <h2 className="text-xl font-semibold mb-4">Car Management</h2>

      {/* Car Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded mb-6"
      >
        {(
          ["category", "name", "capacity", "image"] as Array<keyof CarInterface>
        ).map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="p-2 border rounded"
          />
        ))}

        <textarea
          name="inclusions"
          value={form.inclusions.join(", ")}
          onChange={handleChange}
          placeholder="Inclusions (comma separated)"
          className="p-2 border rounded col-span-2"
        />
        <textarea
          name="exclusions"
          value={form.exclusions.join(", ")}
          onChange={handleChange}
          placeholder="Exclusions (comma separated)"
          className="p-2 border rounded col-span-2"
        />
        <textarea
          name="termscondition"
          value={form.termscondition.join(", ")}
          onChange={handleChange}
          placeholder="Terms & Conditions (comma separated)"
          className="p-2 border rounded col-span-2"
        />

        <Button type="submit" className="col-span-2">
          {editIndex !== null ? "Update Car" : "Add Car"}
        </Button>
      </form>

      {/* Car Table */}
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr
                key={car._id || index}
                className="odd:bg-white even:bg-gray-50"
              >
                <td className="p-2 border text-center">
                  <Image
                    src={car.image}
                    alt={car.name}
                    width={80}
                    height={50}
                    className="mx-auto rounded"
                  />
                </td>
                <td className="p-2 border text-center">{car.name}</td>
                <td className="p-2 border text-center">{car.category}</td>
                <td className="p-2 border text-center">{car.capacity}</td>
                <td className="p-2 border text-center">
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
}

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
      <div className="flex items-center justify-center">
        Loading bookings...
      </div>
    );

  return (
    <div className="h-full  p-4">
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

export default function Dashboard() {
  const [active, setActive] = useState("bookings");
  const { data: session } = useSession();
  const router  = useRouter()

  if (!session) return;

  if(!session.user.isAdmin){
    router.push("/login")
  }

  return (
    <div className="flex flex-col sm:flex-row h-[89.75vh]">
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
            onClick={() => setActive("routes")}
            className={`${
              active === "routes" ? "underline font-semibold" : ""
            }`}
          >
            Routes
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
