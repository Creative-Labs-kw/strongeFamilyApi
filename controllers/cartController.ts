import { Request, Response } from "express";
import Cart from "../models/Cart";

//$ GET getCartItems
export const getCartItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    res.status(200).json(cart.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get cart items" });
  }
};

//$ POST addToCart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { itemId, name, price } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $push: { items: { itemId, name, price } } },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

//$ PUT updateCart
export const updateCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { items } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

//$ DELETE removeFromCart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { itemId } } },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};
