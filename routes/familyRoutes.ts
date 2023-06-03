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
  deleteFamilyPasswordById,
  getFamilyPassword,
  updateFamilyPassword,
} from "../controllers/familyPasswordController";
authMiddleware;
// Create a new router to handle family routes
const familyRouter = Router();
// Get all families
familyRouter.get("/", getAllFamilies);
// Get all family members
familyRouter.get("/members", getAllFamilyMembers);
// Get family by ID
familyRouter.get("/:familyId", getFamilyById);
// Create a new family
familyRouter.post("/", createFamily);
// Update family by ID
familyRouter.put("/:familyId", authMiddleware, updateFamilyById);
// Delete family by ID
familyRouter.delete("/:familyId", deleteFamilyById);
// Delete all families
familyRouter.delete("/", deleteAllFamilies);
// * Password
// Create a new password for a specific family
familyRouter.post("/createPassword", createFamilyPassword);
// Get password by ID for a specific family
familyRouter.get("/:familyId/password", getFamilyPassword);
// Update password by ID for a specific family
familyRouter.put(
  "/:familyId/updatePassword",
  authMiddleware,
  updateFamilyPassword
);
// Delete password by ID for a specific family
familyRouter.delete("/:familyId/deletePassword", deleteFamilyPasswordById);

export default familyRouter;
