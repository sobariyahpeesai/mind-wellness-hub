import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StudentSearch from "@/components/counseling/StudentSearch";
import StudentProfileView from "@/components/counseling/StudentProfileView";
import SignaturePad from "@/components/counseling/SignaturePad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStudentProfile,
  getStudentCounselingRecords,
  saveCounselingRecord,
  serviceTypes,
  problemCategories,
  type StudentProfile,
  type CounselingRecord,
} from "@/lib/mock-student-data";
import { toast } from "sonner";
import {
  Search, FileText, Save, FileDown, PenTool, Clock,
  CalendarDays, User, ChevronDown, ChevronUp, ClipboardList
} from "lucide-react";

export default function CounselingFormPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [pastRecords, setPastRecords] = useState<CounselingRecord[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showPastRecords, setShowPastRecords] = useState(false);

  // Form state
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [serviceType, setServiceType] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [customComplaint, setCustomComplaint] = useState("");
  const [generalAppearance, setGeneralAppearance] = useState("");
  const [behavior, setBehavior] = useState("");
  const [summary, setSummary] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [caseStatus, setCaseStatus] = useState<CounselingRecord["caseStatus"]>("open");
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleSelectStudent = (studentId: string) => {
    const profile = getStudentProfile(studentId);
    setSelectedStudent(profile);
    if (profile) {
      const records = getStudentCounselingRecords(studentId);
      setPastRecords(records);
    }
  };

  const sessionNumber = pastRecords.length + 1;

  const handleSave = () => {
    if (!selectedStudent) {
      toast.error("กรุณาเลือกนักศึกษาก่อน");
      return;
    }
    if (!serviceType || !date) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!signatureData) {
      toast.error("กรุณาลงลายเซ็นดิจิทัลก่อนบันทึก");
      return;
    }

    const record: CounselingRecord = {
      id: `CR-${Date.now()}`,
      studentId: selectedStudent.studentId,
      studentName: `${selectedStudent.namePrefix}${selectedStudent.fullName}`,
      sessionNumber,
      date,
      startTime,
      endTime,
      serviceType,
      chiefComplaint: chiefComplaint === "อื่นๆ" ? customComplaint : chiefComplaint,
      generalAppearance,
      behaviorDuringSession: behavior,
      counselingSummary: summary,
      treatmentPlan,
      dassScores: selectedStudent.dassScores,
      caseStatus,
      psychologistName: "อ.สุภาพร จิตดี",
      signatureDataUrl: signatureData,
      createdAt: new Date().toISOString(),
    };

    saveCounselingRecord(record);
    toast.success("บันทึกข้อมูลการให้คำปรึกษาเรียบร้อยแล้ว");
  };

  const handleExport = () => {
    if (!selectedStudent) return;
    // Generate a simple text export (mock e-docs)
    const content = [
      "แบบบันทึกการให้คำปรึกษาทางจิตวิทยา",
      "มหาวิทยาลัยสงขลานครินทร์",
      "═".repeat(50),
      `ครั้งที่: ${sessionNumber}`,
      `วันที่: ${date}`,
      `เวลา: ${startTime} - ${endTime}`,
      "",
      `ชื่อ-สกุล: ${selectedStudent.namePrefix}${selectedStudent.fullName}`,
      `รหัสนักศึกษา: ${selectedStudent.studentId}`,
      `คณะ: ${selectedStudent.faculty}`,
      `ภาควิชา: ${selectedStudent.department}`,
      `ชั้นปี: ${selectedStudent.yearLevel}`,
      "",
      `รูปแบบการให้บริการ: ${serviceType}`,
      `อาการสำคัญ: ${chiefComplaint === "อื่นๆ" ? customComplaint : chiefComplaint}`,
      `ลักษณะทั่วไป (ทางกาย): ${generalAppearance}`,
      `พฤติกรรมระหว่างการให้คำปรึกษา: ${behavior}`,
      `สรุปการให้คำปรึกษา: ${summary}`,
      `แผนการบำบัด/ครั้งถัดไป: ${treatmentPlan}`,
      `สถานะเคส: ${caseStatus}`,
      "",
      selectedStudent.dassScores
        ? `คะแนน DASS-21: ซึมเศร้า=${selectedStudent.dassScores.depression} วิตกกังวล=${selectedStudent.dassScores.anxiety} เครียด=${selectedStudent.dassScores.stress}`
        : "คะแนน DASS-21: ยังไม่มีผลประเมิน",
      "",
      "ลงชื่อ ผู้ให้คำปรึกษา: อ.สุภาพร จิตดี",
      `วันที่บันทึก: ${new Date().toLocaleDateString("th-TH")}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `counseling-record-${selectedStudent.studentId}-${sessionNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ส่งออกเอกสารสำเร็จ");
  };

  return (
    <AppLayout
      userName="สุภาพร จิตดี"
      userRole="psychologist"
      notificationCount={3}
    >
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">แบบบันทึกการให้คำปรึกษา</h1>
            <p className="text-sm text-muted-foreground">บันทึกข้อมูลการให้คำปรึกษาทางจิตวิทยาแก่นักศึกษา</p>
          </div>
        </div>

        {/* Student Search */}
        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              ค้นหานักศึกษา
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentSearch onSelect={handleSelectStudent} />
          </CardContent>
        </Card>

        {selectedStudent && (
          <>
            {/* Student Profile (collapsible) */}
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardHeader
                className="pb-2 cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              >
                <CardTitle className="font-heading text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    ข้อมูลนักศึกษา — {selectedStudent.namePrefix}{selectedStudent.fullName} ({selectedStudent.studentId})
                  </span>
                  {showProfile ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </CardTitle>
              </CardHeader>
              {showProfile && (
                <CardContent>
                  <StudentProfileView profile={selectedStudent} />
                </CardContent>
              )}
            </Card>

            {/* Past Records (collapsible) */}
            {pastRecords.length > 0 && (
              <Card className="rounded-2xl shadow-sm border-border/60">
                <CardHeader
                  className="pb-2 cursor-pointer"
                  onClick={() => setShowPastRecords(!showPastRecords)}
                >
                  <CardTitle className="font-heading text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-severity-moderate/20 flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-severity-moderate" />
                      </div>
                      ประวัติการให้คำปรึกษา ({pastRecords.length} ครั้ง)
                    </span>
                    {showPastRecords ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </CardTitle>
                </CardHeader>
                {showPastRecords && (
                  <CardContent className="space-y-3">
                    {pastRecords.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl bg-secondary/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-sm font-semibold">ครั้งที่ {r.sessionNumber} — {r.date}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            r.caseStatus === "closed" ? "bg-muted text-muted-foreground" :
                            r.caseStatus === "follow-up" ? "bg-severity-moderate/20 text-severity-moderate" :
                            r.caseStatus === "referred" ? "bg-destructive/10 text-destructive" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {r.caseStatus === "open" ? "เปิดเคส" : r.caseStatus === "follow-up" ? "ติดตาม" : r.caseStatus === "referred" ? "ส่งต่อ" : "ปิดเคส"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">ผู้ให้คำปรึกษา: {r.psychologistName}</p>
                        <p className="text-sm text-foreground">{r.counselingSummary}</p>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Counseling Form */}
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  บันทึกการให้คำปรึกษา — ครั้งที่ {sessionNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto-filled read-only fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-secondary/30">
                  <div>
                    <Label className="text-xs text-muted-foreground">ชื่อ-สกุลนักศึกษา</Label>
                    <Input disabled value={`${selectedStudent.namePrefix}${selectedStudent.fullName}`} className="rounded-lg bg-card mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">รหัสนักศึกษา</Label>
                    <Input disabled value={selectedStudent.studentId} className="rounded-lg bg-card mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">คณะ</Label>
                    <Input disabled value={selectedStudent.faculty} className="rounded-lg bg-card mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">ภาควิชา/สาขา</Label>
                    <Input disabled value={selectedStudent.department} className="rounded-lg bg-card mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">ชั้นปี</Label>
                    <Input disabled value={`ปี ${selectedStudent.yearLevel}`} className="rounded-lg bg-card mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">ครั้งที่ให้คำปรึกษา</Label>
                    <Input disabled value={`ครั้งที่ ${sessionNumber}`} className="rounded-lg bg-card mt-1" />
                  </div>
                  {selectedStudent.dassScores && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">DASS-21 ซึมเศร้า</Label>
                        <Input disabled value={selectedStudent.dassScores.depression} className="rounded-lg bg-card mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">DASS-21 วิตกกังวล</Label>
                        <Input disabled value={selectedStudent.dassScores.anxiety} className="rounded-lg bg-card mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">DASS-21 ความเครียด</Label>
                        <Input disabled value={selectedStudent.dassScores.stress} className="rounded-lg bg-card mt-1" />
                      </div>
                    </>
                  )}
                </div>

                {/* Manual input fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-primary" /> วันที่ให้การปรึกษา
                    </Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> เวลาเริ่มต้น
                    </Label>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-lg mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> เวลาสิ้นสุด
                    </Label>
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-lg mt-1" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">รูปแบบการให้บริการ</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="rounded-lg mt-1">
                      <SelectValue placeholder="เลือกรูปแบบการให้บริการ" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">อาการสำคัญ / ปัญหาที่นำมาปรึกษา</Label>
                  <Select value={chiefComplaint} onValueChange={setChiefComplaint}>
                    <SelectTrigger className="rounded-lg mt-1">
                      <SelectValue placeholder="เลือกประเภทปัญหา" />
                    </SelectTrigger>
                    <SelectContent>
                      {problemCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {chiefComplaint === "อื่นๆ" && (
                    <Textarea
                      placeholder="ระบุอาการสำคัญ..."
                      value={customComplaint}
                      onChange={(e) => setCustomComplaint(e.target.value)}
                      className="rounded-lg mt-2"
                      rows={2}
                    />
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">ลักษณะทั่วไป (ทางกาย)</Label>
                  <Textarea
                    placeholder="บรรยายลักษณะทั่วไปของนักศึกษา เช่น การแต่งกาย สีหน้า ท่าทาง..."
                    value={generalAppearance}
                    onChange={(e) => setGeneralAppearance(e.target.value)}
                    className="rounded-lg mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">พฤติกรรมและสถานการณ์ระหว่างการให้คำปรึกษา</Label>
                  <Textarea
                    placeholder="บรรยายพฤติกรรมที่สังเกตได้ระหว่างการให้คำปรึกษา..."
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}
                    className="rounded-lg mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">สรุปการให้คำปรึกษา</Label>
                  <Textarea
                    placeholder="สรุปประเด็นสำคัญและผลลัพธ์ของการให้คำปรึกษา..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="rounded-lg mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">แผนการบำบัด / แผนการให้คำปรึกษาในครั้งต่อไป</Label>
                  <Textarea
                    placeholder="ระบุแผนการดำเนินการต่อไป..."
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    className="rounded-lg mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">สถานะเคส</Label>
                  <Select value={caseStatus} onValueChange={(v) => setCaseStatus(v as CounselingRecord["caseStatus"])}>
                    <SelectTrigger className="rounded-lg mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">เปิดเคส</SelectItem>
                      <SelectItem value="follow-up">นัดหมายต่อเนื่อง</SelectItem>
                      <SelectItem value="referred">ส่งต่อจิตแพทย์</SelectItem>
                      <SelectItem value="closed">ปิดเคส</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Digital Signature */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1.5 mb-2">
                    <PenTool className="w-3.5 h-3.5 text-primary" /> ลายเซ็นดิจิทัลผู้ให้คำปรึกษา
                  </Label>
                  {signatureData ? (
                    <div className="space-y-2">
                      <div className="border-2 border-primary/20 rounded-xl p-2 bg-card inline-block">
                        <img src={signatureData} alt="ลายเซ็น" className="h-24" />
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => setSignatureData(null)} className="rounded-lg">
                          เปลี่ยนลายเซ็น
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <SignaturePad onSave={setSignatureData} />
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl h-11 flex-1">
                    <Save className="w-4 h-4 mr-2" /> บันทึกข้อมูลการให้คำปรึกษา
                  </Button>
                  <Button variant="outline" onClick={handleExport} className="rounded-xl h-11 border-primary/30 text-primary">
                    <FileDown className="w-4 h-4 mr-2" /> ส่งออกเอกสาร e-docs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
