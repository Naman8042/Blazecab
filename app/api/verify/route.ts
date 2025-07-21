import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
  try {
    const {
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
  booking, // ✅ correct key
} = await req.json();


    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`) // ✅ fixed
      .digest("hex");

    console.log("Generated Signature:", generatedSignature);
    console.log("Received Signature:", razorpaySignature);

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ isOk: false, message: "Invalid signature" });
    }

    await connect();

    const saved = await Booking.create({
      ...booking,
      paymentId: razorpayPaymentId,
      amountPaid: parseFloat(booking.amount),
      status:"Booked"
    });

    return NextResponse.json({ isOk: true, booking: saved }); // ✅ fix missing return
  } catch (err) {
    console.error(err);
    return NextResponse.json({ isOk: false, message: "Verification or DB error" }); // ✅ fix missing return
  }
}
