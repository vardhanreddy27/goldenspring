import { useMemo, useState } from "react";
import { notices, syllabusBySection, teacherPerformance } from "@/components/admin-dashboard/data";

export default function CommunicationView({
  broadcastMessages,
  onBroadcastInputChange,
  onBroadcastSend,
  broadcastForm,
  timetableAssignments,
  onOpenTimetable,
}) {
  const [teacherQuery, setTeacherQuery] = useState("");
  const [teacherPage, setTeacherPage] = useState(1);
  const [syllabusQuery, setSyllabusQuery] = useState("");
  const [syllabusPage, setSyllabusPage] = useState(1);
  const teacherPageSize = 6;
  const syllabusPageSize = 7;

  const highlightedAssignments = timetableAssignments.slice(0, 4);

  const filteredTeachers = useMemo(() => {
    const term = teacherQuery.trim().toLowerCase();
    if (!term) {
      return teacherPerformance;
    }

    return teacherPerformance.filter((row) => {
      return [row.name, row.subject, row.attendance, row.syllabus, row.rating].join(" ").toLowerCase().includes(term);
    });
  }, [teacherQuery]);

  const teacherTotalPages = Math.max(Math.ceil(filteredTeachers.length / teacherPageSize), 1);
  const safeTeacherPage = Math.min(teacherPage, teacherTotalPages);
  const teacherRows = useMemo(() => {
    const start = (safeTeacherPage - 1) * teacherPageSize;
    return filteredTeachers.slice(start, start + teacherPageSize);
  }, [filteredTeachers, safeTeacherPage]);

  const filteredSyllabus = useMemo(() => {
    const term = syllabusQuery.trim().toLowerCase();
    if (!term) {
      return syllabusBySection;
    }

    return syllabusBySection.filter((row) => {
      return [row.className, row.section, row.Mathematics, row.Science, row.English, row.Social].join(" ").toLowerCase().includes(term);
    });
  }, [syllabusQuery]);

  const syllabusTotalPages = Math.max(Math.ceil(filteredSyllabus.length / syllabusPageSize), 1);
  const safeSyllabusPage = Math.min(syllabusPage, syllabusTotalPages);
  const syllabusRows = useMemo(() => {
    const start = (safeSyllabusPage - 1) * syllabusPageSize;
    return filteredSyllabus.slice(start, start + syllabusPageSize);
  }, [filteredSyllabus, safeSyllabusPage]);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Communication</p>
        <h2 className="mt-1 text-2xl font-semibold">Broadcast chat console</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            className="space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
            onSubmit={(event) => {
              event.preventDefault();
              onBroadcastSend();
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Compose message</p>
            <select
              name="audience"
              value={broadcastForm.audience}
              onChange={onBroadcastInputChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="Everyone">Everyone</option>
              <option value="Teachers">Teachers</option>
              <option value="Students">Students</option>
              <option value="Parents">Parents</option>
            </select>
            <textarea
              name="message"
              value={broadcastForm.message}
              onChange={onBroadcastInputChange}
              placeholder="Type announcement message..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Send message</button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live chat timeline</p>
            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1">
              {broadcastMessages.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <p className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">To: {item.audience}</p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {notices.map(({ audience, icon: Icon, sentToday }) => (
            <div key={audience} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-800">{audience}</span>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{sentToday}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Smart substitute allocated</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Late and absent teacher coverage</h3>
            </div>
            <button
              type="button"
              onClick={onOpenTimetable}
              className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              Open full timetable
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {highlightedAssignments.map((item) => (
              <div key={item.id} className="rounded-xl bg-white px-3 py-3 ring-1 ring-blue-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{item.className} • Section {item.section} • {item.period}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.reasonType === "Late" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                    {item.reasonType}
                  </span>
                </div>
                <div className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p><span className="font-semibold text-slate-900">Class subject:</span> {item.subject}</p>
                  <p><span className="font-semibold text-slate-900">Substitute subject:</span> {item.replacementTeacherSubject}</p>
                  <p><span className="font-semibold text-slate-900">Teacher change:</span> {item.previousTeacher} to {item.replacementTeacher}</p>
                  <p><span className="font-semibold text-slate-900">Status:</span> {item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Teacher performance</p>
        <h2 className="mt-1 text-2xl font-semibold">Daily teaching effectiveness</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={teacherQuery}
            onChange={(event) => {
              setTeacherQuery(event.target.value);
              setTeacherPage(1);
            }}
            placeholder="Search teacher or subject"
            className="min-w-56 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
          />
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{filteredTeachers.length} staff</span>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Teacher</th>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Attendance</th>
                <th className="px-3 py-2 font-medium">Syllabus</th>
                <th className="px-3 py-2 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {teacherRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 text-slate-700 hover:bg-blue-50/40">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="px-3 py-3">{row.subject}</td>
                  <td className="px-3 py-3">{row.attendance}</td>
                  <td className="px-3 py-3">{row.syllabus}</td>
                  <td className="px-3 py-3">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {safeTeacherPage} of {teacherTotalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTeacherPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeTeacherPage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setTeacherPage((prev) => Math.min(prev + 1, teacherTotalPages))}
              disabled={safeTeacherPage === teacherTotalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500">Syllabus completion</p>
        <h2 className="mt-1 text-xl font-semibold">Subject wise per section</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={syllabusQuery}
            onChange={(event) => {
              setSyllabusQuery(event.target.value);
              setSyllabusPage(1);
            }}
            placeholder="Search class section"
            className="min-w-56 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
          />
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{filteredSyllabus.length} sections</span>
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Class</th>
                <th className="px-3 py-2 font-medium">Section</th>
                <th className="px-3 py-2 font-medium">Math</th>
                <th className="px-3 py-2 font-medium">Science</th>
                <th className="px-3 py-2 font-medium">English</th>
                <th className="px-3 py-2 font-medium">Social</th>
              </tr>
            </thead>
            <tbody>
              {syllabusRows.map((row) => (
                <tr key={`${row.className}-${row.section}`} className="border-t border-slate-100 text-slate-700 hover:bg-blue-50/40">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.className}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.section}</td>
                  <td className="px-3 py-3">{row.Mathematics}%</td>
                  <td className="px-3 py-3">{row.Science}%</td>
                  <td className="px-3 py-3">{row.English}%</td>
                  <td className="px-3 py-3">{row.Social}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {safeSyllabusPage} of {syllabusTotalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSyllabusPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeSyllabusPage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setSyllabusPage((prev) => Math.min(prev + 1, syllabusTotalPages))}
              disabled={safeSyllabusPage === syllabusTotalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
