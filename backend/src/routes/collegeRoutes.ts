import { Router } from "express";
import {
  fetchColleges,
  fetchCollegeById,
  compareColleges,
} from "../controllers/collegeController";

const router = Router();

router.get("/", fetchColleges);
router.get("/:id", fetchCollegeById);
router.post("/compare", compareColleges);

export default router;