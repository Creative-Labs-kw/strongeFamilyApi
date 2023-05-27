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
import { authMiddleware } from "../middleware/passport";
import {
  createFamilyPassword,
  deleteAllPasswords,
  deleteFamilyPasswordById,
  getFamilyPassword,
  updateFamilyPassword,
} from "../controllers/familyPasswordController";
authMiddleware;

const familyRouter = Router();

familyRouter.get("/", getAllFamilies);
familyRouter.get("/:familyId/members", getAllFamilyMembers);
familyRouter.post("/", createFamily);
familyRouter.get("/:familyId", getFamilyById);
familyRouter.put("/:familyId", authMiddleware, updateFamilyById);
familyRouter.delete("/:familyId", deleteFamilyById);
familyRouter.delete("/", deleteAllFamilies);
// * Password
// Create a new password for a specific family
familyRouter.post("/:familyId/password", createFamilyPassword);
// Get password by ID for a specific family
familyRouter.get("/:familyId/password", getFamilyPassword);
// Update password by ID for a specific family
familyRouter.put("/:familyId/password", updateFamilyPassword);
// Delete password by ID for a specific family
familyRouter.delete("/:familyId/password", deleteFamilyPasswordById);
// Delete all passwords for a specific family
familyRouter.delete("/:familyId/password", deleteAllPasswords);

export default familyRouter;
