"use client";

import { useState } from "react";
import API from "@/services/api";
import Link from "next/link";

export default function Predictor() {
  const [rank, setRank] = useState("");
  const [exam, setExam] = useState("");
  const [data, setData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    if (!rank) return;
    setLoading(true);
    setHasSearched(true);
    try {
      // If an exam is selected, we can pass it to the backend to optimize the initial fetch
      const endpoint = exam ? `/colleges?exam=${encodeURIComponent(exam)}` : "/colleges";
      const res = await API.get(endpoint);

      const filtered = res.data.filter((c) =>
        c.exams?.some((e) => 
          (exam ? e.exam_name === exam : true) && 
          Number(rank) <= e.cutoff_rank
        )
      );

      setData(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in mt-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
          College Predictor
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto transition-colors">
          Enter your entrance exam rank to discover which colleges you might be eligible for based on historical cutoffs.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 p-6 md:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <select
              className="w-full pl-11 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-lg appearance-none cursor-pointer"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
            >
              <option value="">All Exams</option>
              <option value="JEE Main">JEE Main</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="BITSAT">BITSAT</option>
              <option value="VITEEE">VITEEE</option>
              <option value="AEEE">AEEE</option>
              <option value="SRMJEEE">SRMJEEE</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <input
              type="number"
              className="w-full pl-11 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-lg"
              placeholder="Enter your rank (e.g. 5000)"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && predict()}
            />
          </div>
          <button 
            onClick={predict}
            disabled={!rank || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-900/50 text-white font-semibold px-8 py-4 rounded-xl shadow-sm transition-colors flex items-center justify-center min-w-[140px]"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Predict"
            )}
          </button>
        </div>
      </div>

      {hasSearched && !loading && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            {data.length} {data.length === 1 ? 'College' : 'Colleges'} Found
          </h2>
          
          {data.length === 0 ? (
            <div className="p-8 text-center bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl transition-colors">
              <p className="text-rose-700 dark:text-rose-400 font-medium">We couldn't find any colleges matching this rank cutoff.</p>
              <p className="text-rose-600/80 dark:text-rose-400/80 text-sm mt-1">Try entering a different rank or check back later for updated cutoffs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((c) => (
                <Link key={c.id} href={`/college/${c.id}`} className="block group">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm group-hover:shadow-md group-hover:border-emerald-200 dark:group-hover:border-emerald-700 transition-all flex justify-between items-center h-full">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{c.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.location}</p>
                      
                      {/* Show which exam matched */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {c.exams?.filter(e => (exam ? e.exam_name === exam : true) && Number(rank) <= e.cutoff_rank).map((match, idx) => (
                          <span key={idx} className="inline-block text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded">
                            {match.exam_name}: ≤ {match.cutoff_rank}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ml-4 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}