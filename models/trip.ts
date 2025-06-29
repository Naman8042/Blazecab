import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  pickupAddress: String,
  dropAddress: String,
  pickupDate: Date,
  carType: String,
  kmsIncluded: Number,
  fare: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
