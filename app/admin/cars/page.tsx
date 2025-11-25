"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  Car, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Save, 
  Edit2, 
  Loader2,  
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);
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
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCars();
  }, []);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    setSubmitting(true);
    try {
      if (editIndex !== null && cars[editIndex]._id) {
        await axios.put(`/api/car?id=${cars[editIndex]._id}`, form);
        const updated = [...cars];
        updated[editIndex] = form;
        setCars(updated);
      } else {
        const response = await axios.post("/api/cars", form);
        setCars([...cars, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving car", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
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
    // Scroll to top to see form
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // const handleDelete = async (id: string) => {
  //   if(!confirm("Are you sure you want to delete this car?")) return;
  //   try {
  //       // Assuming delete API exists, if not, remove this function
  //       // await axios.delete(`/api/car?id=${id}`);
  //       // For now just updating state if API isn't strictly defined in prompt
  //       setCars(cars.filter(c => c._id !== id));
  //   } catch (e) {
  //       console.error(e);
  //   }
  // }

  const categories = ["Sedan", "SUV", "Hatchback", "Traveller", "Luxury", "Bus"];

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#6aa4e0]" />
        <p className="text-gray-500 mt-2">Loading fleet...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 bg-gray-50/50 min-h-screen" ref={topRef}>
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fleet Management</h2>
          <p className="text-sm text-gray-500">Add, edit, and manage your vehicle inventory.</p>
        </div>
      </div>

      {/* --- Main Form Card --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
            {editIndex !== null ? <Edit2 className="h-4 w-4 text-[#6aa4e0]"/> : <Plus className="h-4 w-4 text-[#6aa4e0]"/>}
            {editIndex !== null ? "Edit Vehicle" : "Add New Vehicle"}
          </h3>
          {editIndex !== null && (
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs text-gray-500">
              Cancel Edit
            </Button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Car className="h-3 w-3"/> Vehicle Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Toyota Innova Crysta"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#6aa4e0] outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <FileText className="h-3 w-3"/> Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#6aa4e0] outline-none bg-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <Users className="h-3 w-3"/> Seating Capacity
              </label>
              <input
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 6+1"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#6aa4e0] outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                <ImageIcon className="h-3 w-3"/> Image URL
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#6aa4e0] outline-none"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Section 2: Policies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-green-600 uppercase flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3"/> Inclusions
              </label>
              <textarea
                name="inclusions"
                value={form.inclusions.join(", ")}
                onChange={handleChange}
                placeholder="Fuel, Driver Allowance, Tolls (comma separated)"
                className="w-full h-24 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-red-500 uppercase flex items-center gap-1">
                <XCircle className="h-3 w-3"/> Exclusions
              </label>
              <textarea
                name="exclusions"
                value={form.exclusions.join(", ")}
                onChange={handleChange}
                placeholder="Parking, State Tax, Night Charge (comma separated)"
                className="w-full h-24 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-500 uppercase flex items-center gap-1">
                <AlertCircle className="h-3 w-3"/> Terms & Conditions
              </label>
              <textarea
                name="termscondition"
                value={form.termscondition.join(", ")}
                onChange={handleChange}
                placeholder="No smoking, ID required (comma separated)"
                className="w-full h-24 border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={submitting} className="w-full md:w-auto bg-[#6aa4e0] hover:bg-[#5a94d0]">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
              {editIndex !== null ? "Update Vehicle Details" : "Add to Fleet"}
            </Button>
          </div>
        </form>
      </div>

      {/* --- Fleet Table --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Vehicle", "Category", "Capacity", "Policies", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car, index) => (
                <tr key={car._id || index} className="hover:bg-gray-50 transition-colors">
                  {/* Image & Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-24 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                         {car.image ? (
                            <Image
                              src={car.image}
                              alt={car.name}
                              fill
                              className="object-cover"
                              unoptimized // Use unoptimized if images are external URLs
                            />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400">
                             <ImageIcon className="h-6 w-6"/>
                           </div>
                         )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{car.name}</div>
                        <div className="text-xs text-gray-500">ID: {car._id?.slice(-6) || 'N/A'}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {car.category}
                    </span>
                  </td>

                  {/* Capacity */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400"/>
                      {car.capacity} Seats
                    </div>
                  </td>

                  {/* Policy Summary */}
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-xs">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-gray-700">{car.inclusions?.length || 0}</span>
                            <span className="text-gray-400">Incl.</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-gray-700">{car.exclusions?.length || 0}</span>
                            <span className="text-gray-400">Excl.</span>
                        </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                     <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(car, index)}
                          className="text-gray-500 hover:text-[#6aa4e0] hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4"/>
                        </Button>
                        {/* Add Delete logic here if available */}
                     </div>
                  </td>
                </tr>
              ))}

              {cars.length === 0 && !loading && (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Car className="h-10 w-10 text-gray-300"/>
                            <p>No vehicles in the fleet yet.</p>
                        </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}