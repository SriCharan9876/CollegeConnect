import { sql } from "../db/index";

/**
 * Ask Question
 */
export const askQuestion = async (req, res) => {
  const userId = req.user.id;
  const { title, description, collegeId } = req.body;

  await sql`
    INSERT INTO questions (user_id, title, description, college_id)
    VALUES (${userId}, ${title}, ${description}, ${collegeId})
  `;

  res.json({ message: "Question posted" });
};

/**
 * Get all questions
 */
export const getQuestions = async (req, res) => {
  const data = await sql`
    SELECT q.*, u.username, c.name AS college_name
    FROM questions q
    LEFT JOIN users u ON q.user_id = u.id
    LEFT JOIN colleges c ON q.college_id = c.id
    ORDER BY q.created_at DESC
  `;

  res.json(data);
};

/**
 * Get single question + answers
 */
export const getQuestionById = async (req, res) => {
  const id = req.params.id;

  const question = await sql`
    SELECT q.*, u.username
    FROM questions q
    JOIN users u ON q.user_id = u.id
    WHERE q.id = ${id}
  `;

  const answers = await sql`
    SELECT a.*, u.username
    FROM answers a
    JOIN users u ON a.user_id = u.id
    WHERE a.question_id = ${id}
  `;

  res.json({
    question: question[0],
    answers,
  });
};

/**
 * Answer question
 */
export const answerQuestion = async (req, res) => {
  const userId = req.user.id;
  const { questionId, answer } = req.body;

  await sql`
    INSERT INTO answers (question_id, user_id, answer)
    VALUES (${questionId}, ${userId}, ${answer})
  `;

  res.json({ message: "Answer added" });
};