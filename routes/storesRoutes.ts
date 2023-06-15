import { Router } from "express";
import {
  getAllStores,
  createStore,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  deleteAllStores,
  getFamilyStores,
} from "../controllers/storeController";
import { authMiddleware } from "../middleware/passport";

const storeRouter = Router();

storeRouter.get("/", getAllStores);
storeRouter.get("/:familyId/getFamilyStores", getFamilyStores);
storeRouter.get("/:storeId/getStoreById", getStoreById);
storeRouter.post("/:userId", authMiddleware, createStore);
storeRouter.put("/:storeId/:userId", authMiddleware, updateStoreById);
storeRouter.delete("/:storeId", authMiddleware, deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
