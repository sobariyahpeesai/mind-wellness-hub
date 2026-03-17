import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Shield } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login — will be replaced with PSU Passport OAuth
    setTimeout(() => {
      // Demo: route based on username prefix
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary py-4">
        <div className="container flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
            <span className="font-heading text-primary font-bold">PSU</span>
          </div>
          <div>
            <h1 className="font-heading text-primary-foreground font-bold text-lg">
              ระบบส่งเสริมสุขภาวะทางจิต
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Prince of Songkla University
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                เข้าสู่ระบบ
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                เข้าสู่ระบบด้วย PSU Passport ของมหาวิทยาลัย
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  PSU Passport Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น 6510210001 หรือ staff.name"
                  className="h-12"
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
                  className="h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-heading font-semibold text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login PSU Passport
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> พิมพ์ username ที่ขึ้นต้นด้วย "psy" เพื่อเข้าหน้านักจิตวิทยา, 
                "doc" เพื่อเข้าหน้าจิตแพทย์, หรืออื่นๆ เพื่อเข้าหน้านักศึกษา
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
