import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CarCategoryCardProps {
  category: string;
  image: string;
  name: string;
  price: number;
  inclusions: string[];
  exclusions: string[];
  termscondition: string[];
  distance?: number | null;
  searchParams: URLSearchParams;
}

const CarCategoryCard = ({
  category,
  image,
  name,
  price,
  inclusions,
  exclusions,
  termscondition,
  searchParams,
  distance,
}: CarCategoryCardProps) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-[#6aa4e0] mb-4 text-center sm:text-left">
      {category}
    </h2>

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row sm:items-center p-5 gap-6 transition-all hover:shadow-xl">
      {/* Car Image */}
      <div className="flex justify-center sm:w-1/3">
        <img src={image} alt={name} className="w-48 h-32 object-contain" />
      </div>

      {/* Car Info and Tabs */}
      <div className="flex-1 w-full sm:w-2/3">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
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
                startLocation: searchParams.get("pickupLocation") || "",
                endLocation: searchParams.get("dropoffLocation") || "",
                date: searchParams.get("pickupDate") || "",
                carType: name,
                totalKm: distance?.toFixed(2) || "0",
                price: price.toString(),
                inclusions: JSON.stringify(inclusions),
                exclusions: JSON.stringify(exclusions),
                termscondition: JSON.stringify(termscondition),
              },
            }}
            className="mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto"
          >
            <Button className="w-full sm:w-64 md:w-72 lg:w-80 px-6 py-2">
              Select Car
            </Button>
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
