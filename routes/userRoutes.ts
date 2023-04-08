import express from "express";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

// Route to get all users
userRouter.get("/", userController.getAllUsers);

// Route to get a single user by id
userRouter.get("/:id", userController.getUserById);

// Route to create a new user with encryption password
userRouter.post("/", userController.register);

// Route to createUser without encryption password
userRouter.post("/", userController.createUser);

// Login
userRouter.post("/login", userController.login);

// Route to update an existing user by id
userRouter.put("/:id", userController.updateUserById);

// Route to delete a user by id
userRouter.delete("/:id", userController.deleteUserById);

// Delete all users:
userRouter.delete("/", userController.deleteAllUsers);
export default userRouter;
