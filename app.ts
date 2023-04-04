import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import config from "./config";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";

dotenv.config();

const url = config.database?.url ?? `http://localhost:${config.server.port}`;

export const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mount the user router at /users
app.use("/users", userRouter);

app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}`);
  // ? Connect MongoDB with Mongoose:
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB!");
      // perform any actions that need to be done after the connection is established
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
});
