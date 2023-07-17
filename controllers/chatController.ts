import admin from "../utils/firebase/firebaseConfig";
import { Request, Response } from "express";

const db = admin.firestore();

// POST chats/send

export const sendChat = async (req, res) => {
  const { messageText } = req.body;
  const { userId, receiverId } = req.params;

  if (!userId || !receiverId) {
    res.status(400).json({ error: "Invalid userId or receiverId" });
    return;
  }

  try {
    const senderRef = db.collection("users").doc(userId);
    const receiverRef = db.collection("users").doc(receiverId);

    // Check if the chat between the sender and receiver already exists
    const chatSnapshot = await senderRef
      .collection("chats")
      .where("members", "array-contains", receiverId)
      .limit(1)
      .get();

    let chatId;
    let chatRef;

    if (chatSnapshot.empty) {
      // Create a new chat
      const newChatRef = senderRef.collection("chats").doc();
      chatId = newChatRef.id;
      chatRef = newChatRef;

      // Add the chat to both sender and receiver
      const batch = db.batch();
      batch.set(newChatRef, {
        members: [userId, receiverId],
      });
      await batch.commit();
    } else {
      // Retrieve the existing chat
      chatId = chatSnapshot.docs[0].id;
      chatRef = chatSnapshot.docs[0].ref;
    }

    // Add the message to the chat
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const messageData = {
      senderId: userId,
      text: messageText,
      timestamp: timestamp,
    };

    await chatRef.collection("messages").add(messageData);

    console.log("Message sent successfully");
    console.log(chatId + ":", messageData);

    res.status(200).json({ success: true, messageText, chatId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// GET chats/getAllChats
export const getAllChats = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const allChats = {};

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const chatsSnapshot = await userDoc.ref.collection("chats").get();

      for (const chatDoc of chatsSnapshot.docs) {
        const chatId = chatDoc.id;
        const messagesSnapshot = await chatDoc.ref
          .collection("messages")
          .orderBy("timestamp")
          .get();

        const messages = messagesSnapshot.docs.map((messageDoc) =>
          messageDoc.data()
        );

        if (!allChats[userId]) {
          allChats[userId] = {};
        }

        if (!allChats[userId][chatId]) {
          allChats[userId][chatId] = [];
        }

        allChats[userId][chatId].push(...messages);
      }
    }

    console.log("Retrieved all chats:", allChats);

    res.status(200).json(allChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve all chats" });
  }
};

// GET chats/:userId/getChatById
export const getChatById = async (req, res) => {
  const { userId, chatId } = req.params;

  console.log("Requested chatId:", chatId);

  if (!userId || !chatId) {
    res.status(400).json({ error: "Invalid userId or chatId" });
    return;
  }

  try {
    const chatRef = db
      .collection("users")
      .doc(userId)
      .collection("chats")
      .doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      console.log("Chat not found");
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const messagesSnapshot = await chatRef
      .collection("messages")
      .orderBy("timestamp")
      .get();

    const messages = messagesSnapshot.docs.map((messageDoc) =>
      messageDoc.data()
    );

    console.log("Retrieved messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve messages for the chat" });
  }
};

// GET chats/:userId/:chatId/getChatMessages
export const getChatMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, chatId } = req.params;

  try {
    const chatRef = db
      .collection("users")
      .doc(userId)
      .collection("chats")
      .doc(chatId);
    const messagesSnapshot = await chatRef
      .collection("messages")
      .orderBy("timestamp")
      .get();

    const messages = messagesSnapshot.docs.map((messageDoc) =>
      messageDoc.data()
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

//$ Delete all chats:
// DELETE chats/deleteAllChats
export const deleteAllChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const userRef = db.collection("users").doc(userId);
    const chatsSnapshot = await userRef.collection("chats").get();

    await deleteChatsRecursive(userRef, chatsSnapshot.docs);

    console.log("All chats deleted successfully");

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete all chats" });
  }
};

const deleteChatsRecursive = async (userRef, chatDocs) => {
  if (chatDocs.length === 0) {
    return;
  }

  const chatDoc = chatDocs[0];
  const chatId = chatDoc.id;
  const messagesCollectionRef = chatDoc.ref.collection("messages");

  const messagesSnapshot = await messagesCollectionRef.get();

  const batch = db.batch();

  messagesSnapshot.forEach((messageDoc) => {
    batch.delete(messageDoc.ref);
  });

  batch.delete(chatDoc.ref);

  await batch.commit();

  const remainingChatDocs = chatDocs.slice(1);

  await deleteChatsRecursive(userRef, remainingChatDocs);
};

// This will be used when the user click on the contact button in UI
export const createChat = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const chatRef = userRef.collection("chats").doc();
    const chatId = chatRef.id;

    await chatRef.set({ chatId });

    res.status(200).json({ success: true, chatId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};
