import { Document } from "mongoose";
import Store, { IStore } from "../models/Store";
import { Request, Response } from "express";
import { User } from "../models/User";
import Family from "../models/Family";
import mongoose from "mongoose";

interface UserDocument extends Document {
  // Properties from IUser interface
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  stores: string[];

  // Additional properties specific to UserDocument if any
}
interface UserRequest extends Request {
  user?: UserDocument;
}

interface StoreDocument extends Document<IStore> {
  remove(): Promise<StoreDocument>;
}

//$ Get updateStoreById
export const updateStoreById = async (req: Request, res: Response) => {
  const { storeName, description, phoneNumber } = req.body;
  try {
    const store = await Store.findOne({
      _id: req.params.storeId,
      owner: new mongoose.Types.ObjectId(req.params.userId),
    });

    if (!store) {
      return res.status(404).json({ msg: "Store not found" });
    }

    store.storeName = storeName || store.storeName;
    store.description = description || store.description;
    store.phoneNumber = phoneNumber || store.phoneNumber;

    await store.save();

    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ Get/Fetch all Store
export const getAllStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stores = await Store.find().populate("owner").populate("items");
    res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all Family Store //fix
export const getFamilyStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId } = req.params;

    // Assuming you have a "familyId" field in the Family schema
    const family = await Family.findById(familyId);

    // Get the user IDs in the family
    const userIds = family.familyMembers.map((member) => member._id);

    // Assuming you have a "userId" field in the User schema
    const stores = await Store.find({ "owner.userId": { $in: userIds } })
      .populate("owner")
      .populate("items");

    res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Create a new store
export const createStore = async (req: UserRequest, res: Response) => {
  const { storeName, address, phoneNumber, description } = req.body;

  try {
    // Check if store already exists
    let store = await Store.findOne({ storeName });
    if (store) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Store already exists" }] });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ errors: [{ msg: "User not authenticated" }] });
    }

    // Create new store
    store = new Store({
      storeName,
      owner: req.body.owner || req.user.id, // set the owner field to the current user's ID if not provided in the
      address,
      phoneNumber,
      description,
    });

    // Save store to database
    await store.save();

    // Add store ID to user's stores array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { stores: store._id } },
      { new: true }
    );
    // Return store object
    res.status(201).json(store);
  } catch (err) {
    console.error(err.message);
    console.log("Error creating store:", err);
    res.status(500).send("Server error");
  }
};

//$ Get store by ID
export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate("owner")
      .populate("items");
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
