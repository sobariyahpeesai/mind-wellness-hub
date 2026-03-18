export type AppointmentStatus =
  | "pending"        // รอนักจิตวิทยาจัดการ
  | "confirmed"      // ยืนยันแล้ว
  | "completed"      // ให้คำปรึกษาเสร็จแล้ว
  | "cancelled"      // ยกเลิก
  | "follow-up"      // นัดหมายต่อเนื่อง
  | "referred";      // ส่งต่อจิตแพทย์

export type CaseStatus =
  | "open"           // กำลังดำเนินการ
  | "follow-up"      // ติดตามต่อเนื่อง
  | "referred"       // ส่งต่อจิตแพทย์
  | "closed";        // ปิดเคส

export interface TimeSlot {
  id: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  available: boolean;
  psychologistId?: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  faculty: string;
  date: string;
  startTime: string;
  endTime: string;
  problemCategory: string;
  problemDetail?: string;
  status: AppointmentStatus;
  psychologistId?: string;
  psychologistName?: string;
  sessionNumber: number;
  caseStatus: CaseStatus;
  createdAt: string;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  detail?: string;
}

export interface Psychologist {
  id: string;
  name: string;
  available: boolean;
  schedule: PsychologistSchedule[];
}

export interface PsychologistSchedule {
  dayOfWeek: number;  // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export const problemCategories = [
  "ความเครียดจากการเรียน",
  "ปัญหาด้านความสัมพันธ์",
  "ปัญหาด้านการเงิน",
  "ปัญหาครอบครัว",
  "ภาวะซึมเศร้า/วิตกกังวล",
  "ปัญหาการปรับตัว",
  "ปัญหาด้านสุขภาพ",
  "อื่นๆ",
];

export const mockPsychologists: Psychologist[] = [
  {
    id: "psy-001",
    name: "ดร.สมใจ นักจิต",
    available: true,
    schedule: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "16:00", enabled: true },
      { dayOfWeek: 2, startTime: "09:00", endTime: "16:00", enabled: true },
      { dayOfWeek: 3, startTime: "09:00", endTime: "12:00", enabled: true },
      { dayOfWeek: 4, startTime: "09:00", endTime: "16:00", enabled: true },
      { dayOfWeek: 5, startTime: "09:00", endTime: "16:00", enabled: true },
    ],
  },
  {
    id: "psy-002",
    name: "อ.มานี ใจดี",
    available: true,
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "16:00", enabled: true },
      { dayOfWeek: 2, startTime: "10:00", endTime: "16:00", enabled: false },
      { dayOfWeek: 3, startTime: "10:00", endTime: "16:00", enabled: true },
      { dayOfWeek: 4, startTime: "10:00", endTime: "16:00", enabled: true },
      { dayOfWeek: 5, startTime: "10:00", endTime: "14:00", enabled: true },
    ],
  },
  {
    id: "psy-003",
    name: "อ.วิภา สว่างจิต",
    available: true,
    schedule: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "15:00", enabled: true },
      { dayOfWeek: 2, startTime: "09:00", endTime: "15:00", enabled: true },
      { dayOfWeek: 3, startTime: "09:00", endTime: "15:00", enabled: false },
      { dayOfWeek: 4, startTime: "09:00", endTime: "15:00", enabled: true },
      { dayOfWeek: 5, startTime: "09:00", endTime: "12:00", enabled: true },
    ],
  },
];

// Available time slots for student booking (next 2 weeks)
export function generateAvailableSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

    const dateStr = date.toISOString().split("T")[0];
    const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
    times.forEach((t, i) => {
      const endH = parseInt(t.split(":")[0]) + 1;
      slots.push({
        id: `slot-${dateStr}-${i}`,
        date: dateStr,
        startTime: t,
        endTime: `${endH.toString().padStart(2, "0")}:00`,
        available: Math.random() > 0.3, // 70% available
      });
    });
  }
  return slots;
}

export const mockStudentAppointments: Appointment[] = [
  {
    id: "apt-001",
    studentId: "6310210100",
    studentName: "ซอบารียะฮ์ ปีไสย",
    faculty: "วิศวกรรมศาสตร์",
    date: "2569-03-28",
    startTime: "10:00",
    endTime: "11:00",
    problemCategory: "ความเครียดจากการเรียน",
    status: "confirmed",
    psychologistId: "psy-001",
    psychologistName: "ดร.สมใจ นักจิต",
    sessionNumber: 1,
    caseStatus: "open",
    createdAt: "2569-03-20T14:30:00",
    auditLog: [
      { id: "log-1", action: "สร้างนัดหมาย", performedBy: "ซอบารียะฮ์ ปีไสย", performedByRole: "นักศึกษา", timestamp: "2569-03-20T14:30:00" },
      { id: "log-2", action: "ยืนยันนัดหมาย", performedBy: "ดร.สมใจ นักจิต", performedByRole: "นักจิตวิทยา", timestamp: "2569-03-20T15:00:00", detail: "มอบหมายให้ ดร.สมใจ นักจิต" },
    ],
  },
  {
    id: "apt-002",
    studentId: "6310210100",
    studentName: "ซอบารียะฮ์ ปีไสย",
    faculty: "วิศวกรรมศาสตร์",
    date: "2569-03-15",
    startTime: "09:00",
    endTime: "10:00",
    problemCategory: "ภาวะซึมเศร้า/วิตกกังวล",
    status: "completed",
    psychologistId: "psy-001",
    psychologistName: "ดร.สมใจ นักจิต",
    sessionNumber: 1,
    caseStatus: "follow-up",
    createdAt: "2569-03-10T09:00:00",
    auditLog: [
      { id: "log-3", action: "สร้างนัดหมาย", performedBy: "ดร.สมใจ นักจิต", performedByRole: "นักจิตวิทยา", timestamp: "2569-03-10T09:00:00", detail: "เคสเร่งด่วน" },
      { id: "log-4", action: "ให้คำปรึกษาเสร็จสิ้น", performedBy: "ดร.สมใจ นักจิต", performedByRole: "นักจิตวิทยา", timestamp: "2569-03-15T10:00:00" },
    ],
  },
];

export const mockAllAppointments: Appointment[] = [
  ...mockStudentAppointments,
  {
    id: "apt-003",
    studentId: "6510210001",
    studentName: "สมชาย ใจดี",
    faculty: "วิศวกรรมศาสตร์",
    date: "2569-03-28",
    startTime: "09:00",
    endTime: "10:00",
    problemCategory: "ภาวะซึมเศร้า/วิตกกังวล",
    status: "confirmed",
    psychologistId: "psy-001",
    psychologistName: "ดร.สมใจ นักจิต",
    sessionNumber: 1,
    caseStatus: "open",
    createdAt: "2569-03-21T10:00:00",
    auditLog: [
      { id: "log-5", action: "สร้างนัดหมาย (เคสเร่งด่วน)", performedBy: "ดร.สมใจ นักจิต", performedByRole: "นักจิตวิทยา", timestamp: "2569-03-21T10:00:00" },
    ],
  },
  {
    id: "apt-004",
    studentId: "6510210045",
    studentName: "สมหญิง รักเรียน",
    faculty: "วิทยาศาสตร์",
    date: "2569-03-28",
    startTime: "10:30",
    endTime: "11:30",
    problemCategory: "ปัญหาด้านความสัมพันธ์",
    status: "pending",
    sessionNumber: 2,
    caseStatus: "follow-up",
    createdAt: "2569-03-22T11:00:00",
    auditLog: [
      { id: "log-6", action: "สร้างนัดหมาย", performedBy: "สมหญิง รักเรียน", performedByRole: "นักศึกษา", timestamp: "2569-03-22T11:00:00" },
    ],
  },
  {
    id: "apt-005",
    studentId: "6510210102",
    studentName: "นายกล้า สู้ชีวิต",
    faculty: "แพทยศาสตร์",
    date: "2569-03-29",
    startTime: "13:00",
    endTime: "14:00",
    problemCategory: "ภาวะซึมเศร้า/วิตกกังวล",
    status: "confirmed",
    psychologistId: "psy-002",
    psychologistName: "อ.มานี ใจดี",
    sessionNumber: 3,
    caseStatus: "referred",
    createdAt: "2569-03-22T14:00:00",
    auditLog: [
      { id: "log-7", action: "สร้างนัดหมาย (ส่งต่อจิตแพทย์)", performedBy: "ดร.สมใจ นักจิต", performedByRole: "นักจิตวิทยา", timestamp: "2569-03-22T14:00:00" },
    ],
  },
];

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
  "follow-up": "นัดหมายต่อเนื่อง",
  referred: "ส่งต่อจิตแพทย์",
};

export const statusColors: Record<AppointmentStatus, string> = {
  pending: "bg-severity-moderate/20 text-severity-moderate border-severity-moderate/30",
  confirmed: "bg-severity-mild/20 text-severity-mild border-severity-mild/30",
  completed: "bg-primary/20 text-primary border-primary/30",
  cancelled: "bg-muted text-muted-foreground border-border",
  "follow-up": "bg-primary/20 text-primary border-primary/30",
  referred: "bg-severity-severe/20 text-severity-severe border-severity-severe/30",
};

export const caseStatusLabels: Record<CaseStatus, string> = {
  open: "เปิดเคส",
  "follow-up": "ติดตามต่อเนื่อง",
  referred: "ส่งต่อจิตแพทย์",
  closed: "ปิดเคส",
};
