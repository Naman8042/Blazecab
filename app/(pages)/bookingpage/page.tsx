"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

export default function BookingPage() {
  const searchParams = useSearchParams();

  const startLocation = searchParams.get("startLocation") || "";
  const endLocation = searchParams.get("endLocation") || "";
  const date = searchParams.get("date");
  const carType = searchParams.get("carType") || "";
  const totalKm = searchParams.get("totalKm") || "0";
  const price = searchParams.get("price") || "0";

  // Type-safe JSON parsing
  const inclusions: string[] = JSON.parse(searchParams.get("inclusions") || "[]");
  const exclusions: string[] = JSON.parse(searchParams.get("exclusions") || "[]");
  const termscondition: string[] = JSON.parse(searchParams.get("termscondition") || "[]");

  // Date formatting
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US") : "";

const rawTime = searchParams.get("time") || "";
const formattedTime = rawTime
  ? new Date(Number(rawTime)).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  : "";



  return (
    <div className="w-full sm:min-h-[89.75vh] flex items-center justify-center p-4">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
        {/* Left Form Section */}
        <Card className="md:w-[58%] w-full shadow-lg rounded-lg bg-white flex flex-col justify-center">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Contact & Pickup Details</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-1">Name</Label>
                <Input id="name" placeholder="Enter your name here" />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1">Email</Label>
                <Input id="email" placeholder="Enter your email here" type="email" />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1">Mobile</Label>
                <Input id="phone" placeholder="Enter your phone number here" type="tel" />
              </div>
              <div>
                <Label htmlFor="pickup" className="mb-1">Pickup Address</Label>
                <Input id="pickup" placeholder="Enter your pickup address" />
              </div>
              <div>
                <Label htmlFor="drop" className="mb-1">Drop Address</Label>
                <Input id="drop" placeholder="Enter your drop address" />
              </div>
              <Button className="w-full">PROCEED</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Booking Summary Section */}
        <div className="flex flex-col gap-4 justify-between w-full md:w-[39%] h-full">
          <Card className="shadow-lg rounded-lg bg-white p-4 md:p-6 h-auto">
            <CardHeader>
              <h2 className="text-xl font-semibold text-center">YOUR BOOKING DETAILS</h2>
            </CardHeader>
            <CardContent className="space-y-2 text-sm md:text-base">
              <p><strong>Itinerary:</strong> {startLocation} → {endLocation}</p>
              <p><strong>Pickup Date and Time:</strong> {formattedDate} at {formattedTime}</p>
              <p><strong>Car Type:</strong> {carType}</p>
              <p><strong>KMs Included:</strong> {Math.floor(Number(totalKm))} Km</p>
              <p><strong>Total Fare:</strong> ₹ {Math.floor(Number(price))}</p>
            </CardContent>
          </Card>

          {/* Tabs for Inclusions/Exclusions/T&C */}
          <Card className="shadow-lg rounded-lg bg-white p-4 md:p-6 relative">
            <Tabs defaultValue="inclusions">
              <TabsList className="flex justify-between bg-gray-200 rounded-lg p-1 w-full text-xs md:text-sm">
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
                <TabsTrigger value="tac">T&C</TabsTrigger>
              </TabsList>

              <CardContent className="mt-4 text-sm  max-h-64 overflow-y-auto space-y-2">
                <TabsContent value="inclusions">
                  {inclusions.map((item: string, index: number) => (
                    <p key={index}>✅ {item}</p>
                  ))}
                </TabsContent>
                <TabsContent value="exclusions">
                  {exclusions.map((item: string, index: number) => (
                    <p key={index}>❌ {item}</p>
                  ))}
                </TabsContent>
                <TabsContent value="tac">
                  {termscondition.map((item: string, index: number) => (
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
}
