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
import authMiddleware from "../middleware/authMiddleware";

const storeRouter = Router();

//? TO Apply authMiddleware to all routes defined below
storeRouter.use(authMiddleware);

//? GET's(READ)
storeRouter.get("/:userId", getAllStores);
storeRouter.get("/getFamilyStores/:familyId", getFamilyStores);
storeRouter.get("/getStoreById/:storeId", getStoreById);
//? POST(CREATE)
storeRouter.post("/createStore/:userId", createStore);
//? PUT(UPDATE)
storeRouter.put("/updateStoreById/:storeId/:userId", updateStoreById);
//? DELETE
storeRouter.delete("/deleteStoreById/:storeId", deleteStoreById);
storeRouter.delete("/deleteAllStores", deleteAllStores);

export default storeRouter;
