"use client";

import { useState, FormEvent, Dispatch, SetStateAction, forwardRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { useRideTypeStore } from "../Providers";
import { RideType } from "@/state/counter-store";

// Icons
import { IoClose, IoLocationSharp, IoCalendarClear, IoTime } from "react-icons/io5";
import { FaCarSide } from "react-icons/fa";

const rideTypes: RideType[] = ["One Way", "Round Trip", "Local"];

type PhotonFeature = {
  properties: {
    osm_id: number;
    name: string;
    country?: string;
    city?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    state?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

type FormData = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
  dropOffDate?: Date;
  rideType?: string;
};

type CarRentalSearchProps = {
  initialValues?: FormData;
  source?: "home" | "carride";
  setShowForm?: Dispatch<SetStateAction<boolean>>;
  showForm?: boolean;
};

// --- Custom Input Component ---
const CustomDateInput = forwardRef(({ value, onClick, placeholder, icon: Icon }: any, ref: any) => (
  <div className="relative w-full group h-full" onClick={onClick} ref={ref}>
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6aa4e0] transition-colors z-10">
      <Icon size={18} />
    </div>
    <button
      type="button"
      className="w-full h-12 lg:h-full pl-10 pr-3 py-3 text-left bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#6aa4e0] focus:ring-2 focus:ring-[#6aa4e0] transition-all truncate flex items-center"
    >
      {value || <span className="text-gray-400 font-normal">{placeholder}</span>}
    </button>
  </div>
));
CustomDateInput.displayName = "CustomDateInput";

export const CarRentalSearch = ({
  initialValues,
  setShowForm,
  showForm,
  source,
}: CarRentalSearchProps) => {
  const pickupDateRef = useRef<DatePicker | null>(null);
  const pickupTimeRef = useRef<DatePicker | null>(null);
  const dropOffDateRef = useRef<DatePicker | null>(null);

  const rideType = useRideTypeStore((state) => state.rideType);
  const setRideType = useRideTypeStore((state) => state.setRideType);

  const getDefaultPickupTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0);
    return tomorrow;
  };

  const [formData, setFormData] = useState<FormData>({
    pickupLocation: initialValues?.pickupLocation || "",
    dropoffLocation:
      initialValues?.dropoffLocation === "Not%20Available"
        ? ""
        : initialValues?.dropoffLocation ?? "",
    pickupDate: initialValues?.pickupDate
      ? new Date(initialValues.pickupDate)
      : new Date(new Date().setDate(new Date().getDate() + 1)),
    pickupTime: initialValues?.pickupTime
      ? typeof initialValues.pickupTime === "string"
        ? new Date(initialValues.pickupTime)
        : new Date(initialValues.pickupTime)
      : getDefaultPickupTime(),
    dropOffDate: initialValues?.dropOffDate
      ? new Date(initialValues.dropOffDate)
      : new Date(new Date().setDate(new Date().getDate() + 2)),
  });

  const [pickupSuggestions, setPickupSuggestions] = useState<PhotonFeature[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<PhotonFeature[]>([]);
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(null);

  const router = useRouter();

  // --- Validation Logic ---
  const onNavigateHandler = (e: FormEvent) => {
    e.preventDefault();
    let isValid = true;
    let errorMessage = "";

    if (formData.pickupDate && formData.pickupTime) {
      const now = new Date();
      const pickupDateTime = new Date(
        formData.pickupDate.getFullYear(),
        formData.pickupDate.getMonth(),
        formData.pickupDate.getDate(),
        formData.pickupTime.getHours(),
        formData.pickupTime.getMinutes()
      );

      const diffInMs = pickupDateTime.getTime() - now.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (rideType === "One Way" && diffInHours < 3) {
        isValid = false;
        errorMessage = "One Way bookings must be at least 3 hours in advance.";
      }
      if ((rideType === "Round Trip" || rideType === "Local") && diffInHours < 2) {
        isValid = false;
        errorMessage = "Round Trip and Local bookings must be at least 2 hours in advance.";
      }
    }

    if (rideType === "Round Trip" && formData.pickupDate && formData.dropOffDate) {
      if (formData.dropOffDate < formData.pickupDate) {
        isValid = false;
        errorMessage = "Return date cannot be earlier than pickup date.";
      }
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    if (!rideType) {
        errorMessage = "Please select a ride type.";
        isValid = false;
      } else if (!formData.pickupLocation.trim()) {
        errorMessage = "Pickup location cannot be empty.";
        isValid = false;
      } else if (rideType !== "Local" && !formData.dropoffLocation.trim()) {
        errorMessage = "Dropoff location cannot be empty for this ride type.";
        isValid = false;
      } else if (!formData.pickupDate) {
        errorMessage = "Please select a pickup date.";
        isValid = false;
      } else if (!formData.pickupTime) {
        errorMessage = "Please select a pickup time.";
        isValid = false;
      } else if (rideType === "Round Trip" && !formData.dropOffDate) {
        errorMessage = "Please select a dropoff date for round trip.";
        isValid = false;
      }
  
      if (!isValid) {
        toast.error(errorMessage);
        return;
      }

    if (showForm && typeof setShowForm === "function") {
      setShowForm(!showForm);
    }

    const queryParams = new URLSearchParams();
    queryParams.append("rideType", rideType.replace(/\s+/g, "-"));
    queryParams.append("pickupLocation", formData.pickupLocation);

    if (rideType !== "Local" && formData.dropoffLocation) {
      queryParams.append("dropoffLocation", formData.dropoffLocation);
    } else if (rideType === "Local") {
      queryParams.append("dropoffLocation", "Not Available");
    }

    if (formData.pickupDate) {
      queryParams.append("pickupDate", formData?.pickupDate.toISOString().replace(/:/g, "-"));
    }

    if (formData.pickupTime) {
      queryParams.append("pickupTime", formData.pickupTime.getTime().toString());
    }

    if (rideType === "Round Trip" && formData.dropOffDate) {
      queryParams.append("dropoffDate", formData.dropOffDate.toISOString().replace(/:/g, "-"));
    }

    const url = `/carride?${queryParams.toString()}`;
    router.push(url);
  };

  const handleDateChange = (date: Date | null, field: keyof FormData) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date }));
      if (field === "pickupDate" && pickupTimeRef.current) {
        pickupTimeRef.current.setFocus();
      }
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      setFormData((prev) => ({ ...prev, pickupTime: time }));
      if (rideType === "Round Trip" && dropOffDateRef.current) {
        dropOffDateRef.current.setFocus();
      }
    }
  };

  const handleAddressSearch = async (query: string, field: "pickup" | "dropoff") => {
    if (!query || query.length < 3) {
      field === "pickup" ? setPickupSuggestions([]) : setDropoffSuggestions([]);
      return;
    }

    try {
      const response = await axios.get<{ features: PhotonFeature[] }>(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en`
      );
      const features = response?.data?.features ?? [];
      const indiaResults = features.filter((place) => place?.properties?.country === "India");
      const uniqueResults = indiaResults.filter((place, i, self) => {
        const osmId = place?.properties?.osm_id;
        return i === self.findIndex((p) => p?.properties?.osm_id === osmId);
      });

      if (field === "pickup") {
        setPickupSuggestions(uniqueResults);
      } else {
        setDropoffSuggestions(uniqueResults);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      field === "pickup" ? setPickupSuggestions([]) : setDropoffSuggestions([]);
    }
  };

  const getGridClass = () => {
    if (rideType === "Local") return "lg:grid-cols-3";       
    if (rideType === "Round Trip") return "lg:grid-cols-5";  
    return "lg:grid-cols-4";                                 
  };

  return (
    <form
      onSubmit={onNavigateHandler}
      className={`relative w-full max-w-7xl mx-auto bg-white rounded-2xl ${
        source === "home" ? "shadow-2xl shadow-blue-900/10" : "border border-gray-200"
      } p-4 sm:p-6 lg:p-8 z-20`}
    >
      {/* Close Button (Modal Mode) */}
      {source === "carride" && (
        <button
          type="button"
          onClick={() => setShowForm?.(false)}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <IoClose size={20} />
        </button>
      )}

      {/* Ride Type Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 p-1.5 rounded-full overflow-hidden shadow-inner">
          {rideTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRideType(type)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                rideType === type
                  ? "bg-[#6aa4e0] text-white shadow-md transform scale-105"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-2 ${getGridClass()} gap-3 items-end`}>
        
        {/* 1. Pickup Location */}
        <div className="relative col-span-2 lg:col-span-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
            Pickup
          </label>
          <div className="relative group h-12">
            <IoLocationSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6aa4e0] transition-colors z-10" size={18} />
            <input
              type="text"
              value={formData.pickupLocation}
              onChange={(e) => {
                setFormData({ ...formData, pickupLocation: e.target.value });
                handleAddressSearch(e.target.value, "pickup");
              }}
              onFocus={() => setActiveField("pickup")}
              onBlur={() => setTimeout(() => setActiveField(null), 200)}
              placeholder="City or Airport"
              className="w-full h-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6aa4e0] focus:border-transparent transition-all"
            />
            {activeField === "pickup" && pickupSuggestions.length > 0 && (
              <ul className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                {pickupSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.properties.osm_id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none text-sm text-gray-700"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({ ...prev, pickupLocation: suggestion.properties.name }));
                      setPickupSuggestions([]);
                      setActiveField(null);
                    }}
                  >
                    <span className="font-semibold">{suggestion.properties.name}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{suggestion.properties.city || suggestion.properties.state}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 2. Dropoff Location */}
        {rideType !== "Local" && (
          <div className="relative col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Dropoff
            </label>
            <div className="relative group h-12">
              <IoLocationSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-red-400 transition-colors z-10" size={18} />
              <input
                type="text"
                value={formData.dropoffLocation}
                onChange={(e) => {
                  setFormData({ ...formData, dropoffLocation: e.target.value });
                  handleAddressSearch(e.target.value, "dropoff");
                }}
                onFocus={() => setActiveField("dropoff")}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                placeholder="Drop City"
                className="w-full h-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6aa4e0] focus:border-transparent transition-all"
              />
               {activeField === "dropoff" && dropoffSuggestions.length > 0 && (
                  <ul className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                    {dropoffSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.properties.osm_id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none text-sm text-gray-700"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData((prev) => ({ ...prev, dropoffLocation: suggestion.properties.name }));
                          setDropoffSuggestions([]);
                          setActiveField(null);
                        }}
                      >
                         <span className="font-semibold">{suggestion.properties.name}</span>
                         <span className="block text-xs text-gray-500 mt-0.5">{suggestion.properties.city || suggestion.properties.state}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        )}

        {/* 3. Date */}
        <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Date</label>
            <div className="h-12">
              <DatePicker
                  ref={pickupDateRef}
                  selected={formData.pickupDate}
                  onChange={(date) => handleDateChange(date, "pickupDate")}
                  dateFormat="dd MMM yy"
                  minDate={new Date()}
                  customInput={<CustomDateInput icon={IoCalendarClear} placeholder="Date" />}
                  wrapperClassName="h-full w-full"
              />
            </div>
        </div>

        {/* 4. Time */}
        <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Time</label>
            <div className="h-12">
              <DatePicker
                  ref={pickupTimeRef}
                  selected={formData.pickupTime}
                  onChange={(time) => handleTimeChange(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="h:mm aa"
                  customInput={<CustomDateInput icon={IoTime} placeholder="Time" />}
                  wrapperClassName="h-full w-full"
                  minTime={(() => {
                      const now = new Date();
                      const pickupDate = formData.pickupDate || new Date();
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      if (
                        pickupDate.getDate() === today.getDate() &&
                        pickupDate.getMonth() === today.getMonth() &&
                        pickupDate.getFullYear() === today.getFullYear()
                      ) {
                        const hoursToAdd = rideType === "One Way" ? 3 : 2;
                        return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
                      }
                      const midnight = new Date(pickupDate);
                      midnight.setHours(0, 0, 0, 0);
                      return midnight;
                    })()}
                    maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
              />
            </div>
        </div>

        {/* 5. Return Date */}
        {rideType === "Round Trip" && (
            <div className="col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Return</label>
                <div className="h-12">
                  <DatePicker
                  ref={dropOffDateRef}
                  selected={formData.dropOffDate}
                  onChange={(date) => handleDateChange(date, "dropOffDate")}
                  dateFormat="dd MMM yy"
                  minDate={formData.pickupDate || new Date()}
                  customInput={<CustomDateInput icon={IoCalendarClear} placeholder="Return" />}
                  wrapperClassName="h-full w-full"
                  />
                </div>
            </div>
        )}

      </div>

      {/* Search Button */}
      <div className="mt-8 flex justify-center">
        <Button
          type="submit"
          onClick={onNavigateHandler}
          className="w-full sm:w-auto bg-[#6aa4e0] hover:bg-[#5b91c9] text-white text-lg font-bold py-6 px-12 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaCarSide className="text-xl" />
          Search Best Fares
        </Button>
      </div>
    </form>
  );
};

// --- Hero Section Component ---
function CarSearch() {
  return (
    // FIXES APPLIED HERE:
    // 1. pt-28: Adds top padding so text isn't hidden behind the fixed header.
    // 2. pb-24: Adds bottom padding so WhatsApp button doesn't block the submit button.
    // 3. justify-start: Ensures content starts from top on mobile (not centered, which causes cutoff).
    <section className="relative w-full sm:min-h-[91vh] flex flex-col justify-start lg:justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden pt-28 pb-24 lg:py-0">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-100 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-center">
        
        {/* Text Section */}
        <div className="text-center mb-6 sm:mb-10 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-[1.2] mb-3 px-2">
             Ride Smart with <span className="text-[#6aa4e0]">Blaze</span><span className="text-[#fbd20b]">Cab</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 font-medium max-w-xl mx-auto px-4 leading-relaxed">
            Premium intercity & local cab services. Compare prices, book instantly, and save up to 60%.
          </p>
        </div>

        {/* Form Section */}
        <CarRentalSearch source="home" />
      </div>
    </section>
  );
}

export default CarSearch;