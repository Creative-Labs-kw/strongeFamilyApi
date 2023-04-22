import { Router } from "express";
import {
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  login,
  register,
  updateUserById,
  updateUserStoresById,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/passport";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/login", login); //$ SignIn
userRouter.post("/register", register); //$ SignUp
userRouter.put("/:id", updateUserById);
userRouter.put("/:id/stores/:storeId", updateUserStoresById);
userRouter.delete("/:id", deleteUserById);
userRouter.delete("/", deleteAllUsers);

export default userRouter;
