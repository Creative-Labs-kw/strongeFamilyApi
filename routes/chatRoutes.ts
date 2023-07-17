import { Router } from "express";
import {
  getChatById,
  getAllChats,
  sendChat,
  getChatMessages,
  deleteAllChats,
  createChat,
} from "../controllers/chatController";

const chatRouter = Router();

chatRouter.post("/send/:userId", sendChat);
chatRouter.post("/createChat/:userId", createChat);
chatRouter.get("/getChatById/:userId/:chatId", getChatById);
chatRouter.get("/getAllChats", getAllChats);
chatRouter.get("/getChatMessages/:chatId/:userId", getChatMessages);
chatRouter.delete("/deleteAllChats/:userId", deleteAllChats);

export default chatRouter;
