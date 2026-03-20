import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { todayClasses, dashboardInsights } from "./data";
import { insightCardTone, dayKey } from "./utils";

export default function HomeTab({ weekDays, today }) {
  const todayKey = dayKey(today);

  // Per-section homework state: key = classId, value = { text, sent }
  const [homeworkState, setHomeworkState] = useState(() =>
    Object.fromEntries(
      todayClasses.map((cls) => [`${cls.className}-${cls.section}`, { text: "", sent: false }])
    )
  );

  function handleTextChange(key, value) {
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], text: value } }));
  }

  function handleSend(key) {
    if (!homeworkState[key]?.text.trim()) return;
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], sent: true } }));
  }

  function handleReset(key) {
    setHomeworkState((prev) => ({ ...prev, [key]: { text: "", sent: false } }));
  }

  return (
    <section className="mt-4 space-y-4">
      <article className="rounded-3xl bg-white p-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.24)]">
        <p className="text-sm text-slate-500">This week</p>
        <h2 className="mt-1 text-lg font-semibold">Teacher calendar view</h2>

        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {weekDays.map((date) => {
            const isToday = dayKey(date) === todayKey;

            return (
              <div key={date.toISOString()} className="text-center">
                <p className="text-[11px] text-slate-500">
                  {date.toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <div
                  className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold ${
                    isToday
                      ? "border border-[#f2b705] bg-[#fff8dc] text-[#8b6400]"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-500">Today&apos;s overview</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {dashboardInsights.map((item) => (
              <div key={item.title} className={`rounded-xl p-3 ring-1 ${insightCardTone(item.tone)}`}>
                <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{item.title}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                <p className="text-xs text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-3xl bg-white p-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.24)]">
        <p className="text-sm text-slate-500">Today classes</p>
        <h2 className="mt-1 text-lg font-semibold">Schedule and homework</h2>

        <div className="mt-3 space-y-3">
          {todayClasses.map((cls) => {
            const key = `${cls.className}-${cls.section}`;
            const state = homeworkState[key];

            return (
              <div key={key} className="rounded-xl border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {cls.subject} · {cls.period} · {cls.time}
                  </p>
                  <p className="text-xs text-slate-600">Class {cls.className} - {cls.section}</p>
                </div>

                {state.sent ? (
                  <div className="mt-2 rounded-lg bg-emerald-50 p-2">
                    <p className="text-sm text-emerald-800">{state.text}</p>
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    placeholder="Write homework..."
                    value={state.text}
                    onChange={(e) => handleTextChange(key, e.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-[#f2b705] focus:ring-2 focus:ring-[#ffeea3]"
                  />
                )}

                <div className="mt-2 flex items-center gap-2">
                  {state.sent ? (
                    <button
                      type="button"
                      onClick={() => handleReset(key)}
                      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!state.text.trim()}
                      onClick={() => handleSend(key)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#f2b705] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </button>
                  )}
                  {state.sent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Sent
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
