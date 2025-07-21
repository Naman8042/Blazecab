"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface Razorpay {
  open(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => Razorpay;
  }
}

export default function BookingPage() {
  const searchParams = useSearchParams();

  // Extract search params
  const startLocation = searchParams.get("startLocation") || "";
  const endLocation = searchParams.get("endLocation") || "";
  const date = searchParams.get("date");
  const carType = searchParams.get("carType") || "";
  const totalKm = searchParams.get("totalKm") || "0";
  const price = searchParams.get("price") || "0";
  const inclusions: string[] = JSON.parse(
    searchParams.get("inclusions") || "[]"
  );
  const exclusions: string[] = JSON.parse(
    searchParams.get("exclusions") || "[]"
  );
  const termscondition: string[] = JSON.parse(
    searchParams.get("termscondition") || "[]"
  );
  const rawTime = searchParams.get("time") || "";

  const formattedDate = date ? new Date(date).toLocaleDateString("en-US") : "";
  const formattedTime = rawTime
    ? new Date(Number(rawTime)).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  // Create Razorpay order
  const createOrder = async () => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(price) * 100 }),
    });
    const data = await res.json();
    return data.orderId;
  };

  // Handle payment
  const handlePayment = async () => {
    const orderId = await createOrder();

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID env variable.");
    }

    const options = {
      key: razorpayKey,
      amount: parseFloat(price) * 100,
      currency: "INR",
      name: "Car Booking",
      description: "Trip Payment",
      order_id: orderId,
      handler: async function (response: RazorpayResponse) {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            booking: {
              customerName: name, // ✅ required
              email,
              phone,
              pickupAddress,
              dropAddress,
              pickupCity: startLocation, // ✅ required
              destination: endLocation, // ✅ required
              pickupDate: date,
              time: rawTime,
              carType,
              totalKm,
              price,
              inclusions,
              exclusions,
              termscondition,
              type: "One Way", // ✅ default or from UI
            },
          }),
        });

        const result = await res.json();
        if (result.isOk) {
          alert("Booking Confirmed ✅");
        } else {
          alert(result.message || "Payment failed ❌");
        }
      },

      prefill: { name, email, contact: phone },
      theme: { color: "#3399cc" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="w-full sm:min-h-[89.75vh] flex items-center justify-center p-4">
        <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
          {/* Left Form */}
          <Card className="md:w-[58%] w-full shadow-lg bg-white">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">
                Contact & Pickup Details
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                  />
                </div>
                <div>
                  <Label>Pickup Address</Label>
                  <Input
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Drop Address</Label>
                  <Input
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                  />
                </div>
                <Button onClick={handlePayment} className="w-full">
                  PROCEED TO PAY
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Booking Summary */}
          <div className="flex flex-col gap-4 w-full md:w-[39%]">
            <Card className="shadow-lg bg-white p-4 md:p-6">
              <CardHeader>
                <h2 className="text-xl font-semibold text-center">
                  YOUR BOOKING DETAILS
                </h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm md:text-base">
                <p>
                  <strong>Itinerary:</strong> {startLocation}{" "}
                  {endLocation == "Not%20Available" ? (
                    <></>
                  ) : (
                    <>→ {endLocation}</>
                  )}
                </p>
                <p>
                  <strong>Pickup:</strong> {formattedDate} at {formattedTime}
                </p>
                <p>
                  <strong>Car Type:</strong> {carType}
                </p>
                <p>
                  <strong>KMs Included:</strong> {Math.floor(Number(totalKm))}{" "}
                  Km
                </p>
                <p>
                  <strong>Total Fare:</strong> ₹ {Math.floor(Number(price))}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white p-4 md:p-6 relative">
              <Tabs defaultValue="inclusions">
                <TabsList className="flex justify-between bg-gray-200 rounded-lg p-1 w-full text-xs md:text-sm">
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
                  <TabsTrigger value="tac">T&C</TabsTrigger>
                </TabsList>

                <CardContent className="mt-4 text-sm max-h-64 overflow-y-auto space-y-2">
                  <TabsContent value="inclusions">
                    {inclusions.map((item, idx) => (
                      <p key={idx}>✅ {item}</p>
                    ))}
                  </TabsContent>
                  <TabsContent value="exclusions">
                    {exclusions.map((item, idx) => (
                      <p key={idx}>❌ {item}</p>
                    ))}
                  </TabsContent>
                  <TabsContent value="tac">
                    {termscondition.map((item, idx) => (
                      <p key={idx}>📜 {item}</p>
                    ))}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
