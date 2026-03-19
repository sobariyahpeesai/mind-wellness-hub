import { Facebook, Globe, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contacts = [
  { icon: Facebook, label: "เพจ Facebook", sub: "PSU Mental Health", color: "text-primary", href: "#" },
  { icon: MessageCircle, label: "Line Official", sub: "@psubuddy", color: "text-severity-mild", href: "#" },
  { icon: Phone, label: "โทรศัพท์", sub: "0-7428-2203", color: "text-primary", href: "tel:074282203" },
  { icon: Globe, label: "เว็บไซต์", sub: "student.psu.ac.th", color: "text-primary", href: "https://student.psu.ac.th" },
];

export default function ContactSidebar() {
  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-sm border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base">ช่องทางการติดต่อ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center shadow-sm shrink-0">
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full h-12 font-heading font-semibold rounded-2xl shadow-sm">
        <Phone className="w-4 h-4 mr-2" />
        ขอความช่วยเหลือเร่งด่วน
      </Button>
    </div>
  );
}
