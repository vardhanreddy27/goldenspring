import {
  Bell,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  GraduationCap,
  LayoutGrid,
  MoreHorizontal,
  UserCircle2,
  TrendingDown,
} from "lucide-react";

export const parentMenuItems = [
  { id: "home", label: "Home", icon: LayoutGrid },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "more", label: "More", icon: MoreHorizontal },
];

export const parentSummary = [
  { title: "Attendance", value: "93%", note: "Present 26 / 28 days", tone: "emerald" },
  { title: "Homework Pending", value: "3", note: "3 subjects", tone: "amber" },
  { title: "Weak Subjects", value: "2", note: "Math, Social", tone: "rose" },
  { title: "Upcoming Tests", value: "2", note: "This week", tone: "blue" },
];

// Child info shown in parent dashboard
export const childInfo = {
  name: "Arjun Kumar",
  className: "8th",
  section: "A",
  rollNumber: "23",
  photo: null,
};

// Pending homework - shows what's due when
export const pendingHomework = [
  { id: 1, subject: "English", title: "'నా పాఠశాల' పై వ్యాస రచన", dueDate: "2026-03-28", priority: "high", description: "500 పదాల వ్యాసం రాయండి" },
  { id: 2, subject: "Maths", title: "బీజగణిత వర్క్‌షీట్ - సమీకరణాలు", dueDate: "2026-03-29", priority: "high", description: "అభ్యాసాలు 5.1 నుండి 5.3 పూర్తి చేయండి" },
  { id: 3, subject: "Science", title: "జీర్ణ వ్యవస్థ చిత్రం", dueDate: "2026-03-30", priority: "medium", description: "వివరణతో లేబుల్ చేసిన చిత్రం" },
  { id: 4, subject: "Social", title: "అధ్యాయ నోట్లు - వాతావరణం", dueDate: "2026-03-31", priority: "medium", description: "అధ్యాయం 12 చేతివ్రాత నోట్స్ పూర్తి చేయండి" },
];

// Assignments - shown separately in assignments tab
export const studentAssignments = [
  { id: 1, subject: "English", title: "వ్యాస రచన", dueDate: "2026-03-28", status: "Pending", description: "500 పదాల వ్యాసం రాయండి" },
  { id: 2, subject: "Maths", title: "బీజగణిత వర్క్‌షీట్", dueDate: "2026-03-29", status: "Pending", description: "అభ్యాసాలు 5.1 నుండి 5.3 పూర్తి చేయండి" },
  { id: 3, subject: "Science", title: "జీర్ణ వ్యవస్థ చిత్రం", dueDate: "2026-03-30", status: "Submitted", description: "వివరణతో లేబుల్ చేసిన చిత్రం" },
  { id: 4, subject: "Social", title: "అధ్యాయ నోట్లు - వాతావరణం", dueDate: "2026-03-31", status: "Pending", description: "అధ్యాయం 12 చేతివ్రాత నోట్స్ పూర్తి చేయండి" },
];

// Subject performance - SHOWS WHERE CHILD IS LACKING
export const subjectPerformance = [
  { subject: "English", score: 78, target: 85, completion: 82, trend: "up", status: "good" },
  { subject: "Maths", score: 62, target: 80, completion: 76, trend: "down", status: "weak" }, // WEAK
  { subject: "Science", score: 81, target: 85, completion: 80, trend: "up", status: "good" },
  { subject: "Social", score: 68, target: 80, completion: 73, trend: "down", status: "weak" }, // WEAK
  { subject: "Hindi", score: 80, target: 85, completion: 84, trend: "stable", status: "good" },
  { subject: "Telugu", score: 83, target: 85, completion: 88, trend: "up", status: "good" },
];

// Performance alerts for parent
export const performanceAlerts = [
  { type: "weak-subject", subject: "Maths", score: 62, message: "గణిత స్కోర్ 8 పాయింట్లు తగ్గింది. దృష్టి అవసరం.", severity: "high" },
  { type: "weak-subject", subject: "Social", score: 68, message: "సామాజిక శాస్త్రం సగటు కంటే తక్కువగా ఉంది. నోట్స్ తిరిగి చూడండి.", severity: "high" },
  { type: "pending-homework", subject: "English", message: "వ్యాసం రేపు గడువు - ఇంకా సమర్పించలేదు", severity: "medium" },
  { type: "attendance", message: "ఈ నెల 2 గైర్హాజరీలు ఉన్నాయి - జాగ్రత్తగా గమనించండి", severity: "medium" },
];

// School-wide and class-level messages shown in parent dashboard
export const parentNotifications = [
  {
    id: 1,
    title: "ఈ శుక్రవారం తల్లిదండ్రులు-ఉపాధ్యాయుల సమావేశం",
    message: "టర్మ్ సమీక్ష సమావేశం శుక్రవారం సాయంత్రం 4:00 గంటలకు నిర్ణయించబడింది. దయచేసి పాఠశాల పోర్టల్ నుండి మీ స్లాట్‌ను నిర్ధారించండి.",
    sourceRole: "Principal",
    sourceName: "Dr. N. Sreenivas",
    category: "School",
    priority: "high",
    actionLabel: "Book Slot",
    date: "2026-03-29T09:30:00+05:30",
  },
  {
    id: 2,
    title: "గణితం పునర్విమర్శ షీట్ పంచబడింది",
    message: "రేఖీయ సమీకరణలు మరియు పద సమస్యల కోసం ఒక చిన్న సాధన షీట్ అప్‌లోడ్ చేయబడింది. దయచేసి దానిని సోమవారం లోపు పూర్తి చేయండి.",
    sourceRole: "Class Teacher",
    sourceName: "Ms. Kavya",
    category: "Academics",
    priority: "high",
    actionLabel: "Open Sheet",
    date: "2026-03-29T14:10:00+05:30",
  },
  {
    id: 3,
    title: "క్రీడా సాధన ముందుకు మార్చబడింది",
    message: "రేపు అథ్లెటిక్స్ సాధన 30 నిమిషాలు ముందుగానే ప్రారంభమవుతుంది. దయచేసి స్పోర్ట్స్ షూస్ మరియు నీటి బాటిల్ పంపండి.",
    sourceRole: "PET",
    sourceName: "Mr. Raghav",
    category: "Sports",
    priority: "medium",
    actionLabel: "Acknowledge",
    date: "2026-03-28T18:20:00+05:30",
  },
  {
    id: 4,
    title: "బస్ మార్గం ఆలస్య సూచన",
    message: "రోడ్డు పనుల కారణంగా మీ మార్గంలో ఉదయపు పికప్ రేపు 10 నిమిషాలు ఆలస్యం కావచ్చు.",
    sourceRole: "Transport",
    sourceName: "Transport Desk",
    category: "Transport",
    priority: "medium",
    actionLabel: "View Update",
    date: "2026-03-28T20:05:00+05:30",
  },
  {
    id: 5,
    title: "యూనిట్ పరీక్ష టైమ్‌టేబుల్ విడుదలైంది",
    message: "తదుపరి యూనిట్ పరీక్ష షెడ్యూల్ ఇప్పుడు అందుబాటులో ఉంది. దయచేసి తేదీలు మరియు విషయాలను మీ పిల్లతో కలిసి పరిశీలించండి.",
    sourceRole: "Exam Cell",
    sourceName: "Assessment Team",
    category: "Exams",
    priority: "high",
    actionLabel: "Open Timetable",
    date: "2026-03-27T11:00:00+05:30",
  },
  {
    id: 6,
    title: "కౌన్సలర్ చెక్-ఇన్ అందుబాటులో ఉంది",
    message: "పరీక్షలు మరియు ప్రెజెంటేషన్లకు సిద్ధమవుతున్న విద్యార్థుల కోసం వారపు మద్దతు సమావేశాలు అందుబాటులో ఉన్నాయి.",
    sourceRole: "Counsellor",
    sourceName: "Ms. Prerna",
    category: "Wellbeing",
    priority: "low",
    actionLabel: "Request Slot",
    date: "2026-03-27T16:25:00+05:30",
  },
  {
    id: 7,
    title: "గ్రంథాలయ పుస్తకం తిరిగి ఇవ్వమని గుర్తు",
    message: "లేట్ ఫీజు నివారించేందుకు ఒక గ్రంథాలయ పుస్తకం సోమవారం లోపు తిరిగి ఇవ్వాలి.",
    sourceRole: "Library",
    sourceName: "Library Desk",
    category: "School",
    priority: "medium",
    actionLabel: "View Details",
    date: "2026-03-26T12:40:00+05:30",
  },
  {
    id: 8,
    title: "శాస్త్ర కార్యకలాప సామగ్రి",
    message: "సోమవారం జరిగే జీర్ణ వ్యవస్థ కార్యకలాపం కోసం చార్ట్ పేపర్ మరియు రంగు పెన్లు తీసుకురండి.",
    sourceRole: "Subject Teacher",
    sourceName: "Mr. Harish",
    category: "Academics",
    priority: "low",
    actionLabel: "View Materials",
    date: "2026-03-25T17:10:00+05:30",
  },
  {
    id: 9,
    title: "ఈ వారం భద్రతా డ్రిల్",
    message: "ఈ వారం పాఠశాల భద్రతా డ్రిల్ ప్లాన్ చేయబడింది. విద్యార్థులు తరగతి ఉపాధ్యాయుడి సూచనలను అనుసరిస్తారు.",
    sourceRole: "Principal",
    sourceName: "Dr. N. Sreenivas",
    category: "School",
    priority: "medium",
    actionLabel: "Read Advisory",
    date: "2026-03-24T08:30:00+05:30",
  },
  {
    id: 10,
    title: "ఫిట్నెస్ లాగ్ సమర్పణ",
    message: "పాల్గొనడం ట్రాకింగ్ కోసం వారపు ఫిట్నెస్ లాగ్‌ను సంతకం చేసి రేపు పంపండి.",
    sourceRole: "PET",
    sourceName: "Mr. Raghav",
    category: "Sports",
    priority: "low",
    actionLabel: "Open Log",
    date: "2026-03-23T19:00:00+05:30",
  },
];

// Attendance tracking
export const attendanceMonthly = [
  { label: "Week 1", present: 6, absent: 0 },
  { label: "Week 2", present: 5, absent: 1 },
  { label: "Week 3", present: 6, absent: 0 },
  { label: "Week 4", present: 5, absent: 1 },
];

export const attendanceLog = [
  { date: "2026-03-26", status: "Present", checkIn: "08:32 AM", note: "On time" },
  { date: "2026-03-25", status: "Present", checkIn: "08:36 AM", note: "On time" },
  { date: "2026-03-24", status: "Absent", checkIn: "-", note: "Medical leave" },
  { date: "2026-03-23", status: "Present", checkIn: "08:34 AM", note: "On time" },
  { date: "2026-03-22", status: "Present", checkIn: "08:37 AM", note: "On time" },
  { date: "2026-03-21", status: "Absent", checkIn: "-", note: "Dummy data entry" },
  { date: "2026-03-20", status: "Present", checkIn: "08:31 AM", note: "Dummy data entry" },
];

// Child's timetable
export const childTimetable = [
  { day: "Mon", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Tue", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Wed", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Thu", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Fri", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Sat", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
];

// Upcoming tests
export const upcomingTests = [
  { id: 1, subject: "Maths", chapter: "రేఖీయ సమీకరణాలు", date: "2026-03-28", syllabus: "అభ్యాసాలు 5.1 నుండి 5.3", difficulty: "High", needsAttention: true },
  { id: 2, subject: "Science", chapter: "జంతువుల్లో పోషణ", date: "2026-03-31", syllabus: "అధ్యాయం 7 మొత్తం", difficulty: "Medium" },
  { id: 3, subject: "English", chapter: "గద్యము + వ్యాకరణం", date: "2026-04-03", syllabus: "పాఠం 4 మరియు కాలాలు", difficulty: "Medium" },
];

// Performance insights and analysis
export const performanceInsights = [
  {
    title: "Areas Needing Improvement",
    items: [
      "Maths: Score dropped from 70 to 62 - focus on equations and algebra",
      "Social Studies: Consistent underperformance (68%) - needs structured study plan",
    ],
    severity: "high",
  },
  {
    title: "Strengths",
    items: [
      "Telugu: Consistently high performance (83%)",
      "Science: Steady improvement with last test score of 81%",
      "English: Good literary analysis done in essays",
    ],
    severity: "low",
  },
  {
    title: "Recommendations",
    items: [
      '1. Spend 30 mins daily on Math - focus on problem solving',
      "2. Review Social Studies notes weekly instead of cramming",
      "3. Encourage participation in Science club to build confidence",
      "4. Continue Telugu - maintain momentum by extra reading",
    ],
    severity: "info",
  },
];

// Progress trend data
export const monthlyProgressTrend = [
  { month: "January", avg: 75 },
  { month: "February", avg: 76 },
  { month: "March", avg: 74 },
];

export const parentProfileDefaults = {
  parentName: "Parent",
  contact: "+91 9346362201",
  childName: "Arjun Kumar",
  childClass: "8th",
  childSection: "A",
  childRollNumber: "23",
};

// Function to get color for weak subjects
export function getSubjectStatus(score) {
  if (score >= 80) return { status: "good", color: "emerald", icon: "✓" };
  if (score >= 70) return { status: "fair", color: "amber", icon: "!" };
  return { status: "weak", color: "rose", icon: "!" };
}
