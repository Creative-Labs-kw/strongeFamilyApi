import { Router } from "express";
import {
  createNotification,
  deleteAllNotifications,
  deleteNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
} from "../controllers/notificationController";

const notificationsRouter = Router();

notificationsRouter.get("/", getAllNotifications);
notificationsRouter.get("/:notificationId", getNotificationById);
notificationsRouter.post("/:familyId", createNotification);
notificationsRouter.put("/:familyId/:notificationId", updateNotification);
notificationsRouter.delete("/:notificationId", deleteNotification);
notificationsRouter.delete("/", deleteAllNotifications);

export default notificationsRouter;
