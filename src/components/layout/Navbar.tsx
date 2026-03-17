import { Bell, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  userName?: string;
  userRole?: "student" | "psychologist" | "psychiatrist";
  studentId?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

const roleLabels: Record<string, string> = {
  student: "นักศึกษา",
  psychologist: "นักจิตวิทยา",
  psychiatrist: "จิตแพทย์",
};

const roleNavItems: Record<string, { label: string; path: string }[]> = {
  student: [
    { label: "หน้าหลัก", path: "/student" },
    { label: "นัดหมาย", path: "/student/appointments" },
    { label: "ผลประเมิน", path: "/student/assessment" },
    { label: "ช่วยเหลือ", path: "/student/help" },
  ],
  psychologist: [
    { label: "แดชบอร์ด", path: "/psychologist" },
    { label: "เคสเร่งด่วน", path: "/psychologist/urgent" },
    { label: "นัดหมาย", path: "/psychologist/appointments" },
    { label: "ค้นหานักศึกษา", path: "/psychologist/search" },
    { label: "บันทึกคำปรึกษา", path: "/psychologist/counseling" },
    { label: "รายงาน", path: "/psychologist/reports" },
  ],
  psychiatrist: [
    { label: "แดชบอร์ด", path: "/psychiatrist" },
    { label: "นัดหมาย", path: "/psychiatrist/appointments" },
  ],
};

export default function Navbar({
  userName = "ผู้ใช้งาน",
  userRole = "student",
  studentId,
  notificationCount = 0,
  onLogout,
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = roleNavItems[userRole] || [];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="font-heading text-primary-foreground text-sm font-bold">PSU</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-heading text-primary font-bold text-sm leading-tight">
              ระบบส่งเสริมสุขภาวะทางจิต
            </p>
            <p className="text-xs text-primary">
              Prince of Songkla University
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Area */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px]">
                {notificationCount}
              </Badge>
            )}
          </button>

          {/* User Info */}
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              {studentId && (
                <p className="text-xs text-muted-foreground">{studentId}</p>
              )}
            </div>
            <Badge variant="outline" className="text-xs border-primary text-primary">
              {roleLabels[userRole]}
            </Badge>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
            {userName.charAt(0)}
          </div>

          {/* Logout */}
          <button
            onClick={onLogout || (() => navigate("/login"))}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-card p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
