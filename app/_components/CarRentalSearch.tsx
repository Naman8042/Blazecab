"use client";
import { useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { useRideTypeStore } from "../Providers";
import { RideType } from "@/state/counter-store";

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
    tomorrow.setDate(tomorrow.getDate() + 1); // kal ka din
    tomorrow.setHours(6, 0, 0, 0); // 6 AM fix
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
        ? new Date(`1970-01-01T${initialValues.pickupTime}`)
        : new Date(initialValues.pickupTime)
      : getDefaultPickupTime(),
    dropOffDate: initialValues?.dropOffDate
      ? new Date(initialValues.dropOffDate)
      : new Date(new Date().setDate(new Date().getDate() + 2)), // 👈 default return next day
  });

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
      if (
        (rideType === "Round Trip" || rideType === "Local") &&
        diffInHours < 2
      ) {
        isValid = false;
        errorMessage =
          "Round Trip and Local bookings must be at least 2 hours in advance.";
      }
    }

    if (
      rideType === "Round Trip" &&
      formData.pickupDate &&
      formData.dropOffDate
    ) {
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
    // --- End Validation Logic ---

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
      queryParams.append(
        "pickupDate",
        formData?.pickupDate.toISOString().replace(/:/g, "-")
      );
    }

    if (formData.pickupTime) {
      queryParams.append(
        "pickupTime",
        formData.pickupTime.getTime().toString()
      );
    }

    if (rideType === "Round Trip" && formData.dropOffDate) {
      queryParams.append(
        "dropoffDate",
        formData.dropOffDate.toISOString().replace(/:/g, "-")
      );
    }

    const url = `/carride?${queryParams.toString()}`;
    console.log("Navigating to URL:", url);
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
    if (!formData.pickupTime) return;
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
        {/* Ride Type Buttons */}
        <div className="flex flex-wrap justify-between sm:justify-center gap-2 mb-6  px-5 sm:px-6">
          {rideTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRideType(type)}
              className={`px-2.5 md:px-4 py-1 md:py-2 rounded-full font-medium transition-all duration-200 ${
                rideType === type
                  ? "bg-[#6aa4e0] text-white text-[13px] sm:text-base cursor-pointer uppercase"
                  : "bg-opacity-20 text-black hover:bg-opacity-30 text-[15px] sm:text-base cursor-pointer uppercase"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Inputs */}
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
              ref={pickupDateRef}
              selected={formData.pickupDate}
              onChange={(date) => handleDateChange(date, "pickupDate")}
              dateFormat="dd MMM yyyy"
              wrapperClassName="w-full"
              minDate={new Date()}
              customInput={
                <button
                  type="button"
                  className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 border-2 text-left"
                >
                  {formData.pickupDate
                    ? `${String(formData.pickupDate.getDate()).padStart(
                        2,
                        "0"
                      )}-${formData.pickupDate.toLocaleString("en-US", {
                        month: "short",
                      })}-${formData.pickupDate.getFullYear()}`
                    : "Select date"}
                </button>
              }
            />
          </div>

          {/* Pickup Time */}
          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pickup time
            </label>
            <DatePicker
              ref={pickupTimeRef}
              selected={formData.pickupTime}
              onChange={(time) => handleTimeChange(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              wrapperClassName="w-full"
              minTime={(() => {
                const now = new Date();
                const pickupDate = formData.pickupDate || new Date();

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Agar pickup date aaj hai
                if (
                  pickupDate.getDate() === today.getDate() &&
                  pickupDate.getMonth() === today.getMonth() &&
                  pickupDate.getFullYear() === today.getFullYear()
                ) {
                  if (rideType === "One Way") {
                    return new Date(now.getTime() + 3 * 60 * 60 * 1000); // now + 3h
                  } else {
                    return new Date(now.getTime() + 2 * 60 * 60 * 1000); // now + 2h
                  }
                }

                // Agar kal ya future date hai → 12:00 AM se select kar sakta hai
                const midnight = new Date(pickupDate);
                midnight.setHours(0, 0, 0, 0);
                return midnight;
              })()}
              maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
              customInput={
                <button className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 border-2 text-left">
                  {formData.pickupTime
                    ? formData.pickupTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Select time"}
                </button>
              }
            />
          </div>

          {/* Dropoff Date */}
          {rideType === "Round Trip" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Return date
              </label>
              <DatePicker
                ref={dropOffDateRef}
                selected={formData.dropOffDate}
                onChange={(date) => handleDateChange(date, "dropOffDate")}
                dateFormat="dd-MM-yyyy"
                wrapperClassName="w-full"
                minDate={formData.pickupDate || new Date()} // 👈 cannot select before pickup
                customInput={
                  <button className="w-full p-2 sm:p-3 rounded-lg bg-white/90 text-gray-900 border-2 text-left">
                    {formData.dropOffDate
                      ? `${String(formData.dropOffDate.getDate()).padStart(
                          2,
                          "0"
                        )}-${formData.dropOffDate.toLocaleString("en-US", {
                          month: "short",
                        })}-${formData.dropOffDate.getFullYear()}`
                      : "Select date"}
                  </button>
                }
              />
            </div>
          )}
        </div>

        {/* Search Button */}
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
    <section className="relative w-full bg-gray-100 min-h-svh sm:min-h-[calc(100vh-3.5rem)] flex items-center overflow-hidden pt-[20%] sm:pt-0">
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
