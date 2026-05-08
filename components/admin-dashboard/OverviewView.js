import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Bell,
  CalendarDays,
  Megaphone,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  attendanceTrend,
  EVENTS,
  metricDrilldown,
  topMetrics,
  trendTabs,
} from "@/components/admin-dashboard/data";
import { parentProfileDefaults } from "@/components/parent-dashboard/data";
import { studentProfileDefaults } from "@/components/student-dashboard/data";

const EMPTY_ROWS = [];

const studentAvatarPool = [
  "/student1.png",
  "/student2.png",
  "/student3.png",
  "/student4.png",
  "/student.jpeg",
];

const upcomingExams = [
  {
    id: "exam-1",
    dateLabel: "12 June",
    subject: "Maths",
    type: "Weekly test",
    image: "/maths.png",
  },
  {
    id: "exam-2",
    audience: "Principal",
    dateLabel: "15 June",
    subject: "Science",
    type: "Monthly test",
    image: "/science.png",
  },
  {
    id: "exam-3",
    dateLabel: "18 June",
    subject: "Biology",
    type: "Surprise test",
    image: "/biology.png",
  },
  {
    id: "exam-4",
    dateLabel: "20 June",
    subject: "English",
    type: "Weekly test",
    image: "/english.png",
  },
];

const initialAnnouncements = [
  {
    id: "a1",
    audience: "Principal",
    title: "School holiday announced for heavy rains",
    message:
      "Classes will remain closed tomorrow. Students should stay home and follow the weather advisory.",
    date: "16/04/26",
    category: "Urgent",
    icon: ShieldAlert,
    accent: "from-rose-500 to-orange-400",
  },
  {
    id: "a2",
    audience: "Teachers",
    title: "Morning attendance review at 8:30 AM",
    message:
      "All class teachers should update attendance before the first bell and report exceptions in the group.",
    date: "16/04/26",
    category: "Reminder",
    icon: Bell,
    accent: "from-indigo-500 to-violet-500",
  },
  {
    id: "a3",
    audience: "Principal",
    title: "Annual day rehearsal schedule shared",
    message:
      "Practice will start from Grade 6. Stage timings and student groups are attached in the notice board.",
    date: "15/04/26",
    category: "Event",
    icon: CalendarDays,
    accent: "from-teal-500 to-cyan-500",
  },
  {
    id: "a4",
    audience: "Teachers",
    title: "Lab safety instructions reissued",
    message:
      "Science and biology staff should ensure safety checklists are complete before practical sessions.",
    date: "15/04/26",
    category: "Policy",
    icon: Megaphone,
    accent: "from-amber-500 to-rose-500",
  },
  {
    id: "a5",
    audience: "Principal",
    title: "Parent meeting postponed by one hour",
    message:
      "Because of road traffic updates, the parent meeting will begin at 10:30 AM instead of 9:30 AM.",
    date: "14/04/26",
    category: "Update",
    icon: MessageSquare,
    accent: "from-sky-500 to-blue-500",
  },
];

const staffBreakdown = [
  { key: "teaching", label: "Teaching Staff", value: 48, color: "#8f89f8" },
  { key: "nonTeaching", label: "Non-Teaching Staff", value: 21, color: "#eb6f40" },
];

const totalStaff = staffBreakdown.reduce((sum, item) => sum + item.value, 0);

function MetricCard({ item, isActive, onOpen, onTrackBuses }) {
  const hasBreakdown = item.breakdown;
  const hasExtendedLayout = Boolean(hasBreakdown || item.helper);

  return (
    <button
      type="button"
      onClick={() => {
        if (item.key === "buses") {
          onTrackBuses?.();
          return;
        }

        onOpen(item.key);
      }}
      className={`w-full rounded-3xl bg-white p-4 text-left shadow-[0_12px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
        hasExtendedLayout ? "h-auto" : "h-28"
      } ${
        isActive
          ? "-translate-y-0.5 ring-2 ring-[#f7e2a3]"
          : "hover:-translate-y-0.5"
      }`}
    >
      {hasBreakdown ? (
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-slate-500">
            {item.title}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "#096dd9" }}
              />
              <span className="text-xs font-semibold text-slate-600">
                Boys {item.breakdown.male}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "#f097e8" }}
              />
              <span className="text-xs font-semibold text-slate-600">
                Girls {item.breakdown.female}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="truncate text-sm font-medium text-slate-500">
          {item.title}
        </p>
      )}

      <div className="mt-3">
        {hasBreakdown ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-3xl font-semibold text-slate-950">
                {item.value}
              </p>

              <div className="inline-flex items-center -space-x-2.5 rounded-full bg-white px-2.5 py-1.5">
                {studentAvatarPool.slice(0, 3).map((avatar, idx) => (
                  <div
                    key={idx}
                    className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white"
                  >
                    <Image
                      src={avatar}
                      alt="Student avatar"
                      width={38}
                      height={38}
                      className="h-9 w-9 object-cover"
                    />
                  </div>
                ))}

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-700 text-[11px] font-bold text-white ring-2 ring-white">
                  +{parseInt(item.value.replace(",", "")) - 3}
                </div>
              </div>
            </div>

            <div className="mt-4 text-left">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-white">
                <div
                  className="flex items-center justify-center"
                  style={{
                    backgroundColor: "#096dd9",
                    width: `${
                      (item.breakdown.male /
                        parseInt(item.value.replace(",", ""))) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="flex items-center justify-center"
                  style={{
                    backgroundColor: "#f097e8",
                    width: `${
                      (item.breakdown.female /
                        parseInt(item.value.replace(",", ""))) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {item.key === "buses" ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-3xl font-semibold text-slate-950">
                  {item.value}
                </p>

                <div className="inline-flex items-center -space-x-3">
                  <Image
                    src="/schoolbus.png"
                    alt="School bus"
                    width={66}
                    height={46}
                    className="h-11 w-auto object-contain"
                  />
                  <Image
                    src="/schoolbus.png"
                    alt="School bus"
                    width={66}
                    height={46}
                    className="h-11 w-auto object-contain"
                  />
                </div>
              </div>
            ) : (
              <p className="text-3xl font-semibold text-slate-950">
                {item.value}
              </p>
            )}

            {item.helper ? (
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {item.helper}
              </p>
            ) : null}
          </>
        )}
      </div>
    </button>
  );
}

function StaffBreakdownCard() {
  return (
    <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] outline-none sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Staff strength</p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center">
        <div className="flex items-center justify-center">
          <div className="relative h-48 w-full max-w-72 outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={staffBreakdown}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  cornerRadius={12}
                  strokeLinecap="round"
                  stroke="#ffffff"
                  strokeWidth={6}
                >
                  {staffBreakdown.map((item) => (
                    <Cell key={item.key} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-l font-black tracking-tight text-slate-900">
                  Total Staff
                </p>
                <p className="mt-1 text-xl font-medium text-slate-900">
                  {totalStaff}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {staffBreakdown.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-lg"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-base font-medium text-slate-900">
                  {item.label}
                </p>
              </div>

              <p className="text-2xl font-semibold text-slate-600">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingEvents() {
  const getDateParts = (dateLabel) => {
    const leftSide = dateLabel.split("•")[0] || "";
    const dayMonth = leftSide.split(",").pop()?.trim() || "";
    const [day = "--", month = "---"] = dayMonth.split(" ");

    return { day, month: month.toUpperCase() };
  };

  return (
    <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">School calendar</p>
          <h2 className="text-xl font-semibold text-slate-950">
            Upcoming events
          </h2>
        </div>

        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-0"
        >
          See all
        </button>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:-mx-5 sm:px-5">
        <div className="flex min-w-max gap-4 pb-1">
          {EVENTS.map((event, index) => {
            const dateParts = getDateParts(event.date);

            return (
              <article
                key={event.id}
                className={`stagger-item relative w-70 shrink-0 overflow-hidden rounded-4xl bg-linear-to-br ${event.gradient} p-4 text-white`}
                style={{ "--stagger-delay": `${90 + index * 70}ms` }}
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-white text-slate-900 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.7)]">
                    <div className="text-center leading-none">
                      <p className="text-base font-black tracking-tight">
                        {dateParts.day}
                      </p>
                      <p className="mt-0.5 text-[8px] font-semibold tracking-[0.16em] text-slate-500">
                        {dateParts.month}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    {event.status}
                  </span>
                </div>

                <h3 className="text-xl font-semibold leading-tight">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-white/85">
                  {event.date}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-white/85">
                  {event.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AnnouncementBoard() {
  const [activeAudience, setActiveAudience] = useState("All");
  const [page, setPage] = useState(1);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sending, setSending] = useState(false);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  const pageSize = 3;

  const filteredAnnouncements = useMemo(() => {
    if (activeAudience === "All") {
      return announcements;
    }

    return announcements.filter((item) => item.audience === activeAudience);
  }, [activeAudience, announcements]);

  const totalPages = Math.max(
    Math.ceil(filteredAnnouncements.length / pageSize),
    1
  );
  const safePage = Math.min(page, totalPages);

  const visibleAnnouncements = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAnnouncements.slice(start, start + pageSize);
  }, [filteredAnnouncements, safePage]);

  const whatsappRecipients = useMemo(() => {
    const candidates = [
      parentProfileDefaults.contact,
      studentProfileDefaults.contact,
    ];

    return [...new Set(candidates.filter(Boolean))];
  }, []);

  function normalizeIndianPhone(phone) {
    let cleanPhone = String(phone || "").replace(/\D/g, "");

    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    return cleanPhone;
  }

  async function sendWhatsAppMessages(message) {
    const results = [];

    for (const phone of whatsappRecipients) {
      const cleanPhone = normalizeIndianPhone(phone);

      if (!cleanPhone) {
        continue;
      }

      try {
        const response = await fetch("/api/admin/send-whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: cleanPhone, message }),
        });

        const payload = await response.json().catch(() => ({}));
        console.log("WhatsApp API response:", payload);
        results.push({
          phone: cleanPhone,
          success: response.ok,
          response: payload,
        });
      } catch (error) {
        const failure = {
          phone: cleanPhone,
          success: false,
          response: { error: error.message || "WhatsApp request failed" },
        };
        console.log("WhatsApp API response:", failure.response);
        results.push(failure);
      }
    }

    console.log("All WhatsApp results:", results);
    return results;
  }

  const audienceTabs = ["All", "Principal", "Teachers"];

  const getAvatar = (audience) =>
    audience === "Teachers" ? "/teacher.avif" : "/principal.png";

  return (
    <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Notice board</p>
          <h2 className="text-xl font-semibold text-slate-950">
            School announcements
          </h2>
        </div>
      </div>

      <div className="mt-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-sm font-semibold text-slate-900">
          Compose announcement
        </p>

        <div className="mt-3 grid gap-3">
          <input
            type="text"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            placeholder="Announcement title"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring"
          />

          <textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder="Write the announcement message"
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring"
          />

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={sendWhatsApp}
              onChange={(event) => setSendWhatsApp(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            Send WhatsApp also
          </label>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-slate-800 focus:outline-none focus:ring-0"
            disabled={sending || !draftTitle || !draftMessage}
            onClick={async () => {
              setSending(true);
              try {
                const response = await fetch("/api/admin/send-push", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title: draftTitle, message: draftMessage }),
                });

                const payload = await response.json().catch(() => ({}));
                if (!response.ok) {
                  throw new Error(payload?.error || "Failed to send push notification.");
                }

                let whatsappResults = [];
                if (sendWhatsApp) {
                  whatsappResults = await sendWhatsAppMessages(draftMessage.trim());
                }

                setAnnouncements((prev) => [
                  {
                    id: `draft-${Date.now()}`,
                    audience: "Principal",
                    title: draftTitle.trim(),
                    message: draftMessage.trim(),
                    date: new Date().toLocaleDateString("en-GB"),
                    category: "Announcement",
                    icon: Megaphone,
                    accent: "from-slate-500 to-slate-700",
                  },
                  ...prev,
                ]);
                setDraftTitle("");
                setDraftMessage("");

                if (sendWhatsApp && whatsappResults.some((item) => item.success)) {
                  alert("Push + WhatsApp sent successfully");
                } else {
                  alert("Notification sent successfully");
                }
              } catch (e) {
                alert(e.message || "Failed to send push notification.");
              } finally {
                setSending(false);
              }
            }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {audienceTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveAudience(tab);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium outline-none transition focus:outline-none focus:ring-0 ${
              activeAudience === tab
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {visibleAnnouncements.map((item) => {
          const avatar = getAvatar(item.audience);

          return (
            <article
              key={item.id}
              className="relative rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                    <Image
                      src={avatar}
                      alt={item.audience === "Teachers" ? "Teacher" : "Principal"}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                        {item.audience}
                      </span>

                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right sm:pt-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {item.date}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Page {safePage} of {totalPages} ·{" "}
          {filteredAnnouncements.length} announcements
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={safePage === 1}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={safePage === totalPages}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function UpcomingExams() {
  return (
    <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
      <div className="mb-4">
        <div>
          <p className="text-sm text-slate-500">Exam timetable</p>
          <h2 className="text-xl font-semibold text-slate-950">
            Upcoming exams
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {upcomingExams.slice(0, 3).map((exam, index) => (
          <article
            key={exam.id}
            className="stagger-item flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3"
            style={{ "--stagger-delay": `${100 + index * 55}ms` }}
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl p-1">
              <Image
                src={exam.image}
                alt={`${exam.subject} subject`}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-base font-semibold text-slate-900">
                  {exam.subject}
                </p>
                <p className="shrink-0 text-xs font-semibold text-black">
                  {exam.dateLabel}
                </p>
              </div>

              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {exam.type}
              </p>
            </div>
          </article>
        ))}

        <button
          type="button"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-0"
        >
          View all exams
        </button>
      </div>
    </section>
  );
}

export default function OverviewView({
  activeTrend,
  onTrendChange,
  activeMetric,
  onOpenMetric,
  onNavigate,
}) {
  const trend = attendanceTrend[activeTrend] || attendanceTrend.Today;
  const handleBusNavigate = onNavigate || (() => {});

  return (
    <div className="school-overview">
      <StaffBreakdownCard />

      <section className="mt-4">
        <div className="stagger-item" style={{ "--stagger-delay": "80ms" }}>
          <MetricCard
            item={topMetrics.find((metric) => metric.key === "students")}
            isActive={activeMetric === "students"}
            onOpen={onOpenMetric}
            onTrackBuses={() => handleBusNavigate("buses")}
          />
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {topMetrics
          .filter(
            (item) =>
              item.key !== "teaching" &&
              item.key !== "nonTeaching" &&
              item.key !== "students"
          )
          .map((item, index) => (
            <div
              key={item.key}
              className="stagger-item"
              style={{ "--stagger-delay": `${125 + index * 45}ms` }}
            >
              <MetricCard
                item={item}
                isActive={activeMetric === item.key}
                onOpen={onOpenMetric}
                onTrackBuses={() => handleBusNavigate("buses")}
              />
            </div>
          ))}
      </section>

      {/* DrilldownPanel removed as per request */}

      <UpcomingEvents />

      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div>
          <p className="text-sm text-slate-500">Attendance trend</p>
          <h2 className="mt-1 text-2xl font-semibold">
            Class wise attendance
          </h2>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {trendTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTrendChange(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium outline-none focus:outline-none focus:ring-0 ${
                  activeTrend === tab
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 h-64 min-h-64 min-w-0 rounded-3xl sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trend}
              margin={{ top: 8, right: 0, left: 8, bottom: 0 }}
              barCategoryGap="10%"
            >
              <CartesianGrid
                vertical
                horizontal
                stroke="#dbe3f0"
                strokeDasharray="2 3"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                width={36}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
              <Bar
                dataKey="students"
                fill="#16c7bd"
                radius={[8, 8, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <AnnouncementBoard />

      <UpcomingExams />

      <style jsx global>{`
        .school-overview .recharts-wrapper,
        .school-overview .recharts-wrapper svg,
        .school-overview .recharts-wrapper *,
        .school-overview .recharts-surface,
        .school-overview .recharts-sector {
          outline: none !important;
        }

        .school-overview button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
