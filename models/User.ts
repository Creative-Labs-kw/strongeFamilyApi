import { ObjectId } from "mongodb";
import mongoose, { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  message: string;
  isRead: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  store?: mongoose.Schema.Types.ObjectId;
  isAdmin?: boolean;
  notifications?: INotification[];
}
const userSchema = new Schema<IUser>({
  _id: ObjectId,
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", //!Make it later
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  notifications: [
    {
      message: {
        type: String,
        required: false,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

export default model<IUser>("User", userSchema);
