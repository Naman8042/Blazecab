import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedLocalRoutes } from '@/models/routeservice'
import { connect } from "@/dbConfig/dbConfig"


export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')

  try {
    await connect()
    const data = await getPaginatedLocalRoutes(page, limit)
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching routes' }, { status: 500 })
  }
}
