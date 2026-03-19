import { MapPin, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg">🎯 กิจกรรมแนะนำ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer bg-card"
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
