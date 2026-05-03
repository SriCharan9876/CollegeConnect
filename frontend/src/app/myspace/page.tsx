"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function MySpace() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, collegesRes, comparisonsRes] = await Promise.all([
          API.get("/user/me"),
          API.get("/user/saved-colleges"),
          API.get("/user/saved-comparisons")
        ]);

        setUser(userRes.data);
        setSavedColleges(collegesRes.data);
        setSavedComparisons(comparisonsRes.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          console.error("Failed to fetch my space data", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const removeCollege = async (collegeId: number) => {
    try {
      await API.delete(`/user/saved-colleges/${collegeId}`);
      setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
      toast.success("College removed");
    } catch (error) {
      console.error("Failed to remove college", error);
      toast.error("Failed to remove college");
    }
  };

  const removeComparison = async (id: number) => {
    try {
      await API.delete(`/user/saved-comparisons/${id}`);
      setSavedComparisons(savedComparisons.filter(c => c.id !== id));
      toast.success("Comparison removed");
    } catch (error) {
      console.error("Failed to remove comparison", error);
      toast.error("Failed to remove comparison");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">My Space</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your profile, saved colleges, and comparisons.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 font-medium py-2 px-4 rounded-lg transition-colors border border-red-200 dark:border-red-800"
        >
          Logout
        </button>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Details</h2>
        {user ? (
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300"><strong>Username:</strong> {user.username}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Could not load user details.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Colleges</h2>
        {savedColleges.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border border-gray-100 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't saved any colleges yet.</p>
            <Link href="/colleges" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((college) => (
              <div key={college.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{college.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{college.location}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link 
                    href={`/college/${college.id}`}
                    className="flex-1 text-center py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg font-medium text-sm transition-colors"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => removeCollege(college.id)}
                    className="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg font-medium text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Comparisons</h2>
        {savedComparisons.length === 0 ? (
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-8 text-center border border-gray-100 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't saved any comparisons yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedComparisons.map((comp) => (
              <div key={comp.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Comparison #{comp.id}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Comparing {comp.college_ids.length} colleges</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link 
                    href={`/compare?ids=${comp.college_ids.join(",")}`}
                    className="flex-1 text-center py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg font-medium text-sm transition-colors"
                  >
                    View Comparison
                  </Link>
                  <button 
                    onClick={() => removeComparison(comp.id)}
                    className="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg font-medium text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
