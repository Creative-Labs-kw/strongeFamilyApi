import { Router } from "express";
import {
  getAllFamilies,
  createFamily,
  getFamilyById,
  updateFamilyById,
  deleteFamilyById,
} from "../controllers/familyController";

const familyRouter = Router();

familyRouter.get("/", getAllFamilies);
familyRouter.post("/", createFamily);
familyRouter.get("/:id", getFamilyById);
familyRouter.put("/:id", updateFamilyById);
familyRouter.delete("/:id", deleteFamilyById);

export default familyRouter;
