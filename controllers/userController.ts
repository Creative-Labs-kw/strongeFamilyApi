import { Request, Response } from "express";
import { validationResult } from "express-validator";
//* Auth:
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
//* Data:
import logger from "../utils/logger";
import { User, IUser } from "../models/User";
import { Document } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import Store from "../models/Store";
import Family from "../models/Family";
interface IUserPayload {
  user?: {
    id: string;
  };
}
export interface IRequest extends Request {
  user?: IUser;
}
interface UserDocument extends Document<IUser> {
  remove(): Promise<UserDocument>;
  stores: string[]; // add stores property here
}

//* Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().populate("stores");
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//* Get Store By Owner:
export const getStoresByOwnerId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const stores = await Store.find({ owner: userId });
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};
//* Get user stores:
export const getUserStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const stores = await Store.find({ owner: userId });
    res.status(200).json(stores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

//* Get user families:
export const getAllUserFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const Families = await Family.find({ familyMembers: userId });
    res.json(Families);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//* Update an user Stores
export const updateUserStoresById = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  const { storeId } = req.params;

  try {
    // Find user by id
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    // Make sure stores field is an array
    if (!Array.isArray(user.stores)) {
      user.stores = [];
    }

    // Update stores array with new store ID
    user.stores.push(storeId);

    // Save updated user to database
    await user.save();

    // Return updated user object
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
    return;
  }
};

//* Update an existing user
export const updateUserById = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  const { name, email, isAdmin } = req.body;

  try {
    // Find user by id
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    // Update user fields if they are provided in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    // Save updated user to database
    await user.save();

    // Return updated user object
    res.json(user);
  } catch (err) {
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

//* Handle user registration
export const register = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user: IUser | null = await User.findOne({ email });
    if (user) {
      res.status(400).json({ errors: [{ msg: "User already exists" }] });
      return;
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT token
    const payload: IUserPayload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, config.jwt.secret!, {
      expiresIn: config.jwt.expiration,
    });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//* Handle user login
export const login = async (req: Request, res: Response) => {
  // Log the request
  logger.UserLogger.info(`Login request: ${JSON.stringify(req.body)}`);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Log the error
      logger.UserLogger.error(`Invalid credentials: email ${email}`);
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log the error
      logger.UserLogger.error(`Invalid credentials: email ${email}`);
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiration },
      (err: Error | null, token?: string) => {
        if (err) {
          // Log the error
          logger.UserLogger.error(`JWT sign error: ${err.message}`);
          throw err;
        }
        // Log the successful login
        logger.UserLogger.info(`User ${email} successfully logged in`);
        res.json({ token, userId: user.id });
      }
    );
  } catch (err) {
    // Log the error
    logger.UserLogger.error(`Server error: ${err.message}`);
    res.status(500).send("Server error");
  }
};

//* Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//* Delete a user
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    // Find user by id
    let user: UserDocument | null = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }

    // Delete user from database
    await user.remove();

    // Return success message
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
//* Delete all users:
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    // Delete all users from database
    await User.deleteMany({});
    res.json({ msg: "All users deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
