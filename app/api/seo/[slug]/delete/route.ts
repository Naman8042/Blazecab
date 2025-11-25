import { NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import SEOContent from "@/models/Seocontent";


export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> } ) {
  await connect();
  const { slug } = await params;

  await SEOContent.deleteOne({ slug });

  return NextResponse.json({ success: true });
}
