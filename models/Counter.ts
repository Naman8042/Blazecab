import mongoose, { Schema, Document } from "mongoose";

interface CounterDocument extends Document {
  prefix: string;
  count: number;
}

const CounterSchema = new Schema<CounterDocument>({
  prefix: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
});

export default mongoose.models.Counter || mongoose.model<CounterDocument>("Counter", CounterSchema);
