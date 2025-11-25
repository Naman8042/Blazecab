"use client";

import { useState, useMemo, useEffect } from "react";
import Script from "next/script";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Car, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Check,
  X,
  FileText,
  ShieldCheck
} from "lucide-react";

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
  const router = useRouter();

  const formFields = [
    { id: "name", label: "Full Name", type: "text", value: name, onChange: setName, required: true, icon: User },
    { id: "email", label: "Email Address", type: "email", value: email, onChange: setEmail, required: true, icon: Mail },
    { id: "phone", label: "Phone Number", type: "tel", value: phone, onChange: setPhone, required: true, icon: Phone },
    { id: "pickupAddress", label: "Pickup Address", type: "text", value: pickupAddress, onChange: setPickupAddress, required: true, icon: MapPin },
    { id: "dropAddress", label: "Drop Address (Optional)", type: "text", value: dropAddress, onChange: setDropAddress, required: false, icon: Navigation },
  ];

  const [paymentOption, setPaymentOption] = useState<"full" | "partial">("full");
  const fullPrice = parseFloat(price);

  const { partialPercentage, partialAmount } = useMemo(() => {
    let percentage = 0;
    if (rideType === "Round Trip" || rideType === "One Way") percentage = 0.3;
    else if (rideType === "Local") percentage = 0.2;
    
    return {
      partialPercentage: percentage * 100,
      partialAmount: fullPrice * percentage,
    };
  }, [rideType, fullPrice]);

  useEffect(() => {
    if (partialPercentage === 0 && paymentOption === "partial") {
      setPaymentOption("full");
    }
  }, [partialPercentage, paymentOption]);

  const createOrder = async (amount: number) => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create order");
    return data.orderId;
  };

  const handlePayment = async () => {
    if (!name || !email || !phone || !pickupAddress) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const amountToPay = paymentOption === "full" ? fullPrice : partialAmount;

    try {
      const orderId = await createOrder(amountToPay);
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) throw new Error("Missing Razorpay Key");

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amountToPay * 100,
        currency: "INR",
        name: "BlazeCab Booking",
        description: `Payment for ${carType} - ${rideType}`,
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          const bookingStatus = paymentOption === "full" ? "Confirmed" : "Advance Paid";
          const paymentStatus = paymentOption === "full" ? "Paid Full" : "Partial Paid";

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
                orderId,
                type: rideType,
                paymentOption,
                bookingStatus,
                paymentStatus,
              },
            }),
          });

          const result = await res.json();
          if (result.isOk) {
            toast.success("Booking Successful!");
            router.push(
              `/bookingstatus?name=${encodeURIComponent(name)}&rideType=${rideType}&from=${startLocation}&to=${endLocation}&date=${formattedDate}&time=${formattedTime}&carType=${carType}&km=${totalKm}&fare=${fullPrice}&paid=${amountToPay}&status=${bookingStatus}&payment=${paymentStatus}`
            );
          } else {
            toast.error(result.message || "Verification failed");
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#6aa4e0" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN: FORM --- */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Details Card */}
              <Card className="border-none shadow-lg shadow-gray-100">
                <CardHeader className="border-b border-gray-100 bg-white rounded-t-xl pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <User className="w-5 h-5 text-[#6aa4e0]" /> 
                    Passenger Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {formFields.map((field) => {
                      if (field.id === "dropAddress" && rideType !== "One Way") return null;
                      
                      return (
                        <div key={field.id} className={field.id.includes("Address") ? "md:col-span-2" : ""}>
                          <Label htmlFor={field.id} className="text-xs font-semibold uppercase text-gray-500 mb-1.5 block">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <field.icon className="h-4 w-4 text-gray-400 group-focus-within:text-[#6aa4e0] transition-colors" />
                            </div>
                            <Input
                              id={field.id}
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              type={field.type}
                              required={field.required}
                              className="pl-10 border-gray-200 focus:border-[#6aa4e0] focus:ring-[#6aa4e0]/20 h-11 transition-all"
                              placeholder={`Enter ${field.label}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Options Card */}
              <Card className="border-none shadow-lg shadow-gray-100">
                <CardHeader className="border-b border-gray-100 bg-white rounded-t-xl pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <CreditCard className="w-5 h-5 text-[#6aa4e0]" /> 
                    Payment Option
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {partialPercentage > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setPaymentOption("full")}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:border-[#6aa4e0]/50 ${paymentOption === "full" ? "border-[#6aa4e0] bg-[#6aa4e0]/5" : "border-gray-100"}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800">Pay Full Amount</span>
                          {paymentOption === "full" && <CheckCircle2 className="w-5 h-5 text-[#6aa4e0]" />}
                        </div>
                        <p className="text-2xl font-bold text-[#6aa4e0]">₹{Math.floor(fullPrice).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Secure your booking instantly</p>
                      </div>

                      <div 
                        onClick={() => setPaymentOption("partial")}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:border-[#6aa4e0]/50 ${paymentOption === "partial" ? "border-[#6aa4e0] bg-[#6aa4e0]/5" : "border-gray-100"}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800">Pay Advance ({Math.floor(partialPercentage)}%)</span>
                          {paymentOption === "partial" && <CheckCircle2 className="w-5 h-5 text-[#6aa4e0]" />}
                        </div>
                        <p className="text-2xl font-bold text-[#6aa4e0]">₹{Math.floor(partialAmount).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Pay remaining ₹{Math.floor(fullPrice - partialAmount)} to driver</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-700 font-medium">Full payment is required for this trip type.</p>
                    </div>
                  )}

                  <Button 
                    onClick={handlePayment} 
                    className="w-full mt-8 h-12 text-lg font-bold bg-[#6aa4e0] hover:bg-[#6aa4e0] transition-all shadow-lg hover:shadow-xl"
                  >
                    Proceed to Pay ₹{paymentOption === "full" ? Math.floor(fullPrice).toLocaleString() : Math.floor(partialAmount).toLocaleString()}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                    <ShieldCheck className="w-3 h-3" />
                    Secure Payment Gateway via Razorpay
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- RIGHT COLUMN: SUMMARY --- */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden">
                  <div className="bg-[#6aa4e0] p-4 text-white text-center">
                    <h3 className="font-bold text-lg">Booking Summary</h3>
                    <p className="text-xs text-white">{rideType}</p>
                  </div>
                  
                  <CardContent className="p-0">
                    {/* Route Visual */}
                    <div className="bg-gray-50 p-6 border-b border-gray-100">
                      <div className="flex flex-col gap-6 relative">
                        {/* Dotted Line */}
                        <div className="absolute left-[19px] top-8 bottom-2 border-l-2 border-dashed border-gray-300" />
                        
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Pickup From</p>
                            <p className="font-bold text-gray-900 leading-tight">{startLocation}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                            <Navigation className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Drop To</p>
                            <p className="font-bold text-gray-900 leading-tight">
                              {endLocation === "Not Available" ? "As per itinerary" : endLocation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#6aa4e0]" />
                        <span className="text-gray-600 font-medium">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-[#6aa4e0]" />
                        <span className="text-gray-600 font-medium">{formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Car className="w-4 h-4 text-[#6aa4e0]" />
                        <span className="text-gray-600 font-medium">{carType}</span>
                        <span className="bg-blue-50 text-[#6aa4e0] text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-100">
                          {Math.floor(Number(totalKm))} KM Included
                        </span>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="bg-[#6aa4e0]/10 p-4 flex justify-between items-center border-t border-[#6aa4e0]/20">
                      <span className="font-bold text-gray-700">Total Fare</span>
                      <span className="text-2xl font-extrabold text-[#6aa4e0]">₹{Math.floor(fullPrice).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs for Info */}
                <Card className="border-none shadow-lg shadow-gray-100">
                  <Tabs defaultValue="inclusions" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 p-1 bg-gray-100 rounded-t-xl rounded-b-none h-10">
                      <TabsTrigger value="inclusions" className="text-xs">Inclusions</TabsTrigger>
                      <TabsTrigger value="exclusions" className="text-xs">Exclusions</TabsTrigger>
                      <TabsTrigger value="tac" className="text-xs">T&C</TabsTrigger>
                    </TabsList>
                    <CardContent className="p-4 max-h-48 overflow-y-auto text-sm text-gray-600 bg-white rounded-b-xl">
                      <TabsContent value="inclusions" className="mt-0 space-y-2">
                        {inclusions.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </TabsContent>
                      <TabsContent value="exclusions" className="mt-0 space-y-2">
                        {exclusions.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </TabsContent>
                      <TabsContent value="tac" className="mt-0 space-y-2">
                        {termscondition.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}