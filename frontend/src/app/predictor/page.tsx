"use client";

import { useState } from "react";
import API from "@/services/api";

export default function Predictor() {
  const [rank, setRank] = useState("");
  const [data, setData] = useState([]);

  const predict = async () => {
    const res = await API.get("/colleges");

    const filtered = res.data.filter((c) =>
      c.exams?.some((e) => rank <= e.cutoff_rank)
    );

    setData(filtered);
  };

  return (
    <div className="p-6">
      <input
        placeholder="Enter Rank"
        onChange={(e) => setRank(Number(e.target.value))}
      />

      <button onClick={predict} className="ml-2 bg-blue-500 text-white px-3">
        Predict
      </button>

      {data.map((c) => (
        <p key={c.id}>{c.name}</p>
      ))}
    </div>
  );
}