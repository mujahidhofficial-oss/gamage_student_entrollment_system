import { useEffect, useMemo, useState } from "react";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
  checkHealth,
} from "../api/studentApi";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";
import SearchFilter from "../components/SearchFilter";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // ✅ Backend Online/Offline
  const [backendOnline, setBackendOnline] = useState(null); // null = checking

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    status: "Pending",
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const pingBackend = async () => {
    try {
      await checkHealth();
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    load();

    // ✅ health check now + every 5s
    pingBackend();
    const id = setInterval(pingBackend, 5000);
    return () => clearInterval(id);
  }, []);

  const courses = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.course))).filter(Boolean);
    return ["All", ...unique];
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchName = (s.name || "").toLowerCase().includes(search.toLowerCase());
      const matchCourse = courseFilter === "All" ? true : s.course === courseFilter;
      return matchName && matchCourse;
    });
  }, [students, search, courseFilter]);

  const stats = useMemo(() => {
    const total = students.length;
    const pending = students.filter((s) => (s.status || "").toLowerCase() === "pending").length;
    const enrolled = students.filter((s) => (s.status || "").toLowerCase() === "enrolled").length;
    const completed = students.filter((s) => (s.status || "").toLowerCase() === "completed").length;
    return { total, pending, enrolled, completed };
  }, [students]);

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email";
    if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits";
    if (!form.course.trim()) return "Course is required";
    if (!form.status.trim()) return "Status is required";
    return "";
  };

  const submit = async () => {
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    try {
      if (editingId) {
        await updateStudent(editingId, form);
      } else {
        await createStudent(form);
      }
      setForm({ name: "", email: "", phone: "", course: "", status: "Pending" });
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.message || "Save failed");
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({
      name: s.name || "",
      email: s.email || "",
      phone: s.phone || "",
      course: s.course || "",
      status: s.status || "Pending",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", course: "", status: "Pending" });
    setError("");
  };

  // ✅ Better delete confirm: shows name
  const remove = async (student) => {
    const name = student?.name || "this student";
    if (!confirm(`Delete "${name}"?`)) return;

    try {
      await deleteStudent(student._id);
      await load();
    } catch {
      setError("Delete failed");
    }
  };

  // ✅ Reset filters
  const resetFilters = () => {
    setSearch("");
    setCourseFilter("All");
  };

  // ✅ Export CSV (filtered list)
  const exportCSV = () => {
    const rows = filtered; // export what user sees
    if (!rows.length) {
      alert("No students to export.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Course", "Status"];
    const escape = (val) => {
      const s = String(val ?? "");
      return `"${s.replace(/"/g, '""')}"`;
    };

    const csv = [
      headers.join(","),
      ...rows.map((s) =>
        [
          escape(s.name),
          escape(s.email),
          escape(s.phone),
          escape(s.course),
          escape(s.status),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const date = new Date();
    const fileName = `students_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}.csv`;

    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-20 bg-slate-900 text-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500 grid place-items-center font-bold">
              SE
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-5">Student Enrollment</h1>
              <p className="text-xs text-slate-300">React • Express • MongoDB</p>
            </div>
          </div>

          {/* ✅ Real Online/Offline */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-200">
            {backendOnline === null ? (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Backend: <span className="font-semibold text-slate-300">Checking...</span>
              </>
            ) : backendOnline ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Backend: <span className="font-semibold text-emerald-300">Online</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Backend: <span className="font-semibold text-red-300">Offline</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* SIDEBAR */}
        <aside className="bg-white rounded-2xl border shadow-sm p-4 h-fit">
          <div className="text-xs font-semibold text-slate-500">MENU</div>

          <nav className="mt-3 space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-medium">
              Dashboard
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
              Students
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
              Reports
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
              Settings
            </button>
          </nav>

          {/* STATS */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard label="Total" value={stats.total} variant="indigo" />
            <StatCard label="Pending" value={stats.pending} variant="amber" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard label="Enrolled" value={stats.enrolled} variant="emerald" />
            <StatCard label="Completed" value={stats.completed} variant="sky" />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {backendOnline === false && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Backend is offline. Please start the backend server.
            </div>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <StudentForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            onSubmit={submit}
            onCancel={cancelEdit}
            error={error}
          />

          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <SearchFilter
              search={search}
              setSearch={setSearch}
              courseFilter={courseFilter}
              setCourseFilter={setCourseFilter}
              courses={courses}
              onReset={resetFilters}
              onExport={exportCSV}
            />

            <StudentTable
              loading={loading}
              students={filtered}
              onEdit={startEdit}
              onDelete={remove}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, variant }) {
  const styles = {
    indigo: "bg-indigo-600 text-white",
    amber: "bg-amber-500 text-white",
    emerald: "bg-emerald-600 text-white",
    sky: "bg-sky-600 text-white",
  };

  return (
    <div className={`rounded-2xl p-3 ${styles[variant]}`}>
      <div className="text-xs opacity-80">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
