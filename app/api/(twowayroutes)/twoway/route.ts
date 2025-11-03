import { NextRequest, NextResponse } from 'next/server'
import { connect } from "@/dbConfig/dbConfig"
import TwowayRoute from '@/models/twowayroute' // adjust path as needed



export async function GET(request: NextRequest) { 
  try {
    await connect();
    const searchParams = request.nextUrl.searchParams;
    const pickup = searchParams.get("pickup")?.toLowerCase();
    const drop = searchParams.get("drop")?.toLowerCase();

    const route = await TwowayRoute
      .find({ pickup, drop })
      .sort({ price: 1 });

    if (!route || route.length === 0) {
      return NextResponse.json({ error: "NOT FOUND" }, { status: 404 });
    }

    return NextResponse.json(route);
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, { status: 500 });
  }
}





export async function POST(req: NextRequest) {
  try {
    await connect()
    const body = await req.json()
    console.log(body)
    const route = new TwowayRoute(body)
    const saved = await route.save()
    console.log(saved)
    return NextResponse.json(saved)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Failed to add route' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect()
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const body = await req.json()
    const {...update } = body

    
    const updated = await TwowayRoute.findByIdAndUpdate(id, update, { new: true })

    if (!updated) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect()
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    const deleted = await TwowayRoute.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 })
  }
}
