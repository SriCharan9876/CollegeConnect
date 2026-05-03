"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/services/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function QuestionPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/discussion/${id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load discussion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      toast.error("Please enter an answer.");
      return;
    }

    setPosting(true);
    try {
      await API.post("/discussion/answer", { questionId: id, answer });
      toast.success("Answer posted successfully!");
      setAnswer("");
      fetchData();
      setTimeout(scrollToBottom, 500);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to answer");
      } else {
        toast.error("Failed to post answer");
      }
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  if (!data || !data.question) {
    return (
      <div className="text-center py-20 mt-10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Discussion not found</h3>
        <Link href="/discussion" className="text-emerald-600 hover:underline font-medium">
          &larr; Back to Discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full animate-fade-in relative bg-white dark:bg-slate-900 overflow-hidden -mt-4">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sm:p-6 shrink-0 z-10 flex items-center gap-4">
        <Link href="/discussion" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">Thread</h1>
        </div>
      </div>

      {/* Thread Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-slate-900/50">
        
        {/* Original Question */}
        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {data.question.username ? data.question.username.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-bold text-gray-900 dark:text-white">
                  {data.question.username || "Anonymous"}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {new Date(data.question.created_at).toLocaleString()}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">
                {data.question.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {data.question.description}
              </p>
            </div>
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-4 pl-4 sm:pl-10 border-l-2 border-emerald-100 dark:border-emerald-900/30">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            {data.answers.length} {data.answers.length === 1 ? 'Reply' : 'Replies'}
          </h3>
          
          {data.answers.map((a: any) => (
            <div key={a.id} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                  {a.username ? a.username.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {a.username || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {a.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Answer Input Area */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 p-4 shrink-0">
        <form onSubmit={submitAnswer} className="max-w-4xl mx-auto relative">
          <textarea 
            placeholder="Write your answer..." 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg pl-4 pr-16 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none font-medium"
          />
          <button 
            type="submit"
            disabled={posting}
            className="absolute right-3 bottom-4 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
            title="Post Answer"
          >
            {posting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}