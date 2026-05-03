import { sql } from "./index";

/**
 * Get colleges with filters
 */
export const getColleges = async (
  search?: string,
  location?: string,
  course?: string,
  exam?: string,
  minFees?: number,
  maxFees?: number
) => {
  return await sql`
    SELECT 
      c.id,
      c.name,
      c.location,
      c.rating,
      c.avg_placement,
      c.type,

      (
        SELECT COALESCE(json_agg(cs), '[]')
        FROM courses cs
        WHERE cs.college_id = c.id
      ) AS courses,

      (
        SELECT COALESCE(json_agg(json_build_object('id', ce.id, 'exam_name', e.name, 'cutoff_rank', ce.cutoff_rank)), '[]')
        FROM college_exams ce
        JOIN exams e ON ce.exam_id = e.id
        WHERE ce.college_id = c.id
      ) AS exams

    FROM colleges c
    WHERE 
      c.name ILIKE ${"%" + (search || "") + "%"}
      ${location ? sql`AND c.location = ${location}` : sql``}
      ${course === 'Computer Science' ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.name IN ('Computer Science Engineering', 'Computer Science', 'Information Technology'))` :
      course === 'Electronics' ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.name IN ('Electrical Engineering', 'Electronics Engineering'))` :
        course === 'Mechanical' ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.name = 'Mechanical Engineering')` :
          course === 'Civil' ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.name = 'Civil Engineering')` :
            course === 'AI & Data Science' ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.name IN ('Artificial Intelligence', 'Data Science'))` :
              course ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.name = ${course})` : sql``}
      ${exam ? sql`AND EXISTS (SELECT 1 FROM college_exams ce JOIN exams e ON ce.exam_id = e.id WHERE ce.college_id = c.id AND e.name = ${exam})` : sql``}
      ${minFees ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.fees >= ${minFees})` : sql``}
      ${maxFees ? sql`AND EXISTS (SELECT 1 FROM courses cs WHERE cs.college_id = c.id AND cs.fees <= ${maxFees})` : sql``}

    ORDER BY c.rating DESC;
  `;
};


/**
 * Get full college detail
 */
export const getCollegeById = async (id: number) => {
  const result = await sql`
    SELECT 
      c.*,

      (
        SELECT COALESCE(json_agg(cs), '[]')
        FROM courses cs
        WHERE cs.college_id = c.id
      ) AS courses,

      (
        SELECT COALESCE(json_agg(json_build_object('id', ce.id, 'exam_name', e.name, 'cutoff_rank', ce.cutoff_rank)), '[]')
        FROM college_exams ce
        JOIN exams e ON ce.exam_id = e.id
        WHERE ce.college_id = c.id
      ) AS exams,

      (
        SELECT COALESCE(json_agg(rv), '[]')
        FROM reviews rv
        WHERE rv.college_id = c.id
      ) AS reviews

    FROM colleges c
    WHERE c.id = ${id};
  `;

  return result[0];
};


/**
 * Compare colleges
 */
export const compareColleges = async (ids: number[]) => {
  return await sql`
    SELECT 
      c.id,
      c.name,
      c.location,
      c.rating,
      c.avg_placement,

      (SELECT MIN(fees) FROM courses cs WHERE cs.college_id = c.id) AS min_fees,
      (SELECT MAX(fees) FROM courses cs WHERE cs.college_id = c.id) AS max_fees,

      (
        SELECT COALESCE(array_agg(e.name), '{}')
        FROM college_exams ce
        JOIN exams e ON ce.exam_id = e.id
        WHERE ce.college_id = c.id
      ) AS exams

    FROM colleges c
    WHERE c.id = ANY(${ids});
  `;
};

/**
 * Add Review
 */
export const addReviewToCollege = async (collegeId: number, userName: string, rating: number, comment: string) => {
  return await sql`
    INSERT INTO reviews (college_id, user_name, rating, comment)
    VALUES (${collegeId}, ${userName}, ${rating}, ${comment})
    RETURNING *;
  `;
};