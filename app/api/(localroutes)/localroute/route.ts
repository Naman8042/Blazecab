import { NextRequest, NextResponse } from 'next/server'
import { connect } from "@/dbConfig/dbConfig"
import LocalRoute from '@/models/localroute' // adjust path as needed


export async function GET(request: NextRequest) {
  try {
    await connect();
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");

    const route = await LocalRoute
      .find({
        cities: String(city),
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



export async function POST(req: NextRequest) {
  try {
    await connect()
    const body = await req.json()
    const route = new LocalRoute(body)
    const saved = await route.save()
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

    
    const updated = await LocalRoute.findByIdAndUpdate(id, update, { new: true })

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
    
    const deleted = await LocalRoute.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 })
  }
}
