import { StudentProfile, CounselingHistory } from "@/lib/mock-student-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SeverityBadge from "@/components/student/SeverityBadge";
import { getDepressionSeverity, getAnxietySeverity, getStressSeverity } from "@/lib/dass21";
import {
  User, Phone, BookOpen, GraduationCap, Building2, MapPin,
  Heart, Home, Shield, Activity, ClipboardList, FileText
} from "lucide-react";

interface StudentProfileViewProps {
  profile: StudentProfile;
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground font-medium w-40 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{String(value) || "—"}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function StudentProfileView({ profile }: StudentProfileViewProps) {
  const p = profile;

  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <TabsList className="bg-secondary rounded-xl p-1 flex-wrap h-auto">
        <TabsTrigger value="personal" className="rounded-lg text-xs">ข้อมูลส่วนตัว</TabsTrigger>
        <TabsTrigger value="family" className="rounded-lg text-xs">ครอบครัว</TabsTrigger>
        <TabsTrigger value="academic" className="rounded-lg text-xs">การศึกษา</TabsTrigger>
        <TabsTrigger value="health" className="rounded-lg text-xs">สุขภาพจิต</TabsTrigger>
        <TabsTrigger value="history" className="rounded-lg text-xs">ประวัติการปรึกษา</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        <SectionCard icon={User} title="ข้อมูลนักศึกษา">
          <InfoRow label="ชื่อ-สกุล" value={`${p.namePrefix}${p.fullName}`} />
          <InfoRow label="รหัสนักศึกษา" value={p.studentId} />
          <InfoRow label="เพศ" value={p.gender} />
          <InfoRow label="โทรศัพท์" value={p.phone} />
          <InfoRow label="อีเมล" value={p.email} />
          <InfoRow label="ศาสนา" value={p.religion} />
          <InfoRow label="ความพิการ" value={p.disability} />
        </SectionCard>
        <SectionCard icon={Home} title="ที่พักอาศัย">
          <InfoRow label="หอพัก" value={p.dormitory} />
        </SectionCard>
        <SectionCard icon={BookOpen} title="ข้อมูลพื้นฐาน">
          <InfoRow label="สถาบันที่จบก่อนเข้าศึกษา" value={p.previousInstitution} />
          <InfoRow label="ปีที่จบการศึกษา" value={p.graduationYear} />
          <InfoRow label="จำนวนพี่น้อง" value={`${p.siblings} คน`} />
        </SectionCard>
      </TabsContent>

      <TabsContent value="family" className="space-y-4">
        <SectionCard icon={Heart} title="ข้อมูลบิดา">
          <InfoRow label="ชื่อ" value={p.fatherName} />
          <InfoRow label="อาชีพ" value={p.fatherOccupation} />
          <InfoRow label="โทรศัพท์" value={p.fatherPhone} />
        </SectionCard>
        <SectionCard icon={Heart} title="ข้อมูลมารดา">
          <InfoRow label="ชื่อ" value={p.motherName} />
          <InfoRow label="อาชีพ" value={p.motherOccupation} />
          <InfoRow label="โทรศัพท์" value={p.motherPhone} />
        </SectionCard>
        <SectionCard icon={MapPin} title="ข้อมูลผู้ปกครอง">
          <InfoRow label="รายได้" value={p.guardianIncome} />
          <InfoRow label="ที่อยู่" value={p.guardianAddress} />
          <InfoRow label="สถานภาพสมรส" value={p.parentMaritalStatus} />
        </SectionCard>
      </TabsContent>

      <TabsContent value="academic" className="space-y-4">
        <SectionCard icon={GraduationCap} title="ข้อมูลการศึกษา">
          <InfoRow label="คณะ" value={p.faculty} />
          <InfoRow label="ภาควิชา" value={p.department} />
          <InfoRow label="ชั้นปี" value={`ปี ${p.yearLevel}`} />
          <InfoRow label="วิทยาเขต" value={p.campus} />
          <InfoRow label="ระดับการศึกษา" value={p.educationLevel} />
          <InfoRow label="อาจารย์ที่ปรึกษา" value={p.advisor} />
          <InfoRow label="GPA" value={p.gpa} />
          <InfoRow label="สถานะลงทะเบียน" value={p.registrationStatus} />
          <InfoRow label="หน่วยกิตปัจจุบัน" value={`${p.currentCredits} หน่วยกิต`} />
          <InfoRow label="สถานะทางการศึกษา" value={p.academicStatus} />
        </SectionCard>
        <SectionCard icon={Building2} title="ทุนการศึกษาและ กยศ.">
          <InfoRow label="ทุนการศึกษา" value={p.scholarship} />
          <InfoRow label="กยศ." value={p.studentLoan} />
        </SectionCard>
        <SectionCard icon={Shield} title="ประวัติวินัยและกิจกรรม">
          <InfoRow label="ประวัติทางวินัย" value={p.disciplinaryRecord} />
          <InfoRow label="ข้อมูลนักกิจกรรม" value={p.activityInfo} />
        </SectionCard>
      </TabsContent>

      <TabsContent value="health" className="space-y-4">
        <SectionCard icon={Activity} title="ผลประเมิน DASS-21">
          {p.dassScores ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-xs text-muted-foreground">ซึมเศร้า</p>
                  <p className="font-heading text-xl font-bold">{p.dassScores.depression}</p>
                </div>
                <SeverityBadge level={getDepressionSeverity(p.dassScores.depression).level} size="sm" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-xs text-muted-foreground">วิตกกังวล</p>
                  <p className="font-heading text-xl font-bold">{p.dassScores.anxiety}</p>
                </div>
                <SeverityBadge level={getAnxietySeverity(p.dassScores.anxiety).level} size="sm" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-xs text-muted-foreground">ความเครียด</p>
                  <p className="font-heading text-xl font-bold">{p.dassScores.stress}</p>
                </div>
                <SeverityBadge level={getStressSeverity(p.dassScores.stress).level} size="sm" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">ยังไม่มีผลประเมิน</p>
          )}
        </SectionCard>
        <SectionCard icon={ClipboardList} title="สภาพปัญหาและอื่นๆ">
          <InfoRow label="สภาพปัญหา" value={p.currentIssues} />
          <InfoRow label="หมายเหตุเพิ่มเติม" value={p.additionalNotes || "ไม่มี"} />
        </SectionCard>
      </TabsContent>

      <TabsContent value="history">
        <SectionCard icon={FileText} title="ประวัติการเข้ารับบริการ">
          {p.serviceHistory.length > 0 ? (
            <div className="space-y-3 mt-2">
              {p.serviceHistory.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-secondary/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">ครั้งที่ {h.sessionNumber} — {h.date}</span>
                    <Badge variant="outline" className="text-xs rounded-full">
                      {h.status === "completed" ? "เสร็จสิ้น" : h.status === "follow-up" ? "ติดตาม" : "ส่งต่อ"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">ผู้ให้คำปรึกษา: {h.psychologistName}</p>
                  <p className="text-sm text-foreground">{h.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">ไม่มีประวัติการเข้ารับบริการ</p>
          )}
        </SectionCard>
      </TabsContent>
    </Tabs>
  );
}
