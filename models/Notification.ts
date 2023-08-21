import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: string;
  content: string;
  isRead: boolean;
  // Other fields as needed
}

const notificationSchema: Schema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  // Add other fields here
});

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
