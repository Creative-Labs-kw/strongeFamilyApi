import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  itemName: string;
  price: number;
  image?: string;
  description: string;
  store: mongoose.Types.ObjectId; // reference to the Store ID
}

const itemSchema: Schema = new Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
});

export default mongoose.model<IItem>("Item", itemSchema);
