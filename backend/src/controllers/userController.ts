import { sql } from "../db/index";

export const getMe = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await sql`
      SELECT id, username, email FROM users WHERE id = ${userId}
    `;
    if (!user[0]) return res.status(404).json({ error: "User not found" });
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const saveCollege = async (req, res) => {
  const userId = req.user.id;
  const { collegeId } = req.body;

  try {
    const existing = await sql`
      SELECT id FROM saved_colleges WHERE user_id = ${userId} AND college_id = ${collegeId}
    `;
    
    if (existing.length === 0) {
      await sql`
        INSERT INTO saved_colleges (user_id, college_id)
        VALUES (${userId}, ${collegeId})
      `;
    }
    res.json({ message: "Saved" });
  } catch (error) {
    res.status(500).json({ error: "Error saving college" });
  }
};

export const getSavedColleges = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await sql`
      SELECT c.* FROM saved_colleges sc
      JOIN colleges c ON sc.college_id = c.id
      WHERE sc.user_id = ${userId}
    `;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching saved colleges" });
  }
};

export const removeSavedCollege = async (req, res) => {
  const userId = req.user.id;
  const { collegeId } = req.params;

  try {
    await sql`
      DELETE FROM saved_colleges
      WHERE user_id = ${userId} AND college_id = ${collegeId}
    `;
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ error: "Error removing saved college" });
  }
};

export const saveComparison = async (req, res) => {
  const userId = req.user.id;
  const { ids } = req.body;

  try {
    const result = await sql`
      INSERT INTO saved_comparisons (user_id, college_ids)
      VALUES (${userId}, ${ids})
      RETURNING id
    `;
    res.json({ message: "Comparison saved", id: result[0].id });
  } catch (error) {
    res.status(500).json({ error: "Error saving comparison" });
  }
};

export const getSavedComparisons = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await sql`
      SELECT id, college_ids FROM saved_comparisons
      WHERE user_id = ${userId}
    `;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching saved comparisons" });
  }
};

export const removeSavedComparison = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    await sql`
      DELETE FROM saved_comparisons
      WHERE user_id = ${userId} AND id = ${id}
    `;
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ error: "Error removing saved comparison" });
  }
};