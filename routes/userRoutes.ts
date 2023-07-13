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
} from "../controllers/userController";

const UserRouter = Router();

UserRouter.get("/getAllUsers", getAllUsers);
UserRouter.get("/getUserStores/:userId", getUserStores);
UserRouter.get("/getAllUserFamilies/:userId", getAllUserFamilies);
UserRouter.get("/getUserById/:userId", getUserById);
UserRouter.put("/updateUserStoreById", updateUserStoreById);
UserRouter.put("/updateUserById", updateUserById);
UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.delete("/deleteUserById", deleteUserById);
UserRouter.delete("/deleteAllUsers", deleteAllUsers);

export default UserRouter;
