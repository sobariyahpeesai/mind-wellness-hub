import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
  userName?: string;
  userRole?: "student" | "psychologist" | "psychiatrist";
  studentId?: string;
  notificationCount?: number;
}

export default function AppLayout({
  children,
  userName,
  userRole = "student",
  studentId,
  notificationCount = 0,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        userName={userName}
        userRole={userRole}
        studentId={studentId}
        notificationCount={notificationCount}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
