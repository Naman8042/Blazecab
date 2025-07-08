import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Route = {
  _id: string;
  pickup: string;
  drop: string;
  cabs: string;
  distance: number;
  per_kms_charge: number;
  minimum_per_day_km: number;
  limit: number;
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
      ? `/api/twowaysearch?pickup=${encodeURIComponent(
          pickup
        )}&drop=${encodeURIComponent(drop)}`
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
    limit: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        mutateSearch(); // Revalidate search results
      } else {
        mutate(); // Revalidate paginated list
      }
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm("Delete this route?")) return;
    const res = await fetch(`/api/twoway/?id=${_id}`, {
      method: "DELETE",
    });
    if (res.ok) mutate();
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleAddNew = async () => {
    console.log(newRoute)
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
        limit: "",
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

  if (error) return <p className="text-red-600">Failed to load routes</p>;

  return (
    <div className="w-full mx-auto px-4 sm:py-6 sm:h-[94%] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-start mt-2 sm:mt-0">
        Available Routes
      </h1>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={pickupInput}
          onChange={(e) => setPickupInput(e.target.value)}
          placeholder="Pickup city"
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          value={dropInput}
          onChange={(e) => setDropInput(e.target.value)}
          placeholder="Drop city"
          className="border p-2 rounded w-full"
        />

        <Button onClick={handleSearch}>Search</Button>
        {(pickup || drop) && (
          <Button variant="secondary" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </div>

      {/* Add new route */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
        <input
          name="pickup"
          placeholder="Pickup"
          value={newRoute.pickup}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="drop"
          placeholder="Drop"
          value={newRoute.drop}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="distance"
          placeholder="Distance"
          value={newRoute.distance}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="cabs"
          placeholder="Cab"
          value={newRoute.cabs}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="per_kms_charge"
          placeholder="Per Km Charge"
          value={newRoute.per_kms_charge}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="minimum_per_day_km"
          placeholder="Minimum Per Day Km"
          value={newRoute.minimum_per_day_km}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="limit"
          placeholder="Limit"
          value={newRoute.limit}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <input
          name="driver_allowance"
          placeholder="Driver Allowance"
          value={newRoute.driver_allowance}
          onChange={handleNewChange}
          className="border p-2 rounded"
        />
        <Button onClick={handleAddNew}>Add</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded shadow-sm text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Pickup</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Drop</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">
                Per Km Price
              </th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Distance</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Cab</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">
                Minimum Per Day Km
              </th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">limit</th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">
                Driver Allowance
              </th>
              <th className="p-1 sm:p-2 border text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route: Route, index: number) => (
              <tr key={route._id} className="odd:bg-white even:bg-gray-50">
                {editIndex === index ? (
                  <>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="pickup"
                        value={form.pickup}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="drop"
                        value={form.drop}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="per_kms_charge"
                        type="number"
                        value={form.per_kms_charge}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="distance"
                        type="number"
                        value={form.distance}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="cabs"
                        value={form.cabs}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="minimum_per_day_km"
                        value={form.minimum_per_day_km}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border">
                      <input
                        name="limit"
                        value={form.limit}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>

                    <td className="p-1 sm:p-2 border">
                      <input
                        name="driver_allowance"
                        value={form.driver_allowance}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                      />
                    </td>
                    <td className="p-1 sm:p-2 border flex flex-col gap-2 sm:flex-row">
                      <Button onClick={handleSave}>Save</Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.pickup}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.drop}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      ₹{route.per_kms_charge}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.distance}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.cabs}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.minimum_per_day_km}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.limit}
                    </td>
                    <td className="p-1 sm:p-2 border text-center">
                      {route.driver_allowance}
                    </td>
                    <td className="p-1 sm:p-2 border flex gap-2 justify-center">
                      <Button onClick={() => handleEditClick(route, index)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(route._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {searchLoading && (
        <p className="text-center text-gray-500 mt-4">Searching...</p>
      )}
      {pickup && drop && !searchLoading && routes.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No results found</p>
      )}
    </div>
  );
}
