import { Request, Response } from "express";
import Family, { IFamily } from "../models/Family";
import { Document } from "mongoose";

interface FamilyDocument extends Document<IFamily> {
  remove(): Promise<FamilyDocument>;
}

//* Get/Fetch all families
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

//* Create a new family
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

//* Get family by ID
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

export const updateFamilyById = async (req: Request, res: Response) => {
  const { familyName, familyMember } = req.body;

  try {
    // Find family by id
    let family = await Family.findById(req.params.id);
    if (!family) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    // Update family fields
    family.familyName = familyName;
    family.familyMember = familyMember;

    // Save updated family to database
    await family.save();
    // Populate the familyMember field and log the updated family object
    family = await Family.findById(req.params.id).populate("familyMember");
    console.log(family);

    // Return updated family object
    res.json(family);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//* Delete a family
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
