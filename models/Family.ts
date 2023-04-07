import mongoose, { Schema, model, Document } from "mongoose";

export interface IFamily extends Document {
  familyName: string;
  familyMember: mongoose.Schema.Types.ObjectId;
}

const familySchema = new Schema<IFamily>(
  {
    familyName: {
      type: String,
      required: false,
    },
    familyMember: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default model<IFamily>("Family", familySchema);
