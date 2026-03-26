import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { type DASS21Scores, type SeverityLevel, getOverallSeverity } from "@/lib/dass21";

import EmergencyBanner from "@/components/student/EmergencyBanner";
import NotificationBanner from "@/components/student/NotificationBanner";
import DassScoreCard from "@/components/student/DassScoreCard";
import AppointmentBookingCard from "@/components/student/AppointmentBookingCard";
import ArticlesCard from "@/components/student/ArticlesCard";
import { getPublishedArticlesForLevel } from "@/lib/mock-article-data";
import ActivitiesCard from "@/components/student/ActivitiesCard";
import ContactSidebar from "@/components/student/ContactSidebar";

// Mock data — will be replaced by API
const mockScores: DASS21Scores | null = {
  depression: 12,
  anxiety: 8,
  stress: 15,
};

const mockActivities = [
  { id: 1, title: "กิจกรรม Mindfulness Workshop", date: "25 มี.ค. 2569", location: "ศูนย์กีฬา" },
  { id: 2, title: "กลุ่มสนทนาจิตวิทยา", date: "28 มี.ค. 2569", location: "ห้องประชุม LRC" },
  { id: 3, title: "โยคะเพื่อสุขภาพจิต", date: "1 เม.ย. 2569", location: "สนามหญ้าหน้าตึก" },
];


export default function StudentDashboard() {
  const [notifyConsent, setNotifyConsent] = useState(false);
  const hasScores = mockScores !== null;
  const overallLevel: SeverityLevel = mockScores ? getOverallSeverity(mockScores) : "normal";
  const recommendedArticles = getPublishedArticlesForLevel(overallLevel);

  return (
    <AppLayout
      userName="ซอบารียะฮ์ ปีไสย"
      userRole="student"
      studentId="6310210100"
      notificationCount={2}
    >
      <div className="container py-6 space-y-5">
        {/* Banners */}
        <EmergencyBanner />
        <NotificationBanner count={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <DassScoreCard scores={mockScores} />

            {/* Notification Consent */}
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notify"
                    checked={notifyConsent}
                    onCheckedChange={(c) => setNotifyConsent(c === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="notify" className="text-sm text-foreground cursor-pointer">
                    อนุญาตให้ระบบส่งแจ้งเตือนทำแบบประเมินใหม่ทุก 3 เดือน
                  </label>
                </div>
              </CardContent>
            </Card>

            <AppointmentBookingCard hasScores={hasScores} />

            {/* Self-care Articles */}
            {hasScores && overallLevel !== "severe" && overallLevel !== "very-severe" && (
              <ArticlesCard articles={recommendedArticles} />
            )}

            <ActivitiesCard activities={mockActivities} />
          </div>

          {/* Sidebar */}
          <div>
            <ContactSidebar />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
