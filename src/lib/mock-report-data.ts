import type { SeverityLevel } from "./dass21";

export interface FacultyData {
  faculty: string;
  totalStudents: number;
  assessed: number;
  normal: number;
  mild: number;
  moderate: number;
  severe: number;
  verySevere: number;
  avgDepression: number;
  avgAnxiety: number;
  avgStress: number;
}

export interface YearData {
  year: number;
  label: string;
  totalStudents: number;
  assessed: number;
  normal: number;
  mild: number;
  moderate: number;
  severe: number;
  verySevere: number;
}

export interface MonthlyTrend {
  month: string;
  depression: number;
  anxiety: number;
  stress: number;
  assessedCount: number;
}

export interface SeverityDistribution {
  level: SeverityLevel;
  label: string;
  count: number;
  color: string;
}

export const FACULTIES = [
  "ทุกคณะ",
  "วิศวกรรมศาสตร์",
  "วิทยาศาสตร์",
  "แพทยศาสตร์",
  "พยาบาลศาสตร์",
  "ทันตแพทยศาสตร์",
  "เภสัชศาสตร์",
  "นิติศาสตร์",
  "ศิลปศาสตร์",
  "วิทยาการจัดการ",
  "ทรัพยากรธรรมชาติ",
  "อุตสาหกรรมเกษตร",
  "เศรษฐศาสตร์",
];

export const YEARS = ["ทุกชั้นปี", "ปี 1", "ปี 2", "ปี 3", "ปี 4", "ปี 5", "ปี 6"];

export const facultyData: FacultyData[] = [
  { faculty: "วิศวกรรมศาสตร์", totalStudents: 420, assessed: 380, normal: 180, mild: 90, moderate: 60, severe: 35, verySevere: 15, avgDepression: 5.2, avgAnxiety: 4.8, avgStress: 8.1 },
  { faculty: "วิทยาศาสตร์", totalStudents: 350, assessed: 310, normal: 150, mild: 80, moderate: 45, severe: 25, verySevere: 10, avgDepression: 4.8, avgAnxiety: 4.2, avgStress: 7.5 },
  { faculty: "แพทยศาสตร์", totalStudents: 280, assessed: 270, normal: 100, mild: 70, moderate: 55, severe: 30, verySevere: 15, avgDepression: 6.1, avgAnxiety: 5.9, avgStress: 9.2 },
  { faculty: "พยาบาลศาสตร์", totalStudents: 200, assessed: 190, normal: 80, mild: 55, moderate: 30, severe: 18, verySevere: 7, avgDepression: 5.0, avgAnxiety: 5.1, avgStress: 8.0 },
  { faculty: "ทันตแพทยศาสตร์", totalStudents: 150, assessed: 140, normal: 60, mild: 40, moderate: 22, severe: 12, verySevere: 6, avgDepression: 5.5, avgAnxiety: 5.3, avgStress: 8.5 },
  { faculty: "เภสัชศาสตร์", totalStudents: 180, assessed: 165, normal: 75, mild: 45, moderate: 25, severe: 14, verySevere: 6, avgDepression: 4.9, avgAnxiety: 4.7, avgStress: 7.8 },
  { faculty: "นิติศาสตร์", totalStudents: 220, assessed: 180, normal: 95, mild: 45, moderate: 25, severe: 10, verySevere: 5, avgDepression: 4.2, avgAnxiety: 3.9, avgStress: 7.0 },
  { faculty: "ศิลปศาสตร์", totalStudents: 250, assessed: 210, normal: 110, mild: 50, moderate: 30, severe: 14, verySevere: 6, avgDepression: 4.5, avgAnxiety: 4.1, avgStress: 7.2 },
  { faculty: "วิทยาการจัดการ", totalStudents: 300, assessed: 250, normal: 130, mild: 60, moderate: 35, severe: 18, verySevere: 7, avgDepression: 4.6, avgAnxiety: 4.3, avgStress: 7.4 },
  { faculty: "ทรัพยากรธรรมชาติ", totalStudents: 160, assessed: 140, normal: 70, mild: 35, moderate: 20, severe: 10, verySevere: 5, avgDepression: 4.3, avgAnxiety: 4.0, avgStress: 7.1 },
  { faculty: "อุตสาหกรรมเกษตร", totalStudents: 140, assessed: 120, normal: 60, mild: 30, moderate: 18, severe: 8, verySevere: 4, avgDepression: 4.1, avgAnxiety: 3.8, avgStress: 6.9 },
  { faculty: "เศรษฐศาสตร์", totalStudents: 130, assessed: 110, normal: 55, mild: 28, moderate: 16, severe: 7, verySevere: 4, avgDepression: 4.0, avgAnxiety: 3.7, avgStress: 6.8 },
];

export const yearData: YearData[] = [
  { year: 1, label: "ปี 1", totalStudents: 650, assessed: 580, normal: 280, mild: 140, moderate: 90, severe: 50, verySevere: 20 },
  { year: 2, label: "ปี 2", totalStudents: 600, assessed: 530, normal: 240, mild: 130, moderate: 85, severe: 50, verySevere: 25 },
  { year: 3, label: "ปี 3", totalStudents: 550, assessed: 480, normal: 200, mild: 110, moderate: 90, severe: 55, verySevere: 25 },
  { year: 4, label: "ปี 4", totalStudents: 500, assessed: 420, normal: 170, mild: 100, moderate: 80, severe: 45, verySevere: 25 },
  { year: 5, label: "ปี 5", totalStudents: 200, assessed: 180, normal: 70, mild: 45, moderate: 35, severe: 20, verySevere: 10 },
  { year: 6, label: "ปี 6", totalStudents: 80, assessed: 75, normal: 30, mild: 20, moderate: 14, severe: 7, verySevere: 4 },
];

export const monthlyTrends: MonthlyTrend[] = [
  { month: "ม.ค.", depression: 4.5, anxiety: 4.0, stress: 7.0, assessedCount: 320 },
  { month: "ก.พ.", depression: 4.8, anxiety: 4.2, stress: 7.3, assessedCount: 280 },
  { month: "มี.ค.", depression: 5.2, anxiety: 4.8, stress: 8.0, assessedCount: 350 },
  { month: "เม.ย.", depression: 4.3, anxiety: 3.9, stress: 6.8, assessedCount: 150 },
  { month: "พ.ค.", depression: 4.1, anxiety: 3.7, stress: 6.5, assessedCount: 180 },
  { month: "มิ.ย.", depression: 4.9, anxiety: 4.5, stress: 7.5, assessedCount: 400 },
  { month: "ก.ค.", depression: 5.5, anxiety: 5.1, stress: 8.3, assessedCount: 420 },
  { month: "ส.ค.", depression: 5.8, anxiety: 5.4, stress: 8.8, assessedCount: 450 },
  { month: "ก.ย.", depression: 5.3, anxiety: 5.0, stress: 8.2, assessedCount: 380 },
  { month: "ต.ค.", depression: 5.0, anxiety: 4.7, stress: 7.8, assessedCount: 360 },
  { month: "พ.ย.", depression: 5.6, anxiety: 5.2, stress: 8.5, assessedCount: 400 },
  { month: "ธ.ค.", depression: 4.7, anxiety: 4.3, stress: 7.2, assessedCount: 200 },
];

export function getOverallSeverityDistribution(): SeverityDistribution[] {
  const totals = facultyData.reduce(
    (acc, f) => ({
      normal: acc.normal + f.normal,
      mild: acc.mild + f.mild,
      moderate: acc.moderate + f.moderate,
      severe: acc.severe + f.severe,
      verySevere: acc.verySevere + f.verySevere,
    }),
    { normal: 0, mild: 0, moderate: 0, severe: 0, verySevere: 0 }
  );

  return [
    { level: "normal", label: "ปกติ", count: totals.normal, color: "hsl(0, 0%, 85%)" },
    { level: "mild", label: "เล็กน้อย", count: totals.mild, color: "hsl(142, 71%, 45%)" },
    { level: "moderate", label: "ปานกลาง", count: totals.moderate, color: "hsl(48, 96%, 53%)" },
    { level: "severe", label: "รุนแรง", count: totals.severe, color: "hsl(25, 95%, 53%)" },
    { level: "very-severe", label: "รุนแรงมาก", count: totals.verySevere, color: "hsl(0, 84%, 60%)" },
  ];
}
