import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import config from "./config";
import passport from "passport";
import mongoose from "mongoose";
import familyRouter from "./routes/familyRoutes";
import storeRouter from "./routes/storesRoutes";
import userRouter from "./routes/userRoutes";
import itemsRouter from "./routes/itemsRoutes";

dotenv.config();
const isTestEnvironment = process.env.NODE_ENV === "test";
export const port = isTestEnvironment ? 3001 : 3000;
const url = config.database?.url ?? `http://localhost:${port}`;

export const app = express();
//*Auth
app.use(passport.initialize());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//*Routers
app.use("/users", userRouter);
app.use("/families", familyRouter);
app.use("/stores", storeRouter);
app.use("/items", itemsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
});
