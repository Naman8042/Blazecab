import { NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig";
import SEOContent from "@/models/Seocontent";

export async function POST(req: Request) {
  await connect();
  const body = await req.json();
  const { slug, seoContent, faqs } = body;

  const exists = await SEOContent.findOne({ slug });
  if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

const result = await SEOContent.create({
  slug,
  seoContent: seoContent || "",
  faqs: faqs || []
});

  return NextResponse.json({ success: true, data: result });
}
