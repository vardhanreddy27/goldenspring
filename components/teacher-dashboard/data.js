import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Megaphone,
  Notebook,
  UserCircle2,
} from "lucide-react";

export const TEACHER_SUBJECT = "English";

export const todayClasses = [
  { period: "P1", time: "08:40 AM", subject: "English", className: "8th", section: "A", room: "R-204" },
  { period: "P2", time: "09:35 AM", subject: "English", className: "7th", section: "C", room: "R-112" },
  { period: "P4", time: "11:20 AM", subject: "English", className: "9th", section: "B", room: "R-307" },
  { period: "P6", time: "01:55 PM", subject: "English", className: "10th", section: "A", room: "R-403" },
];

export const weekPlan = [
  { label: "Today", time: "08:30 AM", focus: "Grammar quiz briefing - Class 8A", status: "quiz" },
  { label: "Tomorrow", time: "09:15 AM", focus: "Reading check - Class 7C", status: "homework" },
  { label: "Thu", time: "11:00 AM", focus: "Unit test revision block", status: "exam" },
  { label: "Fri", time: "01:30 PM", focus: "Essay evaluation hour", status: "grading" },
  { label: "Sat", time: "10:00 AM", focus: "Parent feedback notes", status: "meeting" },
];

export const monthlyCalendarEvents = [
  { date: "2026-03-09", type: "quiz", title: "Quiz Day" },
  { date: "2026-03-14", type: "exam", title: "Exam Day" },
  { date: "2026-03-18", type: "homework", title: "Homework Check" },
  { date: "2026-03-22", type: "quiz", title: "Vocabulary Quiz" },
  { date: "2026-03-26", type: "exam", title: "Monthly Exam" },
  { date: "2026-03-29", type: "meeting", title: "PTM Prep" },
];

export const attendanceClasses = [
  {
    id: "class-8a",
    className: "8th",
    section: "A",
    strength: 42,
    entries: [
      { session: "Morning", submittedBy: "You", time: "08:56 AM", present: 39, total: 42, status: "submitted" },
    ],
  },
  {
    id: "class-9b",
    className: "9th",
    section: "B",
    strength: 44,
    entries: [
      { session: "Evening", submittedBy: "Pending", time: "Pending", present: 0, total: 44, status: "pending" },
    ],
  },
];

export const teacherSelfAttendance = {
  todayStatus: "Present",
  checkIn: "08:24 AM",
  monthSummary: "16 / 17 working days",
};

export const dashboardInsights = [
  { title: "Attendance to submit", value: "1 session", note: "Evening attendance for 9B is pending", tone: "amber" },
  { title: "Assignments to review", value: "18", note: "Essay set from 9B and 10A", tone: "blue" },
  { title: "Quiz papers ready", value: "3", note: "Grammar + Vocabulary", tone: "emerald" },
  { title: "Parent updates pending", value: "5", note: "Low attendance alerts", tone: "rose" },
];

export const moreTools = [
  { key: "myPerformance", title: "My Performance", subtitle: "Track teaching goals", icon: UserCircle2 },
  { key: "lessonPlanner", title: "Lesson Planner", subtitle: "Plan weekly delivery", icon: Notebook },
  { key: "quizCenter", title: "Quiz Center", subtitle: "Schedule and evaluate", icon: FileText },
  { key: "markAttendance", title: "Mark Attendance", subtitle: "Quick class entry", icon: ClipboardCheck },
  { key: "announcements", title: "Announcements", subtitle: "Send class updates", icon: Megaphone },
  { key: "learningResources", title: "Learning Resources", subtitle: "Share notes and links", icon: BookOpen },
];

export const moreToolDetails = {
  myPerformance: {
    title: "My Performance",
    summary: "Syllabus completion this month: 87%. Student reading outcomes improved in 3 classes.",
  },
  lessonPlanner: {
    title: "Lesson Planner",
    summary: "You have 4 lessons pending approval for next week. Start with Class 9B literature plan.",
  },
  quizCenter: {
    title: "Quiz Center",
    summary: "3 quizzes are active this week. 1 needs rubric update before publish.",
  },
  markAttendance: {
    title: "Mark Attendance",
    summary: "Open any class from the Attendance tab and submit period-wise attendance from the bottom sheet.",
  },
  announcements: {
    title: "Announcements",
    summary: "Draft reminders are ready for Class 8A and 10A parents. Review and send.",
  },
  learningResources: {
    title: "Learning Resources",
    summary: "Upload revision worksheets for the monthly exam and tag class sections directly.",
  },
};
