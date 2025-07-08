import mongoose, { Schema, Document } from 'mongoose';

export interface IShowRoute extends Document {
  pickup: string;
  drop: string;
  cabs:string;
  distance:number;
  per_kms_charge:number
  minimum_per_day_km:number
  limit:number
  driver_allowance:number
}

const ShowRouteSchema = new Schema<IShowRoute>({
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  cabs: { type: String, required: true },
  per_kms_charge: { type: Number, required: true },
  distance: { type: Number, required: true },
  minimum_per_day_km: { type: Number, required: true },
  driver_allowance: { type: Number, required: true },
  limit: { type: Number, required: true },
});


export default mongoose.models.twowayroutes || mongoose.model("twowayroutes", ShowRouteSchema);


