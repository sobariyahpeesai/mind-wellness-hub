import { ClipboardList, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SeverityBadge from "./SeverityBadge";
import {
  getDepressionSeverity,
  getAnxietySeverity,
  getStressSeverity,
  getOverallSeverity,
  type DASS21Scores,
  type SeverityLevel,
} from "@/lib/dass21";

function ScoreItem({ label, score, severity }: { label: string; score: number; severity: ReturnType<typeof getDepressionSeverity> }) {
  return (
    <div className={`rounded-2xl p-5 border-2 transition-shadow hover:shadow-md ${
      severity.level === "normal" ? "border-border bg-card" :
      severity.level === "mild" ? "border-severity-mild/40 bg-severity-mild/5" :
      severity.level === "moderate" ? "border-severity-moderate/40 bg-severity-moderate/5" :
      severity.level === "severe" ? "border-severity-severe/40 bg-severity-severe/5" :
      "border-severity-very-severe/40 bg-severity-very-severe/5"
    }`}>
      <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-center justify-between">
        <span className="font-heading text-3xl font-bold text-foreground">{score}</span>
        <SeverityBadge level={severity.level} />
      </div>
    </div>
  );
}

interface DassScoreCardProps {
  scores: DASS21Scores | null;
}

export default function DassScoreCard({ scores }: DassScoreCardProps) {
  const hasScores = scores !== null;
  const overallLevel: SeverityLevel = scores ? getOverallSeverity(scores) : "normal";

  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-primary" />
          </div>
          ผลประเมิน DASS-21
        </CardTitle>
        {hasScores && <SeverityBadge level={overallLevel} size="lg" />}
      </CardHeader>
      <CardContent>
        {hasScores && scores ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ScoreItem label="ด้านภาวะซึมเศร้า" score={scores.depression} severity={getDepressionSeverity(scores.depression)} />
              <ScoreItem label="ด้านวิตกกังวล" score={scores.anxiety} severity={getAnxietySeverity(scores.anxiety)} />
              <ScoreItem label="ด้านความเครียด" score={scores.stress} severity={getStressSeverity(scores.stress)} />
            </div>
            <Button variant="outline" className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/5" asChild>
              <a href="https://dass21.psu.ac.th" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                ทำแบบประเมินใหม่
              </a>
            </Button>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-heading text-lg font-semibold text-foreground mb-2">
              คุณยังไม่ได้ทำแบบประเมิน
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              กรุณาทำแบบประเมิน DASS-21 เพื่อดูผลคะแนนและรับคำแนะนำ
            </p>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-6" asChild>
              <a href="https://dass21.psu.ac.th" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                ไปทำแบบประเมิน DASS-21
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
