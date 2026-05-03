"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import CollegeCard from "@/components/CollegeCard";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import { useRouter } from "next/navigation";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [savedColleges, setSavedColleges] = useState<number[]>([]);
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

  const fetchSavedColleges = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const res = await API.get("/user/saved-colleges");
      setSavedColleges(res.data.map((c: any) => c.id));
    } catch (error) {
      console.error("Failed to fetch saved colleges", error);
    }
  };

  useEffect(() => {
    fetchColleges();
    fetchSavedColleges();
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
    <div className="flex flex-col space-y-10 pb-12 w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center space-y-6 pt-16 pb-12 px-4 w-full">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight transition-colors">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300">Dream College</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium transition-colors">
            Discover, compare, and connect with top universities. Your journey to the perfect education starts here.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto py-4">
          <p className="text-lg md:text-xl font-medium italic text-gray-500 dark:text-gray-400 relative inline-block transition-colors">
            <span className="text-emerald-400 text-4xl absolute -top-4 -left-6 opacity-60">"</span>
            Education is the passport to the future, for tomorrow belongs to those who prepare for it today.
            <span className="text-emerald-400 text-4xl absolute -bottom-4 -right-6 opacity-60">"</span>
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-8 relative z-10 drop-shadow-xl">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearch={fetchColleges}
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full">
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
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={fetchColleges}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </section>

      {/* Colleges Grid */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Featured Colleges</h2>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">{colleges.length} Results</span>
        </div>
        
        {colleges.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 transition-colors">No colleges found</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {colleges.map((c: any) => (
              <CollegeCard
                key={c.id}
                college={c}
                onCompare={handleCompare}
                isSaved={savedColleges.includes(c.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Compare Button */}
      {selected.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => router.push(`/compare?ids=${selected.join(",")}`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-full shadow-2xl transition-all flex items-center gap-3 border-4 border-white dark:border-slate-800 hover:-translate-y-1"
          >
            <span className="bg-white text-emerald-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
              {selected.length}
            </span>
            <span>Compare Selected</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}