import mongoose, { Schema, Document } from "mongoose";

export interface IStore extends Document {
  storeName: string;
  owner: string;
  description: string;
  phoneNumber: string;
  imageUrl: string;
  instagramLink: string;
  snapChatLink: string;
  webLink: string;
  items: mongoose.Types.ObjectId[]; // Array of item IDs
}

const storeSchema: Schema = new Schema({
  storeName: { type: String, required: true },
  owner: { type: String, required: true },
  description: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  imageUrl: { type: String, required: true },
  instagramLink: { type: String, required: true },
  snapChatLink: { type: String, required: true },
  webLink: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

export default mongoose.model<IStore>("Store", storeSchema);
