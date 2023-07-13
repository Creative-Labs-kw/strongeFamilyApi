import { Router } from "express";
import {
  getChatById,
  getAllChats,
  sendChat,
} from "../controllers/chatController";

const chatRouter = Router();

chatRouter.post("/send", sendChat);
chatRouter.get("/getChatById", getChatById);
chatRouter.get("/getAllChats", getAllChats);

export default chatRouter;
