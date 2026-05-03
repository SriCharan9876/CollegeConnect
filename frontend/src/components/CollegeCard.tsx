import Link from "next/link";
import API from "@/services/api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CollegeCard({ college, onCompare, isSaved: initialIsSaved = false }: any) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const minFee =
    college.courses?.length > 0
      ? Math.min(...college.courses.map((c: any) => c.fees))
      : "N/A";

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isSaved) {
        await API.delete(`/user/saved-colleges/${college.id}`);
        setIsSaved(false);
        toast.info("College removed from My Space!");
      } else {
        await API.post("/user/save-college", { collegeId: college.id });
        setIsSaved(true);
        toast.success("College saved to My Space!");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Please login to save colleges");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow relative">
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isSaved 
              ? "text-rose-500 bg-rose-50 dark:bg-rose-900/30" 
              : "bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
          }`}
          title={isSaved ? "Unsave College" : "Save College"}
        >
          {isSaved ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        <div className="flex justify-between items-start mb-4 pr-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {college.name}
          </h2>
        </div>
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 mb-4">
          ★ {college.rating}
        </span>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{college.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Starts at ₹{minFee}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center gap-4 transition-colors">
        <Link 
          href={`/college/${college.id}`} 
          className="flex-1 text-center py-2 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
        >
          View Details
        </Link>

        <button
          onClick={() => onCompare(college.id)}
          className="flex-1 py-2 px-4 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-800 transition-all"
        >
          Compare
        </button>
      </div>
    </div>
  );
}