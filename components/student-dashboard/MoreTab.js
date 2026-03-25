import { studentProfileDefaults, studentResources } from "@/components/student-dashboard/data";

export default function MoreTab({ profile, onProfileChange, onProfileSave, profileSaving }) {
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-[2rem] bg-white p-6 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)]">
        <p className="text-sm text-slate-500">Student profile</p>
        <h2 className="mt-1 text-2xl font-semibold">Basic details</h2>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="student-name">Name</label>
            <input id="student-name" name="name" value={profile.name} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="student-class">Class</label>
              <input id="student-class" name="className" value={profile.className} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="student-section">Section</label>
              <input id="student-section" name="section" value={profile.section} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="student-roll">Roll number</label>
            <input id="student-roll" name="rollNumber" value={profile.rollNumber} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="student-parent">Parent name</label>
            <input id="student-parent" name="parentName" value={profile.parentName} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="student-contact">Contact</label>
            <input id="student-contact" name="contact" value={profile.contact} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]" />
          </div>

          <button type="submit" className="w-full rounded-2xl bg-[#c79216] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10]" disabled={profileSaving}>
            {profileSaving ? "Saving..." : "Update profile"}
          </button>
        </form>
      </article>

      <article className="rounded-[2rem] bg-white p-6 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)]">
        <p className="text-sm text-slate-500">Resources</p>
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
