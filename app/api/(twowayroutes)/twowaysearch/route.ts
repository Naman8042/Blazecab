import { NextRequest, NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";
import TwowayRoute from '@/models/twowayroute';

export async function GET(req: NextRequest) {
  const pickup = req.nextUrl.searchParams.get('pickup')?.toLowerCase();
  const drop = req.nextUrl.searchParams.get('drop')?.toLowerCase();

  try {
    await connect();

    if (!pickup || !drop) {
      return NextResponse.json(
        { error: 'Both pickup and drop locations are required' },
        { status: 400 }
      );
    }

    const results = await TwowayRoute.find({
      pickup: { $regex: new RegExp(pickup, 'i') },
      drop: { $regex: new RegExp(drop, 'i') },
    });

    console.log(results)
    
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching routes' }, { status: 500 });
  }
}
