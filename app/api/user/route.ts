import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Booking from "@/models/Booking";

// Define the handler for GET requests
export async function GET(request: Request) {
  try {
    await connect();

    // Corrected logic: Get the email from the request's URL query parameters
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');

    // Check if the email parameter is provided
    if (!userEmail) {
      console.log("Bad Request: Email not provided in query parameters.");
      return NextResponse.json({ success: false, message: "Email not provided" }, { status: 400 });
    }

    console.log("Fetching bookings for Email:", userEmail);

    // Find bookings associated with the provided email
    const bookings = await Booking.find({ email: userEmail }).sort({ createdAt: -1 });

    console.log("Fetched bookings:", bookings);

    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    console.error("Error in GET /user:", err);
    return NextResponse.json({ success: false, message: "Error fetching user data" }, { status: 500 });
  }
}