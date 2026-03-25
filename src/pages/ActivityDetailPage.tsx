import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, CalendarDays, Clock, MapPin, Users, ExternalLink, MessageCircle, Phone, Building,
} from "lucide-react";
import { getActivityById, mockActivitiesDetail } from "@/lib/mock-activity-data";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activity = getActivityById(Number(id));

  if (!activity) {
    return (
      <AppLayout userName="ซอบารียะฮ์ ปีไสย" userRole="student" studentId="6310210100">
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">ไม่พบกิจกรรมที่ต้องการ</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/student/activities")}>
            กลับหน้ากิจกรรม
          </Button>
        </div>
      </AppLayout>
    );
  }

  const spotsLeft = activity.capacity - activity.registered;
  const progressPct = (activity.registered / activity.capacity) * 100;

  return (
    <AppLayout userName="ซอบารียะฮ์ ปีไสย" userRole="student" studentId="6310210100" notificationCount={2}>
      <div className="container py-6 max-w-3xl space-y-5">
        {/* Back */}
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> กลับ
        </Button>

        {/* Hero */}
        <Card className="rounded-2xl border-border/60 overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-3">
              {activity.category}
            </Badge>
            <h1 className="font-heading text-2xl font-bold mb-2">{activity.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{activity.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{activity.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{activity.location}</span>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="font-heading text-base font-semibold mb-2">รายละเอียด</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
            </div>

            {/* Organizer */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40">
              <Building className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">จัดโดย</p>
                <p className="text-sm font-medium text-foreground">{activity.organizer}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4" /> ผู้สมัคร
                </span>
                <span className="font-medium text-foreground">
                  {activity.registered}/{activity.capacity} คน
                  {spotsLeft > 0 && (
                    <span className="text-xs text-muted-foreground ml-1">(เหลือ {spotsLeft} ที่)</span>
                  )}
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {/* Registration channels */}
            <div>
              <h2 className="font-heading text-base font-semibold mb-3">ช่องทางสมัคร</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activity.registrationUrl && (
                  <a
                    href={activity.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">สมัครออนไลน์</p>
                      <p className="text-xs text-muted-foreground">กรอกแบบฟอร์มลงทะเบียน</p>
                    </div>
                  </a>
                )}
                {activity.lineOA && (
                  <a
                    href={`https://line.me/R/ti/p/${activity.lineOA}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[hsl(142,71%,45%)]/10 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-[hsl(142,71%,45%)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Line OA</p>
                      <p className="text-xs text-muted-foreground">{activity.lineOA}</p>
                    </div>
                  </a>
                )}
                {activity.contactPhone && (
                  <a
                    href={`tel:${activity.contactPhone}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-severity-moderate/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-severity-moderate" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">โทรศัพท์</p>
                      <p className="text-xs text-muted-foreground">{activity.contactPhone}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* CTA */}
            {spotsLeft > 0 && activity.registrationUrl && (
              <Button
                className="w-full rounded-xl h-11"
                onClick={() => window.open(activity.registrationUrl, "_blank")}
              >
                สมัครเข้าร่วมกิจกรรม
              </Button>
            )}
            {spotsLeft <= 0 && (
              <Button className="w-full rounded-xl h-11" disabled>
                เต็มแล้ว
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
