import mongoose, { Schema, model, Document } from "mongoose";

export interface IFamily extends Document {
  familyName: string;
  familyMember: mongoose.Types.ObjectId[];
  numberOfMembers: number;
  passwordText: string;
  notifications: mongoose.Types.ObjectId[];
}

const familySchema = new Schema<IFamily>({
  familyName: { type: String, required: false, default: "", trim: true },
  familyMember: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  numberOfMembers: { type: Number, default: 0 },
  passwordText: { type: String, required: false, default: "", trim: true },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

export default model<IFamily>("Family", familySchema);
