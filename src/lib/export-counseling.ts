import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { StudentProfile } from "./mock-student-data";

export interface ExportData {
  student: StudentProfile;
  sessionNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  chiefComplaint: string;
  generalAppearance: string;
  behavior: string;
  summary: string;
  treatmentPlan: string;
  caseStatus: string;
  psychologistName: string;
  signatureDataUrl: string | null;
}

const caseStatusMap: Record<string, string> = {
  open: "Open",
  "follow-up": "Follow-up",
  referred: "Referred to Psychiatrist",
  closed: "Closed",
};

const caseStatusThai: Record<string, string> = {
  open: "เปิดเคส",
  "follow-up": "นัดหมายต่อเนื่อง",
  referred: "ส่งต่อจิตแพทย์",
  closed: "ปิดเคส",
};

export function exportToPDF(data: ExportData) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(0, 51, 153);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  doc.text("Counseling Record", pageWidth / 2, 14, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("PSU Mental Wellness System - Prince of Songkla University", pageWidth / 2, 22, { align: "center" });

  doc.setTextColor(0);

  // Session badge
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Session #${data.sessionNumber}`, 15, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Date: ${data.date}   |   Time: ${data.startTime} - ${data.endTime}`, 15, 46);

  // Student Info Table
  const studentRows = [
    ["Full Name", `${data.student.namePrefix}${data.student.fullName}`],
    ["Student ID", data.student.studentId],
    ["Faculty", data.student.faculty],
    ["Department", data.student.department],
    ["Year", `${data.student.yearLevel}`],
  ];
  if (data.student.dassScores) {
    studentRows.push(
      ["DASS-21 Depression", `${data.student.dassScores.depression}`],
      ["DASS-21 Anxiety", `${data.student.dassScores.anxiety}`],
      ["DASS-21 Stress", `${data.student.dassScores.stress}`],
    );
  }

  autoTable(doc, {
    startY: 50,
    head: [["Student Information", ""]],
    body: studentRows,
    theme: "grid",
    headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: "bold", fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold", fillColor: [235, 241, 255] },
    },
    margin: { left: 15, right: 15 },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const y1 = (doc as any).lastAutoTable?.finalY || 110;

  // Counseling Details Table
  const detailRows = [
    ["Service Type", data.serviceType || "-"],
    ["Chief Complaint", data.chiefComplaint || "-"],
    ["General Appearance", data.generalAppearance || "-"],
    ["Behavior During Session", data.behavior || "-"],
    ["Counseling Summary", data.summary || "-"],
    ["Treatment Plan / Next", data.treatmentPlan || "-"],
    ["Case Status", caseStatusMap[data.caseStatus] || data.caseStatus],
  ];

  autoTable(doc, {
    startY: y1 + 4,
    head: [["Counseling Details", ""]],
    body: detailRows,
    theme: "grid",
    headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: "bold", fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold", fillColor: [235, 241, 255] },
    },
    margin: { left: 15, right: 15 },
    styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
  });

  const y2 = (doc as any).lastAutoTable?.finalY || 200;

  // Signature
  if (data.signatureDataUrl) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Counselor Signature:", 15, y2 + 10);
    try {
      doc.addImage(data.signatureDataUrl, "PNG", 15, y2 + 13, 45, 18);
    } catch {
      // fallback
    }
    doc.setFont("helvetica", "normal");
    doc.text(data.psychologistName, 15, y2 + 35);
  } else {
    doc.setFontSize(9);
    doc.text(`Counselor: ${data.psychologistName}`, 15, y2 + 10);
  }

  // Footer
  const fy = Math.min(y2 + (data.signatureDataUrl ? 42 : 18), 282);
  doc.setFontSize(7);
  doc.setTextColor(140);
  doc.text(`Generated: ${new Date().toLocaleString("th-TH")}`, 15, fy);
  doc.setDrawColor(0, 51, 153);
  doc.setLineWidth(0.3);
  doc.line(15, fy + 2, pageWidth - 15, fy + 2);

  doc.save(`counseling-${data.student.studentId}-session${data.sessionNumber}.pdf`);
}

export function exportToExcel(data: ExportData) {
  const wb = XLSX.utils.book_new();

  const rows = [
    ["แบบบันทึกการให้คำปรึกษาทางจิตวิทยา - มหาวิทยาลัยสงขลานครินทร์"],
    [],
    ["หมวด", "รายละเอียด"],
    ["ชื่อ-สกุล", `${data.student.namePrefix}${data.student.fullName}`],
    ["รหัสนักศึกษา", data.student.studentId],
    ["คณะ", data.student.faculty],
    ["ภาควิชา/สาขา", data.student.department],
    ["ชั้นปี", data.student.yearLevel],
    [],
    ["DASS-21 ซึมเศร้า", data.student.dassScores?.depression ?? "ยังไม่ประเมิน"],
    ["DASS-21 วิตกกังวล", data.student.dassScores?.anxiety ?? "ยังไม่ประเมิน"],
    ["DASS-21 ความเครียด", data.student.dassScores?.stress ?? "ยังไม่ประเมิน"],
    [],
    ["ครั้งที่", data.sessionNumber],
    ["วันที่", data.date],
    ["เวลาเริ่มต้น", data.startTime],
    ["เวลาสิ้นสุด", data.endTime],
    ["รูปแบบการให้บริการ", data.serviceType],
    ["อาการสำคัญ", data.chiefComplaint],
    ["ลักษณะทั่วไป (ทางกาย)", data.generalAppearance],
    ["พฤติกรรมระหว่างการให้คำปรึกษา", data.behavior],
    ["สรุปการให้คำปรึกษา", data.summary],
    ["แผนการบำบัด/ครั้งถัดไป", data.treatmentPlan],
    ["สถานะเคส", caseStatusThai[data.caseStatus] || data.caseStatus],
    [],
    ["ผู้ให้คำปรึกษา", data.psychologistName],
    ["วันที่บันทึก", new Date().toLocaleDateString("th-TH")],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 35 }, { wch: 55 }];
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  XLSX.utils.book_append_sheet(wb, ws, "บันทึกการให้คำปรึกษา");
  XLSX.writeFile(wb, `counseling-${data.student.studentId}-session${data.sessionNumber}.xlsx`);
}
