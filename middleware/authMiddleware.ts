import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
