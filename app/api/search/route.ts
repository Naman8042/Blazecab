import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedRoutes } from '@/models/routeservice'
import { connect } from "@/dbConfig/dbConfig"
import OnewayRoute from '@/models/onewayroute' // adjust path as needed

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')
  const city = req.nextUrl.searchParams.get('city')?.toLowerCase()

  try {
    await connect()

    if (city) {
      const results = await OnewayRoute.find({
        $or: [
          { pickup: { $regex: city, $options: 'i' } },
          { drop: { $regex: city, $options: 'i' } }
        ]
      })
      return NextResponse.json({ routes: results })
    }

    const data = await getPaginatedRoutes(page, limit)
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching routes' }, { status: 500 })
  }
}
