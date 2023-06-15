import { Router } from "express";
import {
  createItem,
  deleteAllItems,
  deleteItemById,
  getAllItems,
  getItemById,
  updateItemById,
} from "../controllers/itemController";
import { authMiddleware } from "../middleware/passport";

const itemsRouter = Router();

itemsRouter.get("/:storeId", getAllItems);
itemsRouter.get("/:storeId/:itemId", getItemById);
itemsRouter.post("/:storeId/createItems", authMiddleware, createItem);
itemsRouter.put("/:storeId/:itemId", authMiddleware, updateItemById);
itemsRouter.delete("/:storeId/:itemId", authMiddleware, deleteItemById);
itemsRouter.delete("/:storeId", deleteAllItems);

export default itemsRouter;
