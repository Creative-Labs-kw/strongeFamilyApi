// userController.ts
import { Request, Response } from "express";
import admin from "firebase-admin";
import { validationResult } from "express-validator";
import { log } from "console";

export interface User {
  userId: string;
  uid: string;
  name?: string;
  email: string;
  password: string;
  imageUrl?: string;
  stores: string[];
  isAdmin?: boolean;
}

//$ Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usersSnapshot = await admin.firestore().collection("users").get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//$ Get all stores owned by a user
export const getUserStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const storesSnapshot = await admin
      .firestore()
      .collection("stores")
      .where("owner", "==", userId)
      .get();

    const stores = [];
    storesSnapshot.forEach((doc) => {
      const storeData = {
        storeId: doc.id,
        ...doc.data(),
      };
      stores.push(storeData);
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

//$ Get the family that the user belongs to
export const getAllUserFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const familiesSnapshot = await admin
      .firestore()
      .collection("families")
      .where("familyMembers", "array-contains", userId)
      .get();
    const families: any[] = [];
    familiesSnapshot.forEach((doc) => {
      families.push(doc.data());
    });
    res.json(families);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
// $ Get a user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userRef = admin.firestore().collection("users").doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    const userData = userDoc.data();

    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Update a store owned by a user
export const updateUserStoreById = async (
  req,
  res: Response
): Promise<void> => {
  const { storeId } = req.params;
  const {
    storeName,
    address,
    phoneNumber,
    imageUrl,
    description,
    instagramLink,
    snapChatLink,
    webLink,
  } = req.body;

  try {
    const storeRef = admin.firestore().collection("stores").doc(storeId);
    const storeDoc = await storeRef.get();

    if (!storeDoc.exists) {
      res.status(404).json({ errors: [{ msg: "Store not found" }] });
      return;
    }

    await storeRef.update({
      storeName: storeName || storeDoc.data().storeName,
      address: address || storeDoc.data().address,
      phoneNumber: phoneNumber || storeDoc.data().phoneNumber,
      imageUrl: imageUrl || storeDoc.data().imageUrl,
      description: description || storeDoc.data().description,
      instagramLink: instagramLink || storeDoc.data().instagramLink,
      snapChatLink: snapChatLink || storeDoc.data().snapChatLink,
      webLink: webLink || storeDoc.data().webLink,
    });

    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

//$ Update a user by id
export const updateUserById = async (req: Request, res: Response) => {
  const { name, email, isAdmin, imageUrl } = req.body;
  const userId = req.params.userId;

  try {
    await admin.auth().updateUser(userId, {
      displayName: name,
      email: email,
      photoURL: imageUrl,
    });

    const userRef = admin.firestore().collection("users").doc(userId);

    await userRef.update({ isAdmin: isAdmin });

    res.json({ msg: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// $ Register / SignUp  a user
export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  try {
    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!userSnapshot.empty) {
      res.status(400).json({ errors: [{ msg: "User already exists" }] });
      return;
    }

    const userRecord = await admin.auth().createUser({
      displayName: name,
      email: email,
      password: password,
    });

    const { uid } = userRecord;

    const newUser = {
      id: uid,
      name,
      email,
    };

    await admin.firestore().collection("users").doc(uid).set(newUser);

    const token = await admin.auth().createCustomToken(uid);

    res.json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// $ Login / SignIn a user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    // Compare the provided password with the user's stored password hash
    // You can use a library like bcrypt or argon2 for password hashing and comparison
    // If the password is valid, generate a token or session to authenticate the user

    // Example token generation using Firebase Admin SDK
    const token = await admin.auth().createCustomToken(userRecord.uid);
    const userId = userRecord.uid;

    res.json({ token, userId });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

//$ Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userRef = admin.firestore().collection("users").doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    await userRef.delete();

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all users
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore().collection("users").get();
    const batch = admin.firestore().batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({ msg: "All users deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
