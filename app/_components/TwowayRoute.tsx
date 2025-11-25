"use client";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  RotateCcw, 
  Loader2,
  MapPin,
  Car,
  CalendarClock,
  UserCheck,
  MoveHorizontal
} from "lucide-react";

type Route = {
  _id: string;
  pickup: string;
  drop: string;
  cabs: string;
  distance: number;
  per_kms_charge: number;
  minimum_per_day_km: number;
  driver_allowance: number;
};

type PaginatedResponse = {
  routes: Route[];
};

type SearchResponse = Route[];

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_LIMIT = 50;

const getKey = (
  pageIndex: number,
  previousPageData: PaginatedResponse | null
) => {
  if (previousPageData && previousPageData.routes.length === 0) return null;
  return `/api/twowaypagination?page=${pageIndex + 1}&limit=${PAGE_LIMIT}`;
};

export default function RouteList() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const {
    data: searchData,
    isValidating: searchLoading,
    mutate: mutateSearch,
  } = useSWR<SearchResponse>(
    pickup && drop
      ? `/api/twowaysearch?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}`
      : null,
    fetcher
  );

  const {
    data: paginatedData,
    setSize,
    isValidating,
    error,
    mutate,
  } = useSWRInfinite<PaginatedResponse>(getKey, fetcher);

  const routes: Route[] =
    pickup && drop
      ? searchData || []
      : paginatedData?.flatMap((page) => page.routes) || [];

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Route>>({});
  const [newRoute, setNewRoute] = useState({
    pickup: "",
    drop: "",
    distance: "",
    cabs: "",
    per_kms_charge: "",
    minimum_per_day_km: "",
    driver_allowance: "",
  });

  useEffect(() => {
    if (!bottomRef.current || pickup || drop) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating) {
          setSize((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [isValidating, setSize, pickup, drop]);

  const handleEditClick = (route: Route, index: number) => {
    setEditIndex(index);
    setForm(route);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/twoway/?id=${form._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditIndex(null);
      if (pickup && drop) {
  mutateSearch();
} else {
  mutate();
}

    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm("Delete this route?")) return;
    const res = await fetch(`/api/twoway/?id=${_id}`, {
      method: "DELETE",
    });
    if (res.ok) {
       if (pickup && drop) {
  mutateSearch();
} else {
  mutate();
}

    }
  };

  const handleNewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleAddNew = async () => {
    const res = await fetch("/api/twoway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoute),
    });
    if (res.ok) {
      setNewRoute({
        pickup: "",
        drop: "",
        distance: "",
        cabs: "",
        per_kms_charge: "",
        minimum_per_day_km: "",
        driver_allowance: "",
      });
      mutate();
    }
  };

  const handleSearch = () => {
    if (pickupInput.trim() && dropInput.trim()) {
      setPickup(pickupInput.trim());
      setDrop(dropInput.trim());
    }
  };

  const clearSearch = () => {
    setPickupInput("");
    setDropInput("");
    setPickup("");
    setDrop("");
  };

  const cabOptions = [
    "Traveller",
    "Tempo Traveller 11+1",
    "Urbania Traveller 15+1",
    "Urbania Traveller 11+1",
    "Toyota Innova 6+1",
    "Sedan",
    "Suv",
    "Innova Crysta 6+1",
    "Hatchback",
    "Innova Crysta 7+1",
  ];

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 text-red-500">
      <p>Failed to load routes.</p>
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">Retry</Button>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Two-Way Routes</h1>
          <p className="text-sm text-gray-500">Manage round trip pricing, allowances, and minimums.</p>
        </div>
      </div>

      {/* --- Search Section --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Pickup City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={pickupInput}
                onChange={(e) => setPickupInput(e.target.value)}
                placeholder="Enter pickup..."
                className="pl-9 w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-[#6aa4e0] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Drop City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={dropInput}
                onChange={(e) => setDropInput(e.target.value)}
                placeholder="Enter drop..."
                className="pl-9 w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-[#6aa4e0] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={handleSearch} className="bg-[#6aa4e0] hover:bg-[#5a94d0] text-white">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
            {(pickup || drop) && (
              <Button variant="outline" onClick={clearSearch}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* --- Add New Route Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#6aa4e0]" /> Add New Round Trip
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 items-end">
            <input name="pickup" value={newRoute.pickup} onChange={handleNewChange} placeholder="Pickup City" className="border p-2 rounded text-sm w-full" />
            <input name="drop" value={newRoute.drop} onChange={handleNewChange} placeholder="Drop City" className="border p-2 rounded text-sm w-full" />
            
            <select name="cabs" value={newRoute.cabs} onChange={handleNewChange} className="border p-2 rounded text-sm w-full bg-white">
              <option value="">Select Cab</option>
              {cabOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <input name="distance" type="number" value={newRoute.distance} onChange={handleNewChange} placeholder="Dist (km)" className="border p-2 rounded text-sm w-full" />
            <input name="per_kms_charge" type="number" value={newRoute.per_kms_charge} onChange={handleNewChange} placeholder="Charge/Km" className="border p-2 rounded text-sm w-full" />
            <input name="minimum_per_day_km" type="number" value={newRoute.minimum_per_day_km} onChange={handleNewChange} placeholder="Min Km/Day" className="border p-2 rounded text-sm w-full" />
            <input name="driver_allowance" type="number" value={newRoute.driver_allowance} onChange={handleNewChange} placeholder="Driver Allow." className="border p-2 rounded text-sm w-full" />
            
            <Button onClick={handleAddNew} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Pickup", 
                  "Drop", 
                  "Cab Model", 
                  "Distance", 
                  "Price/Km", 
                  "Min Km/Day", 
                  "Driver Allow.", 
                  "Actions"
                ].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map((route, index) => {
                const isEditing = editIndex === index;
                return (
                  <tr key={route._id || index} className={`hover:bg-gray-50 transition-colors ${isEditing ? "bg-blue-50/50" : ""}`}>
                    
                    {/* Pickup */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input name="pickup" value={form.pickup} onChange={handleChange} className="w-full border p-1 rounded" />
                      ) : (
                        <div className="flex items-center gap-2">
                           <MapPin className="h-3 w-3 text-gray-400"/> {route.pickup}
                        </div>
                      )}
                    </td>

                    {/* Drop */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing ? (
                        <input name="drop" value={form.drop} onChange={handleChange} className="w-full border p-1 rounded" />
                      ) : (
                         <div className="flex items-center gap-2">
                           <MapPin className="h-3 w-3 text-red-400"/> {route.drop}
                        </div>
                      )}
                    </td>

                    {/* Cab */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                         <select name="cabs" value={form.cabs} onChange={handleChange} className="border p-1 rounded w-full text-xs">
                           {cabOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                         </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Car className="h-3 w-3 text-gray-400"/> {route.cabs}
                        </div>
                      )}
                    </td>

                    {/* Distance */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input name="distance" type="number" value={form.distance} onChange={handleChange} className="w-20 border p-1 rounded" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <MoveHorizontal className="h-3 w-3 text-gray-400"/> {route.distance} km
                        </div>
                      )}
                    </td>

                    {/* Per Km Charge */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {isEditing ? (
                        <input name="per_kms_charge" type="number" value={form.per_kms_charge} onChange={handleChange} className="w-20 border p-1 rounded" />
                      ) : (
                        <span className="text-[#6aa4e0]">₹{route.per_kms_charge}/km</span>
                      )}
                    </td>

                    {/* Minimum Per Day Km */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input name="minimum_per_day_km" type="number" value={form.minimum_per_day_km} onChange={handleChange} className="w-20 border p-1 rounded" />
                      ) : (
                         <div className="flex items-center gap-1">
                          <CalendarClock className="h-3 w-3 text-gray-400"/> {route.minimum_per_day_km} km
                        </div>
                      )}
                    </td>

                    {/* Driver Allowance */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input name="driver_allowance" type="number" value={form.driver_allowance} onChange={handleChange} className="w-20 border p-1 rounded" />
                      ) : (
                         <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3 text-gray-400"/> ₹{route.driver_allowance}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0 rounded-full">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditIndex(null)} className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleEditClick(route, index)} className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-[#6aa4e0] hover:bg-blue-50">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(route._id)} className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {routes.length === 0 && !isValidating && !searchLoading && (
                 <tr>
                   <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                     <div className="flex flex-col items-center justify-center gap-2">
                       <Search className="h-8 w-8 text-gray-300" />
                       <p>No round trips found.</p>
                     </div>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {(isValidating || searchLoading) && (
          <div className="w-full py-6 flex justify-center bg-gray-50/50">
            <Loader2 className="animate-spin text-[#6aa4e0]" />
          </div>
        )}
      </div>

      {!pickup && !drop && <div ref={bottomRef} className="h-4" />}
    </div>
  );
}