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
  const inputClass = "w-full p-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all";
  const selectBgUrl = `bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2310b981%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.65em_auto]`;

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 p-4 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between transition-colors">
      <div className="flex-1 w-full min-w-[200px]">
        <select 
          className={`${inputClass} appearance-none cursor-pointer ${selectBgUrl}`} 
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        >
          <option value="">All Locations</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Manipur">Manipur</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Odisha">Odisha</option>
          <option value="Punjab">Punjab</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Telangana">Telangana</option>
          <option value="Tripura">Tripura</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
          <option value="Delhi">Delhi</option>
          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
          <option value="Ladakh">Ladakh</option>
          <option value="Lakshadweep">Lakshadweep</option>
          <option value="Puducherry">Puducherry</option>
        </select>
      </div>

      <div className="flex-1 w-full min-w-[200px]">
        <select
          className={`${inputClass} appearance-none cursor-pointer ${selectBgUrl}`}
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
          <option value="AI & Data Science">AI & Data Science</option>
        </select>
      </div>

      <div className="flex w-full sm:w-auto flex-1 min-w-[250px] gap-2 items-center">
        <input
          className={inputClass}
          placeholder="Min ₹"
          type="number"
          value={minFees}
          onChange={(e) => setMinFees(e.target.value)}
        />
        <span className="text-gray-400 font-medium">-</span>
        <input
          className={inputClass}
          placeholder="Max ₹"
          type="number"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
        />
      </div>
    </div>
  );
}