"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/services/api";

export default function ComparePage() {
  const params = useSearchParams();
  const ids = params.get("ids");

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!ids) return;

    const fetch = async () => {
      const res = await API.post("/colleges/compare", {
        ids: ids.split(",").map(Number),
      });
      setData(res.data);
    };

    fetch();
  }, [ids]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Compare Colleges</h1>

      <table className="table-auto border w-full bg-white">
        <thead>
          <tr>
            <th>Name</th>
            <th>Fees</th>
            <th>Placement</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>₹{c.min_fees} - ₹{c.max_fees}</td>
              <td>{c.avg_placement}%</td>
              <td>{c.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}