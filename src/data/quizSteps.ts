export type QuizOption = { value: string; label: string };

export type QuizStep =
  | { id: string; kind: "single"; question: string; tip: string; options: QuizOption[] }
  | { id: "contact"; kind: "contact"; question: string; tip: string }
  | { id: "summary"; kind: "summary" };

const en: QuizStep[] = [
  {
    id: "destination",
    kind: "single",
    question: "Which destination are you dreaming of?",
    tip: "Malaysia and Romania both let you work part time while you study.",
    options: [
      { value: "malaysia", label: "Malaysia" },
      { value: "romania", label: "Romania" },
      { value: "georgia", label: "Georgia" },
      { value: "china", label: "China" },
      { value: "undecided", label: "Not sure yet" },
    ],
  },
  {
    id: "level",
    kind: "single",
    question: "What degree are you aiming for?",
    tip: "Most Malaysian universities also run pathway programs if you're short on a requirement.",
    options: [
      { value: "bachelors", label: "Bachelor's" },
      { value: "masters", label: "Master's" },
      { value: "diploma", label: "Diploma or foundation" },
      { value: "phd", label: "PhD" },
    ],
  },
  {
    id: "field",
    kind: "single",
    question: "Which field interests you most?",
    tip: "Business, engineering, and computer science are the most popular picks among our students.",
    options: [
      { value: "business", label: "Business & management" },
      { value: "engineering", label: "Engineering & technology" },
      { value: "cs", label: "Computer science & IT" },
      { value: "medicine", label: "Medicine & health sciences" },
      { value: "hospitality", label: "Hospitality & tourism" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "budget",
    kind: "single",
    question: "What's your total budget?",
    tip: "Romania often costs less per year than Malaysia, even with the EU degree.",
    options: [
      { value: "under5l", label: "Less than BDT 5 Lakh" },
      { value: "5to8l", label: "BDT 5 Lakh – 8 Lakh" },
      { value: "8to10l", label: "BDT 8 Lakh – 10 Lakh" },
      { value: "10to15l", label: "BDT 10 Lakh – 15 Lakh" },
      { value: "unsure", label: "Not Sure Yet" },
    ],
  },
  {
    id: "english",
    kind: "single",
    question: "Do you have an English Proficiency Certificate?",
    tip: "Some Malaysian programs waive a certificate if your prior medium of instruction was English.",
    options: [
      { value: "ielts", label: "IELTS" },
      { value: "toefl", label: "TOEFL" },
      { value: "pte", label: "PTE Academic" },
      { value: "duolingo", label: "Duolingo English Test" },
      { value: "linguaskill", label: "Linguaskill" },
      { value: "planning", label: "Not Yet, Planning to Take One" },
    ],
  },
  {
    id: "academic",
    kind: "single",
    question: "Where are you right now?",
    tip: "Applications usually open six to nine months before intake, so timing matters.",
    options: [
      { value: "hsc", label: "Currently in HSC or A-Levels" },
      { value: "bachelor_done", label: "Completed Bachelor's" },
      { value: "masters_done", label: "Completed Master's" },
      { value: "working", label: "Working professional" },
    ],
  },
  {
    id: "intake",
    kind: "single",
    question: "When do you want to start?",
    tip: "Malaysia runs three intakes a year. Romania mainly runs in October.",
    options: [
      { value: "soonest", label: "The next available intake" },
      { value: "6months", label: "Within 6 months" },
      { value: "1year", label: "Within a year" },
      { value: "exploring", label: "Just exploring for now" },
    ],
  },
  {
    id: "contact",
    kind: "contact",
    question: "Where should we send your matches?",
    tip: "A counselor reviews every response personally, no bots deciding your future.",
  },
  { id: "summary", kind: "summary" },
];

const bn: QuizStep[] = [
  {
    id: "destination",
    kind: "single",
    question: "কোন গন্তব্যের স্বপ্ন দেখছেন?",
    tip: "মালয়েশিয়া আর রোমানিয়া, দুই জায়গাতেই পড়াশোনার পাশাপাশি খণ্ডকালীন কাজ করা যায়।",
    options: [
      { value: "malaysia", label: "মালয়েশিয়া" },
      { value: "romania", label: "রোমানিয়া" },
      { value: "georgia", label: "জর্জিয়া" },
      { value: "china", label: "চীন" },
      { value: "undecided", label: "এখনও ঠিক করিনি" },
    ],
  },
  {
    id: "level",
    kind: "single",
    question: "কোন ডিগ্রি নিতে চান?",
    tip: "প্রয়োজনীয় যোগ্যতা কম থাকলেও মালয়েশিয়ার বেশিরভাগ বিশ্ববিদ্যালয়ে পাথওয়ে প্রোগ্রাম আছে।",
    options: [
      { value: "bachelors", label: "ব্যাচেলর্স" },
      { value: "masters", label: "মাস্টার্স" },
      { value: "diploma", label: "ডিপ্লোমা বা ফাউন্ডেশন" },
      { value: "phd", label: "পিএইচডি" },
    ],
  },
  {
    id: "field",
    kind: "single",
    question: "কোন বিষয়ে আগ্রহ বেশি?",
    tip: "আমাদের শিক্ষার্থীদের মধ্যে বিজনেস, ইঞ্জিনিয়ারিং আর কম্পিউটার সায়েন্স সবচেয়ে জনপ্রিয়।",
    options: [
      { value: "business", label: "বিজনেস ও ম্যানেজমেন্ট" },
      { value: "engineering", label: "ইঞ্জিনিয়ারিং ও টেকনোলজি" },
      { value: "cs", label: "কম্পিউটার সায়েন্স ও আইটি" },
      { value: "medicine", label: "মেডিসিন ও স্বাস্থ্যবিজ্ঞান" },
      { value: "hospitality", label: "হসপিটালিটি ও ট্যুরিজম" },
      { value: "other", label: "অন্য কিছু" },
    ],
  },
  {
    id: "budget",
    kind: "single",
    question: "আপনার মোট বাজেট কত?",
    tip: "ইইউ ডিগ্রি হওয়া সত্ত্বেও রোমানিয়ার বছরের খরচ প্রায়ই মালয়েশিয়ার চেয়ে কম।",
    options: [
      { value: "under5l", label: "৫ লাখ টাকার কম" },
      { value: "5to8l", label: "৫ লাখ থেকে ৮ লাখ টাকা" },
      { value: "8to10l", label: "৮ লাখ থেকে ১০ লাখ টাকা" },
      { value: "10to15l", label: "১০ লাখ থেকে ১৫ লাখ টাকা" },
      { value: "unsure", label: "এখনও জানি না" },
    ],
  },
  {
    id: "english",
    kind: "single",
    question: "আপনার কি ইংরেজি দক্ষতার সার্টিফিকেট আছে?",
    tip: "মাধ্যম ইংরেজি ছিল এমন শিক্ষার্থীদের জন্য অনেক মালয়েশিয়ান প্রোগ্রামে সার্টিফিকেট মাফ হয়ে যায়।",
    options: [
      { value: "ielts", label: "IELTS" },
      { value: "toefl", label: "TOEFL" },
      { value: "pte", label: "PTE Academic" },
      { value: "duolingo", label: "Duolingo English Test" },
      { value: "linguaskill", label: "Linguaskill" },
      { value: "planning", label: "না, নেওয়ার পরিকল্পনা আছে" },
    ],
  },
  {
    id: "academic",
    kind: "single",
    question: "এখন আপনি কোথায় আছেন?",
    tip: "ইনটেকের ছয় থেকে নয় মাস আগেই সাধারণত আবেদন শুরু হয়, তাই সময়টা গুরুত্বপূর্ণ।",
    options: [
      { value: "hsc", label: "বর্তমানে HSC বা A-Levels এ" },
      { value: "bachelor_done", label: "ব্যাচেলর্স শেষ করেছি" },
      { value: "masters_done", label: "মাস্টার্স শেষ করেছি" },
      { value: "working", label: "কর্মজীবী" },
    ],
  },
  {
    id: "intake",
    kind: "single",
    question: "কবে শুরু করতে চান?",
    tip: "মালয়েশিয়ায় বছরে তিনটি ইনটেক আছে। রোমানিয়া মূলত অক্টোবরে শুরু হয়।",
    options: [
      { value: "soonest", label: "সবচেয়ে কাছের ইনটেকে" },
      { value: "6months", label: "৬ মাসের মধ্যে" },
      { value: "1year", label: "এক বছরের মধ্যে" },
      { value: "exploring", label: "আপাতত শুধু জেনে রাখছি" },
    ],
  },
  {
    id: "contact",
    kind: "contact",
    question: "আপনার ম্যাচগুলো কোথায় পাঠাবো?",
    tip: "প্রতিটি উত্তর একজন কাউন্সেলর নিজে দেখেন, কোনো বট সিদ্ধান্ত নেয় না।",
  },
  { id: "summary", kind: "summary" },
];

export const quizSteps = { en, bn };
