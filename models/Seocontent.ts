import { Schema, models, model, Document } from "mongoose";

interface FAQ {
  question: string;
  answer: string;
}

export interface SEOContentDocument extends Document {
  slug: string;
  seoContent: string;
  faqs: FAQ[];
}

const faqSchema = new Schema<FAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const seoContentSchema = new Schema<SEOContentDocument>(
  {
    slug: { type: String, required: true, unique: true },
    seoContent: { type: String},
    faqs: [faqSchema]
  },
  { timestamps: true }
);


export default models.SEOContent || model<SEOContentDocument>("SEOContent", seoContentSchema);
