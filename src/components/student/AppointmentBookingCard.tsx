import { Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AppointmentBookingCardProps {
  hasScores: boolean;
}

export default function AppointmentBookingCard({ hasScores }: AppointmentBookingCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          นัดหมายขอเข้ารับคำปรึกษา
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasScores ? (
          <div className="bg-severity-moderate/5 border border-severity-moderate/20 rounded-2xl p-5 text-center">
            <p className="text-sm font-medium text-foreground mb-3">
              กรุณาทำแบบประเมิน DASS-21 ก่อนทำการนัดหมาย
            </p>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl" asChild>
              <a href="https://dass21.psu.ac.th" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                ทำแบบประเมินก่อน
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              เลือกวันเวลาที่ต้องการเข้ารับคำปรึกษาจากนักจิตวิทยา
            </p>
            <Button
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl h-11"
              onClick={() => navigate("/student/appointments")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              จองนัดหมาย
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
