import { Schema, Document, models, model } from "mongoose";

export interface BookingDocument extends Document {
  type: string;
  pickupCity: string;
  destination: string;
  createdAt: Date;
  pickupDate: Date;
  customerName: string;
  phone: string;
  status: string;
}

const BookingSchema: Schema = new Schema<BookingDocument>(
  {
    type: { type: String, required: true },
    pickupCity: { type: String, required: true },
    destination: { type: String,},
    createdAt: { type: Date, default: Date.now },
    pickupDate: { type: Date, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

// Avoid re-compiling model during hot reloads
export default models.Booking || model<BookingDocument>("Booking", BookingSchema);
