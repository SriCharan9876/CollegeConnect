import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8 text-center bg-gray-50/50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-white to-white dark:from-emerald-900/20 dark:via-slate-900 dark:to-slate-900 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
            Your Future Starts Here
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            Navigate your college journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Confidence.</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover, compare, and predict your chances at top colleges. Join a community of students making the most important decision of their lives.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/colleges"
              className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Start Searching
            </Link>
            <Link 
              href="/signup" 
              className="rounded-xl bg-white dark:bg-slate-800 px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything you need to succeed</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Powerful tools designed specifically for high school students navigating admissions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Link href="/colleges" className="group block p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-2 transition-all duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Search</h3>
              <p className="text-gray-600 dark:text-gray-400">Filter thousands of colleges by location, fees, ratings, and courses to find your perfect fit.</p>
            </Link>

            {/* Feature 2 */}
            <Link href="/predictor" className="group block p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-2 transition-all duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">College Predictor</h3>
              <p className="text-gray-600 dark:text-gray-400">Input your exam scores and let our rule-based system match you with the best available colleges based on historical cutoffs.</p>
            </Link>

            {/* Feature 3 */}
            <div className="group block p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-2 transition-all duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Compare Options</h3>
              <p className="text-gray-600 dark:text-gray-400">Select multiple colleges and compare their fees, placements, and ratings side-by-side.</p>
            </div>

            {/* Feature 4 */}
            <Link href="/discussion" className="group block p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-2 transition-all duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Community Hub</h3>
              <p className="text-gray-600 dark:text-gray-400">Ask questions and get advice from peers and seniors in our interactive discussion forums.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 dark:bg-emerald-800 relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to find your perfect college?
          </h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl">
            Join thousands of students who have successfully navigated their college admissions journey with CollegeConnect.
          </p>
          <Link
            href="/colleges"
            className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-600 shadow-xl hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Start Exploring Now
          </Link>
        </div>
      </section>
    </div>
  );
}
