import * as db from "../db/collegeQueries";

/**
 * GET /colleges
 */
export const fetchColleges = async (req, res) => {
  try {
    const { search, location, course, minFees, maxFees } = req.query;

    const data = await db.getColleges(
      search,
      location,
      course,
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
export const fetchCollegeById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const college = await db.getCollegeById(id);

    if (!college) {
      return res.status(404).json({ error: "Not found" });
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
export const compareColleges = async (req, res) => {
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