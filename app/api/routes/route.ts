import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import cities from "@/models/cities";
import oneWayRoute from '@/models/onewayroute'

// export async function POST(request: NextRequest) {
//   try {
//     await connect();
//     const reqBody = await request.json();
//     console.log(reqBody);
//     const newRoute = await cities.create(reqBody);
//     return NextResponse.json(newRoute);
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(err);
//   }
// }

export async function GET(request: NextRequest) {
  try {
    await connect();
    const searchParams = request.nextUrl.searchParams;
    const pickup = searchParams.get("pickup");
    const drop = searchParams.get("drop");

    // console.log(startCity);
    // console.log(endCity);

    const route = await oneWayRoute.find({
      pickup: String(pickup),
      drop: String(drop),
    });

    if (!route) {
     
      return NextResponse.json({error:"NOT FOUND"});
    }

    
    return NextResponse.json(route);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const reqBody = await request.json();

    const updated = await cities.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    if (!updated) return NextResponse.json({ error: "Route not found" });
    return NextResponse.json(updated);
  } catch (err) {
    console.log(err)
    return NextResponse.json(err)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const updated = await cities.findByIdAndDelete(id, {
      new: true,
    });
    if (!updated) return NextResponse.json({ error: "Route not found" });
    return NextResponse.json("Deleted Successfully");
  } catch (err) {
    console.log(err)
    return NextResponse.json(err)
  }
}

