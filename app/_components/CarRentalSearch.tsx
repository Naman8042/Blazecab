"use client";

import { useState } from "react";

const CarRentalSearch = () => {
  const [returnDifferentLocation, setReturnDifferentLocation] = useState(false);
  const [isDriverAgeChecked, setIsDriverAgeChecked] = useState(true);

  return (
    <section
      className="relative w-full min-h-[91vh] bg-cover bg-center flex items-center px-4 py-12 lg:py-24"
      style={{ backgroundImage: "url('/images/car-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
          Find the best car rental deals
        </h1>

        {/* Search Box */}
        <div className="bg-[#00204A] text-white p-6 rounded-lg shadow-lg w-full">
          {/* Main Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pick-up location */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-semibold mb-1">Pick-up location</label>
              <input
                type="text"
                placeholder="City, airport, or address"
                className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Pick-up Date/Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Pick-up date</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Time</label>
                <input
                  type="time"
                  className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Drop-off Date/Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Drop-off date</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Time</label>
                <input
                  type="time"
                  className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes and Search Button */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                  checked={isDriverAgeChecked}
                  onChange={() => setIsDriverAgeChecked(!isDriverAgeChecked)}
                />
                <span className="text-sm">Driver aged between 25 – 70</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                  checked={returnDifferentLocation}
                  onChange={() => setReturnDifferentLocation(!returnDifferentLocation)}
                />
                <span className="text-sm">Return car to a different location</span>
              </label>
            </div>

            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 ease-in-out transform hover:scale-105">
              Search Cars
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarRentalSearch;