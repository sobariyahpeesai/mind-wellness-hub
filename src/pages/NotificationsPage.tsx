import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell, CalendarDays, ClipboardList, Megaphone, Settings, CheckCheck,
  Circle,
} from "lucide-react";
import {
  studentNotifications,
  psychologistNotifications,
  type Notification,
} from "@/lib/mock-notification-data";
import { useSearchParams } from "react-router-dom";

const typeIcon: Record<Notification["type"], React.ReactNode> = {
  appointment: <CalendarDays className="w-4 h-4" />,
  assessment: <ClipboardList className="w-4 h-4" />,
  activity: <Megaphone className="w-4 h-4" />,
  system: <Settings className="w-4 h-4" />,
  counseling: <ClipboardList className="w-4 h-4" />,
};

const typeLabel: Record<Notification["type"], string> = {
  appointment: "นัดหมาย",
  assessment: "แบบประเมิน",
  activity: "กิจกรรม",
  system: "ระบบ",
  counseling: "การให้คำปรึกษา",
};

const typeBg: Record<Notification["type"], string> = {
  appointment: "bg-primary/10 text-primary",
  assessment: "bg-severity-moderate/20 text-severity-moderate",
  activity: "bg-severity-mild/20 text-severity-mild",
  system: "bg-muted text-muted-foreground",
  counseling: "bg-primary/10 text-primary",
};

interface Props {
  role: "student" | "psychologist";
}

export default function NotificationsPage({ role }: Props) {
  const isStudent = role === "student";
  const initialData = isStudent ? studentNotifications : psychologistNotifications;
  const [notifications, setNotifications] = useState<Notification[]>(initialData);
  const [filter, setFilter] = useState<Notification["type"] | "all">("all");

  const filtered =
    filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  const filters: { key: Notification["type"] | "all"; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "appointment", label: "นัดหมาย" },
    { key: "assessment", label: "แบบประเมิน" },
    { key: "activity", label: "กิจกรรม" },
    ...(isStudent ? [] : [{ key: "counseling" as const, label: "การให้คำปรึกษา" }]),
    { key: "system", label: "ระบบ" },
  ];

  return (
    <AppLayout
      userName={isStudent ? "ซอบารียะฮ์ ปีไสย" : "สุภาพร จิตดี"}
      userRole={role}
      studentId={isStudent ? "6310210100" : undefined}
      notificationCount={unreadCount}
    >
      <div className="container py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">การแจ้งเตือน</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} รายการที่ยังไม่ได้อ่าน` : "ไม่มีรายการใหม่"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4" />
              อ่านทั้งหมด
            </Button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <Card className="rounded-2xl border-border/60">
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                ไม่มีการแจ้งเตือนในหมวดนี้
              </CardContent>
            </Card>
          )}
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`rounded-2xl border-border/60 transition-all cursor-pointer hover:shadow-sm ${
                !n.read ? "border-l-4 border-l-primary bg-primary/[0.02]" : ""
              }`}
              onClick={() => toggleRead(n.id)}
            >
              <CardContent className="py-4 flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeBg[n.type]}`}>
                  {typeIcon[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`text-sm font-heading ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                      {n.title}
                    </h3>
                    {!n.read && <Circle className="w-2 h-2 fill-primary text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full">
                      {typeLabel[n.type]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
