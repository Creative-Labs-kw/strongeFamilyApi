import mongoose, { Schema, model, Document } from "mongoose";
import { IUser } from "../models/User";

export interface IStore extends Document {
  storeName: string;
  owner: mongoose.Types.ObjectId | IUser; // reference to the User schema
}

const storeSchema = new Schema<IStore>({
  storeName: { type: String, required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
});

export default model<IStore>("Store", storeSchema);
