import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error("Missing Razorpay environment variables. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
export async function POST(req: NextRequest) {
 
  try {
    const { amount } = await req.json();

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_order_" + new Date().getTime(),
    });

    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.log(err)
    return NextResponse.json( {error: "Failed to create Razorpay order"} );
  }
}
