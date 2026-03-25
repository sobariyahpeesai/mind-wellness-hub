import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search, FileDown, ClipboardList,
} from "lucide-react";
import {
  getAllCounselingRecords,
  getStudentProfile,
  type CounselingRecord,
} from "@/lib/mock-student-data";
import { exportToPDF, type ExportData } from "@/lib/export-counseling";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  open: "เปิดเคส",
  "follow-up": "ติดตาม",
  referred: "ส่งต่อ",
  closed: "ปิดเคส",
};

const statusStyle: Record<string, string> = {
  open: "bg-primary/10 text-primary",
  "follow-up": "bg-severity-moderate/20 text-severity-moderate",
  referred: "bg-destructive/10 text-destructive",
  closed: "bg-muted text-muted-foreground",
};

// Add more mock records for demo
function getRecords(): CounselingRecord[] {
  const base = getAllCounselingRecords();
  // Add extra demo records
  const extra: CounselingRecord[] = [
    {
      id: "CR-002",
      studentId: "6310210100",
      studentName: "ซอบารียะฮ์ ปีไสย",
      sessionNumber: 2,
      date: "2569-01-29",
      startTime: "10:00",
      endTime: "11:00",
      serviceType: "การให้คำปรึกษารายบุคคล",
      chiefComplaint: "ติดตามผลการจัดการความเครียด",
      generalAppearance: "สีหน้าดีขึ้น แต่งกายเรียบร้อย",
      behaviorDuringSession: "ให้ความร่วมมือดี สื่อสารเปิดเผย",
      counselingSummary: "นักศึกษามีพัฒนาการที่ดีขึ้น สามารถใช้เทคนิคหายใจได้เอง",
      treatmentPlan: "นัดติดตามอีก 1 เดือน",
      dassScores: { depression: 10, anxiety: 6, stress: 12 },
      caseStatus: "follow-up",
      psychologistName: "อ.สุภาพร จิตดี",
      signatureDataUrl: null,
      createdAt: "2569-01-29T10:00:00",
    },
    {
      id: "CR-003",
      studentId: "6410110234",
      studentName: "ธนพล สุขสวัสดิ์",
      sessionNumber: 1,
      date: "2569-02-10",
      startTime: "14:00",
      endTime: "15:30",
      serviceType: "การให้คำปรึกษารายบุคคล",
      chiefComplaint: "ปัญหาความสัมพันธ์และแรงกดดันจากครอบครัว",
      generalAppearance: "แต่งกายปกติ มีอาการกระวนกระวาย",
      behaviorDuringSession: "พูดเร็ว มีอาการวิตกกังวลชัดเจน",
      counselingSummary: "นักศึกษามีความเครียดจากปัญหาความสัมพันธ์และแรงกดดันจากครอบครัว ได้ให้คำปรึกษาเบื้องต้น",
      treatmentPlan: "นัดติดตาม 2 สัปดาห์ พิจารณาส่งต่อหากไม่ดีขึ้น",
      dassScores: { depression: 16, anxiety: 12, stress: 20 },
      caseStatus: "referred",
      psychologistName: "อ.สุภาพร จิตดี",
      signatureDataUrl: null,
      createdAt: "2569-02-10T14:00:00",
    },
    {
      id: "CR-004",
      studentId: "6510310055",
      studentName: "ฟาตีมะห์ หะยีดอเลาะ",
      sessionNumber: 1,
      date: "2569-03-05",
      startTime: "09:00",
      endTime: "10:00",
      serviceType: "การให้คำปรึกษาออนไลน์",
      chiefComplaint: "ความวิตกกังวลเรื่องผลการเรียน",
      generalAppearance: "แต่งกายสุภาพ สีหน้ากังวล",
      behaviorDuringSession: "ร่วมมือดี แต่พูดน้อย",
      counselingSummary: "นักศึกษามีความวิตกกังวลเรื่อง GPA ได้ช่วยวางแผนการเรียน",
      treatmentPlan: "แนะนำเทคนิคการจัดการเวลาและนัดติดตาม",
      dassScores: { depression: 6, anxiety: 10, stress: 14 },
      caseStatus: "open",
      psychologistName: "อ.สุภาพร จิตดี",
      signatureDataUrl: null,
      createdAt: "2569-03-05T09:00:00",
    },
  ];
  return [...base, ...extra];
}

export default function CounselingRecordsPage() {
  const allRecords = useMemo(() => getRecords(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!searchQuery) return allRecords;
    const q = searchQuery.toLowerCase();
    return allRecords.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.studentId.includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [allRecords, searchQuery]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportPDF = () => {
    const selectedRecords = allRecords.filter((r) => selected.has(r.id));
    if (selectedRecords.length === 0) {
      toast.error("กรุณาเลือกรายการที่ต้องการส่งออก");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    selectedRecords.forEach((record, index) => {
      if (index > 0) doc.addPage();

      const student = getStudentProfile(record.studentId);

      // Header
      doc.setFillColor(0, 51, 153);
      doc.rect(0, 0, pageWidth, 28, "F");
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255);
      doc.text("Counseling Record", pageWidth / 2, 12, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("PSU Mental Wellness System", pageWidth / 2, 19, { align: "center" });
      doc.text(`Record: ${record.id}  |  Page ${index + 1} of ${selectedRecords.length}`, pageWidth / 2, 24, { align: "center" });

      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Session #${record.sessionNumber}`, 15, 36);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Date: ${record.date}  |  Time: ${record.startTime} - ${record.endTime}`, 15, 41);

      // Student info table
      const studentRows = [
        ["Student", record.studentName],
        ["Student ID", record.studentId],
        ["Faculty", student?.faculty || "-"],
        ["Department", student?.department || "-"],
      ];
      if (record.dassScores) {
        studentRows.push(
          ["DASS-21 D/A/S", `${record.dassScores.depression} / ${record.dassScores.anxiety} / ${record.dassScores.stress}`]
        );
      }

      autoTable(doc, {
        startY: 45,
        head: [["Student Information", ""]],
        body: studentRows,
        theme: "grid",
        headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: "bold", fontSize: 9 },
        columnStyles: { 0: { cellWidth: 45, fontStyle: "bold", fillColor: [235, 241, 255] } },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 2.5 },
      });

      const y1 = (doc as any).lastAutoTable?.finalY || 100;

      // Details table
      const detailRows = [
        ["Service Type", record.serviceType || "-"],
        ["Chief Complaint", record.chiefComplaint || "-"],
        ["General Appearance", record.generalAppearance || "-"],
        ["Behavior", record.behaviorDuringSession || "-"],
        ["Summary", record.counselingSummary || "-"],
        ["Treatment Plan", record.treatmentPlan || "-"],
        ["Case Status", statusLabel[record.caseStatus] || record.caseStatus],
      ];

      autoTable(doc, {
        startY: y1 + 3,
        head: [["Counseling Details", ""]],
        body: detailRows,
        theme: "grid",
        headStyles: { fillColor: [0, 51, 153], textColor: 255, fontStyle: "bold", fontSize: 9 },
        columnStyles: { 0: { cellWidth: 45, fontStyle: "bold", fillColor: [235, 241, 255] } },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
      });

      const y2 = (doc as any).lastAutoTable?.finalY || 200;
      doc.setFontSize(8);
      doc.text(`Counselor: ${record.psychologistName}`, 15, y2 + 8);

      // Footer
      doc.setFontSize(6);
      doc.setTextColor(140);
      doc.text(`Generated: ${new Date().toLocaleString("th-TH")}`, 15, 285);
      doc.setDrawColor(0, 51, 153);
      doc.setLineWidth(0.3);
      doc.line(15, 287, pageWidth - 15, 287);
    });

    doc.save(`counseling-records-batch-${selectedRecords.length}.pdf`);
    toast.success(`ส่งออก PDF สำเร็จ (${selectedRecords.length} รายการ)`);
  };

  return (
    <AppLayout userName="สุภาพร จิตดี" userRole="psychologist" notificationCount={3}>
      <div className="container py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">สืบค้นบันทึกการให้คำปรึกษา</h1>
              <p className="text-sm text-muted-foreground">ค้นหาและส่งออกบันทึกการให้คำปรึกษาเป็น PDF</p>
            </div>
          </div>
          <Button
            onClick={handleExportPDF}
            disabled={selected.size === 0}
            className="rounded-xl gap-2"
          >
            <FileDown className="w-4 h-4" />
            ส่งออก PDF ({selected.size})
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาชื่อ, รหัสนักศึกษา, หรือ ID บันทึก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Table */}
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>นักศึกษา</TableHead>
                  <TableHead>ครั้งที่</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผู้ให้คำปรึกษา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      ไม่พบรายการที่ตรงกับการค้นหา
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((r) => (
                  <TableRow key={r.id} className={selected.has(r.id) ? "bg-primary/5" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(r.id)}
                        onCheckedChange={() => toggleOne(r.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{r.studentName}</p>
                        <p className="text-xs text-muted-foreground">{r.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{r.sessionNumber}</TableCell>
                    <TableCell className="text-sm">{r.date}</TableCell>
                    <TableCell className="text-xs">{r.serviceType}</TableCell>
                    <TableCell>
                      <Badge className={`${statusStyle[r.caseStatus]} border-0 text-xs`}>
                        {statusLabel[r.caseStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.psychologistName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary */}
        <p className="text-xs text-muted-foreground">
          แสดง {filtered.length} รายการ | เลือก {selected.size} รายการ
        </p>
      </div>
    </AppLayout>
  );
}
