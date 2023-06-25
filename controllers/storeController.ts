import { Request, Response } from "express";
import admin from "firebase-admin";

export interface Store {
  uid: string;
  storeName: string;
  owner: string;
  description: string;
  phoneNumber: string;
  imageUrl: string;
  instagramLink: string;
  snapChatLink: string;
  webLink: string;
}

//$ Get/Fetch all Store
export const getAllStores = async (req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore().collection("stores").get();
    const stores: Store[] = [];

    snapshot.forEach((doc) => {
      const store: Store = {
        uid: doc.id,
        storeName: doc.data().storeName,
        owner: doc.data().owner,
        description: doc.data().description,
        phoneNumber: doc.data().phoneNumber,
        imageUrl: doc.data().imageUrl,
        instagramLink: doc.data().instagramLink,
        snapChatLink: doc.data().snapChatLink,
        webLink: doc.data().webLink,
      };
      stores.push(store);
    });

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

    const familyDoc = await admin
      .firestore()
      .collection("families")
      .doc(familyId)
      .get();
    if (!familyDoc.exists) {
      return res.status(404).json({ msg: "Family not found" });
    }

    const familyData = familyDoc.data();
    const ownerIds: string[] = familyData?.familyMembers || [];

    const snapshot = await admin
      .firestore()
      .collection("stores")
      .where("owner", "in", ownerIds)
      .get();

    const stores: Store[] = [];

    snapshot.forEach((doc) => {
      const store: Store = {
        uid: doc.id,
        storeName: doc.data().storeName,
        owner: doc.data().owner,
        description: doc.data().description,
        phoneNumber: doc.data().phoneNumber,
        imageUrl: doc.data().imageUrl,
        instagramLink: doc.data().instagramLink,
        snapChatLink: doc.data().snapChatLink,
        webLink: doc.data().webLink,
      };
      stores.push(store);
    });

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
    const storeDoc = await admin
      .firestore()
      .collection("stores")
      .doc(storeId)
      .get();

    if (!storeDoc.exists) {
      return res.status(404).json({ msg: "Store not found" });
    }

    const store: Store = {
      uid: storeDoc.id,
      storeName: storeDoc.data()?.storeName,
      owner: storeDoc.data()?.owner,
      description: storeDoc.data()?.description,
      phoneNumber: storeDoc.data()?.phoneNumber,
      imageUrl: storeDoc.data()?.imageUrl,
      instagramLink: storeDoc.data()?.instagramLink,
      snapChatLink: storeDoc.data()?.snapChatLink,
      webLink: storeDoc.data()?.webLink,
    };

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
    // Check if store already exists
    const snapshot = await admin
      .firestore()
      .collection("stores")
      .where("storeName", "==", storeName)
      .get();

    if (!snapshot.empty) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Store already exists" }] });
    }

    // Create new store
    const newStore = {
      storeName,
      owner: userId,
      address,
      phoneNumber,
      description,
    };

    const storeRef = await admin.firestore().collection("stores").add(newStore);

    // Add store ID to user's stores array
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ stores: admin.firestore.FieldValue.arrayUnion(storeRef.id) });

    res.status(201).json({ id: storeRef.id, ...newStore });
  } catch (err) {
    console.error(err.message);
    console.log("Error creating store:", err);
    res.status(500).send("Server error");
  }
};

//$ Get updateStoreById
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

  try {
    const storeId = req.params.storeId;
    const userId = req.params.userId;

    const storeRef = admin.firestore().collection("stores").doc(storeId);
    const storeDoc = await storeRef.get();

    if (!storeDoc.exists) {
      return res.status(404).json({ msg: "Store not found" });
    }

    // Ensure that the authenticated user is the owner of the store
    if (storeDoc.data()?.owner !== userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await storeRef.update({
      storeName: storeName || storeDoc.data()?.storeName,
      description: description || storeDoc.data()?.description,
      phoneNumber: phoneNumber || storeDoc.data()?.phoneNumber,
      imageUrl: imageUrl || storeDoc.data()?.imageUrl,
      instagramLink: instagramLink || storeDoc.data()?.instagramLink,
      snapChatLink: snapChatLink || storeDoc.data()?.snapChatLink,
      webLink: webLink || storeDoc.data()?.webLink,
    });

    res.json({ msg: "Store updated successfully" });
  } catch (error) {
    console.log("Error while updating Store:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

//$ Delete a store
export const deleteStoreById = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  try {
    const storeRef = admin.firestore().collection("stores").doc(storeId);
    const storeDoc = await storeRef.get();

    if (!storeDoc.exists) {
      return res.status(404).json({ errors: [{ msg: "Store not found" }] });
    }

    await storeRef.delete();

    res.json({ msg: "Store deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all Stores
export const deleteAllStores = async (req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore().collection("stores").get();

    const batch = admin.firestore().batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({ msg: "All stores deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
