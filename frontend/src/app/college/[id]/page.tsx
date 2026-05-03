"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { useParams } from "next/navigation";

export default function CollegePage() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get(`/colleges/${id}`);
      setCollege(res.data);
    };

    if (id) fetchData();
  }, [id]);

  if (!college) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{college.name}</h1>
      <p>{college.location}</p>
      <p>{college.description}</p>

      <h2 className="mt-4 font-bold">Courses</h2>
      <ul>
        {college.courses.map((c) => (
          <li key={c.id}>
            {c.name} - ₹{c.fees}
          </li>
        ))}
      </ul>

      <h2 className="mt-4 font-bold">Entrance Exams</h2>
      {college.exams.map((e) => (
        <p key={e.id}>
          {e.exam_name} (Cutoff: {e.cutoff_rank})
        </p>
      ))}

      <h2 className="mt-4 font-bold">Reviews</h2>
      {college.reviews.map((r) => (
        <div key={r.id}>
          <p>{r.user_name}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}