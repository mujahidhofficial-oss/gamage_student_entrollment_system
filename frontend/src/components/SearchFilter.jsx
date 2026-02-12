export default function SearchFilter({
  search,
  setSearch,
  courseFilter,
  setCourseFilter,
  courses,
  onExport,
  onReset,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-slate-900">Students</h2>
        <p className="text-sm text-slate-500">Search by name & filter by course</p>
      </div>

      {/* ✅ Right side controls */}
      <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
        <input
          className="w-full sm:w-48 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full sm:w-40 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50 whitespace-nowrap"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={onExport}
          className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 whitespace-nowrap"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
