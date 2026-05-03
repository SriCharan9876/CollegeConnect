"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/services/api";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Discussion() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [posting, setPosting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchInitialData = async () => {
    try {
      const [questionsRes, collegesRes] = await Promise.all([
        API.get("/discussion"),
        API.get("/colleges")
      ]);
      setQuestions(questionsRes.data);
      setColleges(collegesRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/discussion");
      setQuestions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Please enter a title and description.");
      return;
    }
    
    setPosting(true);
    try {
      await API.post("/discussion/ask", { 
        title, 
        description: desc,
        collegeId: selectedCollegeId || null
      });
      toast.success("Question posted successfully!");
      setTitle("");
      setDesc("");
      setSelectedCollegeId("");
      const res = await API.get("/discussion");
      setQuestions(res.data);
      setTimeout(scrollToBottom, 500);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to ask a question");
      } else {
        toast.error("Failed to post question");
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full animate-fade-in relative bg-white dark:bg-slate-900 overflow-hidden -mt-4">
      
      {/* Header */}
      <div className="bg-emerald-600 dark:bg-emerald-800 text-white p-4 sm:p-6 shrink-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Community Discussions</h1>
        <p className="text-emerald-100 mt-1 text-sm">Ask questions, share advice, and connect with other students.</p>
      </div>

      {/* Messages / Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-slate-900/50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">No questions yet</p>
            <p className="text-sm">Be the first to ask the community!</p>
          </div>
        ) : (
          questions.map((q) => (
            <Link key={q.id} href={`/discussion/${q.id}`} className="block group">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 group-hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                    {q.username ? q.username.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {q.username || "Anonymous"}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                        {new Date(q.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {q.college_name && (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded mb-2 font-medium">
                        {q.college_name}
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                      {q.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {q.description}
                    </p>
                    <div className="mt-3 flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      <span>View Thread &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chatbot-style Input Area */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 p-4 shrink-0">
        <form onSubmit={submitQuestion} className="max-w-4xl mx-auto space-y-3 relative">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="What's your question about?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-1/3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">No specific college (General)</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <textarea 
              placeholder="Add more details here..." 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg pl-4 pr-16 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            <button 
              type="submit"
              disabled={posting}
              className="absolute right-3 bottom-3 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
              title="Post Question"
            >
              {posting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}