import { Request, Response } from "express";
import Family from "../models/Family";

//$ Create a family password
export const createFamilyPassword = async (req: Request, res: Response) => {
  const { familyId, passwordText } = req.body;

  try {
    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    // Create family password
    family.passwordText = passwordText;
    console.log(family);

    // Save updated family to database
    await family.save();

    res.json({ msg: "Family password created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get family password by ID
export const getFamilyPassword = async (req: Request, res: Response) => {
  try {
    const familyId = req.params.familyId;

    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    const passwordText = family.passwordText; // Retrieve the password from the family document

    res.json({ passwordText });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Update family password by ID
export const updateFamilyPassword = async (req: Request, res: Response) => {
  const { passwordText } = req.body;

  try {
    const family = await Family.findById(req.params.familyId);

    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    // Update family password
    family.passwordText = passwordText;
    console.log(family);

    // Save updated family to database
    await family.save();

    res.json({ msg: "Family passwordText updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete family password by ID
export const deleteFamilyPasswordById = async (req: Request, res: Response) => {
  try {
    const family = await Family.findById(req.params.familyId);

    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    // Delete family password
    family.passwordText = "";

    // Save updated family to database
    await family.save();

    res.json({ msg: "Family passwordText deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
