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

const familyRouter = Router();

familyRouter.get("/", getAllFamilies);
familyRouter.get("/members", getAllFamilyMembers);
familyRouter.get("/:familyId", getFamilyById);
familyRouter.post("/", createFamily);
familyRouter.put("/:familyId", authMiddleware, updateFamilyById);
familyRouter.delete("/:familyId", deleteFamilyById);
familyRouter.delete("/", deleteAllFamilies);

// * Password
familyRouter.post("/createPassword", createFamilyPassword);
familyRouter.get("/:familyId/password", getFamilyPassword);
familyRouter.put(
  "/:familyId/updatePassword",
  authMiddleware,
  updateFamilyPassword
);
familyRouter.delete("/:familyId/deletePassword", deleteFamilyPasswordById);

export default familyRouter;
