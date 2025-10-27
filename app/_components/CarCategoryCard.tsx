import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface initialValues {
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
  initialValues: initialValues;
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
}: CarCategoryCardProps) => (
  <div className="mb-12 border-2 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all">
    <h2 className="text-2xl font-bold text-[#6aa4e0] mb-4 text-center sm:text-left">
      {category}
    </h2>

    <div className=" bg-white overflow-hidden flex flex-col sm:flex-row sm:items-center p-5 gap-6  ">
      {/* Car Image */}
      <div className="flex justify-center sm:w-1/3">
        <Image src={image} width={100} height={100} alt={name} className="w-48 h-32 object-contain" />
      </div>

      {/* Car Info and Tabs */}
      <div className="flex-1 w-full sm:w-2/3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center sm:items-start mb-4 ">
          <div className="text-center sm:text-left  sm:w-3/5">
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-[#6aa4e0] font-bold text-xl flex items-center gap-2 justify-center sm:justify-start">
              ₹{price}{" "}
              <span className="text-xs font-medium text-gray-500">
                All Inclusive
              </span>
            </p>
          </div>

          <Link
            href={{
              pathname: "/bookingpage",
              query: {
                startLocation: initialValues.pickupLocation || "",
                endLocation: initialValues.dropoffLocation || "",
                date: initialValues.pickupDate
                  ? initialValues.pickupDate.toISOString()
                  : "",
               time: initialValues.pickupTime ? initialValues.pickupTime.getTime().toString() : "",
                carType: name,
                totalKm: distance?.toFixed(2) || "0",
                price: price.toString(),
                rideType:initialValues.rideType,
                inclusions: JSON.stringify(inclusions),
                exclusions: JSON.stringify(exclusions),
                termscondition: JSON.stringify(termscondition),
              },
            }}
            className="w-full sm:w-2/5 flex justify-center h-full"
          >
            <Button className="w-full  px-6 py-2 text-base">Select Car</Button>
          </Link>
        </div>

        {/* Tabs Section */}
        <Card className="p-0 border-none ring-0 bg-gray-50">
          <Tabs defaultValue="inclusions">
            <TabsList className="flex justify-around bg-gray-200 rounded-lg p-1 w-full text-sm font-medium">
              <TabsTrigger value="inclusions" className="w-full">
                Inclusions
              </TabsTrigger>
              <TabsTrigger value="exclusions" className="w-full">
                Exclusions
              </TabsTrigger>
              <TabsTrigger value="tac" className="w-full">
                T&C
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-4 text-sm text-gray-700  relative">
              <TabsContent value="inclusions" className="space-y-1">
                {inclusions.map((item, index) => (
                  <p key={index}>✅ {item}</p>
                ))}
              </TabsContent>
              <TabsContent value="exclusions" className="space-y-1">
                {exclusions.map((item, index) => (
                  <p key={index}>❌ {item}</p>
                ))}
              </TabsContent>
              <TabsContent value="tac" className="space-y-1">
                {termscondition.map((item, index) => (
                  <p key={index}>📜 {item}</p>
                ))}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  </div>
);

export default CarCategoryCard;
