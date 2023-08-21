import mongoose, { Schema, Document } from "mongoose";

export interface IFamilyPassword extends Document {
  familyId: string;
  passwordText: string;
}

const familyPasswordSchema: Schema = new Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true,
  },
  passwordText: { type: String, required: true },
});

export default mongoose.model<IFamilyPassword>(
  "FamilyPassword",
  familyPasswordSchema
);
