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
import authMiddleware from "../middleware/authMiddleware";

const familyRouter = Router();

//? GET's(READ)
familyRouter.get("/getAllFamilies", authMiddleware, getAllFamilies);
familyRouter.get("/getFamilyById/:familyId", getFamilyById);
familyRouter.get(
  "/getAllFamilyMembers/:familyId",
  authMiddleware,
  getAllFamilyMembers
);
//? POST(CREATE)
familyRouter.post("/createFamily/:userId", authMiddleware, createFamily);
//? PUT(UPDATE)
familyRouter.put(
  "/updateFamilyById/:familyId",
  authMiddleware,
  updateFamilyById
);
//? DELETE
familyRouter.delete(
  "/deleteFamilyById/:familyId",
  authMiddleware,
  deleteFamilyById
);
familyRouter.delete("/deleteAllFamilies", authMiddleware, deleteAllFamilies);

// * FAMILY PASSWORD's:
//? GET's(READ)
familyRouter.get(
  "/getFamilyPassword/:familyId",
  authMiddleware,
  getFamilyPassword
);
//? POST(CREATE)
familyRouter.post(
  "/createPassword/:familyId",
  authMiddleware,
  createFamilyPassword
);
//? PUT(UPDATE)
familyRouter.put(
  "/updateFamilyPassword/:familyId",
  authMiddleware,
  updateFamilyPassword
);
//? DELETE
familyRouter.delete(
  "/deleteFamilyPasswordById/:familyId",
  authMiddleware,
  deleteFamilyPasswordById
);

export default familyRouter;
