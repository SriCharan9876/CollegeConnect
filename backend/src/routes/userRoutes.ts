import { Router } from "express";
import {
  getMe,
  saveCollege,
  getSavedColleges,
  removeSavedCollege,
  saveComparison,
  getSavedComparisons,
  removeSavedComparison
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.post("/save-college", authMiddleware, saveCollege);
router.get("/saved-colleges", authMiddleware, getSavedColleges);
router.delete("/saved-colleges/:collegeId", authMiddleware, removeSavedCollege);
router.post("/save-comparison", authMiddleware, saveComparison);
router.get("/saved-comparisons", authMiddleware, getSavedComparisons);
router.delete("/saved-comparisons/:id", authMiddleware, removeSavedComparison);

export default router;