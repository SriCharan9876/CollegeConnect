"use client";

export default function Filters({
  location,
  setLocation,
  course,
  setCourse,
  minFees,
  setMinFees,
  maxFees,
  setMaxFees,
}) {
  return (
    <div className="flex gap-4 mb-4">
      <select onChange={(e) => setLocation(e.target.value)}>
        <option value="">All Locations</option>
        <option value="Delhi">Delhi</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Telangana">Telangana</option>
      </select>

      <input
        placeholder="Course (CSE, AI...)"
        onChange={(e) => setCourse(e.target.value)}
      />

      <input
        placeholder="Min Fees"
        type="number"
        onChange={(e) => setMinFees(e.target.value)}
      />

      <input
        placeholder="Max Fees"
        type="number"
        onChange={(e) => setMaxFees(e.target.value)}
      />
    </div>
  );
}