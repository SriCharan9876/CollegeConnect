"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import CollegeCard from "@/components/CollegeCard";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import { useRouter } from "next/navigation";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [selected, setSelected] = useState([]);

  const router = useRouter();

  const fetchColleges = async () => {
    const res = await API.get("/colleges", {
      params: { search, location, course, minFees, maxFees },
    });
    setColleges(res.data);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleCompare = (id) => {
    let updated = [...selected];

    if (updated.includes(id)) {
      updated = updated.filter((i) => i !== id);
    } else {
      if (updated.length < 3) updated.push(id);
    }

    setSelected(updated);
  };

  return (
    <div className="p-6">
      <SearchBar
        search={search}
        setSearch={setSearch}
        onSearch={fetchColleges}
      />

      <Filters
        location={location}
        setLocation={setLocation}
        course={course}
        setCourse={setCourse}
        minFees={minFees}
        setMinFees={setMinFees}
        maxFees={maxFees}
        setMaxFees={setMaxFees}
      />

      <button
        onClick={fetchColleges}
        className="bg-purple-500 text-white px-4 mb-4"
      >
        Apply Filters
      </button>

      {selected.length > 1 && (
        <button
          onClick={() => router.push(`/compare?ids=${selected.join(",")}`)}
          className="bg-green-600 text-white px-4 mb-4 ml-2"
        >
          Compare Selected
        </button>
      )}

      <div className="grid grid-cols-3 gap-4">
        {colleges.map((c) => (
          <CollegeCard
            key={c.id}
            college={c}
            onCompare={handleCompare}
          />
        ))}
      </div>
    </div>
  );
}