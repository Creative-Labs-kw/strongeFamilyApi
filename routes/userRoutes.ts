import { Router } from "express";
import {
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  login,
  register,
  updateUserById,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/passport";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.put("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.delete("/", deleteAllUsers);

export default userRouter;
