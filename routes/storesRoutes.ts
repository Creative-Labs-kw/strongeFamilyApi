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
storeRouter.post("/:id", createStore);
storeRouter.get("/:id", getStoreById);
storeRouter.get("/owner/:id", getStoresByOwnerId);
storeRouter.put("/:id", authMiddleware, updateStoreById);
storeRouter.delete("/:id", deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
