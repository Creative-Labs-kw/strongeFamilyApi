import { Request, Response } from "express";
import Item from "../models/Item";
import Store from "../models/Store";
import mongoose from "mongoose";

// GET all items for a specific store
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ store: req.params.storeId }).populate(
      "store"
    );

    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET a specific item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findOne({
      _id: req.params.itemId,
      itemId: req.params.itemId,
    }).populate("store");

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// CREATE a new item
export const createItem = async (req: Request, res: Response) => {
  const { itemName, price, description } = req.body;

  try {
    const newItem = new Item({
      itemName,
      price,
      description,
      store: new mongoose.Types.ObjectId(req.params.storeId),
    });
    await newItem.save();

    const store = await Store.findById(req.params.storeId);
    store.items.push(newItem.id);
    await store.save();

    res.json(newItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// UPDATE an existing item by ID
export const updateItemById = async (req: Request, res: Response) => {
  const { itemName, price, description } = req.body;
  try {
    let item = await Item.findOne({
      _id: req.params.itemId,
      store: new mongoose.Types.ObjectId(req.params.storeId),
    });
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    item.itemName = itemName || item.itemName;
    item.price = price || item.price;
    item.description = description || item.description;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE an item by ID
export const deleteItemById = async (req: Request, res: Response) => {
  try {
    const result = await Item.deleteOne({
      _id: req.params.itemId,
      store: new mongoose.Types.ObjectId(req.params.storeId),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.json({ msg: "Item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE all items for a specific store
export const deleteAllItems = async (req: Request, res: Response) => {
  try {
    await Item.deleteMany({
      store: new mongoose.Types.ObjectId(req.params.storeId),
    });
    res.json({ msg: "All items removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
