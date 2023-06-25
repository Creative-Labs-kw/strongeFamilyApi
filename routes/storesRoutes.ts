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

const storeRouter = Router();

storeRouter.get("/", getAllStores);
storeRouter.get("/:familyId/getFamilyStores", getFamilyStores);
storeRouter.get("/:storeId/getStoreById", getStoreById);
storeRouter.post("/:userId", createStore);
storeRouter.put("/:storeId/:userId", updateStoreById);
storeRouter.delete("/:storeId", deleteStoreById);
storeRouter.delete("/", deleteAllStores);

export default storeRouter;
