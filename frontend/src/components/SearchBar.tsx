"use client";

export default function SearchBar({ search, setSearch, onSearch }) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        className="border p-2 w-full"
        placeholder="Search colleges..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4"
      >
        Search
      </button>
    </div>
  );
}