import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

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
    <h2 className="text-xl font-bold mb-4 text-center sm:text-start">{category}</h2>
    <div className="flex flex-col items-center bg-white p-2 sm:p-4 rounded-lg shadow">
      <img src={image} alt={name} className="w-48 h-32 object-contain mb-2" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-[#6aa4e0] font-bold">{`₹${price} All Inclusive`}</p>
      <Link href={"/bookingpage"} className="w-full flex items-center justify-center px-4 md:px-6 mt-2 max-w-md"> <Button className="w-full">Select Car</Button></Link>

      <Card className="p-4 md:p-6 h-[180px] mt-2 w-full max-w-md shadow-none border-none ring-0">

        <Tabs defaultValue="inclusions">
          <TabsList className="flex justify-between bg-gray-200 rounded-lg p-1 w-full text-xs md:text-sm">
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
            <TabsTrigger value="tac">T&C</TabsTrigger>
          </TabsList>

          <CardContent className="mt-4 text-sm md:text-base min-h-[130px] relative ">
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

const carData = [
  {
    category: "Hatchback 4+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721159/wago_hxfxnc.webp",
    name: "Maruti WagonR or Similar",
    price: "6020",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Innova Crysta 6+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721138/Innova_Crysta_itts9b.webp",
    name: "Toyota Innova Crysta ",
    price: "6020",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Innova Crysta 7+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721138/Innova_Crysta_itts9b.webp",
    name: "Toyota Innova Crysta 7+1",
    price: "6020",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Suv 6+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721138/Maruti_Ertiga_BlazeCab_jjutkn.webp",
    name: "Maruti Ertiga 6+1 or Similar",
    price: "6020",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Sedan 4+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721149/Sedan-BlazeCab_jknbhq.webp",
    name: "Swift Dzire or Similar",
    price: "6143",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Toyota Innova 6+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721158/Toyota-Innova-BlazeCab_sh3i9j.webp",
    name: "Toyota Innova 6+1",
    price: "10106",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Urbania Traveller 11+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721159/Urbania_hyn8oe.webp",
    name: "Urbania",
    price: "10106",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Urbania Traveller 15+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721159/Urbania_hyn8oe.webp",
    name: "Urbania",
    price: "10106",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Tempo Traveller 11+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721123/12-Seater-Tempo-BlazeCab_bkovkk.webp",
    name: "Force Tempo Traveller ",
    price: "10106",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
  {
    category: "Tempo Traveller 15+1",
    image: "https://res.cloudinary.com/dtrofwkib/image/upload/v1744721123/15-Seater-Tempo-BlazeCab_nznvns.webp",
    name: "Force Tempo Traveller",
    price: "10106",
    inclusions: [
      "Base Fare and Fuel Charges",
      "Driver Allowance",
      "State Tax & Toll",
      "GST (5%)",
    ],
  },
];

const CarList = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      {carData.map((car, index) => (
        <CarCategoryCard
          key={index}
          category={car.category}
          image={car.image}
          name={car.name}
          price={car.price}
          inclusions={car.inclusions}
        />
      ))}
    </div>
  );
};

export default CarList;
