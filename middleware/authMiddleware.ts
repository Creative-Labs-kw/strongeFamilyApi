import { Request, Response, NextFunction } from "express";
import passport from "./passportConfig";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log("Middleware error:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      console.log("Middleware: No user found");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default authMiddleware;
