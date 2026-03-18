import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit3,
  X,
  AlertTriangle,
  CheckCircle2,
  History,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  mockStudentAppointments,
  generateAvailableSlots,
  problemCategories,
  statusLabels,
  statusColors,
  type Appointment,
  type TimeSlot,
} from "@/lib/mock-appointment-data";

// Mock: student has completed DASS-21
const hasCompletedDASS21 = true;

const availableSlots = generateAvailableSlots();

function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export default function StudentAppointments() {
  const [appointments, setAppointments] = useState(mockStudentAppointments);
  const [showBooking, setShowBooking] = useState(false);
  const [showCancel, setShowCancel] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showNoDass, setShowNoDass] = useState(false);

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [problemCategory, setProblemCategory] = useState("");
  const [problemDetail, setProblemDetail] = useState("");

  const filteredSlots = selectedDate
    ? availableSlots.filter(
        (s) => s.date === format(selectedDate, "yyyy-MM-dd") && s.available
      )
    : [];

  const handleBookClick = () => {
    if (!hasCompletedDASS21) {
      setShowNoDass(true);
      return;
    }
    setShowBooking(true);
  };

  const handleSubmitBooking = () => {
    if (!selectedDate || !selectedSlot || !problemCategory) return;
    const newApt: Appointment = {
      id: `apt-new-${Date.now()}`,
      studentId: "6310210100",
      studentName: "ซอบารียะฮ์ ปีไสย",
      faculty: "วิศวกรรมศาสตร์",
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      problemCategory,
      problemDetail: problemDetail || undefined,
      status: "pending",
      sessionNumber: appointments.length + 1,
      caseStatus: "open",
      createdAt: new Date().toISOString(),
      auditLog: [
        {
          id: `log-${Date.now()}`,
          action: "สร้างนัดหมาย",
          performedBy: "ซอบารียะฮ์ ปีไสย",
          performedByRole: "นักศึกษา",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setAppointments([newApt, ...appointments]);
    setShowBooking(false);
    resetForm();
  };

  const handleCancel = (id: string) => {
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
                  performedBy: "ซอบารียะฮ์ ปีไสย",
                  performedByRole: "นักศึกษา",
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : a
      )
    );
    setShowCancel(null);
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setProblemCategory("");
    setProblemDetail("");
  };

  const activeAppointments = appointments.filter((a) => a.status !== "completed" && a.status !== "cancelled");
  const pastAppointments = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <AppLayout userName="ซอบารียะฮ์ ปีไสย" userRole="student" studentId="6310210100" notificationCount={2}>
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">การนัดหมาย</h1>
            <p className="text-sm text-muted-foreground">จัดการการนัดหมายเข้ารับคำปรึกษา</p>
          </div>
          <Button onClick={handleBookClick} className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            จองนัดหมายใหม่
          </Button>
        </div>

        {/* Active Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              นัดหมายที่กำลังดำเนินการ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">ไม่มีนัดหมายที่กำลังดำเนินการ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="w-16 text-center shrink-0">
                      <p className="font-heading text-sm font-bold text-primary">{apt.startTime}</p>
                      <p className="text-xs text-muted-foreground">{apt.endTime}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-heading font-semibold text-foreground">{apt.date}</p>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">ปัญหา: {apt.problemCategory}</p>
                      {apt.problemDetail && (
                        <p className="text-xs text-muted-foreground mt-1">รายละเอียด: {apt.problemDetail}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">ครั้งที่ {apt.sessionNumber}</p>
                    </div>
                    <div className="shrink-0 flex flex-col gap-2">
                      {(apt.status === "pending" || apt.status === "confirmed") && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setShowEdit(apt.id)} className="text-primary border-primary">
                            <Edit3 className="w-3 h-3 mr-1" /> แก้ไข
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowCancel(apt.id)} className="text-destructive border-destructive">
                            <X className="w-3 h-3 mr-1" /> ยกเลิก
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setShowHistory(apt.id)}>
                        <History className="w-3 h-3 mr-1" /> ประวัติ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                ประวัตินัดหมาย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                    <div className="w-16 text-center shrink-0">
                      <p className="text-sm font-medium text-muted-foreground">{apt.startTime}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{apt.date}</p>
                      <p className="text-xs text-muted-foreground">{apt.problemCategory}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                    <Button size="sm" variant="ghost" onClick={() => setShowHistory(apt.id)}>
                      <History className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Dialog */}
        <Dialog open={showBooking} onOpenChange={setShowBooking}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">จองนัดหมายใหม่</DialogTitle>
              <DialogDescription>เลือกวันเวลาและระบุปัญหาที่ต้องการปรึกษา</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label>เลือกวันที่</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: th }) : "เลือกวันที่"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
                      disabled={(date) => {
                        const day = date.getDay();
                        return day === 0 || day === 6 || date < new Date();
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="space-y-2">
                  <Label>เลือกช่วงเวลา</Label>
                  {filteredSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-lg">ไม่มีช่วงเวลาว่างในวันนี้</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {filteredSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSlot(slot)}
                          className={selectedSlot?.id === slot.id ? "bg-primary text-primary-foreground" : ""}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {slot.startTime}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Problem Category */}
              <div className="space-y-2">
                <Label>ปัญหาที่ต้องการปรึกษา</Label>
                <Select value={problemCategory} onValueChange={setProblemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่ปัญหา" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Problem Detail (for "อื่นๆ" or additional info) */}
              {(problemCategory === "อื่นๆ" || problemCategory) && (
                <div className="space-y-2">
                  <Label>{problemCategory === "อื่นๆ" ? "กรุณาระบุปัญหา" : "รายละเอียดเพิ่มเติม (ถ้ามี)"}</Label>
                  <Textarea
                    value={problemDetail}
                    onChange={(e) => setProblemDetail(e.target.value)}
                    placeholder="อธิบายปัญหาของคุณ..."
                    rows={3}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowBooking(false); resetForm(); }}>ยกเลิก</Button>
              <Button
                onClick={handleSubmitBooking}
                disabled={!selectedDate || !selectedSlot || !problemCategory || (problemCategory === "อื่นๆ" && !problemDetail)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                ยืนยันจองนัดหมาย
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* No DASS-21 Dialog */}
        <Dialog open={showNoDass} onOpenChange={setShowNoDass}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-severity-moderate" />
                กรุณาทำแบบประเมินก่อน
              </DialogTitle>
              <DialogDescription>คุณต้องทำแบบประเมิน DASS-21 ก่อนจึงจะสามารถนัดหมายได้</DialogDescription>
            </DialogHeader>
            <div className="bg-severity-moderate/10 border border-severity-moderate/30 rounded-lg p-4">
              <p className="text-sm text-foreground">ระบบกำหนดให้นักศึกษาต้องทำแบบประเมิน DASS-21 ก่อนเข้ารับคำปรึกษา เพื่อให้นักจิตวิทยาสามารถเตรียมการดูแลได้อย่างเหมาะสม</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNoDass(false)}>ปิด</Button>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground" asChild>
                <a href="https://dass21.psu.ac.th" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ไปทำแบบประเมิน
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation */}
        <Dialog open={!!showCancel} onOpenChange={() => setShowCancel(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading text-destructive">ยืนยันการยกเลิกนัดหมาย</DialogTitle>
              <DialogDescription>คุณต้องการยกเลิกนัดหมายนี้หรือไม่? การดำเนินการจะถูกบันทึกในระบบ</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancel(null)}>ไม่ยกเลิก</Button>
              <Button variant="destructive" onClick={() => showCancel && handleCancel(showCancel)}>
                ยืนยันยกเลิก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog (simplified) */}
        <Dialog open={!!showEdit} onOpenChange={() => setShowEdit(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">แก้ไขนัดหมาย</DialogTitle>
              <DialogDescription>แก้ไขข้อมูลการนัดหมาย — การเปลี่ยนแปลงจะถูกบันทึกและแจ้งเตือนนักจิตวิทยา</DialogDescription>
            </DialogHeader>
            {showEdit && (() => {
              const apt = appointments.find((a) => a.id === showEdit);
              if (!apt) return null;
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">วันที่ปัจจุบัน</Label>
                      <p className="text-sm font-medium text-foreground">{apt.date}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">เวลาปัจจุบัน</Label>
                      <p className="text-sm font-medium text-foreground">{apt.startTime} - {apt.endTime}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">ปัญหาที่ปรึกษา</Label>
                    <p className="text-sm font-medium text-foreground">{apt.problemCategory}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      💡 หากต้องการเปลี่ยนวันเวลา ให้ยกเลิกนัดหมายนี้แล้วจองใหม่ หรือติดต่อนักจิตวิทยาผ่านช่องทางการติดต่อ
                    </p>
                  </div>
                </div>
              );
            })()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEdit(null)}>ปิด</Button>
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
              <DialogDescription>รายละเอียดทุกการเปลี่ยนแปลงของนัดหมายนี้</DialogDescription>
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
                        <p className="text-xs text-muted-foreground">
                          โดย: {log.performedBy} ({log.performedByRole})
                        </p>
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
