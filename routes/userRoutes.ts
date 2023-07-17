// userRoutes.ts
import { Router } from "express";
import {
  getAllUsers,
  getUserStores,
  getAllUserFamilies,
  updateUserStoreById,
  updateUserById,
  register,
  login,
  getUserById,
  deleteUserById,
  deleteAllUsers,
  getUserChatIds,
} from "../controllers/userController";

const UserRouter = Router();

UserRouter.get("/getAllUsers", getAllUsers);
UserRouter.get("/getUserStores/:userId", getUserStores); //stores
UserRouter.get("/getAllUserFamilies/:userId", getAllUserFamilies); //families
UserRouter.get("/getUserById/:userId", getUserById);
UserRouter.get("/getUserChatIds/:userId", getUserChatIds); //chats
UserRouter.put("/updateUserStoreById", updateUserStoreById);
UserRouter.put("/updateUserById", updateUserById);
UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.delete("/deleteUserById", deleteUserById);
UserRouter.delete("/deleteAllUsers", deleteAllUsers);

export default UserRouter;
