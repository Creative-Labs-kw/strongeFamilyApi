import mongoose, { Document, Schema } from "mongoose";

// Define the item schema within the cart
interface CartItem {
  itemId: string;
  name: string;
  price: number;
}

// Define the cart schema
export interface ICart extends Document {
  userId: string;
  items: CartItem[];
}

const CartSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      itemId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
