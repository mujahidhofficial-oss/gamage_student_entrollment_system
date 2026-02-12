export default function SearchFilter({
  search,
  setSearch,
  courseFilter,
  setCourseFilter,
  courses,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Students</h2>
        <p className="text-sm text-slate-500">Search by name & filter by course</p>
      </div>

      <div className="flex gap-2">
        <input
          className="w-full md:w-44 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
