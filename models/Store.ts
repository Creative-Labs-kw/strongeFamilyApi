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
  imageUrl: { type: String, required: false },
  instagramLink: { type: String, required: false },
  snapChatLink: { type: String, required: false },
  webLink: { type: String, required: false },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

export default mongoose.model<IStore>("Store", storeSchema);
