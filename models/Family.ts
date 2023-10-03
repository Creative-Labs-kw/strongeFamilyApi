import mongoose, { Schema, Document } from "mongoose";

export interface IFamily extends Document {
  familyName: string;
  familyMembers: string[]; // User IDs
  numberOfMembers: number;
  passwordText: string;
  notifications: string[]; // Notification IDs
  isAdmin: boolean;
  extraInfo: string;
  area: string;
  imageUrl: String;
}

const familySchema: Schema = new Schema({
  familyName: { type: String, required: true },
  familyMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  numberOfMembers: { type: Number, default: 0 },
  passwordText: { type: String },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
  extraInfo: { type: String },
  area: { type: String },
  isAdmin: { type: Boolean, required: true },
  imageUrl: { type: String },
});

export default mongoose.model<IFamily>("Family", familySchema);
