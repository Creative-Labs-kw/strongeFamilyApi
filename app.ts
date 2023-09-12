import express from "express";
import passport from "passport";
import userRouter from "./routes/userRoutes";
import familyRouter from "./routes/familyRoutes";
import storeRouter from "./routes/storesRoutes";
import itemsRouter from "./routes/itemsRoutes";
import notificationsRouter from "./routes/notificationsRoutes";
import cartRouter from "./routes/cartRoutes";
import chatRouter from "./routes/chatRoutes";
import connectToDatabase from "./utils/mongoose";
import dotenv from "dotenv";

dotenv.config();
const isTestEnvironment = process.env.NODE_ENV === "test";
export const port = isTestEnvironment ? 3001 : 3000;

const cors = require("cors");
export const app = express();
app.use(cors());

connectToDatabase();

app.use(passport.initialize()); // Initialize Passport

app.use(express.json());

app.use("/users", userRouter); // Apply userRouter with authMiddleware
app.use("/families", familyRouter);
app.use("/stores", storeRouter);
app.use("/items", itemsRouter);
app.use("/notifications", notificationsRouter);
app.use("/chats", chatRouter);
app.use("/carts", cartRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
