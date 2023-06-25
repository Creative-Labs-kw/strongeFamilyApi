import mongoose, { Schema } from "mongoose";

export interface IItem {
  itemName: string;
  price: number;
  image?: string;
  description: string;
  store: mongoose.Types.ObjectId; // reference to the Store model
}

const ItemSchema = new Schema<IItem>({
  itemName: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
});

export default mongoose.model<IItem>("Item", ItemSchema);
