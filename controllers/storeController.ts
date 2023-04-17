import logger from "../utils/logger";
import { Document } from "mongoose";
import Store, { IStore } from "../models/Store";
import { Request, Response } from "express";
import { IUser } from "../models/User";
interface UserDocument extends Document, IUser {}

interface UserRequest extends Request {
  user?: UserDocument;
}

interface StoreDocument extends Document<IStore> {
  remove(): Promise<StoreDocument>;
}

//$ Get updateStoreById
export const updateStoreById = async (req: UserRequest, res: Response) => {
  try {
    // Find store by id and populate the owner field
    let store = await Store.findById(req.params.id).populate("owner");

    logger.StoreLogger.error(
      `Store with id ${req.params.id} found: ${JSON.stringify(store)}`
    );

    if (!store) {
      logger.StoreLogger.error(`Store with id ${req.params.id} not found`);
      res.status(404).json({ errors: [{ msg: "Store not found" }] });
      return;
    }

    // Check if the current user owns the store
    if (store.owner && store.owner.toString() !== req.user?.id) {
      logger.StoreLogger.error(`User not authorized to update store`);
      res.status(401).json({ errors: [{ msg: "User not authorized" }] });
      return;
    }

    // Update store name
    if (req.body.storeName) {
      store.storeName = req.body.storeName;
    }

    // Save updated store to database
    await store.save();

    // Return updated store object
    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all Store
export const getAllStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stores = await Store.find().populate("owner");
    res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Create a new store
export const createStore = async (req: UserRequest, res: Response) => {
  const { storeName } = req.body;

  try {
    // Check if store already exists
    let store = await Store.findOne({ storeName });
    if (store) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Store already exists" }] });
    }

    // Create new store
    store = new Store({
      storeName,
      owner: req.user?.id, // set the owner field to the current user's ID
    });

    // Save store to database
    await store.save();

    // Return store object
    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get store by ID
export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id).populate("owner");
    console.log(store);

    if (!store) {
      return res.status(404).json({ msg: "store not found" });
    }
    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete a store
export const deleteStoreById = async (req: Request, res: Response) => {
  try {
    // Find store by id
    let store: StoreDocument | null = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ errors: [{ msg: "store not found" }] });
    }

    // Delete store from database
    await store.remove();

    // Return success message
    res.json({ msg: "store deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all Store
export const deleteAllStores = async (req: Request, res: Response) => {
  try {
    // Delete all Store from database
    await Store.deleteMany();

    // Return success message
    res.json({ msg: "All Store deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
