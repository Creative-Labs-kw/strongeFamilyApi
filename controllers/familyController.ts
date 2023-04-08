import { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import Family, { IFamily } from "../models/Family";
import { User } from "../models/User";
import logger from "../utils/logger";

interface FamilyDocument extends Document<IFamily> {
  remove(): Promise<FamilyDocument>;
}
//$ Get Family By Id
export const updateFamilyById = async (
  req: Request & { user: { id: string } },
  res: Response
) => {
  try {
    // Find family by id
    let family = await Family.findById(req.params.id);

    logger.FamilyLogger.error(
      `Family with id ${req.params.id} found: ${JSON.stringify(family)}`
    );

    if (!family) {
      logger.FamilyLogger.error(`Family with id ${req.params.id} not found`);
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }
    //$ Update family name
    if (req.body.familyName) {
      family.familyName = req.body.familyName;
    }
    //$ Update familyMember:
    if (req.body.familyMember) {
      family.familyMember = req.body.familyMember;
    }

    // Add current user to family
    const userId = req.user.id;
    if (
      userId &&
      !family.familyMember.includes(new mongoose.Types.ObjectId(userId))
    ) {
      family.familyMember.push(new mongoose.Types.ObjectId(userId));
    }

    // Filter out invalid user IDs and undefined values
    const validUserIds = family.familyMember
      .filter((id) => id !== undefined && mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // Fetch user objects for the given user IDs
    const users = await User.find({ _id: { $in: validUserIds } });

    // Update family members with the user objects
    family.familyMember = users.map((user) => user._id);

    // Save updated family to database
    await family.save();
    logger.FamilyLogger.info(
      `Family with id ${req.params.id} successfully updated`
    );

    // Return updated family object
    res.json(family);
  } catch (err) {
    logger.FamilyLogger.error(
      `Error updating family with id ${req.params.id}: ${err.message}`
    );
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all families
export const getAllFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const families = await Family.find();
    res.json(families);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Create a new family
export const createFamily = async (req: Request, res: Response) => {
  const { familyName } = req.body;

  try {
    // Check if family already exists
    let family = await Family.findOne({ familyName });
    if (family) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Family already exists" }] });
    }

    // Create new family
    family = new Family({
      familyName,
    });

    // Save family to database
    await family.save();

    // Return family object
    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get family by ID
export const getFamilyById = async (req: Request, res: Response) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }
    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete a family
export const deleteFamilyById = async (req: Request, res: Response) => {
  try {
    // Find family by id
    let family: FamilyDocument | null = await Family.findById(req.params.id);
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
