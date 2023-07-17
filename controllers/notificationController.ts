import { Request, Response } from "express";
import admin from "firebase-admin";

// Send a notification to a specific device
export const sendNotificationToDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { deviceId, title, body, data } = req.body;

  try {
    // Create the notification payload
    const message: admin.messaging.Message = {
      token: deviceId,
      notification: {
        title,
        body,
      },
      data,
    };

    // Send the notification
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send notification" });
  }
};

// Send a notification to a specific topic
export const sendNotificationToTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { topic, title, body, data } = req.body;

  try {
    // Create the notification payload
    const message: admin.messaging.Message = {
      topic,
      notification: {
        title,
        body,
      },
      data,
    };

    // Send the notification
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send notification" });
  }
};
