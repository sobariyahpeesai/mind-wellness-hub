import { Bell, ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  userName?: string;
  userRole?: "student" | "psychologist" | "psychiatrist";
  studentId?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

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

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  isRead: boolean;
}

const mockNotifications: NotificationItem[] = [
  { id: 1, title: "แจ้งเตือน: ถึงเวลาทำแบบประเมินใหม่", description: "กรุณาทำแบบประเมิน DASS-21 ประจำภาคเรียนที่ 1/2569", isRead: false },
  { id: 2, title: "แจ้งเตือน: นัดหมายการปรึกษา", description: "คุณมีนัดหมายวันที่ 25 มี.ค. 2569 เวลา 10:00 น.", isRead: false },
];

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
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navItems = roleNavItems[userRole] || [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = userName.charAt(0);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="font-heading text-primary-foreground text-xs font-bold tracking-tight">PSU</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-heading text-primary font-bold text-sm leading-tight">
              ระบบส่งเสริมสุขภาวะทางจิต
            </p>
            <p className="text-[11px] text-muted-foreground">
              Prince of Songkla University
            </p>
          </div>
        </Link>

        {/* Desktop Nav — centered pills */}
        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right area */}
        <div className="flex items-center gap-2">
          {/* Notification bell + dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {notificationCount}
                </Badge>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="font-heading font-semibold text-sm text-foreground">การแจ้งเตือน</h3>
                  <button className="text-xs text-primary hover:underline">อ่านทั้งหมด</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 cursor-pointer">
                      <p className="text-sm font-medium text-primary">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border text-center">
                  <button className="text-sm text-primary font-medium hover:underline">ดูการแจ้งเตือนทั้งหมด</button>
                </div>
              </div>
            )}
          </div>

          {/* User info + dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-primary leading-tight">{userName}</p>
                {studentId && <p className="text-[11px] text-muted-foreground">{studentId}</p>}
              </div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm shrink-0">
                {initials}
              </div>
            </button>

            {/* Mobile avatar only */}
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              className="md:hidden w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm"
            >
              {initials}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-heading font-semibold text-sm text-foreground">{userName}</p>
                  {studentId && <p className="text-xs text-muted-foreground">{studentId}</p>}
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                    <User className="w-4 h-4 text-muted-foreground" />
                    โปรไฟล์
                  </button>
                  <button
                    onClick={onLogout || (() => navigate("/login"))}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
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
