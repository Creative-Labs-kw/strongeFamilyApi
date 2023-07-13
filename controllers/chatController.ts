import admin from "../utils/firebase/firebaseConfig";

const db = admin.firestore();

// POST chats/send
export const sendChat = async (req, res) => {
  const { storeId, messageText, userId } = req.body;

  if (!storeId || !userId) {
    res.status(400).json({ error: "Invalid userId or storeId" });
    return;
  }

  try {
    const storeRef = db.collection("stores").doc(storeId);
    const storeDoc = await storeRef.get();

    if (!storeDoc.exists) {
      console.log("Store not found");
      res.status(404).json({ error: "Store not found" });
      return;
    }

    const chatId = storeRef.collection("chats").doc().id;

    const messagesRef = storeRef
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    await messagesRef.add({
      chatId,
      messageText,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Message sent successfully");

    res.status(200).json({ success: true, messageText, chatId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// GET chats/getAllChats
export const getAllChats = async (req, res) => {
  try {
    const storeSnapshot = await db.collection("stores").get();
    const allChats = [];

    for (const storeDoc of storeSnapshot.docs) {
      const chatSnapshot = await storeDoc.ref
        .collection("chats")
        .limit(1)
        .get();

      if (!chatSnapshot.empty) {
        const chatDoc = chatSnapshot.docs[0];
        const chatId = chatDoc.id;
        const messagesSnapshot = await chatDoc.ref.collection("messages").get();
        const messages = messagesSnapshot.docs.map((doc) => doc.data());

        allChats.push({
          storeId: storeDoc.id,
          chatId,
          messages,
        });
      }
    }

    console.log("Retrieved all chats:", allChats);

    res.status(200).json(allChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve all chats" });
  }
};

// GET chats/:storeId/getChatById
export const getChatById = async (req, res) => {
  const { storeId, chatId } = req.body;
  console.log("Requested storeId:", storeId);
  console.log("Requested chatId:", chatId);

  if (!storeId || !chatId) {
    res.status(400).json({ error: "Invalid storeId or chatId" });
    return;
  }

  try {
    const chatDocRef = db
      .collection("stores")
      .doc(storeId)
      .collection("chats")
      .doc(chatId);
    const chatDoc = await chatDocRef.get();

    if (!chatDoc.exists) {
      console.log("Chat not found");
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const messagesSnapshot = await chatDocRef.collection("messages").get();
    const messages = messagesSnapshot.docs.map((doc) => doc.data());
    console.log("Retrieved messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve messages for the chat" });
  }
};
