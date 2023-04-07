import mongoose, { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  message: string;
  isRead: boolean;
  userId: mongoose.Schema.Types.ObjectId;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  store?: mongoose.Schema.Types.ObjectId;
  isAdmin?: boolean;
  notifications?: INotification[];
}

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);