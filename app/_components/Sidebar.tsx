"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";

type SectionName = "seats" | "transmission" | "pickup" | "policies";

type Filters = {
  [category: string]: {
    [subCategory: string]: boolean;
  };
};



const FilterSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionName, boolean>>({
    seats: true,
    transmission: true,
    pickup: true,
    policies: true,
  });

  const [selectedSeats, setSelectedSeats] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    transmission: { automatic: false, manual: false },
    pickup: { airportTerminal: false },
    policies: { unlimitedMileage: false, freeCancellation: false, fairFuelPolicy: false },
  });
  

  const toggleSection = (section: SectionName) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSeatSelection = (seatOption: string) => {
    setSelectedSeats((prev) => (prev === seatOption ? null : seatOption));
  };

  const handleCheckboxChange = (category: keyof typeof filters, subCategory: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: !prev[category][subCategory],
      },
    }));
  };

  return (
    <>
      {/* Sidebar Toggle Button (Only for Mobile) */}
      <button
        className="md:hidden  top-19 left-6 p-3 ml-3 mt-3"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`mt-0.25 fixed md:static top-0 left-0 bg-white z-50 min-h-screen w-64 md:w-1/5 p-4 shadow-lg transform transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        {/* Close Button (Only for Mobile) */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-500"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        {/* Reset All */}
        <button
          className="text-blue-500 text-sm font-semibold mb-4"
          onClick={() => {
            setSelectedSeats(null);
            setFilters({
              transmission: { automatic: false, manual: false },
              pickup: { airportTerminal: false },
              policies: { unlimitedMileage: false, freeCancellation: false, fairFuelPolicy: false },
            });
          }}
        >
          Reset all
        </button>

        {/* Seats */}
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("seats")}>
            <h3 className="text-lg font-semibold">Seats</h3>
            {openSections.seats ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openSections.seats && (
            <div className="mt-2 flex space-x-2">
              {["4-5", "6+"].map((seat) => (
                <button
                  key={seat}
                  className={`px-3 py-1 border rounded-lg text-sm ${
                    selectedSeats === seat ? "bg-blue-600 text-white" : "border-gray-400 hover:bg-gray-200"
                  }`}
                  onClick={() => handleSeatSelection(seat)}
                >
                  {seat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Transmission */}
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("transmission")}>
            <h3 className="text-lg font-semibold">Transmission</h3>
            {openSections.transmission ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openSections.transmission && (
            <div className="mt-2 space-y-2">
              {["automatic", "manual"].map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-500"
                    checked={filters.transmission[type as "automatic" | "manual"]}
                    onChange={() => handleCheckboxChange("transmission", type)}
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Pick-up */}
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("pickup")}>
            <h3 className="text-lg font-semibold">Pick-up</h3>
            {openSections.pickup ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openSections.pickup && (
            <label className="mt-2 flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-500"
                checked={filters.pickup.airportTerminal}
                onChange={() => handleCheckboxChange("pickup", "airportTerminal")}
              />
              <span className="text-sm">Airport terminal</span>
            </label>
          )}
        </div>

        {/* Policies */}
        <div className="mb-4">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("policies")}>
            <h3 className="text-lg font-semibold">Policies</h3>
            {openSections.policies ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {openSections.policies && (
            <div className="mt-2 space-y-2">
              {[
                { key: "unlimitedMileage", label: "Unlimited mileage", desc: "No additional costs if you go over your mileage allowance." },
                { key: "freeCancellation", label: "Free cancellation", desc: "Cancel for free up to 48 hours before your pick-up time." },
                { key: "fairFuelPolicy", label: "Fair fuel policy", desc: "Pick up and return your car with the same amount of fuel." },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-500"
                    checked={filters.policies[key as keyof typeof filters.policies]}
                    onChange={() => handleCheckboxChange("policies", key)}
                  />
                  <div>
                    <span className="text-sm font-semibold">{label}</span>
                    <p className="text-xs text-gray-600">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay (click to close sidebar) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default FilterSidebar;
