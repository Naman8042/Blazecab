import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig"; // Your MongoDB connection
import User from "@/models/userModels";
import Trip from "@/models/trip";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const data = await req.json();

    // 1. Create or find the user
    const existingUser = await User.findOne({ email: data.email });
    const user = existingUser || await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });

    // 2. Create the trip associated with this user
    const trip = await Trip.create({
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      pickupDate: new Date(data.pickupDate),
      carType: data.carType,
      kmsIncluded: data.kmsIncluded,
      fare: data.fare,
      user: user._id,
    });

    return NextResponse.json({ success: true, trip });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}
