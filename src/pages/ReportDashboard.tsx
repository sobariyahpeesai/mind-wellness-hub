import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from "recharts";
import {
  BarChart3, PieChart as PieChartIcon, TrendingUp, Users, ClipboardList, AlertTriangle, Activity,
} from "lucide-react";
import {
  FACULTIES, YEARS, facultyData, yearData, monthlyTrends, getOverallSeverityDistribution,
} from "@/lib/mock-report-data";

const SEVERITY_COLORS = {
  normal: "hsl(0, 0%, 85%)",
  mild: "hsl(142, 71%, 45%)",
  moderate: "hsl(48, 96%, 53%)",
  severe: "hsl(25, 95%, 53%)",
  verySevere: "hsl(0, 84%, 60%)",
};

const LINE_COLORS = {
  depression: "hsl(220, 100%, 30%)",
  anxiety: "hsl(25, 95%, 53%)",
  stress: "hsl(0, 84%, 60%)",
};

export default function ReportDashboard() {
  const [selectedFaculty, setSelectedFaculty] = useState("ทุกคณะ");
  const [selectedYear, setSelectedYear] = useState("ทุกชั้นปี");

  const filteredFacultyData = useMemo(() => {
    if (selectedFaculty === "ทุกคณะ") return facultyData;
    return facultyData.filter((f) => f.faculty === selectedFaculty);
  }, [selectedFaculty]);

  const filteredYearData = useMemo(() => {
    if (selectedYear === "ทุกชั้นปี") return yearData;
    const yearNum = parseInt(selectedYear.replace("ปี ", ""));
    return yearData.filter((y) => y.year === yearNum);
  }, [selectedYear]);

  const overallStats = useMemo(() => {
    const data = filteredFacultyData;
    return {
      totalStudents: data.reduce((s, f) => s + f.totalStudents, 0),
      assessed: data.reduce((s, f) => s + f.assessed, 0),
      severe: data.reduce((s, f) => s + f.severe, 0),
      verySevere: data.reduce((s, f) => s + f.verySevere, 0),
    };
  }, [filteredFacultyData]);

  const severityDist = getOverallSeverityDistribution();

  const facultyStackedData = filteredFacultyData.map((f) => ({
    name: f.faculty.length > 8 ? f.faculty.substring(0, 8) + "..." : f.faculty,
    fullName: f.faculty,
    ปกติ: f.normal,
    เล็กน้อย: f.mild,
    ปานกลาง: f.moderate,
    รุนแรง: f.severe,
    รุนแรงมาก: f.verySevere,
  }));

  const yearStackedData = filteredYearData.map((y) => ({
    name: y.label,
    ปกติ: y.normal,
    เล็กน้อย: y.mild,
    ปานกลาง: y.moderate,
    รุนแรง: y.severe,
    รุนแรงมาก: y.verySevere,
  }));

  const radarData = filteredFacultyData.slice(0, 6).map((f) => ({
    faculty: f.faculty.length > 6 ? f.faculty.substring(0, 6) + ".." : f.faculty,
    ซึมเศร้า: f.avgDepression,
    วิตกกังวล: f.avgAnxiety,
    เครียด: f.avgStress,
  }));

  const assessmentRate = overallStats.totalStudents > 0
    ? ((overallStats.assessed / overallStats.totalStudents) * 100).toFixed(1)
    : "0";

  return (
    <AppLayout userName="ดร.สมใจ นักจิต" userRole="psychologist" notificationCount={5}>
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-primary" />
              รายงานผลประเมินภาพรวม
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              DASS-21 Assessment Dashboard — ปีการศึกษา 2568
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="เลือกคณะ" />
              </SelectTrigger>
              <SelectContent>
                {FACULTIES.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="เลือกชั้นปี" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{overallStats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">นักศึกษาทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-severity-mild/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-severity-mild" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{overallStats.assessed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">ทำแบบประเมินแล้ว ({assessmentRate}%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-severity-severe/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-severity-severe/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-severity-severe" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-severity-severe">{overallStats.severe}</p>
                  <p className="text-xs text-muted-foreground">ระดับรุนแรง</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-severity-very-severe/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-severity-very-severe/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-severity-very-severe" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-severity-very-severe">{overallStats.verySevere}</p>
                  <p className="text-xs text-muted-foreground">ระดับรุนแรงมาก</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-1.5">
              <PieChartIcon className="w-4 h-4" /> ภาพรวม
            </TabsTrigger>
            <TabsTrigger value="faculty" className="gap-1.5">
              <BarChart3 className="w-4 h-4" /> ตามคณะ
            </TabsTrigger>
            <TabsTrigger value="year" className="gap-1.5">
              <Users className="w-4 h-4" /> ตามชั้นปี
            </TabsTrigger>
            <TabsTrigger value="trend" className="gap-1.5">
              <TrendingUp className="w-4 h-4" /> แนวโน้ม
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-base">สัดส่วนระดับความรุนแรง</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityDist}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          dataKey="count"
                          nameKey="label"
                          label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                          labelLine={true}
                        >
                          {severityDist.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value} คน`, name]}
                          contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 32%, 91%)", fontSize: "13px" }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-base">เปรียบเทียบคะแนนเฉลี่ย 3 ด้าน (ตามคณะ)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(214, 32%, 91%)" />
                        <PolarAngleAxis dataKey="faculty" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                        <Radar name="ซึมเศร้า" dataKey="ซึมเศร้า" stroke={LINE_COLORS.depression} fill={LINE_COLORS.depression} fillOpacity={0.15} />
                        <Radar name="วิตกกังวล" dataKey="วิตกกังวล" stroke={LINE_COLORS.anxiety} fill={LINE_COLORS.anxiety} fillOpacity={0.15} />
                        <Radar name="เครียด" dataKey="เครียด" stroke={LINE_COLORS.stress} fill={LINE_COLORS.stress} fillOpacity={0.15} />
                        <Legend />
                        <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Coverage Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">อัตราการทำแบบประเมินตามคณะ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredFacultyData.map((f) => ({
                      name: f.faculty.length > 8 ? f.faculty.substring(0, 8) + ".." : f.faculty,
                      อัตราประเมิน: Math.round((f.assessed / f.totalStudents) * 100),
                      ยังไม่ประเมิน: Math.round(((f.totalStudents - f.assessed) / f.totalStudents) * 100),
                    }))} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} formatter={(v: number) => `${v}%`} />
                      <Bar dataKey="อัตราประเมิน" fill="hsl(220, 100%, 30%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Tab */}
          <TabsContent value="faculty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">การกระจายระดับความรุนแรงตามคณะ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyStackedData} margin={{ bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                        formatter={(value: number, name: string) => [`${value} คน`, name]}
                        labelFormatter={(label) => {
                          const item = facultyStackedData.find((d) => d.name === label);
                          return item?.fullName || label;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="ปกติ" stackId="a" fill={SEVERITY_COLORS.normal} />
                      <Bar dataKey="เล็กน้อย" stackId="a" fill={SEVERITY_COLORS.mild} />
                      <Bar dataKey="ปานกลาง" stackId="a" fill={SEVERITY_COLORS.moderate} />
                      <Bar dataKey="รุนแรง" stackId="a" fill={SEVERITY_COLORS.severe} />
                      <Bar dataKey="รุนแรงมาก" stackId="a" fill={SEVERITY_COLORS.verySevere} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Average Scores by Faculty */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">คะแนนเฉลี่ย 3 ด้าน แยกตามคณะ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredFacultyData.map((f) => ({
                      name: f.faculty.length > 8 ? f.faculty.substring(0, 8) + ".." : f.faculty,
                      ซึมเศร้า: f.avgDepression,
                      วิตกกังวล: f.avgAnxiety,
                      เครียด: f.avgStress,
                    }))} margin={{ bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 12]} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
                      <Legend />
                      <Bar dataKey="ซึมเศร้า" fill={LINE_COLORS.depression} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="วิตกกังวล" fill={LINE_COLORS.anxiety} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="เครียด" fill={LINE_COLORS.stress} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Year Tab */}
          <TabsContent value="year" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-base">การกระจายระดับความรุนแรงตามชั้นปี</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearStackedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                          formatter={(value: number, name: string) => [`${value} คน`, name]}
                        />
                        <Legend />
                        <Bar dataKey="ปกติ" stackId="a" fill={SEVERITY_COLORS.normal} />
                        <Bar dataKey="เล็กน้อย" stackId="a" fill={SEVERITY_COLORS.mild} />
                        <Bar dataKey="ปานกลาง" stackId="a" fill={SEVERITY_COLORS.moderate} />
                        <Bar dataKey="รุนแรง" stackId="a" fill={SEVERITY_COLORS.severe} />
                        <Bar dataKey="รุนแรงมาก" stackId="a" fill={SEVERITY_COLORS.verySevere} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-base">สัดส่วนเคสเร่งด่วนตามชั้นปี</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={yearData.map((y) => ({
                            name: y.label,
                            value: y.severe + y.verySevere,
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {yearData.map((_, i) => (
                            <Cell key={i} fill={`hsl(${220 - i * 30}, 70%, ${40 + i * 8}%)`} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} formatter={(v: number) => [`${v} คน`]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Year detail table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">สรุปข้อมูลตามชั้นปี</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-heading font-semibold text-foreground">ชั้นปี</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-foreground">ทั้งหมด</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-foreground">ประเมินแล้ว</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-foreground">ปกติ</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-foreground">เล็กน้อย</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-foreground">ปานกลาง</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-severity-severe">รุนแรง</th>
                        <th className="text-right py-3 px-2 font-heading font-semibold text-severity-very-severe">รุนแรงมาก</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearData.map((y) => (
                        <tr key={y.year} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                          <td className="py-3 px-2 font-medium text-foreground">{y.label}</td>
                          <td className="text-right py-3 px-2 text-muted-foreground">{y.totalStudents}</td>
                          <td className="text-right py-3 px-2 text-muted-foreground">{y.assessed}</td>
                          <td className="text-right py-3 px-2">{y.normal}</td>
                          <td className="text-right py-3 px-2 text-severity-mild">{y.mild}</td>
                          <td className="text-right py-3 px-2 text-severity-moderate">{y.moderate}</td>
                          <td className="text-right py-3 px-2 font-semibold text-severity-severe">{y.severe}</td>
                          <td className="text-right py-3 px-2 font-semibold text-severity-very-severe">{y.verySevere}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trend Tab */}
          <TabsContent value="trend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">แนวโน้มคะแนนเฉลี่ย DASS-21 รายเดือน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 12]} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
                      <Legend />
                      <Line type="monotone" dataKey="depression" name="ซึมเศร้า" stroke={LINE_COLORS.depression} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="anxiety" name="วิตกกังวล" stroke={LINE_COLORS.anxiety} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="stress" name="เครียด" stroke={LINE_COLORS.stress} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">จำนวนการทำแบบประเมินรายเดือน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} formatter={(v: number) => [`${v} คน`]} />
                      <Area
                        type="monotone"
                        dataKey="assessedCount"
                        name="จำนวนผู้ประเมิน"
                        stroke="hsl(220, 100%, 30%)"
                        fill="hsl(220, 100%, 30%)"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
