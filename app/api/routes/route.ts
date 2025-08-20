import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import oneWayRoute from "@/models/onewayroute";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const searchParams = request.nextUrl.searchParams;
    const pickup = searchParams.get("pickup");
    const drop = searchParams.get("drop");

    const route = await oneWayRoute
      .find({
        pickup: String(pickup),
        drop: String(drop),
      })
      .sort({ price: 1 });

    console.log(route);

    // ✅ return empty array instead of error
    if (!route || route.length === 0) {
      return NextResponse.json(
        { message: "No routes found", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: route }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
