import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import familyRouter from "./routes/familyRoutes";
import storeRouter from "./routes/storesRoutes";
import userRouter from "./routes/userRoutes";
import itemsRouter from "./routes/itemsRoutes";
import notificationsRouter from "./routes/notificationsRoutes";
import cartRouter from "./routes/cartRoutes";
import chatRouter from "./routes/chatRoutes";
import connectToDatabase from "./utils/mongoose"; // Import your Mongoose connection function
import dotenv from "dotenv";

dotenv.config();
const isTestEnvironment = process.env.NODE_ENV === "test";
export const port = isTestEnvironment ? 3001 : 3000;

export const app = express();

// Connect to MongoDB
connectToDatabase();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//* Routers
app.use("/users", userRouter);
app.use("/families", familyRouter);
app.use("/stores", storeRouter);
app.use("/items", itemsRouter);
app.use("/notifications", notificationsRouter);
app.use("/chats", chatRouter);
app.use("/carts", cartRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
