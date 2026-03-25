import { attendanceLog, attendanceMonthly } from "@/components/student-dashboard/data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AttendanceTab() {
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Monthly attendance</p>
        <h2 className="mt-1 text-2xl font-semibold">Presence trend</h2>
        <div className="mt-5 h-72 rounded-3xl bg-slate-50 p-4 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceMonthly}>
              <defs>
                <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c79216" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c79216" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#dbe3f0" strokeDasharray="4 4" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="present" stroke="#c79216" fill="url(#attendanceFill)" strokeWidth={3} />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Daily log</p>
        <h2 className="mt-1 text-2xl font-semibold">Recent attendance</h2>
        <div className="mt-4 space-y-2">
          {attendanceLog.map((row) => (
            <div key={row.date} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{row.date}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {row.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Check-in: {row.checkIn}</p>
              <p className="text-xs text-slate-500">{row.note}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
