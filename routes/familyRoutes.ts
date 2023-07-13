import { Router } from "express";
import {
  getAllFamilies,
  createFamily,
  getFamilyById,
  updateFamilyById,
  deleteFamilyById,
  deleteAllFamilies,
  getAllFamilyMembers,
} from "../controllers/familyController";
import {
  createFamilyPassword,
  deleteFamilyPasswordById,
  getFamilyPassword,
  updateFamilyPassword,
} from "../controllers/familyPasswordController";

const familyRouter = Router();

familyRouter.get("/getAllFamilies", getAllFamilies);
familyRouter.get("/getAllFamilyMembers", getAllFamilyMembers);
familyRouter.get("/getFamilyById", getFamilyById);
familyRouter.post("/createFamily", createFamily);
familyRouter.put("/updateFamilyById", updateFamilyById);
familyRouter.delete("/deleteFamilyById", deleteFamilyById);
familyRouter.delete("/deleteAllFamilies", deleteAllFamilies);

// * Password
familyRouter.post("/createPassword", createFamilyPassword);
familyRouter.get("/getFamilyPassword", getFamilyPassword);
familyRouter.put("/updateFamilyPassword", updateFamilyPassword);
familyRouter.delete("/deleteFamilyPasswordById", deleteFamilyPasswordById);

export default familyRouter;
