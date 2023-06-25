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

const router = Router();

router.get("/", getAllUsers);
router.get("/stores/:userId", getUserStores);
router.get("/families/:userId", getAllUserFamilies);
router.get("/:userId", getUserById);
router.put("/stores/:storeId", updateUserStoreById);
router.put("/:userId", updateUserById);
router.post("/register", register);
router.post("/login", login);
router.delete("/:userId", deleteUserById);
router.delete("", deleteAllUsers);

export default router;
