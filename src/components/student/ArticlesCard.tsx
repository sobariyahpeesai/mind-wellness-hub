import { BookOpen, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/mock-article-data";

interface ArticlesCardProps {
  articles: Article[];
}

export default function ArticlesCard({ articles }: ArticlesCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg">📖 บทความแนะนำ Self Care</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {articles.map((a) => (
          <div
            key={a.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{a.title}</p>
              <div className="flex flex-wrap gap-1">
                {a.categories.map((c) => (
                  <Badge key={c} variant="outline" className="text-[10px] px-1.5 py-0">{c}</Badge>
                ))}
              </div>
              {a.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {a.hashtags.map((h) => (
                    <span key={h} className="text-[10px] text-primary font-medium">#{h}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีบทความแนะนำสำหรับคุณ</p>
        )}
      </CardContent>
    </Card>
  );
}
