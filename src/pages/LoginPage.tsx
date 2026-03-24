import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Info, ClipboardList, CalendarCheck, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePsuLogin = () => {
    setLoading(true);
    // In production: redirect to PSU Passport OAuth
    // Demo: redirect to student dashboard
    setTimeout(() => {
      navigate("/student");
      setLoading(false);
    }, 1000);
  };

  const features = [
    { icon: ClipboardList, title: "แบบประเมิน DASS-21", desc: "Mental Health Assessment" },
    { icon: CalendarCheck, title: "นัดหมายปรึกษา", desc: "Counseling Appointment" },
    { icon: BarChart3, title: "ติดตามสถานะคำปรึกษา", desc: "Consultation Status" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Dark blue solid */}
      <div className="relative lg:w-[55%] min-h-[340px] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[hsl(220,60%,10%)] via-[hsl(220,80%,18%)] to-[hsl(220,100%,28%)]">
        <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <span className="font-heading text-white font-bold text-sm">PSU</span>
            </div>
            <span className="font-heading text-white font-semibold text-lg tracking-wide">
              PSU HomeCare
            </span>
          </div>

          {/* Hero text */}
          <div className="my-auto py-12 lg:py-0">
            <h1 className="font-heading text-white text-3xl lg:text-[2.75rem] font-bold leading-tight mb-4">
              โอบกอดใจคุณ สู่การเดิน
              <br />
              ทางที่ผ่อนคลาย
            </h1>
            <p className="text-white/70 text-base lg:text-lg max-w-md leading-relaxed">
              พื้นที่ปลอดภัยสำหรับสุขภาพจิตของชาว ม.อ. ให้เราดูแลคุณในทุกย่าง
              ก้าวของการเติบโต
            </p>

            <blockquote className="mt-8 text-white/50 text-sm italic leading-relaxed max-w-sm">
              "Your mental health is a priority. Your happiness is an essential.
              Your self-care is a necessity."
            </blockquote>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col sm:flex-row gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 flex-1"
              >
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-white/90" />
                </div>
                <div>
                  <p className="text-white text-sm font-heading font-semibold leading-tight">{f.title}</p>
                  <p className="text-white/50 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="lg:w-[45%] flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-foreground">
                เข้าสู่ระบบ
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                ระบบส่งเสริมสุขภาวะทางจิต มหาวิทยาลัยสงขลานครินทร์
              </p>
            </div>

            {/* PSU Passport login button */}
            <Button
              onClick={handlePsuLogin}
              disabled={loading}
              variant="outline"
              className="w-full h-14 rounded-full border-2 border-primary text-primary font-heading font-semibold text-base hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-current/30 border-t-current rounded-full" />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Login with PSU Passport
                </span>
              )}
            </Button>

            {/* Info box */}
            <div className="mt-8 p-4 bg-secondary rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                สำหรับนักศึกษาและบุคลากร ม.อ. กรุณาเข้าสู่ระบบด้วย PSU Passport
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs text-muted-foreground">
          © 2026 Prince of Songkla University. All rights reserved.
        </div>
      </div>
    </div>
  );
}
