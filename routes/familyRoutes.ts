import { Router } from "express";
import {
  getAllFamilies,
  createFamily,
  getFamilyById,
  updateFamilyById,
  deleteFamilyById,
} from "../controllers/familyController";
import authMiddleware from "../middleware/authMiddleware";

const familyRouter = Router();

familyRouter.get("/", getAllFamilies);
familyRouter.post("/", createFamily);
familyRouter.get("/:id", getFamilyById);
familyRouter.put("/:id", authMiddleware, updateFamilyById);
familyRouter.delete("/:id", deleteFamilyById);

export default familyRouter;
