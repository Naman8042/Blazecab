'use client'

import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

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

type SearchResponse = {
  routes: Route[];
};


const fetcher = (url: string) => fetch(url).then(res => res.json())
const PAGE_LIMIT = 50

const getKey = (pageIndex: number, previousPageData: PaginatedResponse | null) => {
  if (previousPageData && previousPageData.routes.length === 0) return null;
  return `/api/onewayroutes?page=${pageIndex + 1}&limit=${PAGE_LIMIT}`;
};


export default function RouteList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const { data: searchData, isValidating: searchLoading } = useSWR<SearchResponse>(
  searchTerm ? `/api/search?city=${encodeURIComponent(searchTerm)}` : null,
  fetcher
);


  const {
  data: paginatedData,
  size,
  setSize,
  isValidating,
  error,
  mutate,
} = useSWRInfinite<PaginatedResponse>(getKey, fetcher);


  const routes: Route[] = searchTerm
  ? searchData?.routes || []
  : paginatedData?.flatMap(page => page.routes) || [];


  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form, setForm] = useState<Partial<Route>>({});
  const [newRoute, setNewRoute] = useState({
    pickup: '',
    drop: '',
    price: '',
    distance: '',
    cabs: '',
    per_kms_extra_charge: ''
  })

  useEffect(() => {
    if (!bottomRef.current || searchTerm) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isValidating) {
        setSize(prev => prev + 1)
      }
    }, { threshold: 1 })

    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [isValidating, setSize, searchTerm])

  const handleEditClick = (route: Route, index: number) => {
  setEditIndex(index);
  setForm(route);
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const res = await fetch(`/api/onewayroutes/?id=${form._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setEditIndex(null)
      mutate()
    }
  }

  const handleDelete = async (_id: string) => {
    if (!confirm('Delete this route?')) return
    const res = await fetch(`/api/onewayroutes/?id=${_id}`, {
      method: 'DELETE',
    })
    if (res.ok) mutate()
  }

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value })
  }

  const handleAddNew = async () => {
    const res = await fetch('/api/onewayroutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoute),
    })
    if (res.ok) {
      setNewRoute({ pickup: '', drop: '', price: '', distance: '', cabs: '', per_kms_extra_charge: '' })
      mutate()
    }
  }

  const handleSearch = () => {
    setSearchTerm(searchInput.trim())
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
  }

  if (error) return <p className="text-red-600">Failed to load routes</p>

  return (
    <div className="w-full mx-auto px-4 sm:py-6 sm:h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-start mt-2 sm:mt-0">Available Routes</h1>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by city"
          className="border p-2 rounded w-full"
        />
        <Button onClick={handleSearch}>Search</Button>
        {searchTerm && <Button variant="secondary" onClick={clearSearch}>Clear</Button>}
      </div>

      {/* Add new route */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        <input name="pickup" placeholder="Pickup" value={newRoute.pickup} onChange={handleNewChange} className="border p-2 rounded" />
        <input name="drop" placeholder="Drop" value={newRoute.drop} onChange={handleNewChange} className="border p-2 rounded" />
        <input name="price" placeholder="Price" value={newRoute.price} onChange={handleNewChange} className="border p-2 rounded" />
        <input name="distance" placeholder="Distance" value={newRoute.distance} onChange={handleNewChange} className="border p-2 rounded" />
        <input name="cabs" placeholder="Cab" value={newRoute.cabs} onChange={handleNewChange} className="border p-2 rounded" />
        <input name="per_kms_extra_charge" placeholder="Per Km Extra Charge" value={newRoute.per_kms_extra_charge} onChange={handleNewChange} className="border p-2 rounded" />
        <Button onClick={handleAddNew}>Add</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded shadow-sm text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm">Pickup</th>
              <th className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm">Drop</th>
              <th className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm">Price</th>
              <th className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm">Distance</th>
              <th className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm">Cab</th>
              <th className="p-1 sm:p-2 border whitespace-nowrap text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route: any, index: number) => (
              <tr key={route._id} className="odd:bg-white even:bg-gray-50">
                {editIndex === index ? (
                  <>
                    <td className="p-1 sm:p-2 border text-xs sm:text-sm">
                      <input name="pickup" value={form.pickup} onChange={handleChange} className="w-full border p-1 rounded" />
                    </td>
                    <td className="p-1 sm:p-2 border text-xs sm:text-sm">
                      <input name="drop" value={form.drop} onChange={handleChange} className="w-full border p-1 rounded" />
                    </td>
                    <td className="p-1 sm:p-2 border text-xs sm:text-sm">
                      <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border p-1 rounded" />
                    </td>
                    <td className="p-1 sm:p-2 border text-xs sm:text-sm">
                      <input name="distance" type="number" value={form.distance} onChange={handleChange} className="w-full border p-1 rounded" />
                    </td>
                    <td className="p-1 sm:p-2 border text-xs sm:text-sm">
                      <input name="cabs" value={form.cabs} onChange={handleChange} className="w-full border p-1 rounded" />
                    </td>
                    <td className="p-1 sm:p-2 border flex flex-col gap-2 sm:flex-row text-xs sm:text-sm">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="secondary" onClick={() => setEditIndex(null)}>Cancel</Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">{route.pickup}</td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">{route.drop}</td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">₹{route.price}</td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">{route.distance}</td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm">{route.cabs}</td>
                    <td className="p-1 sm:p-2 border text-center text-xs sm:text-sm flex  gap-2 sm:flex-row justify-center">
                      <Button onClick={() => handleEditClick(route, index)}>Edit</Button>
                      <Button variant="outline" onClick={() => handleDelete(route._id)}>Delete</Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!searchTerm && (
        <div ref={bottomRef} className="h-12 flex items-center justify-center text-gray-500">
          {isValidating && 'Loading more...'}
        </div>
      )}

      {searchLoading && <p className="text-center text-gray-500 mt-4">Searching...</p>}
      {searchTerm && !searchLoading && routes.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No results found</p>
      )}
    </div>
  )
}
