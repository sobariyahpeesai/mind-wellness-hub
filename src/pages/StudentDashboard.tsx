import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SeverityBadge from "@/components/student/SeverityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  ExternalLink,
  Facebook,
  Globe,
  MessageCircle,
  Phone,
  Bell,
} from "lucide-react";
import {
  getDepressionSeverity,
  getAnxietySeverity,
  getStressSeverity,
  getOverallSeverity,
  type DASS21Scores,
  type SeverityLevel,
} from "@/lib/dass21";

// Mock data — will be replaced by API
const mockScores: DASS21Scores | null = {
  depression: 12,
  anxiety: 8,
  stress: 15,
};

const mockActivities = [
  { id: 1, title: "กิจกรรม Mindfulness Workshop", date: "25 มี.ค. 2569", location: "ศูนย์กีฬา" },
  { id: 2, title: "กลุ่มสนทนาจิตวิทยา", date: "28 มี.ค. 2569", location: "ห้องประชุม LRC" },
  { id: 3, title: "โยคะเพื่อสุขภาพจิต", date: "1 เม.ย. 2569", location: "สนามหญ้าหน้าตึก" },
];

const mockArticles = [
  { id: 1, title: "5 วิธีจัดการความเครียดด้วยตัวเอง", category: "Self Care" },
  { id: 2, title: "เทคนิคการหายใจเพื่อลดความวิตกกังวล", category: "วิตกกังวล" },
];

function ScoreCard({ label, score, severity }: { label: string; score: number; severity: ReturnType<typeof getDepressionSeverity> }) {
  return (
    <div className={`rounded-xl p-4 border-2 ${
      severity.level === "normal" ? "border-border bg-card" :
      severity.level === "mild" ? "border-severity-mild bg-severity-mild/10" :
      severity.level === "moderate" ? "border-severity-moderate bg-severity-moderate/10" :
      severity.level === "severe" ? "border-severity-severe bg-severity-severe/10" :
      "border-severity-very-severe bg-severity-very-severe/10"
    }`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <span className="font-heading text-2xl font-bold text-foreground">{score}</span>
        <SeverityBadge level={severity.level} />
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [notifyConsent, setNotifyConsent] = useState(false);
  const hasScores = mockScores !== null;
  const scores = mockScores;

  const overallLevel: SeverityLevel = scores ? getOverallSeverity(scores) : "normal";

  return (
    <AppLayout
      userName="ซอบารียะฮ์ ปีไสย"
      userRole="student"
      studentId="6310210100"
      notificationCount={2}
    >
      <div className="container py-6 space-y-6">
        {/* Emergency Banner */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              หากคุณต้องการความช่วยเหลือเร่งด่วน กรุณาติดต่อสายด่วนสุขภาพจิต{" "}
              <strong>1323</strong> ตลอด 24 ชั่วโมง
            </p>
          </div>
          <Button size="sm" variant="destructive" className="shrink-0">
            <Phone className="w-4 h-4 mr-1" /> โทรเลย
          </Button>
        </div>

        {/* Notification Bell */}
        <Card className="border-primary/20">
          <CardContent className="flex items-center gap-3 py-4">
            <Bell className="w-5 h-5 text-primary" />
            <p className="text-sm text-foreground flex-1">
              คุณมี <strong>2 แจ้งเตือน</strong> ใหม่ — ตรวจสอบนัดหมายและผลประเมิน
            </p>
            <Button size="sm" variant="outline" className="text-primary border-primary">
              ดูแจ้งเตือน
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* DASS-21 Score Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  ผลประเมิน DASS-21
                </CardTitle>
                {hasScores && <SeverityBadge level={overallLevel} size="lg" />}
              </CardHeader>
              <CardContent>
                {hasScores && scores ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <ScoreCard
                        label="ด้านภาวะซึมเศร้า"
                        score={scores.depression}
                        severity={getDepressionSeverity(scores.depression)}
                      />
                      <ScoreCard
                        label="ด้านวิตกกังวล"
                        score={scores.anxiety}
                        severity={getAnxietySeverity(scores.anxiety)}
                      />
                      <ScoreCard
                        label="ด้านความเครียด"
                        score={scores.stress}
                        severity={getStressSeverity(scores.stress)}
                      />
                    </div>
                    <Button variant="outline" className="w-full border-primary text-primary" asChild>
                      <a href="https://dass21.psu.ac.th" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        ทำแบบประเมินใหม่
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-heading text-lg font-semibold text-foreground mb-2">
                      คุณยังไม่ได้ทำแบบประเมิน
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      กรุณาทำแบบประเมิน DASS-21 เพื่อดูผลคะแนนและรับคำแนะนำ
                    </p>
                    <Button className="bg-primary hover:bg-primary-hover text-primary-foreground" asChild>
                      <a href="https://dass21.psu.ac.th" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        ไปทำแบบประเมิน DASS-21
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Consent */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notify"
                    checked={notifyConsent}
                    onCheckedChange={(c) => setNotifyConsent(c === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="notify" className="text-sm text-foreground cursor-pointer">
                    อนุญาตให้ระบบส่งแจ้งเตือนทำแบบประเมินใหม่ทุก 3 เดือน
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  นัดหมายขอเข้ารับคำปรึกษา
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasScores ? (
                  <div className="bg-severity-moderate/10 border border-severity-moderate/30 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-foreground">
                      กรุณาทำแบบประเมิน DASS-21 ก่อนทำการนัดหมาย
                    </p>
                    <Button className="mt-3 bg-primary hover:bg-primary-hover text-primary-foreground" asChild>
                      <a href="https://dass21.psu.ac.th" target="_blank">
                        ทำแบบประเมินก่อน
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      เลือกวันเวลาที่ต้องการเข้ารับคำปรึกษาจากนักจิตวิทยา
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      จองนัดหมาย
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Self-care Articles */}
            {hasScores && overallLevel !== "severe" && overallLevel !== "very-severe" && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    📖 บทความแนะนำ Self Care
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockArticles.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ClipboardList className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.category}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">🎯 กิจกรรมแนะนำ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {mockActivities.map((act) => (
                    <div key={act.id} className="rounded-xl border border-border p-4 hover:border-primary/30 transition-colors cursor-pointer">
                      <h4 className="font-heading text-sm font-semibold text-foreground mb-2">{act.title}</h4>
                      <p className="text-xs text-muted-foreground">{act.date}</p>
                      <p className="text-xs text-muted-foreground">{act.location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">ช่องทางการติดต่อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
                  <Facebook className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">เพจ Facebook</p>
                    <p className="text-xs text-muted-foreground">PSU Mental Health</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
                  <MessageCircle className="w-5 h-5 text-severity-mild" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Line Official</p>
                    <p className="text-xs text-muted-foreground">@psubuddy</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">โทรศัพท์</p>
                    <p className="text-xs text-muted-foreground">0-7428-2203</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">เว็บไซต์</p>
                    <p className="text-xs text-muted-foreground">student.psu.ac.th</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Auto Emergency Button */}
            <Button variant="destructive" className="w-full h-12 font-heading font-semibold">
              <Phone className="w-4 h-4 mr-2" />
              ขอความช่วยเหลือเร่งด่วน
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
