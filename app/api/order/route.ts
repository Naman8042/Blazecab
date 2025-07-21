import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
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
