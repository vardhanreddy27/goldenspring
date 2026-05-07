import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, FileText, Sparkles, ChevronDown } from "lucide-react";
import { teacherSections } from "./data";

const studentAvatarPool = ["/student1.png", "/student2.png", "/student3.png", "/student4.png", "/student.jpeg"];
const quizRowAvatarBg = ["bg-rose-100", "bg-sky-100", "bg-amber-100", "bg-emerald-100", "bg-violet-100"];

const AP_SOCIAL_LESSONS = [
  {
    id: "ap-social-1",
    lessonName: "1: India's Geography",
    topics: [
      "India: Relief Features",
      "Climate of India",
      "Indian Soils",
      "Natural Vegetation and Wildlife",
      "Agriculture in India",
    ],
  },
  {
    id: "ap-social-2",
    lessonName: "2: Resources and Development",
    topics: [
      "Water Resources",
      "Mineral Resources",
      "Power Resources",
      "Manufacturing Industries",
      "Transport and Communication",
    ],
  },
  {
    id: "ap-social-3",
    lessonName: "3: Modern World History",
    topics: [
      "The Rise of Nationalism in Europe",
      "Nationalism in India",
      "Making of a Global World",
      "Print Culture and the Modern World",
      "The Age of Industrialisation",
    ],
  },
  {
    id: "ap-social-4",
    lessonName: "4: Indian Economy",
    topics: [
      "Sectors of the Indian Economy",
      "Money and Credit",
      "Globalisation and the Indian Economy",
      "Consumer Rights",
      "Development",
    ],
  },
  {
    id: "ap-social-5",
    lessonName: "5: Civics & Democracy",
    topics: [
      "Power Sharing",
      "Democracy and Diversity",
      "Gender, Religion and Caste",
      "Political Parties",
      "Outcomes of Democracy",
    ],
  },
  {
    id: "ap-social-6",
    lessonName: "6: Contemporary Issues",
    topics: [
      "Challenges to Democracy",
      "Population and Human Resources",
      "Map Skills - India",
      "Map Skills - World",
      "Sustainable Development Practices",
    ],
  },
  {
    id: "ap-social-7",
    lessonName: "7: Practice & Review",
    topics: [
      "Civics Source-based Questions",
      "History Assertion-Reason Practice",
      "Economics Data Interpretation",
      "Disaster Management Basics",
      "Constitutional Values and Rights",
    ],
  },
];

const AP_SCIENCE_LESSONS = [
  {
    id: "ap-science-1",
    lessonName: "1: Light & Vision",
    topics: [
      "Light Reflection",
      "Human Eye and Vision",
      "Electricity",
      "Magnetic Effects of Current",
      "Sources of Energy",
    ],
  },
  {
    id: "ap-science-2",
    lessonName: "2: Matter & Atoms",
    topics: [
      "Matter Around Us",
      "Atoms and Molecules",
      "Carbon Compounds",
      "Periodic Classification",
      "Acids, Bases and Salts",
    ],
  },
  {
    id: "ap-science-3",
    lessonName: "3: Metals & Organization",
    topics: [
      "Metals and Non-metals",
      "Cell Structure",
      "Tissues",
      "Diversity in Living Organisms",
      "Life Processes",
    ],
  },
  {
    id: "ap-science-4",
    lessonName: "4: Control & Reproduction",
    topics: [
      "Control and Coordination",
      "How do Organisms Reproduce",
      "Heredity and Evolution",
      "Nutrition",
      "Respiration",
    ],
  },
  {
    id: "ap-science-5",
    lessonName: "5: Motion & Forces",
    topics: [
      "Gravitation",
      "Motion",
      "Work and Energy",
      "Force and Laws of Motion",
      "Sound",
    ],
  },
  {
    id: "ap-science-6",
    lessonName: "6: Environment & Resources",
    topics: [
      "Heat",
      "Our Environment",
      "Natural Resources",
      "Pollution and Control",
      "Transportation in Plants",
    ],
  },
  {
    id: "ap-science-7",
    lessonName: "7: Excretion & Trends",
    topics: [
      "Excretion",
      "Periodic Trends",
      "Laboratory Safety",
      "Experimental Skills",
      "Science in Daily Life",
    ],
  },
  {
    id: "ap-science-8",
    lessonName: "8: Practice Questions",
    topics: [
      "Project-based Questions",
      "Diagram-based Questions",
      "Formula Revision",
      "Data-based Science Questions",
      "Chemical Reactions",
    ],
  },
];

const SYLLABUS_OPTIONS = [
  { id: "ap-ssc-social", label: "AP SSC  (Class 10)", lessons: AP_SOCIAL_LESSONS },
  { id: "ap-ssc-science", label: "AP SSC General Science (Class 10)", lessons: AP_SCIENCE_LESSONS },
];

function marksFromPerformance(performancePercent, outOf = 30) {
  return Math.max(0, Math.min(outOf, Math.round((performancePercent / 100) * outOf)));
}

function generatePaperQuestions({ topics, difficulty, paperIndex }) {
  const starters = [
    "Define",
    "Explain",
    "Illustrate with examples",
    "Differentiate",
    "Analyze",
    "Write short notes on",
    "Evaluate",
    "How would you justify",
    "Discuss",
    "Describe",
  ];

  return Array.from({ length: 40 }, (_, idx) => {
    const topic = topics[(idx + paperIndex) % topics.length] || "Selected Topic";
    const starter = starters[(idx + paperIndex) % starters.length];
    const difficultyLine =
      difficulty === "Hard"
        ? "Use higher-order reasoning and evidence."
        : difficulty === "Moderate"
          ? "Answer with suitable examples."
          : "Answer in simple textbook language.";

    return `${starter} ${topic}. ${difficultyLine}`;
  });
}

function numberItems(items, startNumber) {
  return items.map((text, index) => ({
    number: startNumber + index,
    text,
  }));
}

function getPendingExamLabel(sectionId, suggestedSubject = "pending") {
  return `Month-End Exam (${suggestedSubject}) `;
}

function stripQuestionPrefix(text) {
  return text.replace(/^\d+\.\s*/, "");
}

function buildPapers({ schoolName, classLabel, subjectLabel, examType, difficulty, topics, paperCount = 3 }) {
  const paperArray = Array.from({ length: paperCount }, (_, i) => i + 1);
  return paperArray.map((paperNo, idx) => {
    const questions = generatePaperQuestions({ topics, difficulty, paperIndex: idx + 1 });
    const sectionOneQuestions = numberItems(questions.slice(0, 6), 1);
    const sectionTwoQuestions = numberItems(questions.slice(6, 10), 7);
    const sectionThreeQuestions = numberItems(questions.slice(10, 14), 11);

    return {
      id: `paper-${paperNo}`,
      paperNo,
      title: `${schoolName} - ${subjectLabel}`,
      subtitle: `${examType} Examination`,
      classLabel,
      maxMarks: 20,
      duration: "1 Hr 30 Min",
      generalInstructions: [
        "Read the question paper carefully before answering.",
        "Write all answers neatly and number them correctly.",
        "Use diagrams/examples wherever required.",
      ],
      sections: [
        {
          heading: "SECTION - I (Objective)",
          instruction: "Answer all 6 questions.",
          marks: "6 x 1 = 6",
          items: sectionOneQuestions,
        },
        {
          heading: "SECTION - II (Short Answer)",
          instruction: "Answer any 2 out of 4 questions.",
          marks: "Any 2 x 2 = 4",
          items: sectionTwoQuestions,
        },
        {
          heading: "SECTION - III (Long Answer)",
          instruction: "Answer any 2 out of 4 questions.",
          marks: "2 x 5 = 10",
          items: sectionThreeQuestions,
        },
      ],
      footer: "Nava Chaitanya Bharathi  School, Kadapa | Confidential - Internal Assessment",
    };
  });
}

function DropdownField({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-1 flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm font-semibold text-slate-800"
      >
        <span>{value}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                option === value ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ExamTab() {
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedScoreSectionId, setSelectedScoreSectionId] = useState("9-a");
  const [selectedSyllabusId, setSelectedSyllabusId] = useState(SYLLABUS_OPTIONS[0].id);
  const [selectedTestType, setSelectedTestType] = useState("Monthly End Test");
  const [selectedExamType, setSelectedExamType] = useState("Month End");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Moderate");
  const [expandedLessons, setExpandedLessons] = useState(new Set([SYLLABUS_OPTIONS[0].lessons[0].id]));
  const [selectedTopicIds, setSelectedTopicIds] = useState(
    new Set(SYLLABUS_OPTIONS[0].lessons[0].topics.slice(0, 2))
  );
  const [generatedPapers, setGeneratedPapers] = useState([]);
  const [viewingPapers, setViewingPapers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scorePage, setScorePage] = useState(1);
  const [flashMessage, setFlashMessage] = useState("");

  const selectedSection = useMemo(
    () => teacherSections.find((item) => item.id === selectedSectionId) || null,
    [selectedSectionId]
  );

  const selectedScoreSection = useMemo(
    () => teacherSections.find((item) => item.id === selectedScoreSectionId) || teacherSections[0] || null,
    [selectedScoreSectionId]
  );

  const selectedSyllabus = useMemo(
    () => SYLLABUS_OPTIONS.find((item) => item.id === selectedSyllabusId) || SYLLABUS_OPTIONS[0],
    [selectedSyllabusId]
  );

  const leaderboardRows = useMemo(() => {
    const students = selectedScoreSection?.studentPerformance || [];
    const outOf = 30;
    return students
      .map((student) => ({
        ...student,
        marksObtained: marksFromPerformance(student.subjectPerformance, outOf),
        outOf,
      }))
      .sort((a, b) => b.marksObtained - a.marksObtained);
  }, [selectedScoreSection]);

  const scorePageSize = 5;
  const scoreTotalPages = Math.max(1, Math.ceil(leaderboardRows.length / scorePageSize));
  const safeScorePage = Math.min(scorePage, scoreTotalPages);
  const pagedLeaderboardRows = leaderboardRows.slice((safeScorePage - 1) * scorePageSize, safeScorePage * scorePageSize);

  useEffect(() => {
    if (viewingPapers) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [viewingPapers]);

  function toggleLesson(lessonId) {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  }

  function toggleTopic(topic) {
    const newSelected = new Set(selectedTopicIds);
    if (newSelected.has(topic)) {
      if (newSelected.size === 1) return;
      newSelected.delete(topic);
    } else {
      newSelected.add(topic);
    }
    setSelectedTopicIds(newSelected);
  }

  function toggleLessonTopics(lesson) {
    const lessonTopics = new Set(lesson.topics);
    const allSelected = lesson.topics.every((t) => selectedTopicIds.has(t));

    if (allSelected) {
      if (selectedTopicIds.size === lesson.topics.length) return;
      const newSelected = new Set(selectedTopicIds);
      lesson.topics.forEach((t) => newSelected.delete(t));
      setSelectedTopicIds(newSelected);
    } else {
      const newSelected = new Set(selectedTopicIds);
      lesson.topics.forEach((t) => newSelected.add(t));
      setSelectedTopicIds(newSelected);
    }
  }

  function generateExamPapers() {
    if (!selectedSection) return;

    if (!selectedTopicIds.size) {
      setFlashMessage("Select at least one topic to generate exam papers.");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const topicsArray = Array.from(selectedTopicIds);
      const paperCount = selectedTestType === "Slip Test" ? 1 : 3;
      const papers = buildPapers({
        schoolName: "Nava Chaitanya Bharathi  School",
        classLabel: `Class ${selectedSection.className} - Section ${selectedSection.section}`,
        subjectLabel: selectedSyllabus.label,
        examType: selectedExamType,
        difficulty: selectedDifficulty,
        topics: topicsArray,
        paperCount,
      });

      setGeneratedPapers(papers);
      setViewingPapers(true);
      setIsLoading(false);
      const paperText = paperCount === 1 ? "1 exam paper" : "3 exam papers";
      setFlashMessage(`AI generated ${paperText} for ${selectedExamType} successfully.`);
    }, 1500);
  }

  return (
    <section className="space-y-4  pb-24">
      {!selectedSection ? (
        <article className="bg-(--app-surface) ">
          <h2 className="pt-5 text-xl font-semibold text-slate-900 px-2">Select class to create exam paper</h2>

          <div className="mt-4 grid px-2 grid-cols-2  gap-3">
            {teacherSections.map((section, sectionIndex) => {
              const avatars = Array.from({ length: 4 }, (_, idx) => studentAvatarPool[(sectionIndex + idx) % studentAvatarPool.length]);
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                  setSelectedSectionId(section.id);
                  setSelectedScoreSectionId(section.id);
                  setGeneratedPapers([]);
                  setViewingPapers(false);
                  setFlashMessage("");
                }}
                className="group aspect-square rounded-3xl border border-slate-200 bg-white p-3 text-left shadow-[0_10px_24px_-22px_rgba(15,23,42,0.55)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none sm:p-4"
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      Class {section.className} - Section {section.section}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{section.totalStudents} students</p>
                  </div>

                  <div className="flex">
                    <div className="inline-flex items-center -space-x-2.5 rounded-full px-2.5 py-1.5">
                      {avatars.map((avatar, idx) => (
                        <div key={`${section.id}-avatar-${idx}`} className="h-7 w-7 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white">
                          <Image src={avatar} alt="Student avatar" width={28} height={28} className="h-7 w-7 object-cover" />
                        </div>
                      ))}
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-700 text-[10px] font-bold text-white ring-2 ring-white">
                        +46
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500">Next to start</p>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#c43642] sm:text-[13px]">
                      {getPendingExamLabel(section.id)}
                    </p>
                  </div>
                </div>
              </button>
              );
            })}
          </div>

          <article className="mt-5 mx-2 overflow-visible rounded-3xl border border-slate-200 bg-white">
            <div className="px-3 py-3 sm:px-4">
              <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">Student exam marks</h3>

              <div className="mt-3 sm:w-64">
                <select
                  value={selectedScoreSectionId}
                  onChange={(event) => setSelectedScoreSectionId(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800"
                >
                  {teacherSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.className} - {section.section}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="space-y-2 px-3 py-3 sm:px-4">
                {pagedLeaderboardRows.map((student, index) => {
                const studentAvatar = studentAvatarPool[index % studentAvatarPool.length];
                return (
                  <div key={`${student.name}-${index}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200 ${quizRowAvatarBg[index % quizRowAvatarBg.length]}`}>
                        <Image src={studentAvatar} alt={student.name} width={36} height={36} className="h-9 w-9 object-cover" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">Class {selectedScoreSection?.className} - {selectedScoreSection?.section}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-200">
                      {student.marksObtained}/{student.outOf}
                    </div>
                  </div>
                )
              })}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 sm:px-4">
                <span>
                  Page {safeScorePage} of {scoreTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScorePage((prev) => Math.max(1, prev - 1))}
                    disabled={safeScorePage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setScorePage((prev) => Math.min(scoreTotalPages, prev + 1))}
                    disabled={safeScorePage === scoreTotalPages}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </article>
        </article>
      ) : viewingPapers ? (
        <article className="bg-(--app-surface) p-4 sm:p-5">
          <button
            type="button"
            onClick={() => {
              setViewingPapers(false);
              setFlashMessage("");
            }}
            className="inline-flex items-center gap-1  px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <ArrowLeft className="h-6 w-6" />
            Back
          </button>

          <div className="mt-4 space-y-4">
            {generatedPapers.map((paper) => (
              <article key={paper.id} className="overflow-hidden  border border-slate-300 bg-white shadow-sm">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        <p className="text-xl font-black tracking-tight text-slate-900">Nava Chaitanya Bharathi  SCHOOL</p>
                        <p className="text-sm font-semibold text-slate-700">{paper.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 border-t border-slate-300 pt-2 text-sm text-slate-800 sm:grid-cols-3">
                    <p><span className="font-semibold">Class:</span> {paper.classLabel}</p>
                    <p><span className="font-semibold">Time:</span> {paper.duration}</p>
                    <p><span className="font-semibold">Max Marks:</span> {paper.maxMarks}</p>
                  </div>

                  <div className="mt-3 space-y-3">
                

                    {paper.sections.map((section) => (
                      <div key={section.heading}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-900">{section.heading}</p>
                          <span className="text-xs font-semibold text-slate-600">{section.marks}</span>
                        </div>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                          {section.instruction}
                        </p>
                        <ol className="mt-2 space-y-1 text-sm text-slate-800">
                          {section.items.map((item) => (
                            <li key={`${paper.id}-${section.heading}-${item.number}`}>
                              {item.number}. {stripQuestionPrefix(item.text)}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      ) : (
        <article className="bg-(--app-surface) p-4 sm:p-5">
          <button
            type="button"
            onClick={() => {
              setSelectedSectionId("");
              setGeneratedPapers([]);
              setViewingPapers(false);
              setFlashMessage("");
            }}
            className="inline-flex items-center gap-1  py-1.5 text-xs font-semibold text-slate-700"
          >
            <ArrowLeft className="h-6 w-6" />
            Back
          </button>

          <div className="mt-3">
            <p className="text-sm text-slate-500">Selected class</p>
            <h3 className="text-lg font-semibold text-slate-900">
              Class {selectedSection.className} - Section {selectedSection.section}
            </h3>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Exam paper builder</p>
                <h4 className="text-lg font-semibold text-slate-900">Create Exam Paper</h4>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                AI
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DropdownField
                label="Test Type"
                value={selectedTestType}
                options={["Slip Test", "Monthly End Test", "Half Yearly"]}
                onChange={setSelectedTestType}
              />
      
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Difficulty Level</label>
              <div className="mt-2 flex gap-2">
                {["Easy", "Moderate", "Hard"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedDifficulty(level)}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      selectedDifficulty === level
                        ? "bg-[#19c7be] text-white"
                        : "border border-slate-300 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Select lessons and topics</p>
              <div className="mt-3 space-y-2">
                {selectedSyllabus.lessons.map((lesson) => {
                  const isExpanded = expandedLessons.has(lesson.id);
                  const allTopicsSelected = lesson.topics.every((t) => selectedTopicIds.has(t));

                  return (
                    <div key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => toggleLesson(lesson.id)}
                        className="w-full text-left flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {lesson.lessonName}
                          <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </span>
                        <input
                          type="checkbox"
                          checked={allTopicsSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleLessonTopics(lesson);
                          }}
                          className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-2 ml-3 space-y-1.5 border-l-2 border-slate-200 pl-3">
                          {lesson.topics.map((topic) => (
                            <label
                              key={topic}
                              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTopicIds.has(topic)}
                                onChange={() => toggleTopic(topic)}
                                className="h-3.5 w-3.5 rounded border-slate-300"
                              />
                              <span>{topic}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={generateExamPapers}
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-[#19c7be] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1299a7] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 inline-block animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Generating...
                </span>
              ) : (
                <span>
                  <FileText className="mb-0.5 inline h-4 w-4 mr-2" />
                  Generate AI Exam Papers
                </span>
              )}
            </button>

            {flashMessage ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {flashMessage}
              </div>
            ) : null}
          </div>
        </article>
      )}
    </section>
  );
}
