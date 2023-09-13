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
import authenticateFamily from "../middleware/authenticateFamily";

const familyRouter = Router();

//? GET's(READ)
familyRouter.get("/getAllFamilies", authenticateFamily, getAllFamilies);
familyRouter.get("/getFamilyById/:familyId", getFamilyById);
familyRouter.get(
  "/getAllFamilyMembers/:familyId",
  authenticateFamily,
  getAllFamilyMembers
);
//? POST(CREATE)
familyRouter.post("/createFamily", createFamily);
//? PUT(UPDATE)
familyRouter.put(
  "/updateFamilyById/:familyId",
  authenticateFamily,
  updateFamilyById
);
//? DELETE
familyRouter.delete(
  "/deleteFamilyById/:familyId",
  authenticateFamily,
  deleteFamilyById
);
familyRouter.delete(
  "/deleteAllFamilies",
  authenticateFamily,
  deleteAllFamilies
);

// * FAMILY PASSWORD's:
//? GET's(READ)
familyRouter.get(
  "/getFamilyPassword/:familyId",
  authenticateFamily,
  getFamilyPassword
);
//? POST(CREATE)
familyRouter.post(
  "/createPassword/:familyId",
  authenticateFamily,
  createFamilyPassword
);
//? PUT(UPDATE)
familyRouter.put(
  "/updateFamilyPassword/:familyId",
  authenticateFamily,
  updateFamilyPassword
);
//? DELETE
familyRouter.delete(
  "/deleteFamilyPasswordById/:familyId",
  authenticateFamily,
  deleteFamilyPasswordById
);

export default familyRouter;
