import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { mockActivitiesDetail } from "@/lib/mock-activity-data";

export default function ActivitiesListPage() {
  const navigate = useNavigate();

  return (
    <AppLayout userName="ซอบารียะฮ์ ปีไสย" userRole="student" studentId="6310210100" notificationCount={2}>
      <div className="container py-6 space-y-5">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">🎯 กิจกรรมทั้งหมด</h1>
          <p className="text-sm text-muted-foreground">กิจกรรมเสริมสร้างสุขภาพจิตที่เปิดรับสมัคร</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockActivitiesDetail.map((act) => {
            const spotsLeft = act.capacity - act.registered;
            return (
              <Card
                key={act.id}
                className="rounded-2xl border-border/60 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/student/activities/${act.id}`)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs rounded-full">
                      {act.category}
                    </Badge>
                    {spotsLeft <= 5 && spotsLeft > 0 && (
                      <Badge className="bg-severity-severe/10 text-severity-severe border-0 text-xs">
                        เหลือ {spotsLeft} ที่
                      </Badge>
                    )}
                    {spotsLeft <= 0 && (
                      <Badge className="bg-destructive/10 text-destructive border-0 text-xs">เต็ม</Badge>
                    )}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{act.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{act.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{act.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{act.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {act.registered}/{act.capacity} คน
                    </span>
                    <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      ดูรายละเอียด <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
