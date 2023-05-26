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
storeRouter.get("/:familyId", getFamilyStores);
storeRouter.post("/:userId", authMiddleware, createStore);
storeRouter.get("/:storeId", getStoreById);
storeRouter.put("/:storeId/:userId", updateStoreById);
storeRouter.delete("/:storeId", deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
