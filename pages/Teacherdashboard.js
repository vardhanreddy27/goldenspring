import { getServerSession } from "next-auth/next";
import { useEffect, useMemo, useState } from "react";
import { UserCircle2 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { TeacherSidebar, TeacherBottomNav } from "@/components/teacher-dashboard/TeacherNav";
import HomeTab from "@/components/teacher-dashboard/HomeTab";
import { AttendanceTab, ClassAttendanceBottomSheet } from "@/components/teacher-dashboard/AttendanceTab";
import TimetableTab from "@/components/teacher-dashboard/TimetableTab";
import { MoreTab, ToolModal } from "@/components/teacher-dashboard/MoreTab";
import { buildMonthCalendar, weekDaysFromDate } from "@/components/teacher-dashboard/utils";
import { TEACHER_SUBJECT, monthlyCalendarEvents } from "@/components/teacher-dashboard/data";







export default function TeacherDashboard({ user }) {
  const [activeMenu, setActiveMenu] = useState("home");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [openClassSheet, setOpenClassSheet] = useState(null);
  const [activeToolModal, setActiveToolModal] = useState(null);

  const today = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => weekDaysFromDate(today), [today]);
  const monthGrid = useMemo(() => buildMonthCalendar(calendarDate), [calendarDate]);

  const monthEventsByDate = useMemo(() => {
    return monthlyCalendarEvents.reduce((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeMenu, openClassSheet, activeToolModal]);

  return (
    <div className="min-h-dvh bg-[#eef3fb] text-slate-950 lg:flex">
      <TeacherSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
          <section className="rounded-4xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2b705] text-base font-bold text-white">N</div>
                  <div>
                    <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                    <p className="text-sm text-slate-500">Teacher Workspace</p>
                  </div>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome, {user?.name || "Teacher"}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Subject: {TEACHER_SUBJECT}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    4 classes today
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMenu("more")}
                className="p-1 text-slate-500 transition-all duration-150 hover:text-slate-800 active:scale-90 lg:hidden"
                aria-label="Open more tools"
              >
                <UserCircle2 className="h-7 w-7" />
              </button>
            </div>
          </section>

          {activeMenu === "home" ? <HomeTab weekDays={weekDays} today={today} /> : null}
          {activeMenu === "attendance" ? <AttendanceTab onOpenClassSheet={setOpenClassSheet} /> : null}
          {activeMenu === "timetable" ? (
            <TimetableTab
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
              monthGrid={monthGrid}
              monthEventsByDate={monthEventsByDate}
            />
          ) : null}
          {activeMenu === "more" ? <MoreTab onOpenToolModal={setActiveToolModal} /> : null}
        </div>

        <TeacherBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      </main>

      <ClassAttendanceBottomSheet openClass={openClassSheet} onClose={() => setOpenClassSheet(null)} />
      <ToolModal activeTool={activeToolModal} onClose={() => setActiveToolModal(null)} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/Teacher_login",
        permanent: false,
      },
    };
  }

  if (session.user?.userType !== "teacher") {
    return {
      redirect: {
        destination: "/Admindashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: session.user?.id || "teacher",
        name: session.user?.name || "Teacher",
        email: session.user?.email || "",
        role: session.user?.role || "teacher",
      },
    },
  };
}
