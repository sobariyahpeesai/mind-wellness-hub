import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Info, ClipboardList, CalendarCheck, BarChart3 } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username.startsWith("psy")) {
        navigate("/psychologist");
      } else if (username.startsWith("doc")) {
        navigate("/psychiatrist");
      } else {
        navigate("/student");
      }
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
      {/* Left — Dark blue hero */}
      <div className="relative lg:w-[55%] min-h-[340px] lg:min-h-screen flex flex-col justify-between overflow-hidden">
        <img
          src={loginBg}
          alt="PSU Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,12%)/0.88] via-[hsl(220,80%,18%)/0.82] to-[hsl(220,100%,30%)/0.75]" />

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

        {/* Quote overlay */}
        <div className="absolute bottom-28 left-8 lg:left-14 max-w-xs hidden lg:block">
          <blockquote className="text-white/60 text-sm italic leading-relaxed">
            "Your mental health is a priority. Your happiness is an essential.
            Your self-care is a necessity."
          </blockquote>
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

            <form onSubmit={handleLogin} className="space-y-5">
              {/* PSU Passport button style */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 rounded-full border-2 border-primary text-primary font-heading font-semibold text-base hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  // In production: redirect to PSU Passport OAuth
                  document.getElementById("login-fields")?.classList.toggle("hidden");
                }}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login with PSU Passport
              </Button>

              {/* Expandable fields for demo */}
              <div id="login-fields" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    PSU Passport Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="เช่น 6510210001 หรือ staff.name"
                    className="h-12 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน PSU Passport"
                    className="h-12 rounded-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-heading font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      กำลังเข้าสู่ระบบ...
                    </span>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </Button>
              </div>
            </form>

            {/* Info box */}
            <div className="mt-6 p-4 bg-secondary rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                สำหรับนักศึกษาและบุคลากร ม.อ. กรุณาเข้าสู่ระบบด้วย PSU Passport
              </p>
            </div>

            {/* Demo hint */}
            <div className="mt-4 p-3 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> พิมพ์ "psy" = นักจิตวิทยา, "doc" = จิตแพทย์, อื่นๆ = นักศึกษา
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
