import { Router } from "express";
import {
  deleteAllUsers,
  deleteUserById,
  getAllUserFamilies,
  getAllUsers,
  getUserById,
  getUserStores,
  login,
  register,
  updateUserById,
  updateUserStoresById,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/passport";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:userId/families", getAllUserFamilies);
userRouter.get("/:userId", getUserById);
userRouter.get("/:userId/stores", getUserStores); //$ get all user stores
userRouter.post("/login", login); //$ SignIn
userRouter.post("/register", register); //$ SignUp
userRouter.put("/:userId", updateUserById);
userRouter.put(
  "/:userId/stores/:storeId",
  authMiddleware,
  updateUserStoresById
);
userRouter.delete("/:userId", deleteUserById);
userRouter.delete("/", deleteAllUsers);

export default userRouter;
