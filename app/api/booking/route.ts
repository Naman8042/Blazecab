import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";

interface BookingDocument {
  _id:string,  
  type: string;
  pickupCity: string;
  destination: string;
  createdAt: Date;
  pickupDate: Date;
  customerName: string;
  phone: string;
  status: string;
}

export async function GET() {
  try {
    await connect();

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today

    // Get bookings with pickupDate today or in the future
    const bookings = await Booking.find({
      pickupDate: { $gte: now }
    }).sort({ pickupDate: 1 });

    const formatted = bookings.map((b: BookingDocument) => ({
      id: b._id.toString(),
      type: b.type,
      pickupCity: b.pickupCity,
      destinationCity: b.destination,
      createdAt: b.createdAt,
      pickupDate: b.pickupDate,
      customerName: b.customerName,
      customerPhone: b.phone,
      status: b.status,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching bookings" },
      { status: 500 }
    );
  }
}
