import { Facebook, Globe, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-psu-dark text-psu-dark-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                <span className="font-heading text-primary text-sm font-bold">PSU</span>
              </div>
              <div>
                <p className="font-heading font-bold text-sm">ระบบส่งเสริมสุขภาวะทางจิต</p>
                <p className="text-xs opacity-80">มหาวิทยาลัยสงขลานครินทร์</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              พัฒนาโดย งานสารสนเทศนักศึกษา กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์
              มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-ring transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-ring transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-heading font-bold mb-4">เมนูลัด</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/student" className="hover:opacity-100 transition-opacity">หน้าหลัก</a></li>
              <li><a href="/student/assessment" className="hover:opacity-100 transition-opacity">ผลประเมิน DASS-21</a></li>
              <li><a href="/student/appointments" className="hover:opacity-100 transition-opacity">นัดหมาย</a></li>
              <li><a href="/student/help" className="hover:opacity-100 transition-opacity">ช่วยเหลือ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                <span className="opacity-80">
                  กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ อาคารสำนักงานอธิการบดี ชั้น 2
                  มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่ 90110
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 opacity-80" />
                <span className="opacity-80">0-7428-2203</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0 opacity-80" />
                <span className="opacity-80">student.psu.ac.th</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs opacity-60">
            © 2026 Student Information System. Student Development Division, PSU Hat-Yai Campus.
          </p>
          <div className="flex gap-4 text-xs opacity-60">
            <a href="#" className="hover:opacity-100">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:opacity-100">แจ้งปัญหาการใช้งาน</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
