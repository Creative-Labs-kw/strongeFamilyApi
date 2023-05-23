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
authMiddleware;

const familyRouter = Router();

familyRouter.get("/", getAllFamilies);
familyRouter.get("/:familyId/members", getAllFamilyMembers);
familyRouter.post("/", createFamily);
familyRouter.get("/:familyId", getFamilyById);
familyRouter.put("/:familyId", authMiddleware, updateFamilyById);
familyRouter.delete("/:familyId", deleteFamilyById);
familyRouter.delete("/", deleteAllFamilies);

export default familyRouter;
