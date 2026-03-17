import { ChevronLeft, ChevronRight } from "lucide-react";
import { weekPlan, monthlyCalendarEvents } from "./data";
import { statusStyles, eventDotColor, dayKey } from "./utils";

export default function TimetableTab({ calendarDate, setCalendarDate, monthGrid, monthEventsByDate }) {
  const today = new Date();
  const todayKey = dayKey(today);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      {/* Left — Monthly calendar with event markers */}
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mt-1 text-xl font-semibold">Quiz and exam markers</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white p-2 hover:bg-slate-50"
              onClick={() =>
                setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
              }
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white p-2 hover:bg-slate-50"
              onClick={() =>
                setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
              }
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-800">
          {calendarDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>

        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs text-slate-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {monthGrid.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-12 rounded-xl bg-transparent" />;
            }

            const key = dayKey(date);
            const events = monthEventsByDate[key] || [];
            const isToday = key === todayKey;

            return (
              <div
                key={key}
                className={`flex h-12 flex-col items-center justify-center rounded-xl ring-1 ${
                  isToday
                    ? "bg-[#fff8dc] ring-[#f2b705]"
                    : "bg-slate-50 ring-slate-200"
                }`}
              >
                <span className={`text-sm font-semibold ${isToday ? "text-[#8b6400]" : "text-slate-800"}`}>
                  {date.getDate()}
                </span>
                <div className="mt-1 flex items-center gap-0.5">
                  {events.slice(0, 2).map((event) => (
                    <span
                      key={`${key}-${event.type}-${event.title}`}
                      className={`h-1.5 w-1.5 rounded-full ${eventDotColor(event.type)}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Quiz day
          </span>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Exam day
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            Homework review
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Meeting
          </span>
        </div>

        {/* Events list for selected month */}
        {Object.keys(monthEventsByDate).length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Upcoming this month
            </p>
            {monthlyCalendarEvents.map((event) => (
              <div
                key={`${event.date}-${event.title}`}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${eventDotColor(event.type)}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Right — Calendar timings and weekly plan */}
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Calendar timings</p>
        <h2 className="mt-1 text-xl font-semibold">Upcoming academic flow</h2>

        <div className="mt-4 space-y-3 rounded-3xl bg-[#f7f8fb] p-3 ring-1 ring-slate-200">
          {weekPlan.map((item) => (
            <div key={`${item.label}-time`} className="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {weekPlan.map((item) => (
            <div
              key={`${item.label}-${item.focus}`}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${statusStyles(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
