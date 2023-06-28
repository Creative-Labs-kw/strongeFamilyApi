import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import admin from "./utils/firebase/firebaseConfig"; // Update the import path to your Firebase Admin initialization file
import familyRouter from "./routes/familyRoutes";
import storeRouter from "./routes/storesRoutes";
import userRouter from "./routes/userRoutes";
import itemsRouter from "./routes/itemsRoutes";
import notificationsRouter from "./routes/notificationsRoutes";

dotenv.config();
const isTestEnvironment = process.env.NODE_ENV === "test";
export const port = isTestEnvironment ? 3001 : 3000;

export const app = express();

//* Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp(); // Initialize the default app if it hasn't been initialized already
}

//*Auth

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//* Routers
app.use("/users", userRouter);
app.use("/families", familyRouter);
app.use("/stores", storeRouter);
app.use("/items", itemsRouter);
app.use("/notifications", notificationsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
