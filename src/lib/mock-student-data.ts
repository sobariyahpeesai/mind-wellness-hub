// Mock student database — will be replaced by university API calls

export interface StudentProfile {
  // 1. ชื่อ-สกุล
  fullName: string;
  namePrefix: string;
  // 2. รหัสนักศึกษา
  studentId: string;
  // 3. หมายเลขโทรศัพท์
  phone: string;
  // 4. ศาสนา
  religion: string;
  // 5. คณะ
  faculty: string;
  // 6. ภาควิชา
  department: string;
  // 7. ชั้นปี
  yearLevel: number;
  // 8. วิทยาเขต
  campus: string;
  // 9. ระดับการศึกษา
  educationLevel: string;
  // 10. อาจารย์ที่ปรึกษา
  advisor: string;
  // 11. ข้อมูลพื้นฐาน
  previousInstitution: string;
  graduationYear: string;
  siblings: number;
  disability: string;
  // 12. ข้อมูลผู้ปกครอง
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  guardianIncome: string;
  guardianAddress: string;
  parentMaritalStatus: string;
  // 13. หอพัก
  dormitory: string;
  // 14. ผลการเรียน (GPA)
  gpa: number;
  // 15. ผลการลงทะเบียน
  registrationStatus: string;
  currentCredits: number;
  // 16. สถานะทางการศึกษา
  academicStatus: string;
  // 17. ทุนการศึกษา
  scholarship: string;
  // 18. ข้อมูล กยศ.
  studentLoan: string;
  // 19. ประวัติทางวินัย
  disciplinaryRecord: string;
  // 20. ประวัติการเข้ารับบริการ
  serviceHistory: CounselingHistory[];
  // 21. ข้อมูลนักกิจกรรม
  activityInfo: string;
  // 22. ผลประเมิน DASS-21
  dassScores: { depression: number; anxiety: number; stress: number } | null;
  // 23. สภาพปัญหา
  currentIssues: string;
  // 24. อื่นๆ
  additionalNotes: string;
  // email
  email: string;
  gender: string;
}

export interface CounselingHistory {
  sessionNumber: number;
  date: string;
  psychologistName: string;
  summary: string;
  status: "completed" | "follow-up" | "referred";
}

export interface CounselingRecord {
  id: string;
  studentId: string;
  studentName: string;
  sessionNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  chiefComplaint: string;
  generalAppearance: string;
  behaviorDuringSession: string;
  counselingSummary: string;
  treatmentPlan: string;
  dassScores: { depression: number; anxiety: number; stress: number } | null;
  caseStatus: "open" | "follow-up" | "referred" | "closed";
  psychologistName: string;
  signatureDataUrl: string | null;
  createdAt: string;
}

// Mock student database
const mockStudents: StudentProfile[] = [
  {
    fullName: "ซอบารียะฮ์ ปีไสย",
    namePrefix: "นางสาว",
    studentId: "6310210100",
    phone: "089-123-4567",
    religion: "อิสลาม",
    faculty: "คณะวิทยาศาสตร์",
    department: "สาขาวิทยาศาสตร์การคำนวณ",
    yearLevel: 4,
    campus: "วิทยาเขตหาดใหญ่",
    educationLevel: "ปริญญาตรี",
    advisor: "ผศ.ดร.สมชาย วิชาดี",
    previousInstitution: "โรงเรียนหาดใหญ่วิทยาลัย",
    graduationYear: "2563",
    siblings: 2,
    disability: "ไม่มี",
    fatherName: "นายอาหมัด ปีไสย",
    fatherOccupation: "ค้าขาย",
    fatherPhone: "081-234-5678",
    motherName: "นางอามีเน๊าะ ปีไสย",
    motherOccupation: "แม่บ้าน",
    motherPhone: "082-345-6789",
    guardianIncome: "25,000 บาท/เดือน",
    guardianAddress: "123 ถ.กรณีย์ อ.หาดใหญ่ จ.สงขลา 90110",
    parentMaritalStatus: "สมรส",
    dormitory: "หอพักนักศึกษาหญิง 12",
    gpa: 3.25,
    registrationStatus: "ลงทะเบียนปกติ",
    currentCredits: 18,
    academicStatus: "ปกติ",
    scholarship: "ทุนเรียนดี คณะวิทยาศาสตร์",
    studentLoan: "กู้ยืม กยศ. ประเภท 1",
    disciplinaryRecord: "ไม่มี",
    serviceHistory: [
      { sessionNumber: 1, date: "15 ม.ค. 2569", psychologistName: "อ.สุภาพร จิตดี", summary: "ปรึกษาเรื่องความเครียดจากการเรียน", status: "completed" },
      { sessionNumber: 2, date: "29 ม.ค. 2569", psychologistName: "อ.สุภาพร จิตดี", summary: "ติดตามผลและฝึกเทคนิคการจัดการความเครียด", status: "follow-up" },
    ],
    activityInfo: "ชมรมวิทยาศาสตร์, กิจกรรมจิตอาสา",
    dassScores: { depression: 12, anxiety: 8, stress: 15 },
    currentIssues: "ความเครียดจากการเรียนและปัญหาครอบครัว",
    additionalNotes: "",
    email: "sobariyah.p@email.psu.ac.th",
    gender: "หญิง",
  },
  {
    fullName: "ธนพล สุขสวัสดิ์",
    namePrefix: "นาย",
    studentId: "6410110234",
    phone: "091-987-6543",
    religion: "พุทธ",
    faculty: "คณะวิศวกรรมศาสตร์",
    department: "สาขาวิศวกรรมคอมพิวเตอร์",
    yearLevel: 3,
    campus: "วิทยาเขตหาดใหญ่",
    educationLevel: "ปริญญาตรี",
    advisor: "รศ.ดร.วิชัย ใจเย็น",
    previousInstitution: "โรงเรียนมหาวชิราวุธ สงขลา",
    graduationYear: "2564",
    siblings: 1,
    disability: "ไม่มี",
    fatherName: "นายสมศักดิ์ สุขสวัสดิ์",
    fatherOccupation: "ข้าราชการ",
    fatherPhone: "083-456-7890",
    motherName: "นางสุนิสา สุขสวัสดิ์",
    motherOccupation: "พยาบาล",
    motherPhone: "084-567-8901",
    guardianIncome: "50,000 บาท/เดือน",
    guardianAddress: "456 ถ.ไทรบุรี อ.เมือง จ.สงขลา 90000",
    parentMaritalStatus: "สมรส",
    dormitory: "หอพักนักศึกษาชาย 7",
    gpa: 2.85,
    registrationStatus: "ลงทะเบียนปกติ",
    currentCredits: 21,
    academicStatus: "ปกติ",
    scholarship: "ไม่มี",
    studentLoan: "ไม่มี",
    disciplinaryRecord: "ไม่มี",
    serviceHistory: [],
    activityInfo: "ชมรมหุ่นยนต์, สภานักศึกษา",
    dassScores: { depression: 16, anxiety: 12, stress: 20 },
    currentIssues: "ปัญหาความสัมพันธ์และแรงกดดันจากครอบครัว",
    additionalNotes: "",
    email: "thanapon.s@email.psu.ac.th",
    gender: "ชาย",
  },
  {
    fullName: "ฟาตีมะห์ หะยีดอเลาะ",
    namePrefix: "นางสาว",
    studentId: "6510310055",
    phone: "095-111-2222",
    religion: "อิสลาม",
    faculty: "คณะแพทยศาสตร์",
    department: "สาขาแพทยศาสตร์",
    yearLevel: 2,
    campus: "วิทยาเขตหาดใหญ่",
    educationLevel: "ปริญญาตรี",
    advisor: "ศ.นพ.ประยุทธ์ ศรีสุข",
    previousInstitution: "โรงเรียนเดชะปัตตนยานุกูล",
    graduationYear: "2565",
    siblings: 4,
    disability: "ไม่มี",
    fatherName: "นายมูฮัมหมัด หะยีดอเลาะ",
    fatherOccupation: "เกษตรกร",
    fatherPhone: "086-333-4444",
    motherName: "นางรอฮานี หะยีดอเลาะ",
    motherOccupation: "ค้าขาย",
    motherPhone: "087-444-5555",
    guardianIncome: "15,000 บาท/เดือน",
    guardianAddress: "789 ม.3 ต.รูสะมิแล อ.เมือง จ.ปัตตานี 94000",
    parentMaritalStatus: "สมรส",
    dormitory: "หอพักนักศึกษาหญิง 15",
    gpa: 3.65,
    registrationStatus: "ลงทะเบียนปกติ",
    currentCredits: 22,
    academicStatus: "ปกติ",
    scholarship: "ทุน พสวท.",
    studentLoan: "กู้ยืม กยศ. ประเภท 2",
    disciplinaryRecord: "ไม่มี",
    serviceHistory: [],
    activityInfo: "ชมรมอาสาสาธารณสุข",
    dassScores: { depression: 6, anxiety: 10, stress: 14 },
    currentIssues: "ความวิตกกังวลเรื่องผลการเรียน",
    additionalNotes: "",
    email: "fatimah.h@email.psu.ac.th",
    gender: "หญิง",
  },
];

// Mock counseling records
const mockCounselingRecords: CounselingRecord[] = [
  {
    id: "CR-001",
    studentId: "6310210100",
    studentName: "ซอบารียะฮ์ ปีไสย",
    sessionNumber: 1,
    date: "2569-01-15",
    startTime: "10:00",
    endTime: "11:00",
    serviceType: "การให้คำปรึกษารายบุคคล",
    chiefComplaint: "ความเครียดจากการเรียนและปัญหาครอบครัว",
    generalAppearance: "แต่งกายสุภาพ สีหน้าเหนื่อยล้า",
    behaviorDuringSession: "ให้ความร่วมมือดี เปิดเผยความรู้สึก มีอาการร้องไห้ระหว่างเล่าปัญหา",
    counselingSummary: "นักศึกษามีความเครียดสะสมจากการเรียนและปัญหาครอบครัว ได้ฝึกเทคนิคการหายใจเพื่อผ่อนคลาย",
    treatmentPlan: "นัดติดตามผลอีก 2 สัปดาห์ ฝึกเทคนิคการจัดการความเครียดด้วยตนเอง",
    dassScores: { depression: 12, anxiety: 8, stress: 15 },
    caseStatus: "follow-up",
    psychologistName: "อ.สุภาพร จิตดี",
    signatureDataUrl: null,
    createdAt: "2569-01-15T10:00:00",
  },
];

// --- API simulation functions ---

export function searchStudents(query: string): { studentId: string; fullName: string; namePrefix: string; faculty: string }[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return mockStudents
    .filter((s) => s.fullName.toLowerCase().includes(q) || s.studentId.includes(q))
    .map((s) => ({ studentId: s.studentId, fullName: s.fullName, namePrefix: s.namePrefix, faculty: s.faculty }));
}

export function getStudentProfile(studentId: string): StudentProfile | null {
  return mockStudents.find((s) => s.studentId === studentId) || null;
}

export function getStudentCounselingRecords(studentId: string): CounselingRecord[] {
  return mockCounselingRecords.filter((r) => r.studentId === studentId);
}

export function saveCounselingRecord(record: CounselingRecord): CounselingRecord {
  mockCounselingRecords.push(record);
  return record;
}

export function getAllCounselingRecords(): CounselingRecord[] {
  return [...mockCounselingRecords];
}

export const serviceTypes = [
  "การให้คำปรึกษารายบุคคล",
  "การให้คำปรึกษาแบบกลุ่ม",
  "การให้คำปรึกษาทางโทรศัพท์",
  "การให้คำปรึกษาออนไลน์",
  "การให้คำปรึกษาเชิงรุก",
  "อื่นๆ",
];

export const problemCategories = [
  "ปัญหาด้านการเรียน",
  "ปัญหาด้านความสัมพันธ์",
  "ปัญหาด้านครอบครัว",
  "ปัญหาด้านการเงิน",
  "ปัญหาด้านสุขภาพจิต",
  "ปัญหาด้านสุขภาพกาย",
  "ปัญหาด้านการปรับตัว",
  "ปัญหาด้านอาชีพและอนาคต",
  "อื่นๆ",
];
