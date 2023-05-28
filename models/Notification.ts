import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
