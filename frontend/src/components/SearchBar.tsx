"use client";

interface SearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ search, setSearch, onSearch }: SearchBarProps) {
  return (
    <div className="flex w-full max-w-2xl mx-auto shadow-sm rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-300">
      <div className="pl-4 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        className="flex-grow p-3 sm:p-4 outline-none text-gray-700 dark:text-gray-200 bg-transparent"
        placeholder="Search for colleges, universities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <button
        onClick={onSearch}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 font-medium transition-colors duration-200 focus:outline-none"
      >
        Search
      </button>
    </div>
  );
}