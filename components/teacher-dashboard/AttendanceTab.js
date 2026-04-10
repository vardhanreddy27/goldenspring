import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { X, Check, MapPin, ShieldCheck, Clock } from "lucide-react";
import { teacherSelfAttendance } from "./data";
import { dayKey } from "./utils";

const DUMMY_STUDENTS = {
  "class-8a": [
    { rollNo: "01", name: "Aarav", photo: "/student1.png" },
    { rollNo: "02", name: "Diya", photo: "/student2.png" },
    { rollNo: "03", name: "Karthik", photo: "/student3.png" },
    { rollNo: "04", name: "Saanvi", photo: "/student4.png" },
    { rollNo: "05", name: "Vikram", photo: "/student1.png" },
  ],
  "class-5a": [
    { rollNo: "11", name: "Moksha", photo: "/student3.png" },
    { rollNo: "12", name: "Aditya", photo: "/student1.png" },
    { rollNo: "13", name: "Nithya", photo: "/student2.png" },
    { rollNo: "14", name: "Rahul", photo: "/student3.png" },
    { rollNo: "15", name: "Tara", photo: "/student4.png" },
  ],
};

function buildDraft(targetClass, session) {
  const classStudents = DUMMY_STUDENTS[targetClass.id] || DUMMY_STUDENTS["class-8a"];
  return {
    classId: targetClass.id,
    className: targetClass.className,
    section: targetClass.section,
    session,
    students: classStudents.map((student) => ({ ...student, status: "Present" })),
  };
}

export function AttendanceTab({ classes, attendanceRecords, onSubmitAttendance }) {
  // --- Attendance States ---
  const [attendanceDraft, setAttendanceDraft] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // --- Face Auth States ---
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [activeCheckInSession, setActiveCheckInSession] = useState(null);
  const videoRef = useRef(null);

  const morningClass = classes[0] || null;
  const eveningClass = classes[1] || classes[0] || null;
  const todayKey = dayKey(new Date());

  const todaysRecords = useMemo(
    () => attendanceRecords.filter((entry) => entry.dateKey === todayKey),
    [attendanceRecords, todayKey]
  );

  const morningSubmitted = todaysRecords.some((entry) => entry.session === "Morning");
  const eveningSubmitted = todaysRecords.some((entry) => entry.session === "Evening");

  // --- Student Attendance Handlers ---
  function startAttendance(session) {
    const targetClass = session === "Morning" ? morningClass : eveningClass;
    if (!targetClass) return;
    setAttendanceDraft(buildDraft(targetClass, session));
    setCurrentPage(1);
    setSheetOpen(true);
  }

  function toggleStudent(index) {
    if (!attendanceDraft) return;
    const nextStudents = [...attendanceDraft.students];
    nextStudents[index].status = nextStudents[index].status === "Present" ? "Absent" : "Present";
    setAttendanceDraft({ ...attendanceDraft, students: nextStudents });
  }

  function handleStudentSubmit() {
    if (!attendanceDraft) return;

    const presentCount = attendanceDraft.students.filter(s => s.status === "Present").length;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 1. Submit to parent state
    onSubmitAttendance({
      id: Date.now(),
      dateKey: todayKey,
      classId: attendanceDraft.classId,
      className: attendanceDraft.className,
      section: attendanceDraft.section,
      session: attendanceDraft.session,
      present: presentCount,
      total: attendanceDraft.students.length,
      time: timeString,
      studentStatuses: attendanceDraft.students,
    });

    // 2. UI Close sequence
    setSheetOpen(false);
    setTimeout(() => setAttendanceDraft(null), 300);
  }

  // --- Teacher Face Auth Logic ---
  const startFaceAuth = async (sessionType) => {
    setActiveCheckInSession(sessionType);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 500 }, height: { ideal: 500 } } 
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied");
      setCameraOpen(false);
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setVerificationStatus("verifying");
    setTimeout(() => {
      setVerificationStatus("location");
      setTimeout(() => {
        setVerificationStatus("success");
        setTimeout(() => {
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
          if (activeCheckInSession === 'morning') {
            teacherSelfAttendance.morning.status = "Present";
            teacherSelfAttendance.morning.checkIn = timeString;
          } else {
            teacherSelfAttendance.afternoon.status = "Present";
            teacherSelfAttendance.afternoon.checkIn = timeString;
          }
          stopCamera();
        }, 1500);
      }, 1500);
    }, 2000);
  };

  const stopCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    setCameraOpen(false);
    setVerificationStatus(null);
    setIsVerifying(false);
  };

  const totalPages = attendanceDraft ? Math.ceil(attendanceDraft.students.length / studentsPerPage) : 1;
  const paginatedStudents = attendanceDraft ? attendanceDraft.students.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage) : [];
  const presentCount = attendanceDraft?.students.filter(s => s.status === "Present").length || 0;
  const absentCount = (attendanceDraft?.students.length || 0) - presentCount;

  return (
    <section className="mt-4 space-y-6 pb-20">
      
      {/* 1. ASSIGNED CLASSES */}
      <article className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100">
        <p className="text-sm text-slate-500 font-medium">School attendance</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Mark attendance for assigned classes</h2>
        
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {['Morning', 'Evening'].map((session) => {
            const submitted = session === 'Morning' ? morningSubmitted : eveningSubmitted;
            const target = session === 'Morning' ? morningClass : eveningClass;
            return (
              <div key={session} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{session} Attendance</p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {target ? `Class ${target.className} - Section ${target.section}` : "Not assigned"}
                </p>
                <button
                  onClick={() => startAttendance(session)}
                  disabled={submitted || !target}
                  className="mt-3 w-full rounded-xl bg-[#16c7bd] py-2.5 text-sm font-bold text-white shadow-sm disabled:opacity-50"
                >
                  {submitted ? "Submitted" : `Start ${session} Roll Call`}
                </button>
              </div>
            );
          })}
        </div>

        {/* History of submissions for today */}
        {todaysRecords.length > 0 && (
          <div className="mt-6 space-y-2 border-t pt-4">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recently Submitted</p>
             {todaysRecords.map(rec => (
               <div key={rec.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                 <div>
                    <p className="text-xs font-bold text-slate-800">{rec.session} - Class {rec.className}</p>
                    <p className="text-[10px] text-slate-500">{rec.present}/{rec.total} students present • {rec.time}</p>
                 </div>
                 <Check className="text-emerald-500" size={16} />
               </div>
             ))}
          </div>
        )}
      </article>

      {/* 2. TEACHER CHECK-IN */}
      <article className="px-1">
        <p className="text-sm font-medium text-slate-500">My attendance</p>
        <h2 className="text-2xl font-bold text-slate-900">Check in for today</h2>
        
        <div className="mt-4 rounded-[28px] bg-slate-50 p-4 ring-1 ring-slate-200/60">
          <div className="space-y-3">
            {[ 
              { label: 'MORNING', data: teacherSelfAttendance.morning },
              { label: 'AFTERNOON', data: teacherSelfAttendance.afternoon }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                  {item.data.status === "Present" && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-100">Present</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4 text-slate-300" />
                  <span className="text-sm font-medium">Check in: {item.data.checkIn || "--:--"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => startFaceAuth('morning')}
            disabled={teacherSelfAttendance.morning.status === "Present"}
            className="flex-1 rounded-2xl bg-[#16c7bd] py-4 text-sm font-bold text-white shadow-lg disabled:opacity-50"
          >
            Morning Check In
          </button>
          <button
            onClick={() => startFaceAuth('afternoon')}
            disabled={teacherSelfAttendance.afternoon.status === "Present"}
            className="flex-1 rounded-2xl bg-[#16c7bd] py-4 text-sm font-bold text-white shadow-lg disabled:opacity-50"
          >
            Evening Check In
          </button>
        </div>
      </article>

      {/* 3. ROLL CALL BOTTOM SHEET */}
      {attendanceDraft && (
        <div className={`fixed inset-0 z-50 flex items-end bg-slate-950/35 transition-opacity duration-300 ${sheetOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setSheetOpen(false)}>
          <div className="w-full max-h-[90vh] flex flex-col rounded-t-[32px] bg-white p-5 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="mx-auto h-1.5 w-16 rounded-full bg-slate-200" />
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{attendanceDraft.session} - Class {attendanceDraft.className}</h3>
                <div className="mt-2 inline-flex rounded-full bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
                  Present {presentCount} • Absent {absentCount}
                </div>
              </div>
              <button onClick={() => setSheetOpen(false)} className="rounded-full border p-2 text-slate-400"><X size={18}/></button>
            </div>

            <div className="mt-6 flex-1 overflow-hidden rounded-[24px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between border-b bg-white px-4 py-3">
                <p className="text-xs font-bold text-slate-800">Roll call table</p>
                <div className="flex gap-2">
                   <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="rounded-lg bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-400">Prev</button>
                   <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">Next</button>
                </div>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-50">
                  {paginatedStudents.map((student, idx) => {
                    const globalIdx = (currentPage - 1) * studentsPerPage + idx;
                    const isPresent = student.status === "Present";
                    return (
                      <tr key={student.rollNo}>
                        <td className="px-4 py-4 text-xs font-bold">{student.rollNo}</td>
                        <td className="px-4 py-4">
                          <Image src={student.photo} alt="user" width={36} height={36} className="rounded-full ring-2 ring-white" />
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-slate-700">{student.name}</td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            onClick={() => toggleStudent(globalIdx)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${isPresent ? 'bg-[#16c7bd]' : 'bg-rose-400'}`}
                          >
                            <span className={`h-4 w-4 transform rounded-full bg-white transition-transform ${isPresent ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button 
              onClick={handleStudentSubmit}
              className="mt-6 w-full rounded-2xl bg-[#16c7bd] py-4 font-bold text-white shadow-lg active:scale-95"
            >
              Submit attendance
            </button>
          </div>
        </div>
      )}

      {/* 4. FACE AUTH MODAL */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-6">
          <div className="relative w-full max-w-sm rounded-[48px] bg-white p-10 text-center shadow-2xl animate-in zoom-in">
            <div className="mb-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <ShieldCheck size={14}/> Secure Verification
            </div>
            <h3 className="text-xl font-bold text-slate-800">Liveness Detection</h3>

            <div className="relative mx-auto mt-8 aspect-square w-60">
              <div className={`absolute inset-[-12px] rounded-full border-2 border-dashed border-slate-200 ${isVerifying ? 'animate-spin-slow border-[#16c7bd]' : ''}`} />
              <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-white bg-slate-100 shadow-xl">
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover scale-x-[-1]" />
                {verificationStatus === "location" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-500/80 text-white animate-in fade-in">
                    <MapPin className="mb-2 h-10 w-10 animate-bounce" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Verifying GPS</p>
                  </div>
                )}
                {verificationStatus === "success" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#16c7bd] text-white animate-in zoom-in">
                    <Check size={64} strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            {!isVerifying && verificationStatus !== "success" && (
              <button onClick={handleVerify} className="mt-8 w-full rounded-2xl bg-[#16c7bd] py-4 font-bold text-white active:scale-95">
                Capture & Verify
              </button>
            )}
            {!isVerifying && (
               <button onClick={stopCamera} className="mt-2 w-full py-2 text-sm font-bold text-slate-400">Cancel</button>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}</style>
    </section>
  );
}