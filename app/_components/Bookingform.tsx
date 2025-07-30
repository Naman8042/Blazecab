"use client";

import { useState, useMemo, useEffect } from "react";
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
  rideType: string | null;
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
  rideType,
  exclusions,
  termscondition,
  rawTime,
  formattedDate,
  formattedTime,
}: BookingFormClientProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const formFields = [
    { id: "name", label: "Name", type: "text", value: name, onChange: setName, required: true },
    { id: "email", label: "Email", type: "email", value: email, onChange: setEmail, required: true },
    { id: "phone", label: "Phone", type: "tel", value: phone, onChange: setPhone, required: true },
    { id: "pickupAddress", label: "Pickup Address", type: "text", value: pickupAddress, onChange: setPickupAddress, required: true },
    { id: "dropAddress", label: "Drop Address", type: "text", value: dropAddress, onChange: setDropAddress, required: false }, // Drop address is not always required
  ];


  const [paymentOption, setPaymentOption] = useState<"full" | "partial">(
    "full"
  );

  const fullPrice = parseFloat(price);

  const { partialPercentage, partialAmount } = useMemo(() => {
    let percentage = 0;
    if (rideType === "Round Trip") {
      percentage = 0.3;
    } else if (rideType === "Local") {
      percentage = 0.2;
    }
    return {
      partialPercentage: percentage * 100,
      partialAmount: fullPrice * percentage,
    };
  }, [rideType, fullPrice]);

  useEffect(() => {
    // If rideType changes to "One Way" or any type where partial isn't allowed,
    // force paymentOption to "full".
    if (rideType === "One Way" && paymentOption === "partial") {
      setPaymentOption("full");
    }
  }, [rideType, paymentOption]);

  const createOrder = async (amount: number) => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create order");
    }
    return data.orderId;
  };

  const handlePayment = async () => {
    if (!name || !email || !phone || !pickupAddress) {
      toast.error("Please fill in all required contact and pickup details.");
      return;
    }

    // Determine the amount to pay based on the selected option or forced full for One Way
    const amountToPay = rideType === "One Way" ? fullPrice : (paymentOption === "full" ? fullPrice : partialAmount);


    try {
      const orderId = await createOrder(amountToPay);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID env variable.");
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amountToPay * 100,
        currency: "INR",
        name: "Car Booking",
        description: "Trip Payment",
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          let bookingStatus = "";
          let paymentStatus = "";

          // Payment status logic for backend
          if (rideType === "One Way" || paymentOption === "full") {
            bookingStatus = "Confirmed";
            paymentStatus = "Paid Full";
          } else { // Partial payment logic for Round Trip or Local
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
                price: fullPrice,
                amountPaid: amountToPay,
                inclusions,
                exclusions,
                termscondition,
                type: rideType,
                // Ensure paymentOption correctly reflects the actual choice for backend
                // For One Way, it's always 'full', even if the button wasn't shown.
                paymentOption: rideType === "One Way" ? "full" : paymentOption,
                bookingStatus: bookingStatus,
                paymentStatus: paymentStatus,
              },
            }),
          });

          const result = await res.json();
          if (result.isOk) {
            toast.success(`Booking ${bookingStatus} ✅`);
          } else {
            toast.error(result.message || "Payment failed ❌");
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Payment initiation failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred during payment initiation.");
      }
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="w-full sm:min-h-[89.75vh] flex items-center justify-center p-4">
        <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
          <Card className="md:w-[58%] w-full shadow-lg bg-white">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">
                Contact & Pickup Details
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
               {formFields.map((field) => (
                  <div key={field.id}>
                    <Label className="mb-1" htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      type={field.type}
                      required={field.required}
                    />
                  </div>
                ))}

                {/* Conditional Payment Options Section */}
                {rideType !== "One Way" ? ( // Only show payment options for Round Trip or Local
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Select Payment Option
                    </h3>
                    <div className="flex gap-4 md:flex-row flex-col">
                      <Button
                        variant={paymentOption === "full" ? "default" : "outline"}
                        onClick={() => setPaymentOption("full")}
                        className="flex-1"
                      >
                        Pay Full (₹{Math.floor(fullPrice)})
                      </Button>
                      {partialPercentage > 0 && ( // Still only show partial if percentage > 0
                        <Button
                          variant={
                            paymentOption === "partial" ? "default" : "outline"
                          }
                          onClick={() => setPaymentOption("partial")}
                          className="flex-1"
                        >
                          Pay {Math.floor(partialPercentage)}% Now (₹
                          {Math.floor(partialAmount)})
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  // For "One Way", display a message that full payment is required
                  <></>
                )}

                <Button onClick={handlePayment} className="w-full mt-6">
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
                  <strong>Ride Type:</strong> {rideType}
                </p>
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