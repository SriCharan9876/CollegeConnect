import { Router } from "express";
import {
  fetchColleges,
  fetchCollegeById,
  compareColleges,
  addReview,
} from "../controllers/collegeController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", fetchColleges);
router.get("/:id", fetchCollegeById);
router.post("/compare", compareColleges);
router.post("/:id/reviews", authMiddleware, addReview);

export default router;