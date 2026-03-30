import { studentAssignments, studentAnnouncements, studentTodaySchedule, subjectProgress } from "@/components/student-dashboard/data";

export default function HomeTab() {
  const pendingHomework = studentAssignments.filter((item) => item.status !== "Submitted");
  const averageScore = Math.round(
    subjectProgress.reduce((sum, item) => sum + item.score, 0) / Math.max(subjectProgress.length, 1)
  );
  const orderedSubjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];
  const subjectScoreMap = subjectProgress.reduce((map, item) => {
    map[item.subject] = item.score;
    return map;
  }, {});
  const subjectBars = orderedSubjects.map((subject) => ({
    subject,
    score: subjectScoreMap[subject] ?? 0,
  }));
  const chartBarColors = [
    "bg-amber-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];
  const weakSubjects = [...subjectProgress]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((item) => item.subject)
    .join(", ");

  return (
    <>
      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <h2 className="mt-1 text-2xl font-semibold">Subject Performance</h2>

        <div className="mt-4 rounded-3xl py-3 pe-3">
          <div className="grid grid-cols-[2.8rem_1fr]">
            <div className="flex h-52 items-center justify-center text-[11px] font-semibold text-slate-500">
              <span style={{ writingMode: "vertical-rl" }} className="-rotate-180 text-center">
                Percentage (%) of marks scored
              </span>
            </div>

            <div>
              <div className="relative h-52">
                <div className="relative z-10 grid h-full grid-cols-6 items-end gap-2">
                  {subjectBars.map((item, index) => (
                    <div key={item.subject} className="flex h-full flex-col items-center justify-end gap-1">
                      <span className="text-[11px] font-semibold text-slate-700">{item.score}%</span>
                      <div
                        className={`w-full rounded-t-lg border border-slate-300/70 transition-all duration-300 ${chartBarColors[index % chartBarColors.length]}`}
                        style={{ height: `${Math.max(item.score, 10)}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-6 gap-2 text-center text-[11px] font-semibold text-slate-600">
                {subjectBars.map((item) => (
                  <span key={item.subject}>{item.subject.slice(0, 3)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-slate-900">Key Metrics</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <article className="rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Quiz Performance</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{averageScore}%</p>
            <p className="mt-2 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Average quiz score
            </p>
          </article>

          <article className="rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Homework Due</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{pendingHomework.length}</p>
            <p className="mt-2 inline-flex rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">
              Tasks pending submission
            </p>
          </article>

          <article className="rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Announcements</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{studentAnnouncements.length}</p>
            <p className="mt-2 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Latest school updates
            </p>
          </article>

          <article className="rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Weak Subjects</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{weakSubjects || "None"}</p>
            <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Need extra focus
            </p>
          </article>
        </div>
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
