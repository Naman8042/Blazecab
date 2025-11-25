import { NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import SEOContent from "@/models/Seocontent";


export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> } ) {
  await connect();
  const { slug } = await params;
  const { question } = await req.json();

  const result = await SEOContent.findOneAndUpdate(
    { slug },
    { $pull: { faqs: { question } } },
    { new: true }
  );

  return NextResponse.json({ success: true, data: result });
}
