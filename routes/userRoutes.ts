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
import authMiddleware from "../middleware/authMiddleware";

const UserRouter = Router();

//? TO Apply authMiddleware to all routes defined below
// UserRouter.use(authMiddleware);

//? GET's(READ)
UserRouter.get("/getAllUsers", authMiddleware, getAllUsers);
UserRouter.get("/getUserStores/:userId", getUserStores);
UserRouter.get("/getAllUserFamilies/:userId", getAllUserFamilies);
UserRouter.get("/getUserById/:userId", getUserById);
UserRouter.get("/getUserChatIds/:userId", getUserChatIds);
//? POST(CREATE)
UserRouter.post("/register", register);
UserRouter.post("/login", authMiddleware, login);
//? PUT(UPDATE)
UserRouter.put("/updateUserStoreById", authMiddleware, updateUserStoreById);
UserRouter.put("/updateUserById", authMiddleware, updateUserById);
//? DELETE
UserRouter.delete("/deleteUserById", authMiddleware, deleteUserById);
UserRouter.delete("/deleteAllUsers", deleteAllUsers);

export default UserRouter;
