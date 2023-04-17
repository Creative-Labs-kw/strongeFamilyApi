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

const storeRouter = Router();

storeRouter.get("/", getAllStores);
storeRouter.post("/:id", authMiddleware, createStore);
storeRouter.get("/:id", getStoreById);
storeRouter.put("/:id", authMiddleware, updateStoreById);
storeRouter.delete("/:id", deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
