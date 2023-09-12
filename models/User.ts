import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  stores: string[];
  isAdmin?: boolean;
  chats: mongoose.Types.ObjectId[];
  token?: string; // Add the token field here
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String },
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
  isAdmin: { type: Boolean, default: false },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  token: { type: String }, // Define the token field here
});

export default mongoose.model<IUser>("User", userSchema);
