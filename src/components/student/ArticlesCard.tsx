import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Article {
  id: number;
  title: string;
  category: string;
}

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
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.category}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
