import express from "express";
import {
  getCartItems,
  addToCart,
  removeFromCart,
} from "../controllers/cartController";
import authMiddleware from "../middleware/authMiddleware";

const cartRouter = express.Router();
//? TO Apply authMiddleware to all routes defined below
cartRouter.use(authMiddleware);

//? GET's(READ)
cartRouter.get("/:userId", getCartItems);
//? POST(CREATE)
cartRouter.post("/addItem/:userId", addToCart);
//? PUT(UPDATE)
cartRouter.put("/updateCart/:userId", addToCart);
//? DELETE
cartRouter.delete("/removeItem/:userId/:itemId", removeFromCart);

export default cartRouter;
