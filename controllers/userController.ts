import { Request, Response } from "express";
import User from "../models/User";
import Family from "../models/Family";
import Store from "../models/Store";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { getToken } from "../utils/getToken"; // Import the getToken function
import { ObjectId } from "mongodb";

dotenv.config();

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get all stores owned by a user
export const getUserStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("stores");
    const userToken = await getToken(userId);

    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    res.json({ stores: user.stores, token: userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Get the family that the user belongs to
export const getAllUserFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const families = await Family.find({ familyMembers: userId });
    const userToken = await getToken(userId);

    res.json({ families, token: userToken });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// getUserByToken
export const getUserByToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ errors: [{ msg: "No token provided" }] });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(new ObjectId(decoded.userId));

    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error in getUserByToken:", err);

    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ errors: [{ msg: "Invalid token" }] });
    } else {
      res.status(500).send("Server error");
    }
  }
};

// Get chat IDs for a user
export const getUserChatIds = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("chats", "_id");
    const userToken = await getToken(userId);

    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    const chatIds: string[] = user.chats.map((chat) => chat._id.toString());
    res.json({ chatIds, token: userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ msg: "User already exists" });
      return;
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create and send JWT token using environment variables
    // Using email as the payload for this example
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.json({ token }); // Only sending the token back
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Log in a user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    const jwtExpirationInSeconds = parseInt(process.env.JWT_EXPIRATION, 10);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: jwtExpirationInSeconds,
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Update a store owned by a user
export const updateUserStoreById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { storeId, ...updateData } = req.body;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      res.status(404).json({ errors: [{ msg: "Store not found" }] });
      return;
    }

    Object.assign(store, updateData);
    await store.save();

    res.json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Update a user by id
export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, isAdmin, imageUrl, userId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      name,
      email,
      isAdmin,
      imageUrl,
    });

    res.json({ msg: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Delete a user by ID
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    await User.findByIdAndDelete(userId);

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

// Delete all users
export const deleteAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await User.deleteMany();
    res.json({ msg: "All users deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};
