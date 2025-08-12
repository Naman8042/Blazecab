"use client";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {toast} from 'react-hot-toast'
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";

type PhotonFeature = {
  properties: {
    osm_id: number;
    name: string;
    country?: string;
    city?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

type FormData = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  pickupTime: Date; // 👈 store as Date for correct binding
  dropoffDate: Date;
};

type CarRentalSearchProps = {
  initialValues?: Partial<FormData> & { rideType?: string };
  source?: "home" | "carride";
  setShowForm?: Dispatch<SetStateAction<boolean>>;
  showForm?: boolean;
};

export const CarRentalSearch = ({
  initialValues,
  setShowForm,
  showForm,
  source,
}: CarRentalSearchProps) => {
  const [rideType, setRideType] = useState<string>(
    initialValues?.rideType || "One Way"
  );
  
  

  const [formData, setFormData] = useState<FormData>({
    pickupLocation: initialValues?.pickupLocation || "",
    dropoffLocation: initialValues?.dropoffLocation === "Not%20Available"
  ? ""
  : initialValues?.dropoffLocation ?? "",
    pickupDate: initialValues?.pickupDate
      ? new Date(initialValues.pickupDate)
      : new Date(),
    pickupTime: initialValues?.pickupTime
      ? typeof initialValues.pickupTime === "string"
        ? new Date(`1970-01-01T${initialValues.pickupTime}`)
        : new Date(initialValues.pickupTime)
      : new Date(),

    dropoffDate: initialValues?.dropoffDate
      ? new Date(initialValues.dropoffDate)
      : new Date(Date.now() + 86400000),
  });
  console.log(formData);
  const [pickupSuggestions, setPickupSuggestions] = useState<PhotonFeature[]>(
    []
  );
  const [dropoffSuggestions, setDropoffSuggestions] = useState<PhotonFeature[]>(
    []
  );
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(
    null
  );

  const router = useRouter();

 const onNavigateHandler = (e: FormEvent) => {
    e.preventDefault();

    // --- Validation Logic ---
    let isValid = true;
    let errorMessage = "";

    if (!rideType) {
      errorMessage = "Please select a ride type.";
      isValid = false;
    } else if (!formData.pickupLocation.trim()) {
      errorMessage = "Pickup location cannot be empty.";
      isValid = false;
    } else if (rideType !== "Local" && !formData.dropoffLocation.trim()) {
      // dropoffLocation is required if not "Local"
      errorMessage = "Dropoff location cannot be empty for this ride type.";
      isValid = false;
    } else if (!formData.pickupDate) {
      errorMessage = "Please select a pickup date.";
      isValid = false;
    } else if (!formData.pickupTime) {
      errorMessage = "Please select a pickup time.";
      isValid = false;
    } else if (rideType === "Round Trip" && !formData.dropoffDate) {
      // dropoffDate is required for "Round Trip"
      errorMessage = "Please select a dropoff date for round trip.";
      isValid = false;
    }

    if (!isValid) {
      toast.error(errorMessage);
      return; // Stop the function execution if validation fails
    }
    // --- End Validation Logic ---


    if (showForm && typeof setShowForm === "function") {
      setShowForm(!showForm);
    }

    const queryParams = new URLSearchParams();

    // Add rideType (already validated)
    queryParams.append("rideType", rideType.replace(/\s+/g, "-"));

    // Add pickupLocation (already validated)
    queryParams.append("pickupLocation", formData.pickupLocation);

    // Add dropoffLocation (conditional based on rideType, already validated)
    if (rideType !== "Local" && formData.dropoffLocation) {
      queryParams.append("dropoffLocation", formData.dropoffLocation);
    } else if (rideType === "Local") {
      queryParams.append("dropoffLocation", "Not Available");
    }


    // Add pickupDate (already validated)
    queryParams.append("pickupDate", formData.pickupDate.toISOString().replace(/:/g, "-"));

    // Add pickupTime (already validated)
    queryParams.append("pickupTime", formData.pickupTime.getTime().toString());

    // Add dropoffDate (only for "Round Trip", already validated)
    if (rideType === "Round Trip" && formData.dropoffDate) {
      queryParams.append("dropoffDate", formData.dropoffDate.toISOString().replace(/:/g, "-"));
    }

    const url = `/carride?${queryParams.toString()}`;
    console.log("Navigating to URL:", url);
    router.push(url);
  };


  const handleDateChange = (date: Date | null, field: keyof FormData) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date }));
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      setFormData((prev) => ({ ...prev, pickupTime: time }));
    }
  };

  const handleAddressSearch = async (
    query: string,
    field: "pickup" | "dropoff"
  ) => {
    if (!query || query.length < 3) {
      if (field === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }

      return;
    }

    try {
      const response = await axios.get<{ features: PhotonFeature[] }>(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`
      );

      const features = response?.data?.features ?? [];

      const uniqueResults = features.filter((place, i, self) => {
        const osmId = place?.properties?.osm_id;
        return i === self.findIndex((p) => p?.properties?.osm_id === osmId);
      });

      if (field === "pickup") {
        setPickupSuggestions(uniqueResults);
      } else {
        setDropoffSuggestions(uniqueResults);
      }
    } catch (error) {
      console.error("Error fetching data from Photon API:", error);

      if (field === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      pickupTime: formData.pickupTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    console.log("Form submitted:", formattedData);
  };

  const getVisibleInputCount = () => {
    if (rideType === "One Way") return 4;
    if (rideType === "Round Trip") return 5;
    if (rideType === "Local") return 3;
    return 5;
  };

  const inputCount = getVisibleInputCount();

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`bg-opacity-90 bg-white py-6 rounded-xl ${
          source === "home" ? "shadow-2xl" : "border-2"
        } border w-full backdrop-blur-sm`}
      >
        <div className="flex flex-wrap justify-between sm:justify-center gap-2 mb-6  px-5 sm:px-6">
          {["One Way", "Round Trip", "Local"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRideType(type)}
              className={`px-2.5 md:px-4 py-1 md:py-2 rounded-full font-medium transition-all duration-200 ${
                rideType === type
                  ? "bg-[#6aa4e0] text-white text-[13px] text-xs  sm:text-base cursor-pointer uppercase"
                  : "bg-opacity-20 text-black hover:bg-opacity-30 text-[15px] text-xs  sm:text-base cursor-pointer uppercase"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div
          className="flex flex-col sm:grid gap-2 md:gap-4 px-6"
          style={{
            gridTemplateColumns: `repeat(${inputCount}, minmax(0, 1fr))`,
          }}
        >
          {/* Pickup Location */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Pickup City
            </label>
            <input
              type="text"
              value={formData.pickupLocation}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  pickupLocation: e.target.value,
                });
                handleAddressSearch(e.target.value, "pickup");
              }}
              onFocus={() => setActiveField("pickup")}
              onBlur={() => setTimeout(() => setActiveField(null), 200)}
              placeholder="Enter Pickup City"
              className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 border-2"
            />
            {activeField === "pickup" && pickupSuggestions.length > 0 && (
              <ul className="absolute top-full text-black left-0 w-full bg-white rounded-lg shadow-lg z-50 h-40 overflow-y-auto">
                {pickupSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.properties.osm_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        pickupLocation: suggestion.properties.name,
                      });
                      setPickupSuggestions([]);
                      setActiveField(null);
                    }}
                  >
                    {suggestion.properties.name},{" "}
                    {suggestion.properties.city || ""}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dropoff Location */}
          {rideType !== "Local" && (
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                {rideType === "One Way" ? "Drop City" : "Destination City"}
              </label>

              <input
                type="text"
                value={formData.dropoffLocation}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    dropoffLocation: e.target.value,
                  });
                  handleAddressSearch(e.target.value, "dropoff");
                }}
                onFocus={() => setActiveField("dropoff")}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                placeholder={
                  rideType == "One Way"
                    ? "Enter Your Drop City"
                    : "Enter Your Destination City"
                }
                className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 border-2"
              />
              {activeField === "dropoff" && dropoffSuggestions.length > 0 && (
                <ul className="absolute top-full text-black left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 h-40 overflow-y-auto">
                  {dropoffSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.properties.osm_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          dropoffLocation: suggestion.properties.name,
                        });
                        setDropoffSuggestions([]);
                        setActiveField(null);
                      }}
                    >
                      {suggestion.properties.name},{" "}
                      {suggestion.properties.city || ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pickup date
            </label>
            <DatePicker
              selected={formData.pickupDate}
              onChange={(date) => handleDateChange(date, "pickupDate")}
              className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 border-2"
              wrapperClassName="w-full"
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pickup time
            </label>
            <DatePicker
              selected={formData.pickupTime}
              onChange={(time) => handleTimeChange(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 border-2"
              wrapperClassName="w-full"
            />
          </div>

          {/* Dropoff Date (if Round Trip) */}
          {rideType === "Round Trip" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Return date
              </label>
              <DatePicker
                selected={formData.dropoffDate}
                onChange={(date) => handleDateChange(date, "dropoffDate")}
                className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 border-2"
                wrapperClassName="w-full"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            className="font-semibold py-3 px-8"
            onClick={onNavigateHandler}
          >
            Search Cars
          </Button>
        </div>
      </div>
    </form>
  );
};

function CarSearch() {
  return (
    <section className="relative w-full bg-gray-100 min-h-[calc(100vh-3.5rem)] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-opacity-50 -z-10"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left mb-4 md:mb-8 lg:mb-12">
          <h1 className="text-[#6aa4e0] text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ride Smart → Ride Safe → Ride with Blaze
            <span className="text-[#fbd20b]">Cab</span>
          </h1>
          <p className="text-[#6aa4e0] text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 hidden sm:block">
            Compare prices from top rental companies and save up to 60%
          </p>
        </div>

        <CarRentalSearch />
      </div>
    </section>
  );
}

export default CarSearch;
