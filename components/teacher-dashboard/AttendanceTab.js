import { X } from "lucide-react";
import { attendanceClasses, teacherSelfAttendance } from "./data";
import { statusStyles } from "./utils";

export function AttendanceTab({ onOpenClassSheet }) {
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">School attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Send attendance twice a day</h2>

        <div className="mt-4 space-y-3">
          {attendanceClasses.map((classItem) => {
            const pendingCount = classItem.entries.filter((e) => e.status === "pending").length;
            const morningEntry = classItem.entries.find((entry) => entry.session === "Morning");
            const eveningEntry = classItem.entries.find((entry) => entry.session === "Evening");

            return (
              <button
                key={classItem.id}
                type="button"
                onClick={() => onOpenClassSheet(classItem)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-[#fff8dc]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Class {classItem.className} — Section {classItem.section}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">Strength: {classItem.strength}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${
                      pendingCount > 0
                        ? "bg-amber-50 text-amber-700 ring-amber-200"
                        : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    {pendingCount > 0 ? `${pendingCount} pending` : "All submitted"}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {morningEntry ? (
                    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-xs text-slate-500">Morning</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{morningEntry.status}</p>
                    </div>
                  ) : null}
                  {eveningEntry ? (
                    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-xs text-slate-500">Evening</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{eveningEntry.status}</p>
                    </div>
                  ) : null}
                </div>
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Tap to send the morning or evening attendance for this class
                </p>
              </button>
            );
          })}
        </div>
      </article>

      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">My attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Check in for today</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Today status</p>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {teacherSelfAttendance.todayStatus}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-700">Check in: {teacherSelfAttendance.checkIn}</p>
            <p className="mt-3 text-xs text-slate-500">This month: {teacherSelfAttendance.monthSummary}</p>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300]"
          >
            Check In
          </button>
        </div>
      </article>
    </section>
  );
}

export function ClassAttendanceBottomSheet({ openClass, onClose }) {
  if (!openClass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/35" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Attendance sheet</p>
            <h3 className="text-lg font-semibold text-slate-900">
              Class {openClass.className} — Section {openClass.section}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close attendance details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
          {openClass.entries.map((entry) => (
            <div
              key={`${openClass.id}-${entry.session}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{entry.session}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${statusStyles(entry.status)}`}>
                  {entry.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Submitted by: {entry.submittedBy}</p>
              <p className="text-sm text-slate-600">Time: {entry.time}</p>
              <p className="text-sm text-slate-600">
                Present: {entry.present} / {entry.total}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300]"
        >
          Send Attendance
        </button>
      </div>
    </div>
  );
}
