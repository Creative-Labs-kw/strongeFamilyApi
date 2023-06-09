import mongoose, { Document, Schema } from "mongoose";
import { IItem } from "./Item";

export interface IStore extends Document {
  storeName: string;
  owner: mongoose.Types.ObjectId; // Change field name from "user" to "owner"
  address: string;
  phoneNumber: string;
  imageUrl: string;
  description: string;
  links: string;
  items: IItem[];
}

const StoreSchema = new Schema<IStore>({
  storeName: {
    type: String,
    required: true,
    default: "",
    trim: true,
    unique: true,
  },
  owner: {
    // Change field name from "user" to "owner"
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  links: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

export default mongoose.model<IStore>("Store", StoreSchema);
