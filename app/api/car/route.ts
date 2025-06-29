import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import car from "@/models/car";

export async function GET() {
  try {
    await connect();
    const cars = await car.find();
    return NextResponse.json(cars);
  } catch (err: unknown) {
    console.log(err);
    return NextResponse.json(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const newCar = await car.create(reqBody);
    return NextResponse.json(newCar);
  } catch (err: unknown) {
    console.log(err);
    return NextResponse.json(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connect();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    console.log(id)

    if (!id) {
      return NextResponse.json({ error: "Missing 'id' query parameter" }, { status: 400 });
    }

    const body = await request.json();
    const updated = await car.findByIdAndUpdate(id, body, { new: true });

    console.log(updated)

    if (!updated) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connect();
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams)
    const id = searchParams.get("id");
    console.log(id)
    const deleted = await car.findByIdAndDelete(id);
    console.log(deleted)
    return NextResponse.json({ message: "Deleted" });
  } catch (err: unknown) {
    console.log(err);
    return NextResponse.json(err);
  }
}
