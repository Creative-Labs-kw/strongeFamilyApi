import { Request, Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";

// POST chats/send
export const sendChat = async (req, res) => {
  const { content } = req.body; // Change from messageText to content
  const { userId, receiverId } = req.params;

  if (!userId || !receiverId) {
    res.status(400).json({ error: "Invalid userId or receiverId" });
    return;
  }

  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      res.status(400).json({ error: "Sender or receiver not found" });
      return;
    }

    let chat = await Chat.findOne({
      members: { $all: [userId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({ members: [userId, receiverId] });
    }

    const messageData = {
      sender: userId,
      content: content, // Use the content property
    };

    const message = await Message.create(messageData);
    // chat.messages.push(message); // ERROR
    await chat.save();

    console.log("Message sent successfully");
    console.log(chat._id + ":", messageData);

    res.status(200).json({ success: true, content, chatId: chat._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// GET chats/getAllChats
export const getAllChats = async (req, res) => {
  try {
    const users = await User.find();
    const allChats = {};

    for (const user of users) {
      const userId = user._id;
      const chats = await Chat.find({ members: userId }).populate("messages");

      if (chats.length > 0) {
        allChats[userId] = chats;
      }
    }

    console.log("Retrieved all chats:", allChats);

    res.status(200).json(allChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve all chats" });
  }
};

// GET chats/:userId/getChatMessages
export const getChatMessages = async (req: Request, res: Response) => {
  const { userId, chatId } = req.params;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      members: userId,
    }).populate("messages");

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const messages = chat.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve messages for the chat" });
  }
};

// DELETE chats/deleteAllChats
export const deleteAllChats = async (req, res) => {
  const { userId } = req.params;

  try {
    await Chat.deleteMany({ members: userId });

    console.log("All chats deleted successfully");

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete all chats" });
  }
};

// This will be used when the user clicks on the contact button in UI
export const createChat = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  try {
    const chat = await Chat.create({ members: [userId] });

    res.status(200).json({ success: true, chatId: chat._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};
