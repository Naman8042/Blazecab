import { Schema, Document, models, model } from "mongoose";
import Counter from "./Counter";

export interface BookingDocument extends Document {
  type: string;
  pickupCity: string;
  destination: string;
  createdAt: Date;
  pickupDate: Date;
  customerName: string;
  email:string;
  phone: string;
  status: string;
  bookingId: string; 
}

const BookingSchema: Schema = new Schema<BookingDocument>(
  {
    type: { type: String, required: true },
    pickupCity: { type: String, required: true },
    destination: { type: String,},
    createdAt: { type: Date, default: Date.now },
    pickupDate: { type: Date, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true, default: "Pending" },
    bookingId: { type: String, unique: true, sparse: true }
  },
  {
    timestamps: true,
  }
);

// models/Booking.ts (part of the BookingSchema definition)

BookingSchema.pre<BookingDocument>("save", async function (next) {
  if (this.isNew && !this.bookingId) {
    let prefix = "";
    switch (this.type) {
      case "Local":
        prefix = "LOC";
        break;
      case "Round Trip":
        prefix = "RT";
        break;
      case "One Way":
        prefix = "OW";
        break;
      default:
        prefix = "BOOK";
    }

    // Find counter and increment
    const counter = await Counter.findOneAndUpdate(
      { prefix }, 
      { $inc: { count: 1 } }, 
      { new: true, upsert: true }
    );

    // Pad the number with leading zeros (e.g., 0001, 0002)
    const paddedNumber = counter.count.toString().padStart(4, "0");
    this.bookingId = `${prefix}-${paddedNumber}`;
  }
  next();
});

// Avoid re-compiling model during hot reloads
export default models.Booking || model<BookingDocument>("Booking", BookingSchema);
