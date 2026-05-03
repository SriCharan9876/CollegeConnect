import { sql } from "./index";

/**
 * Get colleges with filters
 */
export const getColleges = async (
  search?: string,
  location?: string,
  course?: string,
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

      MIN(cs.fees) AS min_fees,

      COALESCE(
        json_agg(DISTINCT cs) FILTER (WHERE cs.id IS NOT NULL),
        '[]'
      ) AS courses

    FROM colleges c
    LEFT JOIN courses cs ON c.id = cs.college_id

    WHERE 
      c.name ILIKE ${"%" + (search || "") + "%"}
      ${location ? sql`AND c.location = ${location}` : sql``}
      ${course ? sql`AND cs.name = ${course}` : sql``}
      ${minFees ? sql`AND cs.fees >= ${minFees}` : sql``}
      ${maxFees ? sql`AND cs.fees <= ${maxFees}` : sql``}

    GROUP BY c.id
    ORDER BY c.rating DESC;
  `;
};

/**
 * Get full college details
 */
export const getCollegeById = async (id: number) => {
  const result = await sql`
    SELECT 
      c.*,

      COALESCE(
        json_agg(DISTINCT cs) FILTER (WHERE cs.id IS NOT NULL),
        '[]'
      ) AS courses,

      COALESCE(
        json_agg(DISTINCT ex) FILTER (WHERE ex.id IS NOT NULL),
        '[]'
      ) AS exams,

      COALESCE(
        json_agg(DISTINCT rv) FILTER (WHERE rv.id IS NOT NULL),
        '[]'
      ) AS reviews

    FROM colleges c
    LEFT JOIN courses cs ON c.id = cs.college_id
    LEFT JOIN exams ex ON c.id = ex.college_id
    LEFT JOIN reviews rv ON c.id = rv.college_id

    WHERE c.id = ${id}
    GROUP BY c.id;
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

      MIN(cs.fees) AS min_fees,
      MAX(cs.fees) AS max_fees

    FROM colleges c
    LEFT JOIN courses cs ON c.id = cs.college_id

    WHERE c.id = ANY(${ids})
    GROUP BY c.id;
  `;
};