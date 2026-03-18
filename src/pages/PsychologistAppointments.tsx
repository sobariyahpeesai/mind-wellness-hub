import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import SeverityBadge from "@/components/student/SeverityBadge";
import {
  mockAllAppointments,
  mockPsychologists,
  statusLabels,
  statusColors,
  caseStatusLabels,
  type Appointment,
  type AppointmentStatus,
  type CaseStatus,
  type PsychologistSchedule,
} from "@/lib/mock-appointment-data";
import {
  getDepressionSeverity,
  getAnxietySeverity,
  getStressSeverity,
} from "@/lib/dass21";

// Mock DASS scores for students in appointments
const studentScores: Record<string, { depression: number; anxiety: number; stress: number }> = {
  "6510210001": { depression: 15, anxiety: 12, stress: 18 },
  "6510210045": { depression: 14, anxiety: 10, stress: 14 },
  "6510210102": { depression: 11, anxiety: 9, stress: 17 },
  "6310210100": { depression: 12, anxiety: 8, stress: 15 },
};

const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

function StatusBadgeComp({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export default function PsychologistAppointments() {
  const [appointments, setAppointments] = useState(mockAllAppointments);
  const [schedule, setSchedule] = useState<PsychologistSchedule[]>(
    mockPsychologists[0].schedule
  );
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [showStatusChange, setShowStatusChange] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState("");
  const [newCaseStatus, setNewCaseStatus] = useState<CaseStatus>("open");

  // Referral state
  const [showReferral, setShowReferral] = useState<string | null>(null);
  const [referralDate, setReferralDate] = useState<Date>();
  const [referralPsychologist, setReferralPsychologist] = useState("");

  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed" || a.status === "follow-up");
  const completedAppointments = appointments.filter((a) => a.status === "completed" || a.status === "cancelled" || a.status === "referred");

  const handleConfirm = (id: string) => {
    if (!selectedPsychologist) return;
    const psy = mockPsychologists.find((p) => p.id === selectedPsychologist);
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "confirmed" as const,
              psychologistId: selectedPsychologist,
              psychologistName: psy?.name,
              auditLog: [
                ...a.auditLog,
                {
                  id: `log-${Date.now()}`,
                  action: "ยืนยันนัดหมาย",
                  performedBy: "ดร.สมใจ นักจิต",
                  performedByRole: "นักจิตวิทยา",
                  timestamp: new Date().toISOString(),
                  detail: `มอบหมายให้ ${psy?.name}`,
                },
              ],
            }
          : a
      )
    );
    setShowAssign(null);
    setSelectedPsychologist("");
  };

  const handleCancelByPsy = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "cancelled" as const,
              auditLog: [
                ...a.auditLog,
                {
                  id: `log-${Date.now()}`,
                  action: "ยกเลิกนัดหมาย",
                  performedBy: "ดร.สมใจ นักจิต",
                  performedByRole: "นักจิตวิทยา",
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : a
      )
    );
  };

  const handleChangeCaseStatus = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              caseStatus: newCaseStatus,
              status: newCaseStatus === "closed" ? ("completed" as const) : newCaseStatus === "referred" ? ("referred" as const) : a.status,
              auditLog: [
                ...a.auditLog,
                {
                  id: `log-${Date.now()}`,
                  action: `เปลี่ยนสถานะเคส: ${caseStatusLabels[newCaseStatus]}`,
                  performedBy: "ดร.สมใจ นักจิต",
                  performedByRole: "นักจิตวิทยา",
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : a
      )
    );
    setShowStatusChange(null);
    if (newCaseStatus === "referred") {
      setShowReferral(id);
    }
  };

  const handleReferral = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              auditLog: [
                ...a.auditLog,
                {
                  id: `log-${Date.now()}`,
                  action: `ส่งต่อจิตแพทย์ — นัดหมาย ${referralDate ? format(referralDate, "PPP", { locale: th }) : ""}`,
                  performedBy: "ดร.สมใจ นักจิต",
                  performedByRole: "นักจิตวิทยา",
                  timestamp: new Date().toISOString(),
                  detail: `นักจิตวิทยาผู้รับผิดชอบ: ${mockPsychologists.find((p) => p.id === referralPsychologist)?.name || "-"}`,
                },
              ],
            }
          : a
      )
    );
    setShowReferral(null);
    setReferralDate(undefined);
    setReferralPsychologist("");
  };

  const toggleScheduleDay = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const renderAppointmentCard = (apt: Appointment, showActions: boolean) => {
    const scores = studentScores[apt.studentId];
    return (
      <div key={apt.id} className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
        <div className="w-16 text-center shrink-0">
          <p className="font-heading text-sm font-bold text-primary">{apt.startTime}</p>
          <p className="text-xs text-muted-foreground">{apt.endTime}</p>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-heading font-semibold text-foreground">{apt.studentName}</p>
            <span className="text-xs text-muted-foreground">[{apt.studentId}]</span>
            <StatusBadgeComp status={apt.status} />
            <Badge variant="outline" className="text-xs">{caseStatusLabels[apt.caseStatus]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{apt.faculty} — {apt.date}</p>
          <p className="text-xs text-muted-foreground">ปัญหา: {apt.problemCategory} | ครั้งที่ {apt.sessionNumber}</p>
          {apt.psychologistName && (
            <p className="text-xs text-primary mt-1">ผู้รับผิดชอบ: {apt.psychologistName}</p>
          )}
          {scores && (
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs">ซึมเศร้า: <SeverityBadge level={getDepressionSeverity(scores.depression).level} size="sm" /></span>
              <span className="text-xs">วิตกกังวล: <SeverityBadge level={getAnxietySeverity(scores.anxiety).level} size="sm" /></span>
              <span className="text-xs">เครียด: <SeverityBadge level={getStressSeverity(scores.stress).level} size="sm" /></span>
            </div>
          )}
        </div>
        <div className="shrink-0 flex flex-col gap-2">
          {showActions && apt.status === "pending" && (
            <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground" onClick={() => setShowAssign(apt.id)}>
              <UserCheck className="w-3 h-3 mr-1" /> มอบหมาย
            </Button>
          )}
          {showActions && (apt.status === "confirmed" || apt.status === "follow-up") && (
            <>
              <Button size="sm" variant="outline" onClick={() => { setShowStatusChange(apt.id); setNewCaseStatus(apt.caseStatus); }} className="text-primary border-primary">
                <Settings className="w-3 h-3 mr-1" /> สถานะเคส
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCancelByPsy(apt.id)} className="text-destructive border-destructive">
                <XCircle className="w-3 h-3 mr-1" /> ยกเลิก
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={() => setShowHistory(apt.id)}>
            <History className="w-3 h-3 mr-1" /> ประวัติ
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AppLayout userName="ดร.สมใจ นักจิต" userRole="psychologist" notificationCount={5}>
      <div className="container py-6 space-y-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">จัดการนัดหมาย</h1>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="relative">
              รอดำเนินการ
              {pendingAppointments.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-severity-severe text-white text-[10px]">
                  {pendingAppointments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">ยืนยันแล้ว</TabsTrigger>
            <TabsTrigger value="completed">เสร็จสิ้น/ยกเลิก</TabsTrigger>
            <TabsTrigger value="schedule">ตารางเวลา</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingAppointments.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">ไม่มีนัดหมายรอดำเนินการ</CardContent></Card>
            ) : (
              pendingAppointments.map((a) => renderAppointmentCard(a, true))
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4 mt-4">
            {confirmedAppointments.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">ไม่มีนัดหมายที่ยืนยันแล้ว</CardContent></Card>
            ) : (
              confirmedAppointments.map((a) => renderAppointmentCard(a, true))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedAppointments.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">ไม่มีรายการ</CardContent></Card>
            ) : (
              completedAppointments.map((a) => renderAppointmentCard(a, false))
            )}
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  จัดการตารางเวลาทำงาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">เปิด-ปิดวันเวลาที่พร้อมให้บริการคำปรึกษา</p>
                <div className="space-y-3">
                  {schedule.map((s) => (
                    <div key={s.dayOfWeek} className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={s.enabled}
                          onCheckedChange={() => toggleScheduleDay(s.dayOfWeek)}
                        />
                        <div>
                          <p className={`font-heading font-semibold ${s.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                            วัน{dayNames[s.dayOfWeek]}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {s.startTime} - {s.endTime}
                          </p>
                        </div>
                      </div>
                      <Badge variant={s.enabled ? "default" : "secondary"} className={s.enabled ? "bg-severity-mild text-white" : ""}>
                        {s.enabled ? "เปิด" : "ปิด"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assign Psychologist Dialog */}
        <Dialog open={!!showAssign} onOpenChange={() => setShowAssign(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">มอบหมายนักจิตวิทยา</DialogTitle>
              <DialogDescription>เลือกนักจิตวิทยาที่จะรับผิดชอบเคสนี้ (เลือกได้เฉพาะที่เปิดให้บริการ)</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {mockPsychologists.map((psy) => {
                const apt = showAssign ? appointments.find((a) => a.id === showAssign) : null;
                const aptDay = apt ? new Date(apt.date).getDay() : -1;
                const daySchedule = psy.schedule.find((s) => s.dayOfWeek === aptDay);
                const isAvailable = daySchedule?.enabled ?? false;
                return (
                  <div
                    key={psy.id}
                    onClick={() => isAvailable && setSelectedPsychologist(psy.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedPsychologist === psy.id ? "border-primary bg-primary/5" : "border-border",
                      !isAvailable && "opacity-50 cursor-not-allowed bg-muted"
                    )}
                  >
                    <div>
                      <p className="font-medium text-foreground">{psy.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAvailable ? `${daySchedule?.startTime} - ${daySchedule?.endTime}` : "ไม่เปิดให้บริการในวันนี้"}
                      </p>
                    </div>
                    {isAvailable ? (
                      <CheckCircle2 className={`w-5 h-5 ${selectedPsychologist === psy.id ? "text-primary" : "text-muted-foreground/30"}`} />
                    ) : (
                      <XCircle className="w-5 h-5 text-muted-foreground/30" />
                    )}
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssign(null)}>ยกเลิก</Button>
              <Button
                onClick={() => showAssign && handleConfirm(showAssign)}
                disabled={!selectedPsychologist}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                ยืนยันมอบหมาย
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Case Status Change Dialog */}
        <Dialog open={!!showStatusChange} onOpenChange={() => setShowStatusChange(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">เปลี่ยนสถานะเคส</DialogTitle>
              <DialogDescription>เลือกสถานะใหม่สำหรับเคสนี้</DialogDescription>
            </DialogHeader>
            <Select value={newCaseStatus} onValueChange={(v) => setNewCaseStatus(v as CaseStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">เปิดเคส</SelectItem>
                <SelectItem value="follow-up">ติดตามต่อเนื่อง (นัดหมายครั้งถัดไป)</SelectItem>
                <SelectItem value="referred">ส่งต่อจิตแพทย์</SelectItem>
                <SelectItem value="closed">ปิดเคส</SelectItem>
              </SelectContent>
            </Select>
            {newCaseStatus === "referred" && (
              <div className="bg-severity-severe/10 border border-severity-severe/30 rounded-lg p-3">
                <p className="text-sm text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-severity-severe" />
                  ระบบจะนำไปสู่การจัดการนัดหมายส่งต่อจิตแพทย์
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusChange(null)}>ยกเลิก</Button>
              <Button onClick={() => showStatusChange && handleChangeCaseStatus(showStatusChange)} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Referral to Psychiatrist Dialog */}
        <Dialog open={!!showReferral} onOpenChange={() => setShowReferral(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-severity-severe" />
                จัดการส่งต่อจิตแพทย์
              </DialogTitle>
              <DialogDescription>เลือกวันเวลานัดหมายและนักจิตวิทยาผู้รับผิดชอบร่วม</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>เลือกวันนัดหมายจิตแพทย์</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !referralDate && "text-muted-foreground")}>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {referralDate ? format(referralDate, "PPP", { locale: th }) : "เลือกวันที่"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={referralDate}
                      onSelect={setReferralDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>นักจิตวิทยาผู้รับผิดชอบร่วม</Label>
                <Select value={referralPsychologist} onValueChange={setReferralPsychologist}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกนักจิตวิทยา" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPsychologists.map((psy) => (
                      <SelectItem key={psy.id} value={psy.id}>{psy.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReferral(null)}>ยกเลิก</Button>
              <Button
                onClick={() => showReferral && handleReferral(showReferral)}
                disabled={!referralDate || !referralPsychologist}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                ยืนยันส่งต่อ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Audit Log Dialog */}
        <Dialog open={!!showHistory} onOpenChange={() => setShowHistory(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                ประวัติการดำเนินการ
              </DialogTitle>
              <DialogDescription>บันทึกทุกการเปลี่ยนแปลงและผู้ดำเนินการ</DialogDescription>
            </DialogHeader>
            {showHistory && (() => {
              const apt = appointments.find((a) => a.id === showHistory);
              if (!apt) return null;
              return (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {apt.auditLog.map((log) => (
                    <div key={log.id} className="flex gap-3 p-3 rounded-lg bg-secondary">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">โดย: {log.performedBy} ({log.performedByRole})</p>
                        <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                        {log.detail && <p className="text-xs text-primary mt-1">{log.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
