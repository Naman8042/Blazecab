import { NextRequest, NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";
import LocalRoute from '@/models/localroute';

export async function GET(req: NextRequest) {
  const pickup = req.nextUrl.searchParams.get('pickup')?.toLowerCase();

  try {
    await connect();

    if (!pickup) {
      return NextResponse.json(
        { error: 'Both pickup and drop locations are required' },
        { status: 400 }
      );
    }

    const results = await LocalRoute.find({
      cities: { $regex: new RegExp(pickup, 'i') },
    });

    console.log(results)
    
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching routes' }, { status: 500 });
  }
}
