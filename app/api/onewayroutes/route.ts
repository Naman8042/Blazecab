import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedRoutes } from '@/models/routeservice'
import { connect } from "@/dbConfig/dbConfig"
import OnewayRoute from '@/models/onewayroute' // adjust path as needed

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')

  try {
    await connect()
    const data = await getPaginatedRoutes(page, limit)
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching routes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect()
    const body = await req.json()
    const route = new OnewayRoute(body)
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

    
    const updated = await OnewayRoute.findByIdAndUpdate(id, update, { new: true })

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
    
    const deleted = await OnewayRoute.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 })
  }
}
