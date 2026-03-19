import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencyBanner() {
  return (
    <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          หากคุณต้องการความช่วยเหลือเร่งด่วน กรุณาติดต่อสายด่วนสุขภาพจิต{" "}
          <strong className="text-destructive">1323</strong> ตลอด 24 ชั่วโมง
        </p>
      </div>
      <Button size="sm" variant="destructive" className="shrink-0 rounded-full shadow-sm">
        <Phone className="w-4 h-4 mr-1" /> โทรเลย
      </Button>
    </div>
  );
}
