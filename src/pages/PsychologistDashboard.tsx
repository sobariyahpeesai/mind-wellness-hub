import AppLayout from "@/components/layout/AppLayout";
import SeverityBadge from "@/components/student/SeverityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  Search,
  TrendingUp,
  Users,
  FileText,
  Bell,
} from "lucide-react";
import {
  getDepressionSeverity,
  getAnxietySeverity,
  getStressSeverity,
  getOverallSeverity,
  calculateUrgencyScore,
  type DASS21Scores,
} from "@/lib/dass21";

// Mock urgent cases
const mockUrgentCases = [
  { id: 1, name: "สมชาย ใจดี", studentId: "6510210001", faculty: "วิศวกรรมศาสตร์", scores: { depression: 15, anxiety: 12, stress: 18 } as DASS21Scores, status: "pending" },
  { id: 2, name: "สมหญิง รักเรียน", studentId: "6510210045", faculty: "วิทยาศาสตร์", scores: { depression: 14, anxiety: 10, stress: 14 } as DASS21Scores, status: "pending" },
  { id: 3, name: "นายกล้า สู้ชีวิต", studentId: "6510210102", faculty: "แพทยศาสตร์", scores: { depression: 11, anxiety: 9, stress: 17 } as DASS21Scores, status: "contacted" },
  { id: 4, name: "นางสาวใจ สว่าง", studentId: "6510210203", faculty: "พยาบาลศาสตร์", scores: { depression: 13, anxiety: 11, stress: 13 } as DASS21Scores, status: "pending" },
].sort((a, b) => calculateUrgencyScore(b.scores) - calculateUrgencyScore(a.scores));

const mockStats = {
  totalStudents: 2450,
  assessed: 1890,
  urgentCases: 24,
  appointmentsToday: 6,
};

export default function PsychologistDashboard() {
  return (
    <AppLayout
      userName="ดร.สมใจ นักจิต"
      userRole="psychologist"
      notificationCount={5}
    >
      <div className="container py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{mockStats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">นักศึกษาทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-severity-mild/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-severity-mild" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{mockStats.assessed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">ทำแบบประเมินแล้ว</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-severity-very-severe/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-severity-very-severe/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-severity-very-severe" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-severity-very-severe">{mockStats.urgentCases}</p>
                  <p className="text-xs text-muted-foreground">เคสเร่งด่วน</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{mockStats.appointmentsToday}</p>
                  <p className="text-xs text-muted-foreground">นัดหมายวันนี้</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Cases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-severity-very-severe" />
                  เคสเร่งด่วน
                </CardTitle>
                <Button size="sm" variant="outline" className="text-primary border-primary">
                  ดูทั้งหมด
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockUrgentCases.map((c) => {
                  const overall = getOverallSeverity(c.scores);
                  const isVerySevere = overall === "very-severe";
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-secondary cursor-pointer ${
                        isVerySevere ? "border-severity-very-severe/50 pulse-urgent" : "border-border"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-heading font-semibold text-foreground truncate">{c.name}</p>
                          <span className="text-xs text-muted-foreground">[{c.studentId}]</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{c.faculty}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs">
                            ซึมเศร้า: <SeverityBadge level={getDepressionSeverity(c.scores.depression).level} size="sm" />
                          </span>
                          <span className="text-xs">
                            วิตกกังวล: <SeverityBadge level={getAnxietySeverity(c.scores.anxiety).level} size="sm" />
                          </span>
                          <span className="text-xs">
                            เครียด: <SeverityBadge level={getStressSeverity(c.scores.stress).level} size="sm" />
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <SeverityBadge level={overall} />
                        {c.status === "pending" ? (
                          <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs">
                            <Calendar className="w-3 h-3 mr-1" /> นัดหมาย
                          </Button>
                        ) : (
                          <span className="text-xs text-severity-mild font-medium">ติดต่อแล้ว</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Student Search */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  ค้นหานักศึกษา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ชื่อ หรือ รหัสนักศึกษา..."
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ค้นหาจะแสดงผลเป็น [รหัส] ชื่อนักศึกษา
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">เมนูด่วน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-foreground">
                  <FileText className="w-4 h-4 mr-2 text-primary" />
                  บันทึกการให้คำปรึกษา
                </Button>
                <Button variant="outline" className="w-full justify-start text-foreground">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  ดูรายงานภาพรวม
                </Button>
                <Button variant="outline" className="w-full justify-start text-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  จัดการตารางเวลา
                </Button>
                <Button variant="outline" className="w-full justify-start text-foreground">
                  <Bell className="w-4 h-4 mr-2 text-primary" />
                  จัดการบทความ Self Care
                </Button>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">📅 นัดหมายวันนี้</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: "09:00", name: "สมชาย ใจดี", type: "ครั้งที่ 1" },
                  { time: "10:30", name: "สมหญิง รักเรียน", type: "ติดตามผล" },
                  { time: "13:00", name: "นายกล้า สู้ชีวิต", type: "ส่งต่อจิตแพทย์" },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                    <div className="w-14 text-center">
                      <p className="font-heading text-sm font-bold text-primary">{apt.time}</p>
                    </div>
                    <div className="border-l border-border pl-3">
                      <p className="text-sm font-medium text-foreground">{apt.name}</p>
                      <p className="text-xs text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
