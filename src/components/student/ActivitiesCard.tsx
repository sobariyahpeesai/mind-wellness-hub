import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: number;
  title: string;
  date: string;
  location: string;
}

interface ActivitiesCardProps {
  activities: Activity[];
}

export default function ActivitiesCard({ activities }: ActivitiesCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-lg">🎯 กิจกรรมแนะนำ</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary" onClick={() => navigate("/student/activities")}>
          ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer bg-card"
              onClick={() => navigate(`/student/activities/${act.id}`)}
            >
              <h4 className="font-heading text-sm font-semibold text-foreground mb-3">{act.title}</h4>
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {act.date}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {act.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
