"use client";

import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Route = {
  _id: string;
  pickup: string;
  drop: string;
  price: number;
  distance: number;
  cabs: string;
  per_kms_extra_charge?: string;
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
  return `/api/onewayroutes?page=${pageIndex + 1}&limit=${PAGE_LIMIT}`;
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
      ? `/api/routes?pickup=${encodeURIComponent(
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
    price: "",
    distance: "",
    cabs: "",
    per_kms_extra_charge: "",
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
    const res = await fetch(`/api/onewayroutes/?id=${form._id}`, {
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
    const res = await fetch(`/api/onewayroutes/?id=${_id}`, {
      method: "DELETE",
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

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleAddNew = async () => {
    const res = await fetch("/api/onewayroutes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoute),
    });
    if (res.ok) {
      setNewRoute({
        pickup: "",
        drop: "",
        price: "",
        distance: "",
        cabs: "",
        per_kms_extra_charge: "",
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
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        {[
          "pickup",
          "drop",
          "price",
          "distance",
          "cabs",
          "per_kms_extra_charge",
        ].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace(/_/g, " ")}
            value={newRoute[field as keyof typeof newRoute] ?? ""}
            onChange={handleNewChange}
            className="border p-2 rounded"
          />
        ))}
        <Button onClick={handleAddNew}>Add</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded shadow-sm text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Pickup", "Drop", "Price", "Distance", "Cab", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {routes.map((route: Route, index: number) => (
              <tr key={route._id} className="odd:bg-white even:bg-gray-50">
                {editIndex === index ? (
                  <>
                    {["pickup", "drop", "price", "distance", "cabs"].map(
                      (field) => (
                        <td
                          key={field}
                          className="p-1 sm:p-2 border text-xs sm:text-sm"
                        >
                          <input
                            name={field}
                            type={
                              field === "price" || field === "distance"
                                ? "number"
                                : "text"
                            }
                            value={form[field as keyof Route] ?? ""}
                            onChange={handleChange}
                            className="w-full border p-1 rounded"
                          />
                        </td>
                      )
                    )}
                    <td className="p-1 sm:p-2 border flex flex-col gap-2 sm:flex-row text-xs sm:text-sm">
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
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">
                      {route.pickup}
                    </td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">
                      {route.drop}
                    </td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">
                      ₹{route.price}
                    </td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">
                      {route.distance}
                    </td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">
                      {route.cabs}
                    </td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm flex gap-2 justify-center">
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

      {/* Infinite Scroll Loader */}
      {!pickup && !drop && (
        <div
          ref={bottomRef}
          className="h-12 flex items-center justify-center text-gray-500"
        >
          {isValidating && "Loading more..."}
        </div>
      )}

      {/* Search state feedback */}
      {searchLoading && (
        <p className="text-center text-gray-500 mt-4">Searching...</p>
      )}
      {pickup && drop && !searchLoading && routes.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No results found</p>
      )}
    </div>
  );
}
