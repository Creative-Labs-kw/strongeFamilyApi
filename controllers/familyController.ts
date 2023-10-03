import { Request, Response } from "express";
import Family from "../models/Family";

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

//$ Get family by ID
export const getFamilyById = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all family [Members]:
export const getAllFamilyMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { familyId } = req.params;

  try {
    const family = await Family.findById(familyId).populate("familyMembers");
    if (!family) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    res.json(family.familyMembers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Create a new family
export const createFamily = async (req: Request, res: Response) => {
  const secretKey = process.env.JWT_SECRET;
  const { familyName, passwordText, extraInfo, isAdmin, familyMembers } =
    req.body;

  // Assuming creatorUserId is sent in the request body
  const creatorUserId = req.body.creatorUserId;

  try {
    const updatedFamilyMembers = [...familyMembers, creatorUserId];

    const family = await Family.create({
      familyName,
      extraInfo,
      passwordText,
      isAdmin,
      familyMembers: updatedFamilyMembers,
      numberOfMembers: updatedFamilyMembers.length,
      notifications: [],
    });

    res.json({ family });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

//$ Update family by ID
export const updateFamilyById = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findById(familyId);

    if (!family) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    // Update family name
    if (req.body.familyName) {
      family.familyName = req.body.familyName;
    }
    // Update family info
    if (req.body.familyInfo) {
      family.extraInfo = req.body.familyInfo;
    }

    // Add new user IDs to existing family members
    const userIdsToAdd = req.body.familyMembers
      .filter((member: any) => member && member !== "") // Filter out empty and undefined values
      .map((userId: string) => userId)
      .filter((userId: string) => !family.familyMembers.includes(userId)); // Filter out already existing user IDs

    family.familyMembers.push(...userIdsToAdd);
    family.numberOfMembers = family.familyMembers.length;

    await family.save();

    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete a family by ID
export const deleteFamilyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { familyId } = req.body;
    const family = await Family.findById(familyId);

    if (!family) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    await family.deleteOne({ familyId });

    res.json({ msg: "Family deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all families
export const deleteAllFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Family.deleteMany({});
    res.json({ msg: "All families deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
