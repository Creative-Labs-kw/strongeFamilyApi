import { Router } from "express";
import {
  getAllStores,
  createStore,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  deleteAllStores,
} from "../controllers/storeController";

const storeRouter = Router();

storeRouter.get("/", getAllStores);
storeRouter.post("/", createStore);
storeRouter.get("/:id", getStoreById);
storeRouter.put("/:id", updateStoreById);
storeRouter.delete("/:id", deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
