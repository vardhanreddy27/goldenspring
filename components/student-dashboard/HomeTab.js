import { studentAssignments, studentAnnouncements, studentSummary, studentTodaySchedule } from "@/components/student-dashboard/data";

function toneClasses(tone) {
  if (tone === "emerald") return "bg-emerald-50 text-emerald-700";
  if (tone === "blue") return "bg-sky-50 text-sky-700";
  if (tone === "rose") return "bg-rose-50 text-rose-700";
  return "bg-[#fff4d6] text-[#8b6400]";
}

export default function HomeTab() {
  return (
    <>
      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {studentSummary.map((item, index) => (
          <article key={item.title} className="stagger-item rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]" style={{ "--stagger-delay": `${50 + index * 40}ms` }}>
            <p className="text-sm text-slate-500">{item.title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses(item.tone)}`}>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Today schedule</p>
          <h2 className="mt-1 text-2xl font-semibold">Classes and rooms</h2>
          <div className="mt-4 space-y-3">
            {studentTodaySchedule.map((slot) => (
              <div key={`${slot.period}-${slot.subject}`} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{slot.period} • {slot.subject}</p>
                  <p className="text-xs font-semibold text-slate-500">{slot.time}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">{slot.teacher}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Homework tracker</p>
          <h2 className="mt-1 text-2xl font-semibold">Pending and submitted</h2>
          <div className="mt-4 space-y-2">
            {studentAssignments.slice(0, 4).map((work) => (
              <div key={work.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{work.subject}: {work.title}</p>
                  <p className="text-xs text-slate-500">Due: {work.dueDate}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${work.status === "Submitted" ? "bg-emerald-50 text-emerald-700" : "bg-[#fff4d6] text-[#8b6400]"}`}>
                  {work.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Announcements</p>
        <h2 className="mt-1 text-2xl font-semibold">Latest updates</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {studentAnnouncements.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4d6] text-[#8b6400]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{item.time}</p>
                </div>
                <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
