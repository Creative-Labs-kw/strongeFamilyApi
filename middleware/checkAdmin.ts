import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user.isAdmin) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  next();
};
// For Future
