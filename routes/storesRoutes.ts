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
storeRouter.get("/getFamilyStores/:familyId", getFamilyStores);
storeRouter.get("/getStoreById/:storeId", getStoreById);
storeRouter.post("createStore", createStore);
storeRouter.put("/updateStoreById", updateStoreById);
storeRouter.delete("/deleteStoreById", deleteStoreById);
storeRouter.delete("/deleteAllStores", deleteAllStores);

export default storeRouter;
