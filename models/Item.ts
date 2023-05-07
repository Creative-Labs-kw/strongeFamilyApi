import mongoose, { Schema } from "mongoose";

export interface IItem {
  itemName: string;
  price: number;
  imageUrl: string;
  description: string;
  store: mongoose.Types.ObjectId; // reference to the Store model
}

const ItemSchema = new Schema<IItem>({
  itemName: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store", // reference to the Store model
  },
});

export default mongoose.model<IItem>("Item", ItemSchema);
