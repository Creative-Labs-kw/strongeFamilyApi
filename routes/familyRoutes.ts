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

familyRouter.get("/", getAllFamilies);
familyRouter.get("/members/:familyId", getAllFamilyMembers);
familyRouter.get("/:familyId", getFamilyById);
familyRouter.post("/", createFamily);
familyRouter.put("/:familyId", updateFamilyById);
familyRouter.delete("/:familyId", deleteFamilyById);
familyRouter.delete("/", deleteAllFamilies);

// * Password
familyRouter.post("/createPassword", createFamilyPassword);
familyRouter.get("/:familyId/password", getFamilyPassword);
familyRouter.put("/:familyId/updatePassword", updateFamilyPassword);
familyRouter.delete("/:familyId/deletePassword", deleteFamilyPasswordById);

export default familyRouter;
