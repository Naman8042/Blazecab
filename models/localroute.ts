

import mongoose, { Schema, Document } from 'mongoose';

export interface IShowRoute extends Document {
  cities: string;
  price: number;
  cabs:string;
  distance:number;
  time:number;
  perkmextra_charge:number
  per_hour_charge:number
}

const ShowRouteSchema = new Schema<IShowRoute>({
  cities: { type: String, required: true },
  cabs: { type: String, required: true },
  time:{ type: Number, required: true },
  price: { type: Number, required: true },
  perkmextra_charge: { type: Number, required: true },
  distance: { type: Number, required: true },
  per_hour_charge: { type: Number, required: true },
});


export default mongoose.models.localroute || mongoose.model("localroute", ShowRouteSchema);


