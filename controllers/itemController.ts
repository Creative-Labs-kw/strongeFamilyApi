import { Request, Response } from "express";
import * as admin from "firebase-admin";

export interface IItem {
  itemName: string;
  price: number;
  image?: string;
  description: string;
  store: string; // reference to the Store ID
}

//$ GET all items for a specific store
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const snapshot = await admin
      .firestore()
      .collection("items")
      .where("store", "==", storeId)
      .get();

    const items: IItem[] = [];
    snapshot.forEach((doc) => {
      items.push({
        itemName: doc.data().itemName,
        price: doc.data().price,
        image: doc.data().image,
        description: doc.data().description,
        store: doc.data().store,
      });
    });

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
    const doc = await admin.firestore().collection("items").doc(itemId).get();

    if (!doc.exists) {
      return res.status(404).json({ msg: "Item not found" });
    }

    const item: IItem = {
      itemName: doc.data().itemName,
      price: doc.data().price,
      image: doc.data().image,
      description: doc.data().description,
      store: doc.data().store,
    };

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
    const newItem: IItem = {
      itemName,
      price,
      description,
      store: storeId,
    };

    const docRef = await admin.firestore().collection("items").add(newItem);

    newItem.store = storeId; // Assign the store ID instead of the Store model

    const storeRef = await admin.firestore().collection("stores").doc(storeId);
    await storeRef.update({
      items: admin.firestore.FieldValue.arrayUnion(docRef.id),
    });

    res.json({ id: docRef.id, ...newItem });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ UPDATE an existing item by ID
export const updateItemById = async (req: Request, res: Response) => {
  const { itemName, price, description, image } = req.body;

  try {
    const itemId = req.params.itemId;
    const storeId = req.params.storeId;

    const itemRef = admin.firestore().collection("items").doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({ msg: "Item not found" });
    }

    const updatedItem: Partial<IItem> = {
      itemName: itemName || itemDoc.data()?.itemName,
      price: price || itemDoc.data()?.price,
      description: description || itemDoc.data()?.description,
      store: storeId,
    };

    if (image) {
      updatedItem.image = image;
    }

    //? Remove undefined properties from updatedItem
    Object.keys(updatedItem).forEach((key) => {
      if (updatedItem[key] === undefined) {
        delete updatedItem[key];
      }
    });

    await itemRef.update(updatedItem);

    res.json({ msg: "Item updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ DELETE an item by ID
export const deleteItemById = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const storeId = req.params.storeId;

    await admin.firestore().collection("items").doc(itemId).delete();

    const storeRef = admin.firestore().collection("stores").doc(storeId);
    await storeRef.update({
      items: admin.firestore.FieldValue.arrayRemove(itemId),
    });

    res.json({ msg: "Item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//$ DELETE all items for a specific store
export const deleteAllItems = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;

    const snapshot = await admin
      .firestore()
      .collection("items")
      .where("store", "==", storeId)
      .get();

    const batch = admin.firestore().batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    const storeRef = admin.firestore().collection("stores").doc(storeId);
    await storeRef.update({ items: [] });

    res.json({ msg: "All items removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
