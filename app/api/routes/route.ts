import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import oneWayRoute from '@/models/onewayroute'


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

     console.log(route) 

    if (!route || route.length === 0) {
      return NextResponse.json({ error: "NOT FOUND" }, { status: 404 });
    }

    return NextResponse.json(route);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}


