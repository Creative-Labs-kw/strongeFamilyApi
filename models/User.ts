import mongoose, { Model } from "mongoose";

export interface IUser extends mongoose.Document {
  userId: string; // Change 'id' to 'userId'
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  stores: string[]; // add stores property here
  isAdmin: boolean;
}

export interface UserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
    default: "",
    trim: true,
  },
  password: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
  families: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
  isAdmin: { type: Boolean, require: true },
});

export const User = mongoose.model<IUser>("User", userSchema);
