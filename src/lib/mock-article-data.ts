import type { SeverityLevel } from "@/lib/dass21";

export interface Article {
  id: string;
  title: string;
  content: string;
  categories: string[];
  hashtags: string[];
  targetLevels: SeverityLevel[];
  author: string;
  source: string;
  coverImage?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const articleCategories = [
  "Self Care",
  "การจัดการความเครียด",
  "ความวิตกกังวล",
  "ภาวะซึมเศร้า",
  "การนอนหลับ",
  "สติและสมาธิ",
  "ความสัมพันธ์",
  "การเรียน",
  "โภชนาการ",
  "การออกกำลังกาย",
];

export const severityLevelOptions: { value: SeverityLevel; label: string }[] = [
  { value: "normal", label: "ปกติ" },
  { value: "mild", label: "เล็กน้อย" },
  { value: "moderate", label: "ปานกลาง" },
  { value: "severe", label: "รุนแรง" },
  { value: "very-severe", label: "รุนแรงมาก" },
];

let mockArticles: Article[] = [
  {
    id: "ART-001",
    title: "5 วิธีจัดการความเครียดด้วยตัวเอง",
    content: "ความเครียดเป็นสิ่งที่ทุกคนต้องเผชิญ แต่การรู้จักวิธีจัดการกับมันจะช่วยให้เรามีสุขภาพจิตที่ดี...\n\n1. ฝึกหายใจลึก\n2. ออกกำลังกายสม่ำเสมอ\n3. นอนหลับให้เพียงพอ\n4. พูดคุยกับคนที่ไว้ใจ\n5. ทำกิจกรรมที่ชอบ",
    categories: ["Self Care", "การจัดการความเครียด"],
    hashtags: ["สุขภาพจิต", "ความเครียด", "selfcare"],
    targetLevels: ["normal", "mild", "moderate"],
    author: "อ.สุภาพร จิตดี",
    source: "กรมสุขภาพจิต",
    isPublished: true,
    createdAt: "2569-01-10T09:00:00",
    updatedAt: "2569-01-10T09:00:00",
  },
  {
    id: "ART-002",
    title: "เทคนิคการหายใจเพื่อลดความวิตกกังวล",
    content: "การหายใจเป็นเครื่องมือที่ทรงพลังในการจัดการกับความวิตกกังวล...\n\nเทคนิค 4-7-8:\n- หายใจเข้า 4 วินาที\n- กลั้นหายใจ 7 วินาที\n- หายใจออก 8 วินาที",
    categories: ["ความวิตกกังวล", "สติและสมาธิ"],
    hashtags: ["การหายใจ", "วิตกกังวล", "mindfulness"],
    targetLevels: ["mild", "moderate"],
    author: "อ.สุภาพร จิตดี",
    source: "กรมสุขภาพจิต",
    isPublished: true,
    createdAt: "2569-01-15T14:00:00",
    updatedAt: "2569-01-15T14:00:00",
  },
  {
    id: "ART-003",
    title: "การดูแลตัวเองเมื่อรู้สึกหมดแรงจูงใจ",
    content: "ภาวะหมดแรงจูงใจเป็นเรื่องปกติที่สามารถเกิดขึ้นได้กับทุกคน...",
    categories: ["ภาวะซึมเศร้า", "Self Care"],
    hashtags: ["ซึมเศร้า", "แรงจูงใจ", "กำลังใจ"],
    targetLevels: ["moderate", "severe"],
    author: "อ.วิชัย ใจเย็น",
    source: "นักจิตวิทยา ม.อ.",
    isPublished: true,
    createdAt: "2569-02-01T10:00:00",
    updatedAt: "2569-02-05T11:00:00",
  },
  {
    id: "ART-004",
    title: "นอนไม่หลับทำอย่างไร? Sleep Hygiene 101",
    content: "การนอนหลับที่มีคุณภาพเป็นรากฐานสำคัญของสุขภาพจิตที่ดี...",
    categories: ["การนอนหลับ", "Self Care"],
    hashtags: ["นอนไม่หลับ", "sleephygiene", "สุขภาพ"],
    targetLevels: ["normal", "mild"],
    author: "อ.สุภาพร จิตดี",
    source: "กรมสุขภาพจิต",
    isPublished: false,
    createdAt: "2569-02-10T09:00:00",
    updatedAt: "2569-02-10T09:00:00",
  },
];

export function getAllArticles(): Article[] {
  return [...mockArticles];
}

export function getPublishedArticlesForLevel(level: SeverityLevel): Article[] {
  return mockArticles.filter(
    (a) => a.isPublished && a.targetLevels.includes(level)
  );
}

export function saveArticle(article: Article): Article {
  const idx = mockArticles.findIndex((a) => a.id === article.id);
  if (idx >= 0) {
    mockArticles[idx] = article;
  } else {
    mockArticles.push(article);
  }
  return article;
}

export function deleteArticle(id: string): void {
  mockArticles = mockArticles.filter((a) => a.id !== id);
}
