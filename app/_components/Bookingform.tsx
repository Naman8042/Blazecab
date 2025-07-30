// components/BookingFormClient.tsx
"use client"; // This directive marks it as a Client Component

import { useState } from "react";
import Script from "next/script";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

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

interface BookingFormClientProps {
  startLocation: string;
  endLocation: string;
  date: string | null;
  carType: string;
  totalKm: string;
  price: string;
  inclusions: string[];
  exclusions: string[];
  termscondition: string[];
  rawTime: string;
  formattedDate: string;
  formattedTime: string;
}

export function BookingFormClient({
  startLocation,
  endLocation,
  date,
  carType,
  totalKm,
  price,
  inclusions,
  exclusions,
  termscondition,
  rawTime,
  formattedDate,
  formattedTime,
}: BookingFormClientProps) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  // New state for payment option selection
  const [paymentOption, setPaymentOption] = useState<"full" | "partial">(
    "full"
  ); // 'full' or 'partial'

  const fullPrice = parseFloat(price);
  const partialPrice = fullPrice * 0.3; // 30% of the total price

  // Create Razorpay order - This should ideally be an API call
  // For a Server Component, you'd trigger a Server Action or API Route here.
  // We're keeping it within the Client Component for direct Razorpay integration.
  const createOrder = async (amount: number) => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }), // Amount in paisa
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create order");
    }
    return data.orderId;
  };

  // Handle payment
  const handlePayment = async () => {
    // Basic form validation
    if (!name || !email || !phone || !pickupAddress) {
      toast.error("Please fill in all required contact and pickup details.");
      return;
    }

    const amountToPay = paymentOption === "full" ? fullPrice : partialPrice;

    try {
      const orderId = await createOrder(amountToPay);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID env variable.");
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amountToPay * 100, // Amount in paisa
        currency: "INR",
        name: "Car Booking",
        description: "Trip Payment",
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          let bookingStatus = "";
          let paymentStatus = "";

          if (paymentOption === "full") {
            bookingStatus = "Confirmed";
            paymentStatus = "Paid Full";
          } else {
            bookingStatus = "Advance Paid";
            paymentStatus = "Partial Paid";
          }

          const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              booking: {
                customerName: name,
                email,
                phone,
                pickupAddress,
                dropAddress,
                pickupCity: startLocation,
                destination: endLocation,
                pickupDate: date,
                time: rawTime,
                carType,
                totalKm,
                price: fullPrice, // Always store the full price in booking
                amountPaid: amountToPay, // Store the amount actually paid
                inclusions,
                exclusions,
                termscondition,
                type: "One Way",
                paymentOption: paymentOption, // 'full' or 'partial'
                bookingStatus: bookingStatus, // 'Confirmed' or 'Advance Paid'
                paymentStatus: paymentStatus, // 'Paid Full' or 'Partial Paid'
              },
            }),
          });

          const result = await res.json();
          if (result.isOk) {
            toast.success(`Booking ${bookingStatus} ✅`);
            // Optionally redirect or show success message
          } else {
            toast.error(result.message || "Payment failed ❌"); // Changed to toast.error here
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) { // Changed 'error: any' to 'error' (type unknown by default in modern TS)
      // Type guard to safely access error properties
      if (error instanceof Error) {
        toast.error(`Payment initiation failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred during payment initiation.");
      }
    }
  };

  return (
    <>
      {/* Razorpay script is typically loaded once, often in _app.tsx or layout.tsx
          but for simplicity, keeping it here. It's safe in a Client Component. */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pickupAddress">Pickup Address</Label>
                  <Input
                    id="pickupAddress"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dropAddress">Drop Address</Label>
                  <Input
                    id="dropAddress"
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                  />
                </div>

                {/* Payment Options */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Select Payment Option
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      variant={paymentOption === "full" ? "default" : "outline"}
                      onClick={() => setPaymentOption("full")}
                      className="flex-1"
                    >
                      Pay Full (₹{Math.floor(fullPrice)})
                    </Button>
                    <Button
                      variant={
                        paymentOption === "partial" ? "default" : "outline"
                      }
                      onClick={() => setPaymentOption("partial")}
                      className="flex-1"
                    >
                      Pay 30% Now (₹{Math.floor(partialPrice)})
                    </Button>
                  </div>
                </div>

                <Button onClick={handlePayment} className="w-full mt-6">
                  PROCEED TO PAY
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Booking Summary (can remain in client component for simplicity, or be a separate static server component) */}
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
                  {endLocation === "Not%20Available" ? (
                    <></>
                  ) : (
                    <>→ {decodeURIComponent(endLocation)}</>
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
                  <strong>Total Fare:</strong> ₹ {Math.floor(fullPrice)}
                </p>
                {paymentOption === "partial" && (
                  <p className="text-blue-600 font-semibold">
                    <strong>Amount to Pay Now:</strong> ₹
                    {Math.floor(partialPrice)}
                  </p>
                )}
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