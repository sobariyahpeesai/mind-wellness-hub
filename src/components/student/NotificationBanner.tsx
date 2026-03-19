import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationBannerProps {
  count: number;
}

export default function NotificationBanner({ count }: NotificationBannerProps) {
  if (count <= 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Bell className="w-5 h-5 text-primary" />
      </div>
      <p className="text-sm text-foreground flex-1">
        คุณมี <strong className="text-primary">{count} แจ้งเตือน</strong> ใหม่ — ตรวจสอบนัดหมายและผลประเมิน
      </p>
      <Button size="sm" variant="outline" className="rounded-full text-primary border-primary/30 hover:bg-primary/5">
        ดูแจ้งเตือน
      </Button>
    </div>
  );
}
