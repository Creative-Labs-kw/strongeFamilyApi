import { Router } from "express";
import {
  createItem,
  deleteAllItems,
  deleteItemById,
  getAllItems,
  getItemById,
  updateItemById,
} from "../controllers/itemController";

const itemsRouter = Router();

itemsRouter.get("/getAllItems/:storeId", getAllItems);
itemsRouter.get("/getItemById", getItemById);
itemsRouter.post("/createItem", createItem);
itemsRouter.put("/updateItemById", updateItemById);
itemsRouter.delete("/deleteItemById", deleteItemById);
itemsRouter.delete("/deleteAllItems", deleteAllItems);

export default itemsRouter;
