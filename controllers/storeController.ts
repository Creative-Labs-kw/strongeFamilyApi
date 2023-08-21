import { Request, Response } from "express";
import Store from "../models/Store";
import Family from "../models/Family";
import User from "../models/User";

//$ Get/Fetch all Store
export const getAllStores = async (req: Request, res: Response) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all Family Store
export const getFamilyStores = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;

    const familyData = await Family.findById(familyId);

    if (!familyData) {
      return res.status(404).json({ msg: "Family not found" });
    }

    const ownerIds = familyData.familyMembers || [];

    const stores = await Store.find({ owner: { $in: ownerIds } });

    res.json(stores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get store by ID
export const getStoreById = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ msg: "Store not found" });
    }

    res.json(store);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Create a new store
export const createStore = async (req: Request, res: Response) => {
  const { storeName, address, phoneNumber, description } = req.body;
  const { userId } = req.params;

  try {
    const existingStore = await Store.findOne({ storeName });

    if (existingStore) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Store already exists" }] });
    }

    const newStore = new Store({
      storeName,
      owner: userId,
      address,
      phoneNumber,
      description,
    });

    await newStore.save();

    // Add store ID to user's stores array
    const user = await User.findById(userId);
    user.stores.push(newStore._id);
    await user.save();

    res.status(201).json({ id: newStore._id, ...newStore.toObject() });
  } catch (err) {
    console.error(err.message);
    console.log("Error creating store:", err);
    res.status(500).send("Server error");
  }
};

//$ Update a store by ID
export const updateStoreById = async (req: Request, res: Response) => {
  const {
    storeName,
    description,
    phoneNumber,
    imageUrl,
    instagramLink,
    snapChatLink,
    webLink,
  } = req.body;
  const { storeId, userId } = req.params;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ msg: "Store not found" });
    }

    if (store.owner !== userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    store.storeName = storeName || store.storeName;
    store.description = description || store.description;
    store.phoneNumber = phoneNumber || store.phoneNumber;
    store.imageUrl = imageUrl || store.imageUrl;
    store.instagramLink = instagramLink || store.instagramLink;
    store.snapChatLink = snapChatLink || store.snapChatLink;
    store.webLink = webLink || store.webLink;

    await store.save();

    res.json({ msg: "Store updated successfully" });
  } catch (error) {
    console.log("Error while updating Store:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

//$ Delete a store by ID
export const deleteStoreById = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  try {
    const result = await Store.deleteOne({ _id: storeId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ errors: [{ msg: "Store not found" }] });
    }

    res.json({ msg: "Store deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all Stores
export const deleteAllStores = async (req: Request, res: Response) => {
  try {
    await Store.deleteMany();

    res.json({ msg: "All stores deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
