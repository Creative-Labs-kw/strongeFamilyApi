import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  participants: string[];
  messages: Array<{ sender: string; content: string }>;
  // Other fields as needed
}

const chatSchema: Schema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
    },
  ],
  // Add other fields here
});

export default mongoose.model<IChat>("Chat", chatSchema);
