import { Request, Response } from "express";
import admin from "firebase-admin";
import { IIUser } from "./userController";

const db = admin.firestore();

interface IFamily {
  familyName: string;
  familyMembers: string[]; // Assuming it contains user IDs as strings
  numberOfMembers: number;
  passwordText: string;
  notifications: string[]; // Assuming it contains notification IDs as strings
  familyInfo: string;
  isAdmin: boolean;
}

//$ Get/Fetch all families
export const getAllFamilies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const snapshot = await db.collection("families").get();
    const families: IFamily[] = [];

    snapshot.forEach((doc) => {
      const family = doc.data() as IFamily;
      families.push(family);
    });

    res.json(families);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get/Fetch all family Members:
export const getAllFamilyMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { familyId } = req.params;

  try {
    const familyDoc = await db.collection("families").doc(familyId).get();

    if (!familyDoc.exists) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    const familyData = familyDoc.data();
    const familyMembers = familyData.familyMembers;

    // Fetch the user documents or user details based on the familyMembers array
    const usersSnapshot = await db
      .collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", familyMembers)
      .get();

    const members: any[] = [];
    usersSnapshot.forEach((doc) => {
      const member = doc.data();
      members.push(member);
    });

    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Get family by ID
export const getFamilyById = async (req: Request, res: Response) => {
  try {
    const familyId = req.params.familyId;
    const doc = await db.collection("families").doc(familyId).get();

    if (!doc.exists) {
      return res.status(404).json({ msg: "Family not found" });
    }

    const family = doc.data() as IFamily;
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

  try {
    const docRef = db.collection("families").doc();
    const family: IFamily = {
      familyName,
      familyInfo,
      passwordText,
      isAdmin,
      familyMembers: [], // Initialize an empty array for familyMembers
      numberOfMembers: 0, // Initialize numberOfMembers to 0
      notifications: [],
    };

    // Associate users with the family by adding their document references or IDs
    for (const memberId of familyMembers) {
      // Assuming memberId is the user ID or the reference to the user document
      family.familyMembers.push(memberId);
    }

    // Update the numberOfMembers field
    family.numberOfMembers = family.familyMembers.length;

    await docRef.set(family);

    res.json(family);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

//$ Update family by ID (FIX)
export const updateFamilyById = async (req: Request, res: Response) => {
  try {
    const familyId = req.params.familyId;
    const familyRef = db.collection("families").doc(familyId);

    const familySnapshot = await familyRef.get();
    if (!familySnapshot.exists) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    const familyData = familySnapshot.data();

    // Update family name
    if (req.body.familyName) {
      familyData.familyName = req.body.familyName;
    }
    // Update family info
    if (req.body.familyInfo) {
      familyData.familyInfo = req.body.familyInfo;
    }

    // Extract user IDs from familyMembers array and filter out undefined values
    const userIds = req.body.familyMembers
      .map((member: IIUser | string) =>
        typeof member === "string" ? member : member.uid
      )
      .filter((userId: string) => userId);

    // Add current user to family members if not already present
    const userId = req.user; // ERRO HERE
    if (!userIds.includes(userId)) {
      userIds.push(userId);
      familyData.numberOfMembers = userIds.length;
    }

    familyData.familyMembers = userIds;

    await familyRef.set(familyData);

    res.json(familyData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete a family by ID
export const deleteFamilyById = async (
  req: Request,
  res: Response<any, Record<string, any>>
): Promise<void> => {
  try {
    const familyId = req.params.familyId;
    const familyRef = db.collection("families").doc(familyId);

    const familySnapshot = await familyRef.get();
    if (!familySnapshot.exists) {
      res.status(404).json({ errors: [{ msg: "Family not found" }] });
      return;
    }

    await familyRef.delete();

    res.json({ msg: "Family deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//$ Delete all families
export const deleteAllFamilies = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("families").get();
    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({ msg: "All families deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
