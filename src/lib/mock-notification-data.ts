export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "assessment" | "activity" | "system" | "counseling";
  date: string;
  read: boolean;
  link?: string;
}

export const studentNotifications: Notification[] = [
  {
    id: "n1",
    title: "นัดหมายใหม่",
    message: "คุณมีนัดหมายกับ อ.สุภาพร จิตดี วันที่ 28 มี.ค. 2569 เวลา 10:00 น.",
    type: "appointment",
    date: "2569-03-25T09:00:00",
    read: false,
  },
  {
    id: "n2",
    title: "ถึงกำหนดทำแบบประเมิน DASS-21",
    message: "ครบรอบ 3 เดือนแล้ว กรุณาทำแบบประเมิน DASS-21 อีกครั้ง",
    type: "assessment",
    date: "2569-03-24T14:00:00",
    read: false,
  },
  {
    id: "n3",
    title: "กิจกรรม Mindfulness Workshop",
    message: "กิจกรรม Mindfulness Workshop จะจัดขึ้นในวันที่ 25 มี.ค. 2569 ที่ศูนย์กีฬา",
    type: "activity",
    date: "2569-03-23T10:00:00",
    read: true,
  },
  {
    id: "n4",
    title: "ผลประเมินพร้อมแล้ว",
    message: "ผลประเมิน DASS-21 ของคุณพร้อมให้ดูแล้ว คลิกเพื่อดูรายละเอียด",
    type: "assessment",
    date: "2569-03-20T16:30:00",
    read: true,
  },
  {
    id: "n5",
    title: "ยืนยันนัดหมายสำเร็จ",
    message: "นัดหมายวันที่ 15 มี.ค. 2569 ได้รับการยืนยันเรียบร้อยแล้ว",
    type: "appointment",
    date: "2569-03-14T08:00:00",
    read: true,
  },
];

export const psychologistNotifications: Notification[] = [
  {
    id: "pn1",
    title: "นัดหมายใหม่รอยืนยัน",
    message: "นางสาวซอบารียะฮ์ ปีไสย (6310210100) ขอนัดหมายวันที่ 28 มี.ค. 2569",
    type: "appointment",
    date: "2569-03-25T08:30:00",
    read: false,
  },
  {
    id: "pn2",
    title: "ผลประเมินนักศึกษาระดับรุนแรง",
    message: "นายธนพล สุขสวัสดิ์ (6410110234) มีผล DASS-21 ระดับรุนแรง ควรติดตามเร่งด่วน",
    type: "assessment",
    date: "2569-03-24T11:00:00",
    read: false,
  },
  {
    id: "pn3",
    title: "เคสส่งต่อจิตแพทย์",
    message: "เคส CR-001 ถูกส่งต่อจิตแพทย์เรียบร้อยแล้ว รอการตอบรับ",
    type: "counseling",
    date: "2569-03-22T15:00:00",
    read: true,
  },
  {
    id: "pn4",
    title: "ระบบปรับปรุง",
    message: "ระบบจะมีการปรับปรุงในวันที่ 30 มี.ค. 2569 เวลา 22:00-24:00 น.",
    type: "system",
    date: "2569-03-21T09:00:00",
    read: true,
  },
];
