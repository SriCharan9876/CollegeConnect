"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import API from "@/services/api";
import Link from "next/link";
import { toast } from "react-toastify";

function CompareContent() {
  const params = useSearchParams();
  const ids = params.get("ids");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedComparisonId, setSavedComparisonId] = useState<number | null>(null);

  useEffect(() => {
    if (!ids) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const res = await API.post("/colleges/compare", {
          ids: ids.split(",").map(Number),
        });
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token || !ids) return;
      try {
        const res = await API.get("/user/saved-comparisons");
        const currentIds = ids.split(",").map(Number).sort((a, b) => a - b).join(",");
        
        const existing = res.data.find((c: any) => {
          return c.college_ids.sort((a: number, b: number) => a - b).join(",") === currentIds;
        });
        
        if (existing) {
          setSavedComparisonId(existing.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
    fetchSavedStatus();
  }, [ids]);

  const handleSaveComparison = async () => {
    if (!ids) return;
    try {
      setSaving(true);
      if (savedComparisonId) {
        await API.delete(`/user/saved-comparisons/${savedComparisonId}`);
        setSavedComparisonId(null);
        toast.info("Comparison removed from My Space!");
      } else {
        const res = await API.post("/user/save-comparison", {
          ids: `{${ids}}` // PostgreSQL array format string
        });
        setSavedComparisonId(res.data.id);
        toast.success("Comparison saved to My Space!");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Please login to manage comparisons");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 mt-10 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">No colleges to compare</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors">Select colleges from the home page to compare them here.</p>
        <Link href="/colleges" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors">
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">Compare Colleges</h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors">Comparing {data.length} selected colleges</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleSaveComparison}
            disabled={saving}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors border disabled:opacity-50 ${
              savedComparisonId
                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50 dark:border-rose-800"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:border-emerald-800"
            }`}
          >
            {savedComparisonId ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
            {saving ? "Processing..." : savedComparisonId ? "Unsave Comparison" : "Save Comparison"}
          </button>
          <Link href="/colleges" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors">
            &larr; Back to Search
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 transition-colors">
              <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors">College Name</th>
              <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors">Fees Range</th>
              <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors">Avg. Placement</th>
              <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors">Rating</th>
              <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900 dark:text-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg transition-colors">
                      {c.name.charAt(0)}
                    </div>
                    {c.name}
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400 transition-colors">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">₹{c.min_fees?.toLocaleString() ?? 0}</span> - <span className="font-medium text-emerald-600 dark:text-emerald-400">₹{c.max_fees?.toLocaleString() ?? 0}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors">
                      <div className="h-full bg-emerald-500" style={{ width: `${c.avg_placement || 0}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{c.avg_placement || 0}%</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 transition-colors">
                    ★ {c.rating}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Link href={`/college/${c.id}`} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium text-sm border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 px-3 py-1.5 rounded-lg transition-colors">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}