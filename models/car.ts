import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  capacity: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  inclusions: { type: [String], default: [] },
  exclusions: { type: [String], default: [] },
  termscondition: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Car || mongoose.model("Car", CarSchema);