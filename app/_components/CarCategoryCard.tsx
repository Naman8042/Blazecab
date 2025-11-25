import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Check, X, FileText, ArrowRight } from "lucide-react";

interface InitialValues {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | undefined;
  pickupTime: Date | undefined;
  dropOffDate: Date | undefined;
  rideType: string;
}

interface CarCategoryCardProps {
  category: string;
  image: string;
  name: string;
  price: number;
  inclusions: string[];
  exclusions: string[];
  termscondition: string[];
  distance?: number | null;
  initialValues: InitialValues;
}

const CarCategoryCard = ({
  category,
  image,
  name,
  price,
  inclusions,
  exclusions,
  termscondition,
  initialValues,
  distance,
}: CarCategoryCardProps) => {
  // Logic to hide "All Inclusive" for Round Trip and Local
  const showAllInclusive =
    initialValues.rideType !== "Round Trip" && initialValues.rideType !== "Local";

  return (
    <div className="group mb-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* --- Left Side: Image & Price (Desktop) --- */}
        <div className="w-full md:w-[30%] bg-gray-50 p-4 flex flex-col justify-between relative">
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 bg-white text-[10px] font-bold uppercase tracking-wider text-gray-900 rounded shadow-sm border border-gray-100">
              {category}
            </span>
          </div>

          {/* Reduced height for compactness */}
          <div className="flex-1 flex items-center justify-center py-4 min-h-[140px]">
            <div className="relative w-full h-28 md:h-32">
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Mobile Price View */}
          <div className="md:hidden flex justify-between items-end border-t border-gray-200 pt-3 mt-2">
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">{name}</h3>
              {showAllInclusive && (
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-0.5">
                  <Check size={10} /> All Inclusive
                </p>
              )}
            </div>
            <p className="text-xl font-extrabold text-[#6aa4e0]">
              ₹{price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* --- Right Side: Details & Tabs --- */}
        <div className="w-full md:w-[70%] p-4 flex flex-col">
          {/* Header (Desktop) - Compact */}
          <div className="hidden md:flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#6aa4e0]">
                ₹{price.toLocaleString()}
              </p>
              {showAllInclusive && (
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium mt-1">
                  <Check size={10} /> All Inclusive
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section - Reduced margins and padding */}
          <div className="flex-1">
            <Tabs defaultValue="inclusions" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-gray-100 p-0 h-auto space-x-4">
                <TabsTrigger
                  value="inclusions"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6aa4e0] data-[state=active]:text-[#6aa4e0] rounded-none px-0 py-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Inclusions
                </TabsTrigger>
                <TabsTrigger
                  value="exclusions"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 rounded-none px-0 py-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Exclusions
                </TabsTrigger>
                <TabsTrigger
                  value="tac"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 rounded-none px-0 py-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  T&C
                </TabsTrigger>
              </TabsList>

              {/* Content area with fixed height to prevent layout jumps, but smaller */}
              <div className="mt-2 min-h-[80px] text-xs text-gray-600">
                <TabsContent
                  value="inclusions"
                  className="mt-0 space-y-1.5 animate-in fade-in-50 duration-300"
                >
                  {inclusions.length > 0 ? (
                    inclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      No specific inclusions listed.
                    </p>
                  )}
                </TabsContent>

                <TabsContent
                  value="exclusions"
                  className="mt-0 space-y-1.5 animate-in fade-in-50 duration-300"
                >
                  {exclusions.length > 0 ? (
                    exclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <X className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      No specific exclusions listed.
                    </p>
                  )}
                </TabsContent>

                <TabsContent
                  value="tac"
                  className="mt-0 space-y-1.5 animate-in fade-in-50 duration-300"
                >
                  {termscondition.length > 0 ? (
                    termscondition.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <FileText className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      Standard terms apply.
                    </p>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Action Button - Compact */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <Link
              href={{
                pathname: "/bookingpage",
                query: {
                  startLocation: initialValues.pickupLocation || "",
                  endLocation: initialValues.dropoffLocation || "",
                  date: initialValues.pickupDate
                    ? initialValues.pickupDate.toISOString()
                    : "",
                  time: initialValues.pickupTime
                    ? initialValues.pickupTime.getTime().toString()
                    : "",
                  carType: name,
                  totalKm: distance?.toFixed(2) || "0",
                  price: price.toString(),
                  rideType: initialValues.rideType,
                  inclusions: JSON.stringify(inclusions),
                  exclusions: JSON.stringify(exclusions),
                  termscondition: JSON.stringify(termscondition),
                },
              }}
              className="w-full md:w-auto"
            >
              <Button className="w-full md:w-auto bg-gray-900 hover:bg-[#6aa4e0] text-white text-sm font-semibold py-2 h-10 px-6 rounded-lg transition-colors shadow-md">
                Select {name} <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCategoryCard;