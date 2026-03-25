import { studentTimetable } from "@/components/student-dashboard/data";

export default function TimetableTab() {
  return (
    <section className="mt-4">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Weekly timetable</p>
        <h2 className="mt-1 text-2xl font-semibold">Morning and afternoon plan</h2>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#fffaf0] px-4 py-3 text-sm text-[#8b6400]">
          Morning shows P1 to P3. Afternoon shows P4 to P6.
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Morning</p>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Day</th>
                <th className="px-3 py-2 font-medium">P1</th>
                <th className="px-3 py-2 font-medium">P2</th>
                <th className="px-3 py-2 font-medium">P3</th>
              </tr>
            </thead>
            <tbody>
              {studentTimetable.map((row) => (
                <tr key={`${row.day}-morning`} className="border-t border-slate-100 text-slate-700 hover:bg-[#fff4d6]/40">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.day}</td>
                  {row.periods.slice(0, 3).map((subject) => (
                    <td key={`${row.day}-m-${subject}`} className="px-3 py-3">{subject}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Afternoon</p>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Day</th>
                <th className="px-3 py-2 font-medium">P4</th>
                <th className="px-3 py-2 font-medium">P5</th>
                <th className="px-3 py-2 font-medium">P6</th>
              </tr>
            </thead>
            <tbody>
              {studentTimetable.map((row) => (
                <tr key={`${row.day}-afternoon`} className="border-t border-slate-100 text-slate-700 hover:bg-[#fff4d6]/40">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.day}</td>
                  {row.periods.slice(3, 6).map((subject) => (
                    <td key={`${row.day}-a-${subject}`} className="px-3 py-3">{subject}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
