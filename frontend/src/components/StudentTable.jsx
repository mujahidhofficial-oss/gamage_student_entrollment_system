export default function StudentTable({ loading, students, onEdit, onDelete }) {
  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (students.length === 0) return <p className="text-sm text-slate-500">No students found.</p>;

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500 border-b">
          <tr>
            <th className="py-2 pr-3">Name</th>
            <th className="py-2 pr-3">Email</th>
            <th className="py-2 pr-3">Course</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const isPending = (s.status || "").toLowerCase() === "pending";
            return (
              <tr key={s._id} className={`border-b ${isPending ? "bg-yellow-50" : ""}`}>
                <td className="py-2 pr-3 font-medium text-slate-900">{s.name}</td>
                <td className="py-2 pr-3 text-slate-700">{s.email}</td>
                <td className="py-2 pr-3 text-slate-700">{s.course}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      isPending
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="py-2 flex gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="rounded-lg border px-2 py-1 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="rounded-lg border border-red-200 text-red-700 px-2 py-1 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
