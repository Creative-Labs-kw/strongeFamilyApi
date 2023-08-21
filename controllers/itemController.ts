import { Request, Response } from "express";
import Store, { IStore } from "../models/Store";
import Item from "../models/Item";

//$ GET all items for a specific store
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const items = await Item.find({ store: storeId });

    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ GET a specific item by ID
export const getItemById = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ CREATE a new item
export const createItem = async (req: Request, res: Response) => {
  const { itemName, price, description } = req.body;
  const { storeId } = req.params;

  try {
    const newItem = await Item.create({
      itemName,
      price,
      description,
      store: storeId,
    });

    const storeRef = (await Store.findById(storeId)) as IStore;
    if (storeRef) {
      storeRef.items.push(newItem._id);
      await storeRef.save();
    }

    res.json(newItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ UPDATE an existing item by ID
export const updateItemById = async (req: Request, res: Response) => {
  const { itemName, price, description, image } = req.body;

  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    item.itemName = itemName || item.itemName;
    item.price = price || item.price;
    item.description = description || item.description;

    if (image) {
      item.image = image;
    }

    await item.save();

    res.json({ msg: "Item updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ DELETE an item by ID
export const deleteItemById = async (req: Request, res: Response) => {
  try {
    const { storeId, itemId } = req.params;

    await Item.findByIdAndDelete(itemId);

    const storeRef = (await Store.findById(storeId)) as IStore;
    if (storeRef) {
      storeRef.items = storeRef.items.filter((id) => id.toString() !== itemId);
      await storeRef.save();
    }

    res.json({ msg: "Item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ DELETE all items for a specific store
export const deleteAllItems = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    await Item.deleteMany({ store: storeId });

    const storeRef = (await Store.findById(storeId)) as IStore;
    if (storeRef) {
      storeRef.items = [];
      await storeRef.save();
    }

    res.json({ msg: "All items removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
