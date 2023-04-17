import mongoose, { Document, Schema } from "mongoose";

export interface IStore extends Document {
  storeName: string;
  owner: mongoose.Types.ObjectId;
  address: string;
  phoneNumber: string;
  imageUrl: string;
  description: string;
}

const StoreSchema = new Schema<IStore>({
  storeName: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IStore>("Store", StoreSchema);
