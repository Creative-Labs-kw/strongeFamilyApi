import mongoose, { Schema, model, Document } from "mongoose";

export interface IFamily extends Document {
  familyName: string;
  familyMember: mongoose.Types.ObjectId[];
}

const familySchema = new Schema<IFamily>({
  familyName: { type: String, required: false },
  familyMember: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default model<IFamily>("Family", familySchema);
