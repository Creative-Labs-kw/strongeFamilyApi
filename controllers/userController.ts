import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User";
import config from "../config";
import logger from "../utils/logger";
import { Document } from "mongoose";

interface IUserPayload {
  user: {
    id: string;
  };
}
interface UserDocument extends Document<IUser> {
  remove(): Promise<UserDocument>;
}
//* Handle user registration / create user
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

    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Handle user login

export const login = async (req: Request, res: Response): Promise<void> => {
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
      res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      return;
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log the error
      logger.UserLogger.error(`Invalid credentials: email ${email}`);
      res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      return;
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
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
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

    // Return user object
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Update an existing user
exports.updateUserById = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
      return;
    }

    // Update user fields
    user.name = name;
    user.email = email;

    // Save updated user to database
    await user.save();

    // Return updated user object
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Delete a user
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    // Find user by id
    let user: UserDocument | null = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }

    // Delete user from database
    await user.remove();

    // Return success message
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
// Delete all users:
export const deleteAllUsers = async (_req: Request, res: Response) => {
  try {
    // Delete all users from database
    await User.deleteMany({});
    res.json({ msg: "All users deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export function updateUserById(arg0: string, updateUserById: any) {
  throw new Error("Function not implemented.");
}
