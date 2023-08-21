import { Router } from "express";
import {
  getAllChats,
  sendChat,
  getChatMessages,
  deleteAllChats,
  createChat,
} from "../controllers/chatController";

const chatRouter = Router();

chatRouter.get("/getAllChats", getAllChats);
// chatRouter.get("/getChatById/:userId/:chatId", getChatById);
chatRouter.get("/getChatMessages/:userId/:chatId", getChatMessages);
chatRouter.post("/send/:userId", sendChat);
chatRouter.post("/createChat/:userId", createChat);
chatRouter.delete("/deleteAllChats/:userId", deleteAllChats);

export default chatRouter;
