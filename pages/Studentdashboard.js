import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { UserCircle2 } from "lucide-react";
import HomeTab from "@/components/student-dashboard/HomeTab";
import AttendanceTab from "@/components/student-dashboard/AttendanceTab";
import TimetableTab from "@/components/student-dashboard/TimetableTab";
import AcademicsTab from "@/components/student-dashboard/AcademicsTab";
import MoreTab, { getInitialStudentProfile } from "@/components/student-dashboard/MoreTab";
import { StudentBottomNav, StudentSidebar } from "@/components/student-dashboard/StudentNav";

export default function StudentDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("home");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState(getInitialStudentProfile());

  const showTopHeader = activeMenu === "home" || activeMenu === "more";

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleProfileSave() {
    setProfileSaving(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("studentProfile", JSON.stringify(profileForm));
    }

    setTimeout(() => {
      setProfileSaving(false);
    }, 500);
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("studentProfile");
    }
    router.push("/Student_login");
  }

  const subtitle = useMemo(() => {
    return `Class ${profileForm.className || "-"} • Section ${profileForm.section || "-"}`;
  }, [profileForm.className, profileForm.section]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeMenu]);

  return (
    <div className="min-h-dvh bg-white text-slate-950 lg:flex">
      <StudentSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} onLogout={handleLogout} />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
          {showTopHeader ? (
            <section className="bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 lg:hidden">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c79216] text-base font-bold text-white">N</div>
                    <div>
                      <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                      <p className="text-sm text-slate-500">Student Workspace</p>
                    </div>
                  </div>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome, {profileForm.name || "Student"}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{subtitle}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Roll: {profileForm.rollNumber || "-"}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMenu("more")}
                  className="p-1 text-slate-500 transition-all duration-150 hover:text-slate-800 active:scale-90 lg:hidden"
                  aria-label="Open profile"
                >
                  <UserCircle2 className="h-7 w-7" />
                </button>
              </div>
            </section>
          ) : null}

          <div key={activeMenu} className="page-enter">
            {activeMenu === "home" ? <HomeTab /> : null}
            {activeMenu === "attendance" ? <AttendanceTab /> : null}
            {activeMenu === "timetable" ? <TimetableTab /> : null}
            {activeMenu === "academics" ? <AcademicsTab /> : null}
            {activeMenu === "more" ? (
              <MoreTab
                profile={profileForm}
                onProfileChange={handleProfileChange}
                onProfileSave={handleProfileSave}
                profileSaving={profileSaving}
              />
            ) : null}
          </div>
        </div>

        <StudentBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      </main>
    </div>
  );
}
