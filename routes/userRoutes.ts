import { Router } from "express";
import {
  getAllUsers,
  getUserStores,
  getAllUserFamilies,
  updateUserStoreById,
  updateUserById,
  register,
  login,
  deleteUserById,
  deleteAllUsers,
  getUserChatIds,
  getUserByToken,
} from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const userRouter = Router();

// GET's(READ)
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUserStores/:userId", authMiddleware, getUserStores);
userRouter.get(
  "/getAllUserFamilies/:userId",
  authMiddleware,
  getAllUserFamilies
);
userRouter.get("/getUserByToken", authMiddleware, getUserByToken);
userRouter.get("/getUserChatIds/:userId", authMiddleware, getUserChatIds);

// POST(CREATE)
userRouter.post("/register", register);
userRouter.post("/login", login);

// PUT(UPDATE)
userRouter.put("/updateUserStoreById", authMiddleware, updateUserStoreById);
userRouter.put("/updateUserById", authMiddleware, updateUserById);

// DELETE
userRouter.delete("/deleteUserById", authMiddleware, deleteUserById);
userRouter.delete("/deleteAllUsers", authMiddleware, deleteAllUsers);

export default userRouter;
