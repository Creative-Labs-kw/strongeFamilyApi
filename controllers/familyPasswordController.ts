import { Request, Response } from "express";
import FamilyPassword from "../models/FamilyPassword";

//$ Create a family password
export const createFamilyPassword = async (req: Request, res: Response) => {
  const { passwordText } = req.body;
  const { familyId } = req.params;

  try {
    const familyPassword = await FamilyPassword.create({
      familyId,
      passwordText,
    });

    res.json({ msg: "Family password created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get family password by ID
export const getFamilyPassword = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;

    const familyPassword = await FamilyPassword.findOne({ familyId });
    if (!familyPassword) {
      return res.status(404).json({ msg: "Family password not found" });
    }

    res.json({ passwordText: familyPassword.passwordText });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Update family password by ID
export const updateFamilyPassword = async (req: Request, res: Response) => {
  const { passwordText } = req.body;
  const { familyId } = req.params;

  try {
    const familyPassword = await FamilyPassword.findOne({ familyId });
    if (!familyPassword) {
      return res.status(404).json({ msg: "Family password not found" });
    }

    familyPassword.passwordText = passwordText;
    await familyPassword.save();

    res.json({ msg: "Family password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete family password by ID
export const deleteFamilyPasswordById = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;

    const familyPassword = await FamilyPassword.findOne({ familyId });
    if (!familyPassword) {
      return res.status(404).json({ msg: "Family password not found" });
    }

    await FamilyPassword.deleteOne({ familyId });

    res.json({ msg: "Family password deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
