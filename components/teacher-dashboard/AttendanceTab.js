import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Camera, RefreshCw, Check, AlertCircle, MapPin, ShieldCheck } from "lucide-react";
import { teacherSelfAttendance } from "./data";
import { dayKey, statusStyles } from "./utils";

const DUMMY_STUDENTS = {
  "class-8a": [
    { rollNo: "01", name: "Aarav", photo: "/student1.png" },
    { rollNo: "02", name: "Diya", photo: "/student2.png" },
    { rollNo: "03", name: "Karthik", photo: "/student3.png" },
    { rollNo: "04", name: "Saanvi", photo: "/student4.png" },
    { rollNo: "05", name: "Vikram", photo: "/student1.png" },
  ],
  "class-5a": [
    { rollNo: "11", name: "Moksha", photo: "/student2.png" },
    { rollNo: "12", name: "Aditya", photo: "/student3.png" },
    { rollNo: "13", name: "Nithya", photo: "/student4.png" },
    { rollNo: "14", name: "Rahul", photo: "/student1.png" },
    { rollNo: "15", name: "Tara", photo: "/student2.png" },
  ],
};

function buildDraft(targetClass, session) {
  const classStudents = DUMMY_STUDENTS[targetClass.id] || DUMMY_STUDENTS["class-8a"];
  return {
    classId: targetClass.id,
    className: targetClass.className,
    section: targetClass.section,
    session,
    currentIndex: 0,
    students: classStudents.map((student) => ({ ...student, status: "Present" })),
  };
}

export function AttendanceTab({ classes, attendanceRecords, onSubmitAttendance }) {
  // --- Attendance State ---
  const [attendanceDraft, setAttendanceDraft] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  // --- Auth & Camera State ---
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'verifying', 'location', 'success', 'error'
  const [checkInType, setCheckInType] = useState(null);
  
  const videoRef = useRef(null);

  // --- Attendance Logic ---
  const morningClass = classes[0] || null;
  const eveningClass = classes[1] || classes[0] || null;
  const todayKey = dayKey(new Date());
  const todaysRecords = useMemo(
    () => attendanceRecords.filter((entry) => entry.dateKey === todayKey),
    [attendanceRecords, todayKey]
  );

  const morningSubmitted = todaysRecords.some((entry) => entry.session === "Morning");
  const eveningSubmitted = todaysRecords.some((entry) => entry.session === "Evening");

  // --- Camera & Dummy Auth Logic ---
  const startCamera = async (type) => {
    setCheckInType(type);
    setCameraOpen(true);
    setVerificationStatus(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 500 },
          height: { ideal: 500 }
        } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setVerificationStatus("error");
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setVerificationStatus("verifying");

    // Stage 1: Simulate Face Scan
    setTimeout(() => {
      setVerificationStatus("location");
      
      // Stage 2: Simulate Location Check
      setTimeout(() => {
        setVerificationStatus("success");
        setIsVerifying(false);

        // Stage 3: Finalize and Close
        setTimeout(() => {
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          
          if (checkInType === 'morning') {
            teacherSelfAttendance.morning.status = "Present";
            teacherSelfAttendance.morning.checkIn = timeString;
          } else {
            teacherSelfAttendance.afternoon.status = "Present";
            teacherSelfAttendance.afternoon.checkIn = timeString;
          }
          stopCamera();
        }, 2000);
      }, 1500);
    }, 2000);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
    setVerificationStatus(null);
    setIsVerifying(false);
  };

  // --- Student List Logic ---
  function startAttendance(session) {
    const targetClass = session === "Morning" ? morningClass : eveningClass;
    if (!targetClass) return;
    setAttendanceDraft(buildDraft(targetClass, session));
    setCurrentPage(1);
    setTimeout(() => setSheetOpen(true), 10);
  }

  const totalPages = attendanceDraft ? Math.ceil(attendanceDraft.students.length / studentsPerPage) : 1;
  const paginatedStudents = attendanceDraft ? attendanceDraft.students.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage) : [];

  return (
    <section className="mt-4 space-y-4">
      {/* Assigned Classes Section */}
      <article className="bg-(--app-surface) p-4 sm:p-5 shadow-sm rounded-2xl">
        <p className="text-sm text-slate-500">School attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Mark attendance for assigned classes</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-(--app-border) bg-(--app-surface-muted) p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Morning Attendance - 9 B</p>
                <button
                    onClick={() => startAttendance("Morning")}
                    disabled={morningSubmitted || !morningClass}
                    className="mt-2 w-full rounded-xl bg-[#16c7bd] py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {morningSubmitted ? "Submitted" : "Start Roll Call"}
                </button>
            </div>
            <div className="rounded-2xl border border-(--app-border) bg-(--app-surface-muted) p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Evening Class - 10 A</p>
                <button
                    onClick={() => startAttendance("Evening")}
                    disabled={eveningSubmitted || !eveningClass}
                    className="mt-2 w-full rounded-xl bg-[#16c7bd] py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {eveningSubmitted ? "Submitted" : "Start Roll Call"}
                </button>
            </div>
        </div>
      </article>

      {/* Teacher Self Attendance Section */}
      <article className="bg-(--app-surface) p-4 sm:p-5 shadow-sm rounded-2xl">
        <p className="text-sm text-slate-500">My attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Check in for today</h2>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => startCamera('morning')}
            disabled={teacherSelfAttendance.morning.status === "Present"}
            className="flex-1 rounded-2xl bg-[#16c7bd] px-4 py-4 text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            Morning Check In
          </button>
          <button
            onClick={() => startCamera('afternoon')}
            disabled={teacherSelfAttendance.afternoon.status === "Present"}
            className="flex-1 rounded-2xl bg-[#16c7bd] px-4 py-4 text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            Afternoon Check In
          </button>
        </div>
      </article>

      {/* --- LIVENESS AUTH MODAL --- */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-6">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[40px] bg-white p-8 text-center shadow-2xl animate-in zoom-in duration-300">
            
            {/* Close Button */}
            {!isVerifying && verificationStatus !== 'success' && (
                <button onClick={stopCamera} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-6 w-6" />
                </button>
            )}
            
            <div className="flex flex-col items-center">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <ShieldCheck className="h-3 w-3" /> Secure Auth
                </div>
                <h3 className="mb-8 text-xl font-bold text-slate-800">Liveness Detection</h3>

                {/* Circular Camera Mask */}
                <div className="relative aspect-square w-64">
                    {/* Rotating Ring */}
                    <div className={`absolute inset-[-10px] rounded-full border-2 border-dashed border-slate-200 ${isVerifying ? 'animate-spin-slow border-[#16c7bd]' : ''}`} />
                    
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-white bg-slate-100 shadow-xl">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full object-cover scale-x-[-1]" 
                        />

                        {/* Verification States Overlays */}
                        {verificationStatus === "verifying" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#16c7bd]/30 backdrop-blur-[2px]">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
                                <p className="mt-4 text-xs font-bold text-white uppercase tracking-widest">Scanning Face</p>
                            </div>
                        )}

                        {verificationStatus === "location" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-500/80 text-white animate-in fade-in">
                                <MapPin className="mb-2 h-12 w-12 animate-bounce" />
                                <p className="text-xs font-bold uppercase tracking-widest">Verifying GPS</p>
                            </div>
                        )}

                        {verificationStatus === "success" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#16c7bd] text-white animate-in zoom-in duration-500">
                                <Check className="h-20 w-20" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Message Area */}
                <div className="mt-10 min-h-[60px]">
                    {verificationStatus === "success" ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <p className="text-xl font-bold text-[#16c7bd]">Success!</p>
                            <p className="mt-1 text-sm font-medium text-slate-500">You are inside school premises</p>
                        </div>
                    ) : (
                        <p className={`text-sm font-medium transition-colors ${isVerifying ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isVerifying ? "Processing security checks..." : "Please look straight into the camera"}
                        </p>
                    )}
                </div>

                {/* Primary Action Button */}
                {!isVerifying && verificationStatus !== "success" && (
                    <button
                        onClick={handleVerify}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16c7bd] py-4 font-bold text-white shadow-lg shadow-cyan-100 transition-all hover:bg-[#13b4ab] active:scale-95"
                    >
                        <Camera className="h-5 w-5" />
                        Capture & Verify
                    </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ... (Rest of your attendance table/sheet code remains the same) ... */}
    </section>
  );
}