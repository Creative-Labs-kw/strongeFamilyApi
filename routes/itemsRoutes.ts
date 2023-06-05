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

itemsRouter.get("/:storeId", getAllItems);
itemsRouter.get("/:storeId/:itemId", getItemById);
itemsRouter.post("/:storeId/createItems", createItem);
itemsRouter.put("/:storeId/:itemId", updateItemById);
itemsRouter.delete("/:storeId/:itemId", deleteItemById);
itemsRouter.delete("/:storeId", deleteAllItems);

export default itemsRouter;
