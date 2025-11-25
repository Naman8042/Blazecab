import { NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import SEOContent from "@/models/Seocontent";

export async function GET() {
  await connect();
  const data = await SEOContent.find().lean();
  return NextResponse.json({ success: true, data });
}
