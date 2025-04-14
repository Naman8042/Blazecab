import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CarCategoryCardProps {
  category: string;
  image: string;
  name: string;
  price: string;
  inclusions: string[];
}

const CarCategoryCard=({
  category,
  image,
  name,
  price,
  inclusions,
}:CarCategoryCardProps) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold mb-4">{category}</h2>
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
      <img src={image} alt={name} className="w-48 h-32 object-contain mb-2" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-blue-600 font-bold">{`₹${price} All Inclusive`}</p>
      <Button className="w-1/2 mt-2">Select Car</Button>

      <Card className="p-4 md:p-6 h-[200px] mt-4 w-full max-w-md shadow-none border-none ring-0">

        <Tabs defaultValue="inclusions">
          <TabsList className="flex justify-between bg-gray-200 rounded-lg p-1 w-full text-xs md:text-sm">
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
            <TabsTrigger value="tac">T&C</TabsTrigger>
          </TabsList>

          <CardContent className="mt-4 text-sm md:text-base min-h-[130px] relative">
            <TabsContent
              value="inclusions"
              className="absolute top-0 left-0 w-full transition-opacity duration-300"
            >
              {inclusions.map((item, index) => (
                <p key={index}>✅ {item}</p>
              ))}
            </TabsContent>
            <TabsContent
              value="exclusions"
              className="absolute top-0 left-0 w-full transition-opacity duration-300"
            >
              <p>❌ Extra KM charges</p>
              <p>❌ Parking charges</p>
            </TabsContent>
            <TabsContent
              value="tac"
              className="absolute top-0 left-0 w-full transition-opacity duration-300"
            >
              <p>📜 Terms and conditions apply.</p>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  </div>
);

const CarList=() => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <CarCategoryCard
        category="Hatchback"
        image="/images/wagonr.png"
        name="Maruti WagonR"
        price="6020"
        inclusions={[
          "Base Fare and Fuel Charges",
          "Driver Allowance",
          "State Tax & Toll",
          "GST (5%)",
        ]}
      />
      <CarCategoryCard
        category="Sedan"
        image="/images/etios.png"
        name="Toyota Etios"
        price="6143"
        inclusions={[
          "Base Fare and Fuel Charges",
          "Driver Allowance",
          "State Tax & Toll",
          "GST (5%)",
        ]}
      />
      <CarCategoryCard
        category="SUV"
        image="/images/innova.png"
        name="Toyota Innova"
        price="10106"
        inclusions={[
          "Base Fare and Fuel Charges",
          "Driver Allowance",
          "State Tax & Toll",
          "GST (5%)",
        ]}
      />
    </div>
  );
};

export default CarList;
