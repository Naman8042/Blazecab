

import mongoose, { Schema, Document } from 'mongoose';

export interface IShowRoute extends Document {
  pickup: string;
  drop: string;
  price: number;
  cabs:string;
  distance:number;
  per_kms_extra_charge:number
}

const ShowRouteSchema = new Schema<IShowRoute>({
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  cabs: { type: String, required: true },
  price: { type: Number, required: true },
  per_kms_extra_charge: { type: Number, required: true },
  distance: { type: Number, required: true },
});


export default mongoose.models.onewayroute || mongoose.model("onewayroute", ShowRouteSchema);


