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
  // This hook runs automatically BEFORE a document is saved
  if (this.isNew && !this.bookingId) { // Ensures it runs only for new documents and if ID isn't already set
    let prefix = "";
    switch (this.type) { // Assumes 'this.type' is correctly set as "Local", "Round Trip", or "One Way"
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
    const timestampPart = Date.now().toString(); // Current timestamp for uniqueness
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // Random string for more uniqueness

    this.bookingId = `${prefix}-${timestampPart}-${randomPart}`; // Generate and assign the ID
  }
  next(); // Proceed with saving
});

// Avoid re-compiling model during hot reloads
export default models.Booking || model<BookingDocument>("Booking", BookingSchema);
