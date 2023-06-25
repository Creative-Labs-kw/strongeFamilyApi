import mongoose, { Schema, model, Document } from "mongoose";

export interface IFamily extends Document {
  familyName: string;
  familyMembers: mongoose.Types.ObjectId[];
  numberOfMembers: number;
  passwordText: string;
  notifications: mongoose.Types.ObjectId[];
  familyInfo: string;
}

const familySchema = new Schema<IFamily>({
  familyName: { type: String, required: true, default: "", trim: true },
  familyMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  numberOfMembers: { type: Number, default: 0 },
  passwordText: { type: String, required: true, default: "", trim: true },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
  familyInfo: { type: String, required: false, default: "", trim: true },
});

export default model<IFamily>("Family", familySchema);
