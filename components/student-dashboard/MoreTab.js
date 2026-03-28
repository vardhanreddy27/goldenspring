import { studentProfileDefaults, studentResources } from "@/components/student-dashboard/data";
import { X } from "lucide-react";

export default function MoreTab({ profile, onProfileChange, onProfileSave, profileSaving }) {
  return (
    <section className="mt-4 grid gap-4">
      <article className="rounded-4xl bg-white p-6 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)]">
        <p className="text-sm text-slate-500">Notes and resources</p>
        <h2 className="mt-1 text-2xl font-semibold">Notes and files</h2>

        <div className="mt-5 space-y-3">
          {studentResources.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <span className="rounded-full bg-[#fff4d6] px-2 py-1 text-xs font-semibold text-[#8b6400]">{item.type}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Updated: {item.updated}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Fees and dues</p>
          <p className="mt-1">Not enabled in this first version, as requested.</p>
        </div>

        <div className="mt-4 rounded-2xl bg-[#fff4d6] p-4 text-sm text-[#8b6400]">
          <p className="font-semibold">Need help?</p>
          <p className="mt-1">Contact class teacher or school office for account and academic support.</p>
        </div>
      </article>
    </section>
  );
}

export function getInitialStudentProfile(storedProfile) {
  return {
    ...studentProfileDefaults,
    ...storedProfile,
  };
}

export function StudentProfileBottomSheet({
  open,
  onClose,
  profile,
  onProfileChange,
  onProfileSave,
  profileSaving,
  onLogout,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Student profile details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close profile popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label htmlFor="student-profile-name" className="text-sm font-medium text-slate-600">Name</label>
            <input
              id="student-profile-name"
              name="name"
              value={profile.name}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="student-profile-class" className="text-sm font-medium text-slate-600">Class</label>
              <input
                id="student-profile-class"
                name="className"
                value={profile.className}
                onChange={onProfileChange}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
              />
            </div>
            <div>
              <label htmlFor="student-profile-section" className="text-sm font-medium text-slate-600">Section</label>
              <input
                id="student-profile-section"
                name="section"
                value={profile.section}
                onChange={onProfileChange}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="student-profile-roll" className="text-sm font-medium text-slate-600">Roll number</label>
            <input
              id="student-profile-roll"
              name="rollNumber"
              value={profile.rollNumber}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="student-profile-parent" className="text-sm font-medium text-slate-600">Parent name</label>
            <input
              id="student-profile-parent"
              name="parentName"
              value={profile.parentName}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="student-profile-contact" className="text-sm font-medium text-slate-600">Contact</label>
            <input
              id="student-profile-contact"
              name="contact"
              value={profile.contact}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-2xl bg-[#c79216] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:bg-[#e6cc8a]"
            >
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
