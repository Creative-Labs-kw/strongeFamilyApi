import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import Family, { IFamily } from "../models/Family";
import { User } from "../models/User";
import logger from "../utils/logger";
import { IUser } from "../models/User";

interface FamilyDocument extends Document<IFamily> {
  remove(): Promise<FamilyDocument>;
}

//$ Get/Fetch all families
export const getAllFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const families = await Family.find()
      .populate("familyMembers")
      .populate("notifications");

    res.json(families);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all family Members:
export const getAllFamilyMembers = async (res: Response): Promise<void> => {
  try {
    const members = await User.find({}).populate("families");

    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get family by ID
export const getFamilyById = async (req: Request, res: Response) => {
  try {
    const family = await Family.findById(req.params.familyId);

    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }
    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Create a new family
export const createFamily = async (req: Request, res: Response) => {
  const { familyName, familyInfo, passwordText, isAdmin, familyMembers } =
    req.body;

  console.log("req.body", req.body);

  try {
    // Check if family already exists
    let family = await Family.findOne({ familyName });
    if (family) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Family already exists" }] });
    }

    family = new Family({
      familyName,
      familyInfo,
      passwordText,
      isAdmin,
      familyMembers,
      numberOfMembers: familyMembers.length,
    });

    // Save family to the database
    await family.save();
    console.log("family", family);

    // Return family object
    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get updateFamilyById
export const updateFamilyById = async (req, res) => {
  try {
    // Check whether user object is defined
    if (!req.user) {
      throw new Error("User object is undefined");
    }

    // Find family by id
    let family = await Family.findById(req.params.familyId)
      .populate("familyMembers")
      .populate("notifications");

    logger.FamilyLogger.info(
      `Family with id ${req.params.familyId} found: ${JSON.stringify(family)}`
    );

    if (!family) {
      logger.FamilyLogger.error(
        `Family with id ${req.params.familyId} not found`
      );
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    // Update family name
    if (req.body.familyName) {
      family.familyName = req.body.familyName;
    }
    // Update family info
    if (req.body.familyInfo) {
      family.familyInfo = req.body.familyInfo;
    }

    // Add current user to family members
    const userId = req.user._id;

    const isMemberExists = family.familyMembers.some(
      (member) => member._id.toString() === userId.toString()
    );

    if (!isMemberExists) {
      // Assuming familyMembers is an array of ObjectId references to users
      family.familyMembers.push(userId);
    }

    // Update the numberOfMembers field based on the updated family members
    family.numberOfMembers = family.familyMembers.length;

    // Save updated family to database
    await family.save();

    logger.FamilyLogger.info(
      `Family with id ${req.params.familyId} successfully updated`
    );

    // Return updated family object
    res.json(family);
  } catch (err) {
    logger.FamilyLogger.error(
      `Error updating family with id ${req.params.familyId}: ${err.message}`
    );
    res.status(500).send("Server error");
  }
};

//$ Delete a family
export const deleteFamilyById = async (req: Request, res: Response) => {
  try {
    // Find family by id
    let family: FamilyDocument | null = await Family.findById(
      req.params.familyId
    );
    if (!family) {
      return res.status(404).json({ errors: [{ msg: "Family not found" }] });
    }

    // Delete family from database
    await family.remove();

    // Return success message
    res.json({ msg: "Family deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all families
export const deleteAllFamilies = async (req: Request, res: Response) => {
  try {
    // Delete all families from database
    await Family.deleteMany();

    // Return success message
    res.json({ msg: "All families deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
