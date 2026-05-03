import { Router } from "express";
import {
  askQuestion,
  getQuestions,
  getQuestionById,
  answerQuestion,
} from "../controllers/discussionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);

router.post("/ask", authMiddleware, askQuestion);
router.post("/answer", authMiddleware, answerQuestion);

export default router;