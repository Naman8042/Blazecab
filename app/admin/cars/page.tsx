"use client"
import { useState ,useEffect} from "react";
import axios from "axios";
import Loading from "@/app/loading";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

export default function CarsView() {
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
      <div className="flex justify-center h-full w-full">
        <Loading />
      </div>
    );

  return (
    <div className="overflow-y-auto h-full px-4 pt-4 w-full">
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
