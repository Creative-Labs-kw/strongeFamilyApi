import { Request, Response } from "express";
import admin from "firebase-admin";

const db = admin.firestore();

//$ Create a family password
export const createFamilyPassword = async (req: Request, res: Response) => {
  const { familyId, passwordText } = req.body;

  try {
    const familyRef = db.collection("families").doc(familyId);
    const familyDoc = await familyRef.get();

    if (!familyDoc.exists) {
      return res.status(404).json({ msg: "Family not found" });
    }

    //? Update family password
    await familyRef.update({
      passwordText: passwordText,
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
    const { familyId } = req.body;

    const familyRef = db.collection("families").doc(familyId);
    const familyDoc = await familyRef.get();

    if (!familyDoc.exists) {
      return res.status(404).json({ msg: "Family not found" });
    }

    const passwordText = familyDoc.data()?.passwordText;

    res.json({ passwordText });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Update family password by ID
export const updateFamilyPassword = async (req: Request, res: Response) => {
  const { familyId, passwordText } = req.body;

  try {
    const familyRef = db.collection("families").doc(familyId);
    const familyDoc = await familyRef.get();

    if (!familyDoc.exists) {
      return res.status(404).json({ msg: "Family not found" });
    }

    //$ Update family password
    await familyRef.update({
      passwordText: passwordText,
    });

    res.json({ msg: "Family passwordText updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete family password by ID
export const deleteFamilyPasswordById = async (req: Request, res: Response) => {
  try {
    const { familyId } = req.body;

    const familyRef = db.collection("families").doc(familyId);
    const familyDoc = await familyRef.get();

    if (!familyDoc.exists) {
      return res.status(404).json({ msg: "Family not found" });
    }

    //$ Delete family password
    await familyRef.update({
      passwordText: admin.firestore.FieldValue.delete(),
    });

    res.json({ msg: "Family passwordText deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
