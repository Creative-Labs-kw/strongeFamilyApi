import { Request, Response } from "express";
import Notification, { INotification } from "../models/notification";
import Family, { IFamily } from "../models/Family";

// Get all notifications
export const getAllNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notifications: INotification[] = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific notification by ID
export const getNotificationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;
  try {
    const notification: INotification | null = await Notification.findById(
      notificationId
    );
    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new notification within a family
export const createNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { familyId } = req.params;
  const { title, content } = req.body;
  try {
    const newNotification: INotification = new Notification({
      title,
      content,
    });

    // Save the new notification
    const savedNotification: INotification = await newNotification.save();

    // Find the family by ID
    const family: IFamily | null = await Family.findById(familyId);
    if (!family) {
      res.status(404).json({ error: "Family not found" });
      return;
    }

    // Add the new notification to the family's notifications array
    family.notifications.push(savedNotification._id);

    // Save the updated family
    await family.save();

    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a notification within a family
export const updateNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { familyId, notificationId } = req.params;
  const { title, content } = req.body;
  try {
    // Find the family by ID
    const family: IFamily | null = await Family.findById(familyId);
    if (!family) {
      res.status(404).json({ error: "Family not found" });
      return;
    }

    // Find the notification by ID
    const notification: INotification | null =
      await Notification.findByIdAndUpdate(
        notificationId,
        {
          title,
          content,
        },
        { new: true }
      );
    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a notification
export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;
  try {
    const deletedNotification: INotification | null =
      await Notification.findByIdAndRemove(notificationId);
    if (!deletedNotification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    res.json(deletedNotification);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAllNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Notification.deleteMany();
    res.json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};
