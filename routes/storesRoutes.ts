import { Router } from "express";
import {
  getAllStores,
  createStore,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  deleteAllStores,
} from "../controllers/storeController";
import { authMiddleware } from "../middleware/passport";
import { getStoresByOwnerId } from "../controllers/userController";

const storeRouter = Router();

storeRouter.get("/", getAllStores);
storeRouter.post("/:userId", authMiddleware, createStore);
storeRouter.get("/:storeId", getStoreById);
storeRouter.get("/owner/:storeId", getStoresByOwnerId);
storeRouter.put("/:id", updateStoreById);
storeRouter.delete("/:storeId", deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
