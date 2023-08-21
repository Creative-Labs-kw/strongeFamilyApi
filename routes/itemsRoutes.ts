import { Router } from "express";
import {
  createItem,
  deleteAllItems,
  deleteItemById,
  getAllItems,
  getItemById,
  updateItemById,
} from "../controllers/itemController";
import authMiddleware from "../middleware/authMiddleware";

const itemsRouter = Router();

//? TO Apply authMiddleware to all routes defined below
itemsRouter.use(authMiddleware);

//? GET's(READ)
itemsRouter.get("/getAllItems/:storeId", getAllItems);
itemsRouter.get("/getItemById/:itemId", getItemById);
//? POST(CREATE)
itemsRouter.post("/createItem/:storeId", createItem);
//? PUT(UPDATE)
itemsRouter.put("/updateItemById/:itemId", updateItemById);
//? DELETE
itemsRouter.delete("/deleteItemById/:storeId/:itemId", deleteItemById);
itemsRouter.delete("/deleteAllItems/:storeId", deleteAllItems);

export default itemsRouter;
