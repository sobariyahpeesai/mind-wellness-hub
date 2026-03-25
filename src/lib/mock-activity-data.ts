export interface ActivityDetail {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  capacity: number;
  registered: number;
  category: string;
  registrationUrl?: string;
  lineOA?: string;
  contactPhone?: string;
  image?: string;
}

export const mockActivitiesDetail: ActivityDetail[] = [
  {
    id: 1,
    title: "กิจกรรม Mindfulness Workshop",
    date: "25 มี.ค. 2569",
    time: "13:00 - 16:00",
    location: "ศูนย์กีฬา มหาวิทยาลัยสงขลานครินทร์",
    description:
      "เรียนรู้เทคนิค Mindfulness เพื่อลดความเครียดและเพิ่มสมาธิในการเรียน โดยวิทยากรจากศูนย์สุขภาพจิต มีกิจกรรม Workshop ฝึกปฏิบัติจริง พร้อมรับใบประกาศนียบัตรเมื่อเข้าร่วมครบ",
    organizer: "กองกิจการนักศึกษา ร่วมกับ ศูนย์ส่งเสริมสุขภาพจิต",
    capacity: 50,
    registered: 32,
    category: "สุขภาพจิต",
    registrationUrl: "https://forms.psu.ac.th/mindfulness",
    lineOA: "@psu-wellness",
    contactPhone: "074-282-255",
  },
  {
    id: 2,
    title: "กลุ่มสนทนาจิตวิทยา",
    date: "28 มี.ค. 2569",
    time: "14:00 - 16:00",
    location: "ห้องประชุม LRC ชั้น 3",
    description:
      "กลุ่มสนทนาแลกเปลี่ยนประสบการณ์ด้านสุขภาพจิตอย่างเป็นกันเอง นำโดยนักจิตวิทยาผู้เชี่ยวชาญ หัวข้อประจำสัปดาห์: การจัดการความเครียดก่อนสอบ",
    organizer: "ศูนย์ให้คำปรึกษาทางจิตวิทยา",
    capacity: 20,
    registered: 15,
    category: "กลุ่มสนทนา",
    lineOA: "@psu-counseling",
    contactPhone: "074-282-256",
  },
  {
    id: 3,
    title: "โยคะเพื่อสุขภาพจิต",
    date: "1 เม.ย. 2569",
    time: "07:00 - 08:30",
    location: "สนามหญ้าหน้าตึกกิจกรรม",
    description:
      "ฝึกโยคะเบื้องต้นเพื่อผ่อนคลายร่างกายและจิตใจ เหมาะสำหรับผู้เริ่มต้น ไม่จำเป็นต้องมีประสบการณ์มาก่อน เตรียมเสื่อโยคะมาเองหรือยืมได้ที่จุดลงทะเบียน",
    organizer: "ชมรมโยคะ มหาวิทยาลัยสงขลานครินทร์",
    capacity: 40,
    registered: 28,
    category: "ออกกำลังกาย",
    registrationUrl: "https://forms.psu.ac.th/yoga",
    lineOA: "@psu-yoga-club",
    contactPhone: "074-282-257",
  },
  {
    id: 4,
    title: "อบรมเทคนิคการจัดการอารมณ์",
    date: "5 เม.ย. 2569",
    time: "09:00 - 12:00",
    location: "ห้องประชุมคณะศิลปศาสตร์ ชั้น 2",
    description:
      "อบรมเชิงปฏิบัติการเกี่ยวกับการจัดการอารมณ์ด้วยเทคนิค CBT (Cognitive Behavioral Therapy) ช่วยให้เข้าใจกลไกของอารมณ์และวิธีรับมืออย่างสร้างสรรค์",
    organizer: "ศูนย์ให้คำปรึกษาทางจิตวิทยา",
    capacity: 30,
    registered: 12,
    category: "สุขภาพจิต",
    registrationUrl: "https://forms.psu.ac.th/emotion-mgmt",
    lineOA: "@psu-counseling",
    contactPhone: "074-282-256",
  },
];

export function getActivityById(id: number): ActivityDetail | undefined {
  return mockActivitiesDetail.find((a) => a.id === id);
}
