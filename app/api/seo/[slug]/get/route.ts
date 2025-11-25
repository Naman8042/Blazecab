import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import SEOContent from "@/models/Seocontent";

export async function GET(
  request: NextRequest,
  // 1. Define params as a Promise
  { params }: { params: Promise<{ slug: string }> } 
) {
  try {
    await connect();

    // 2. Await the params object before destructuring
    const { slug } = await params; 

    const data = await SEOContent.findOne({ slug }).lean();

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}