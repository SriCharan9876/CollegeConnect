"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function CollegePage() {
  const { id } = useParams();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/colleges/${id}`);
        setCollege(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.get("/user/saved-colleges");
        if (res.data.some((c: any) => c.id === Number(id))) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
      fetchSavedStatus();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isSaved) {
        await API.delete(`/user/saved-colleges/${id}`);
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
        toast.error("Please login to manage saved colleges");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post(`/colleges/${id}/reviews`, { rating, comment });
      toast.success("Review added!");
      setComment("");
      setRating(5);
      // Refresh college data
      const res = await API.get(`/colleges/${id}`);
      setCollege(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  if (!college) return <p className="text-center text-gray-500 dark:text-gray-400 mt-10 transition-colors">College not found.</p>;

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="mb-4">
        <Link href="/colleges" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-500"></div>
        <div className="px-6 sm:px-8 pb-8 pt-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">{college.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400 font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {college.location}
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-4 py-2 rounded-xl text-center transition-colors">
              <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors">{college.rating}</span>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider transition-colors">Rating</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl transition-colors">{college.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {college.courses?.map((c: any) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors">
                  <h3 className="font-bold text-gray-900 dark:text-white transition-colors">{c.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1 transition-colors">₹{c.fees.toLocaleString()}</p>
                </div>
              ))}
              {(!college.courses || college.courses.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 italic transition-colors">No courses listed.</p>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Student Reviews
            </h2>
            
            <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Rating</label>
                  <select 
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full sm:w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Your Experience</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the campus, faculty, and placements..."
                    rows={3}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submittingReview}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submittingReview ? "Posting..." : "Post Review"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {college.reviews?.map((r: any) => (
                <div key={r.id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-sm transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold transition-colors">
                      {r.user_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white transition-colors leading-none">{r.user_name || "Anonymous"}</p>
                      <div className="flex text-amber-400 text-xs mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-gray-300 dark:text-slate-600'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">{r.comment}</p>
                </div>
              ))}
              {(!college.reviews || college.reviews.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 italic transition-colors">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Entrance Exams
            </h2>
            <div className="space-y-3">
              {college.exams?.map((e: any) => (
                <div key={e.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 transition-colors">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">{e.exam_name}</span>
                  <span className="text-sm px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-md shadow-sm font-medium text-gray-600 dark:text-gray-400 text-right transition-colors">
                    Cutoff: {e.cutoff_rank}
                  </span>
                </div>
              ))}
              {(!college.exams || college.exams.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 italic transition-colors">No exams listed.</p>
              )}
            </div>
          </section>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-2xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800/50 text-center transition-colors">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 transition-colors">Interested in {college.name}?</h3>
            <p className="text-emerald-700 dark:text-emerald-400/80 text-sm mb-4 transition-colors">Add this college to your comparison list to see how it stacks up against others, or save it for later.</p>
            <div className="space-y-3">
              <Link href={`/compare?ids=${college.id}`} className="block w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                Compare College
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 border ${isSaved
                    ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
                    : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  }`}
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
                {saving ? "Processing..." : isSaved ? "Unsave College" : "Save College"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}