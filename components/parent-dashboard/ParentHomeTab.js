import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  TrendingDown,
  BookOpen,
  Award,
  Bell,
  ChevronLeft,
  ChevronRight,
  School,
  UserCircle2,
  Dumbbell,
  Bus,
} from "lucide-react";
import { childInfo, performanceAlerts, upcomingTests, parentNotifications } from "./data";
import { PARENT_LANGUAGES, translateText } from "./i18n";
import { useEffect } from "react";
import { urlBase64ToUint8Array } from "@/utils/push";

const TE_NOTIFICATION_MAP = {
  "Parent-Teacher Meeting This Friday": "ఈ శుక్రవారం తల్లిదండ్రులు-ఉపాధ్యాయుల సమావేశం",
  "The term review meeting is scheduled for Friday at 4:00 PM. Please confirm your slot from the school portal.": "టర్మ్ సమీక్ష సమావేశం శుక్రవారం సాయంత్రం 4:00 గంటలకు నిర్ణయించబడింది. దయచేసి పాఠశాల పోర్టల్ నుండి మీ స్లాట్‌ను నిర్ధారించండి.",
  "Maths Revision Sheet Shared": "గణితం పునర్విమర్శ షీట్ పంచబడింది",
  "A short practice sheet has been uploaded for linear equations and word problems. Please complete it by Monday.": "రేఖీయ సమీకరణలు మరియు పద సమస్యల కోసం ఒక చిన్న సాధన షీట్ అప్‌లోడ్ చేయబడింది. దయచేసి దానిని సోమవారం లోపు పూర్తి చేయండి.",
  "Sports Practice Moved Earlier": "క్రీడా సాధన ముందుకు మార్చబడింది",
  "Athletics practice begins 30 minutes early tomorrow. Please send sports shoes and a water bottle.": "రేపు అథ్లెటిక్స్ సాధన 30 నిమిషాలు ముందుగానే ప్రారంభమవుతుంది. దయచేసి స్పోర్ట్స్ షూస్ మరియు నీటి బాటిల్ పంపండి.",
  "Bus Route Delay Notice": "బస్ మార్గం ఆలస్య సూచన",
  "Morning pickup for your route may run 10 minutes late tomorrow because of road maintenance.": "రోడ్డు పనుల కారణంగా మీ మార్గంలో ఉదయపు పికప్ రేపు 10 నిమిషాలు ఆలస్యం కావచ్చు.",
  "Unit Test Timetable Published": "యూనిట్ పరీక్ష టైమ్‌టేబుల్ విడుదలైంది",
  "The next unit test schedule is now live. Please review the dates and subjects with your child.": "తదుపరి యూనిట్ పరీక్ష షెడ్యూల్ ఇప్పుడు అందుబాటులో ఉంది. దయచేసి తేదీలు మరియు విషయాలను మీ పిల్లతో కలిసి పరిశీలించండి.",
  "Counsellor Check-In Available": "కౌన్సలర్ చెక్-ఇన్ అందుబాటులో ఉంది",
  "Weekly well-being support sessions are open for students preparing for exams and presentations.": "పరీక్షలు మరియు ప్రెజెంటేషన్లకు సిద్ధమవుతున్న విద్యార్థుల కోసం వారపు మద్దతు సమావేశాలు అందుబాటులో ఉన్నాయి.",
  "Library Book Return Reminder": "గ్రంథాలయ పుస్తకం తిరిగి ఇవ్వమని గుర్తు",
  "One library book is due for return by Monday to avoid a late fee.": "లేట్ ఫీజు నివారించేందుకు ఒక గ్రంథాలయ పుస్తకం సోమవారం లోపు తిరిగి ఇవ్వాలి.",
  "Science Activity Materials": "శాస్త్ర కార్యకలాప సామగ్రి",
  "Please bring chart paper and color pens for Monday's digestive system activity.": "సోమవారం జరిగే జీర్ణ వ్యవస్థ కార్యకలాపం కోసం చార్ట్ పేపర్ మరియు రంగు పెన్లు తీసుకురండి.",
  "Safety Drill This Week": "ఈ వారం భద్రతా డ్రిల్",
  "A school safety drill is planned this week. Students will follow class teacher instructions.": "ఈ వారం పాఠశాల భద్రతా డ్రిల్ ప్లాన్ చేయబడింది. విద్యార్థులు తరగతి ఉపాధ్యాయుడి సూచనలను అనుసరిస్తారు.",
  "Fitness Log Submission": "ఫిట్నెస్ లాగ్ సమర్పణ",
  "Please sign and send the weekly fitness log tomorrow for participation tracking.": "పాల్గొనడం ట్రాకింగ్ కోసం వారపు ఫిట్నెస్ లాగ్‌ను సంతకం చేసి రేపు పంపండి.",
  "Principal": "ప్రిన్సిపాల్",
  "Class Teacher": "తరగతి ఉపాధ్యాయుడు",
  "PET": "పీఈటీ",
  "Transport": "రవాణా",
  "Exam Cell": "పరీక్ష విభాగం",
  "Counsellor": "కౌన్సలర్",
  "Library": "గ్రంథాలయం",
  "Subject Teacher": "విషయ ఉపాధ్యాయుడు",
  "School": "పాఠశాల",
  "Academics": "అకాడెమిక్స్",
  "Exams": "పరీక్షలు",
  "Sports": "క్రీడలు",
  "Wellbeing": "ఆరోగ్య సంరక్షణ",
  "Book Slot": "స్లాట్ బుక్ చేయండి",
  "Open Sheet": "షీట్ తెరవండి",
  "Acknowledge": "అంగీకరించండి",
  "View Update": "అప్డేట్ చూడండి",
  "Open Timetable": "టైమ్‌టేబుల్ తెరవండి",
  "Request Slot": "స్లాట్ అభ్యర్థించండి",
  "View Details": "వివరాలు చూడండి",
  "View Materials": "సామగ్రి చూడండి",
  "Read Advisory": "సలహా చదవండి",
  "Open Log": "లాగ్ తెరవండి",
};

function translateNotificationText(lang, value) {
  if (lang === PARENT_LANGUAGES.TE) return TE_NOTIFICATION_MAP[value] || translateText(lang, value);
  return value;
}

export default function ParentHomeTab({ lang = PARENT_LANGUAGES.EN, showNotificationsFeed = true }) {
  // Push notification subscription logic
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // Only subscribe if not already done
    if (window.localStorage.getItem("gs-push-subscribed")) return;
    if (!("Notification" in window)) return;

    let cancelled = false;

    async function subscribeForPush() {
      const permission = Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();

      if (permission !== "granted" || cancelled) return;

      const { publicKey } = await fetch("/api/parent/push-vapid-key").then((res) => res.json());
      if (!publicKey || cancelled) return;

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ||
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

      await fetch("/api/parent/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      window.localStorage.setItem("gs-push-subscribed", "1");
    }

    subscribeForPush().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);
  const t = (text) => translateText(lang, text);
  const tNotification = (text) => translateNotificationText(lang, text);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState(() => new Set());
  const pageSize = 4;

  const categories = useMemo(
    () => ["all", ...new Set(parentNotifications.map((notification) => notification.category))],
    []
  );

  const sources = useMemo(
    () => ["all", ...new Set(parentNotifications.map((notification) => notification.sourceRole))],
    []
  );

  const filteredNotifications = useMemo(() => {
    return parentNotifications
      .filter((notification) => (categoryFilter === "all" ? true : notification.category === categoryFilter))
      .filter((notification) => (sourceFilter === "all" ? true : notification.sourceRole === sourceFilter))
      .filter((notification) => (priorityFilter === "all" ? true : notification.priority === priorityFilter))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [categoryFilter, sourceFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
  const paginatedNotifications = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = parentNotifications.filter((notification) => !readIds.has(notification.id)).length;

  const weakSubjectItems = [
    { subject: t("Maths"), score: 52, tip: t("Revise formulas and solve 5 mixed problems daily.") },
    { subject: t("Science"), score: 48, tip: t("Read one concept summary and practice one diagram.") },
  ];
  const homeworkPreviewItems = [
    { subject: t("English"), title: t("Essay writing") },
    { subject: t("Maths"), title: t("Algebra worksheet") },
  ];
  const translatedUpcomingTests = upcomingTests.slice(0, 3).map((test) => ({
    ...test,
    subject: t(test.subject),
  }));
  const translatedNotifications = paginatedNotifications.map((notification) => ({
    ...notification,
    title: translateNotificationText(lang, notification.title),
    message: translateNotificationText(lang, notification.message),
    sourceRole: translateNotificationText(lang, notification.sourceRole),
    sourceName: translateNotificationText(lang, notification.sourceName),
    category: translateNotificationText(lang, notification.category),
    priority: translateNotificationText(lang, notification.priority),
    actionLabel: translateNotificationText(lang, notification.actionLabel),
  }));

  const childAvatar = childInfo.photo || "/student.jpeg";

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function markAsRead(id) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function markVisibleAsRead() {
    setReadIds((prev) => {
      const next = new Set(prev);
      paginatedNotifications.forEach((notification) => next.add(notification.id));
      return next;
    });
  }

  function getSourceIcon(sourceRole) {
    if (sourceRole === "Principal") return <School className="h-4 w-4" />;
    if (sourceRole === "PET") return <Dumbbell className="h-4 w-4" />;
    if (sourceRole === "Transport") return <Bus className="h-4 w-4" />;
    if (sourceRole === "Library") return <BookOpen className="h-4 w-4" />;
    if (sourceRole === "Counsellor") return <UserCircle2 className="h-4 w-4" />;
    return <UserCircle2 className="h-4 w-4" />;
  }

  function getPriorityTone(priority) {
    if (priority === "high") return "border-rose-200 bg-rose-50 text-rose-700";
    if (priority === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  function getCategoryTone(category) {
    if (category === "Academics") return "bg-sky-50 text-sky-700 border-sky-100";
    if (category === "Exams") return "bg-violet-50 text-violet-700 border-violet-100";
    if (category === "Sports") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (category === "Transport") return "bg-amber-50 text-amber-700 border-amber-100";
    if (category === "Wellbeing") return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-slate-50 text-slate-700 border-slate-200";
  }

  return (
    <div className="space-y-6 py-6">
      {/* Child Overview */}
      <section className="bg-linear-to-r from-[#fff4d6] to-yellow-50 rounded-2xl border border-yellow-100 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-600">{t("CHILD INFO")}</h3>
            <p className="mt-2 text-2xl font-bold text-slate-950">{childInfo.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t("Class")} {childInfo.className} • {t("Section")} {childInfo.section} • {t("Roll")} {childInfo.rollNumber}
            </p>
          </div>
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/80 shadow-sm">
            <Image src={childAvatar} alt={`${childInfo.name} photo`} fill sizes="64px" className="object-cover" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t("Attendance")}</span>
            <span className="text-xs font-semibold text-emerald-700">93% (26/28 days)</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[93%] rounded-full bg-emerald-500" />
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mt-4">
        <h2 className="text-xl font-semibold text-slate-900">{t("Key Metrics")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">{t("Quiz Performance")}</p>
            <div className="flex items-center justify-center">
              <div className="mx-auto mt-1 w-full max-w-36 sm:max-w-40">
                <svg viewBox="0 0 120 80" className="h-auto w-full" aria-hidden="true">
                  <path
                    d="M 10 70 A 50 50 0 0 1 110 70"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 70 A 50 50 0 0 1 110 70"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="10"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray={`${79} 100`}
                  />
                  <text
                    x="60"
                    y="62"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-950 text-[20px] font-semibold sm:text-[24px]"
                  >
                    79%
                  </text>
                </svg>
              </div>
            </div>
            <p className="inline-flex self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {t("Average quiz score")}
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">{t("Homework Due")}</p>
            <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
              <p className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">{homeworkPreviewItems.length}</p>
              <ul className="min-w-0 space-y-1 rounded-xl bg-amber-50/90 p-2 ring-1 ring-amber-100">
                {homeworkPreviewItems.map((item) => (
                  <li key={item.subject} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    <span className="block min-w-0 truncate text-[11px] font-medium text-slate-700" title={`${item.subject}: ${item.title}`}>
                      {item.subject}: {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="inline-flex self-start rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">
              {t("Pending Tasks")}
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">{t("Upcoming Tests")}</p>
            <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
              <p className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">{upcomingTests.length}</p>
              <ul className="min-w-0 space-y-1 rounded-xl bg-blue-50/90 p-2 ring-1 ring-blue-100">
                {translatedUpcomingTests.map((test) => (
                  <li key={test.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                    <span className="block min-w-0 truncate text-[11px] font-medium text-slate-700" title={test.subject}>
                      {test.subject}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="inline-flex self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {t("This week")}
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">{t("Weak Subjects")}</p>
            <div className="min-w-0 space-y-3 self-center">
              {weakSubjectItems.map((item) => (
                <div key={item.subject} className="min-w-0 space-y-1.5">
                  <p className="text-base font-semibold text-slate-900">{item.subject}</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 flex-1 overflow-hidden rounded-full border border-slate-300/80 bg-slate-100"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg, rgba(148,163,184,0.3) 0, rgba(148,163,184,0.3) 4px, rgba(241,245,249,0.95) 4px, rgba(241,245,249,0.95) 8px)",
                      }}
                    >
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{item.score}%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{item.tip}</p>
                </div>
              ))}
            </div>
          
          </article>
        </div>
      </section>

      {showNotificationsFeed ? (
      <>
      {/* Announcements & Notifications */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ecfffd] text-[#0e8f84] ring-1 ring-[#cfeeed]">
                <Bell className="h-4 w-4" />
              </span>
              {t("School Announcements")}
            </h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{t("Important notices from the school office, teachers, sports staff, transport and exam cell.")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 shadow-sm">
              {t("Total")}: {parentNotifications.length}
            </span>
            <span className="rounded-full bg-[#fff6e6] px-3 py-1 font-semibold text-[#9a6b12] shadow-sm">
              {t("High")}: {unreadCount}
            </span>
          </div>
        </div>


        <div className="mt-5 space-y-3">
          {translatedNotifications.map((notification) => {
            const isRead = readIds.has(notification.id);
            return (
              <article
                key={notification.id}
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  isRead ? "border-slate-200 bg-slate-50/80" : "border-[#d8e5ff] bg-linear-to-r from-[#f7faff] to-white shadow-[0_12px_28px_-24px_rgba(15,23,42,0.45)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                        {getSourceIcon(notification.sourceRole)}
                        {notification.sourceRole}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getCategoryTone(notification.category)}`}>
                        {notification.category}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${getPriorityTone(notification.priority)}`}
                      >
                        {notification.priority}
                      </span>
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-slate-950">{notification.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{notification.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {t("By")} {notification.sourceName} • {new Date(notification.date).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
              
                    <button
                      type="button"
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                      {notification.actionLabel}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {paginatedNotifications.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              {t("No notifications match the selected filters.")}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-slate-600">
            {t("Showing")} {filteredNotifications.length === 0 ? 0 : (page - 1) * pageSize + 1} {t("to")} {Math.min(page * pageSize, filteredNotifications.length)} {t("of")} {filteredNotifications.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("Prev")}
            </button>
            <span className="text-slate-700 font-semibold">
              {t("Page")} {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              {t("Next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      </>
      ) : null}
    </div>
  );
}
