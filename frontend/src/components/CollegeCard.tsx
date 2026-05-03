import Link from "next/link";

export default function CollegeCard({ college, onCompare }) {
  const minFee =
    college.courses?.length > 0
      ? Math.min(...college.courses.map((c) => c.fees))
      : "N/A";

  return (
    <div className="border p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">{college.name}</h2>
      <p>{college.location}</p>
      <p>Fees: ₹{minFee}</p>
      <p>Rating: {college.rating}</p>

      <div className="flex justify-between mt-2">
        <Link href={`/college/${college.id}`} className="text-blue-500">
          View Details
        </Link>

        <button
          onClick={() => onCompare(college.id)}
          className="bg-green-500 text-white px-2"
        >
          Compare
        </button>
      </div>
    </div>
  );
}