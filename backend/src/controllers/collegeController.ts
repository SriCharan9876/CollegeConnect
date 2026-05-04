import { Request, Response } from "express";
import * as db from "../db/collegeQueries";
import { sql } from "../db/index";

/**
 * GET /colleges
 */
export const fetchColleges = async (req: Request, res: Response) => {
  try {
    const { search, location, course, exam, minFees, maxFees } = req.query;

    const data = await db.getColleges(
      search as string,
      location as string,
      course as string,
      exam as string,
      Number(minFees),
      Number(maxFees)
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};


/**
 * GET /colleges/:id
 */
export const fetchCollegeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const college = await db.getCollegeById(id);

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(college);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching college" });
  }
};


/**
 * POST /colleges/compare
 */
export const compareColleges = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length < 2) {
      return res.status(400).json({ error: "Select at least 2 colleges" });
    }

    const data = await db.compareColleges(ids);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Compare failed" });
  }
};


/**
 * POST /colleges/:id/reviews
 */
export const addReview = async (req : Request, res: Response) => {
  try {
    const collegeId = Number(req.params.id);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!collegeId || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch username from users table since schema uses user_name string
    const user = await sql`SELECT username FROM users WHERE id = ${userId}`;
    if (!user[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const newReview = await db.addReviewToCollege(collegeId, user[0].username, Number(rating), comment);
    res.json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add review" });
  }
};