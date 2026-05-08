export const PARENT_LANGUAGES = {
  EN: "en",
  UR: "ur",
  TE: "te",
};

export const TRANSLATIONS = {
  en: {
    Home: "Home",
    Homework: "Homework",
    Attendance: "Attendance",
    Academics: "Academics",
    More: "More",
    Logout: "Logout",
    "Family App": "Family App",
    Parent: "Parent",
    Student: "Student",
    "Parent Portal": "Parent Portal",
    Welcome: "Welcome",
  },
  te: {
    Home: "హోమ్",
    Homework: "హోమ్ వర్క్",
    Attendance: "హాజరు",
    Academics: "అకాడెమిక్స్",
    More: "మరిన్ని",
    Logout: "లాగౌట్",
    "Teacher connect": "టీచర్ తో మాట్లాడండి",
    "Contact teacher": "టీచర్ ని కాల్ చేయండి",
    "Parent control": "పేరెంట్స్ కంట్రోల్",
    "Quick actions": "క్విక్ ఆక్షన్స్",
    "Timetable": "టైమ్ టేబుల్",
    "School Announcements": "పాఠశాల ప్రకటనలు",
  },
  ur: {
    Student: "طلبہ",
    Parent: "والدین",
    "Family App": "فیملی ایپ",
    "Parent Portal": "والدین کا پورٹل",
    Logout: "لاگ آؤٹ",
    Welcome: "خوش آمدید",
    Home: "ہوم",
    Homework: "ہوم ورک",
    Attendance: "حاضری",
    Academics: "تعلیمی کارکردگی",
    More: "مزید",
    "School Announcements": "اسکول کے اعلانات",
  },
};

export function translateText(lang, text) {
  if (lang === PARENT_LANGUAGES.UR) return TRANSLATIONS.ur[text] || text;
  if (lang === PARENT_LANGUAGES.TE) return TRANSLATIONS.te[text] || text;
  return TRANSLATIONS.en[text] || text;
}

export function languageToggleLabel(lang) {
  return lang === PARENT_LANGUAGES.TE ? "TE" : lang === PARENT_LANGUAGES.UR ? "UR" : "EN";
}
