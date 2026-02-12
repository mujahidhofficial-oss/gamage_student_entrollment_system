import { useEffect, useMemo, useState } from "react";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
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

  useEffect(() => {
    load();
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

  const remove = async (id) => {
    if (!confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      await load();
    } catch {
      setError("Delete failed");
    }
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

          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Backend: <span className="font-semibold text-emerald-300">Online</span>
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
