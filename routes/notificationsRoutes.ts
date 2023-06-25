import express from "express";
import {
  sendNotificationToDevice,
  sendNotificationToTopic,
} from "../controllers/notificationController";

const router = express.Router();

// Route for sending a notification to a specific device
router.post("/notification/device", sendNotificationToDevice);

// Route for sending a notification to a specific topic
router.post("/notification/topic", sendNotificationToTopic);

export default router;
