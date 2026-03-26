import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus, Search, Pencil, Trash2, Eye, EyeOff, BookOpen, Hash, Tag, Filter, X
} from "lucide-react";
import {
  type Article,
  articleCategories,
  severityLevelOptions,
  getAllArticles,
  saveArticle,
  deleteArticle,
} from "@/lib/mock-article-data";
import type { SeverityLevel } from "@/lib/dass21";
import { getSeverityLabel } from "@/lib/dass21";

const severityColorMap: Record<SeverityLevel, string> = {
  normal: "bg-muted text-foreground border-border",
  mild: "bg-[hsl(142,71%,45%)] text-white border-transparent",
  moderate: "bg-[hsl(48,96%,53%)] text-foreground border-transparent",
  severe: "bg-[hsl(25,95%,53%)] text-white border-transparent",
  "very-severe": "bg-destructive text-destructive-foreground border-transparent",
};

export default function ArticleManagementPage() {
  const [articles, setArticles] = useState<Article[]>(getAllArticles());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterPublished, setFilterPublished] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [hashtagInput, setHashtagInput] = useState("");

  // Form state
  const [form, setForm] = useState<Omit<Article, "id" | "createdAt" | "updatedAt">>({
    title: "",
    content: "",
    categories: [],
    hashtags: [],
    targetLevels: [],
    author: "อ.สุภาพร จิตดี",
    source: "",
    isPublished: true,
  });

  const resetForm = () => {
    setForm({
      title: "", content: "", categories: [], hashtags: [],
      targetLevels: [], author: "อ.สุภาพร จิตดี", source: "", isPublished: true,
    });
    setHashtagInput("");
    setSelectedArticle(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (article: Article) => {
    setSelectedArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      categories: [...article.categories],
      hashtags: [...article.hashtags],
      targetLevels: [...article.targetLevels],
      author: article.author,
      source: article.source,
      isPublished: article.isPublished,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("กรุณากรอกชื่อบทความ");
      return;
    }
    if (form.targetLevels.length === 0) {
      toast.error("กรุณาเลือกระดับที่แสดงผลอย่างน้อย 1 ระดับ");
      return;
    }

    const now = new Date().toISOString();
    const article: Article = {
      id: selectedArticle?.id || `ART-${String(Date.now()).slice(-6)}`,
      ...form,
      createdAt: selectedArticle?.createdAt || now,
      updatedAt: now,
    };
    saveArticle(article);
    setArticles(getAllArticles());
    setDialogOpen(false);
    resetForm();
    toast.success(selectedArticle ? "อัปเดตบทความแล้ว" : "เพิ่มบทความใหม่แล้ว");
  };

  const handleDelete = () => {
    if (!selectedArticle) return;
    deleteArticle(selectedArticle.id);
    setArticles(getAllArticles());
    setDeleteDialogOpen(false);
    setSelectedArticle(null);
    toast.success("ลบบทความแล้ว");
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleLevel = (level: SeverityLevel) => {
    setForm((prev) => ({
      ...prev,
      targetLevels: prev.targetLevels.includes(level)
        ? prev.targetLevels.filter((l) => l !== level)
        : [...prev.targetLevels, level],
    }));
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, "");
    if (tag && !form.hashtags.includes(tag)) {
      setForm((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag] }));
    }
    setHashtagInput("");
  };

  const removeHashtag = (tag: string) => {
    setForm((prev) => ({ ...prev, hashtags: prev.hashtags.filter((t) => t !== tag) }));
  };

  const togglePublish = (article: Article) => {
    const updated = { ...article, isPublished: !article.isPublished, updatedAt: new Date().toISOString() };
    saveArticle(updated);
    setArticles(getAllArticles());
    toast.success(updated.isPublished ? "เผยแพร่บทความแล้ว" : "ยกเลิกการเผยแพร่แล้ว");
  };

  // Filter
  const filtered = articles.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) ||
      a.hashtags.some((h) => h.toLowerCase().includes(q)) ||
      a.categories.some((c) => c.toLowerCase().includes(q));
    const matchCategory = filterCategory === "all" || a.categories.includes(filterCategory);
    const matchLevel = filterLevel === "all" || a.targetLevels.includes(filterLevel as SeverityLevel);
    const matchPublished = filterPublished === "all" ||
      (filterPublished === "published" && a.isPublished) ||
      (filterPublished === "draft" && !a.isPublished);
    return matchSearch && matchCategory && matchLevel && matchPublished;
  });

  return (
    <AppLayout userName="อ.สุภาพร จิตดี" userRole="psychologist" notificationCount={3}>
      <div className="container py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">📝 จัดการบทความสุขภาวะทางจิต</h1>
            <p className="text-sm text-muted-foreground mt-1">เพิ่ม แก้ไข และจัดการบทความแนะนำสำหรับนักศึกษา</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มบทความใหม่
          </Button>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl shadow-sm border-border/60">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาบทความ, แฮชแท็ก..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {articleCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full md:w-44">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="ระดับเป้าหมาย" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกระดับ</SelectItem>
                  {severityLevelOptions.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPublished} onValueChange={setFilterPublished}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="published">เผยแพร่แล้ว</SelectItem>
                  <SelectItem value="draft">ฉบับร่าง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "บทความทั้งหมด", value: articles.length, icon: BookOpen },
            { label: "เผยแพร่แล้ว", value: articles.filter((a) => a.isPublished).length, icon: Eye },
            { label: "ฉบับร่าง", value: articles.filter((a) => !a.isPublished).length, icon: EyeOff },
            { label: "หมวดหมู่", value: new Set(articles.flatMap((a) => a.categories)).size, icon: Tag },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl shadow-sm border-border/60">
              <CardContent className="py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-heading text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Article List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="rounded-2xl shadow-sm border-border/60">
              <CardContent className="py-12 text-center text-muted-foreground">
                ไม่พบบทความที่ตรงกับเงื่อนไข
              </CardContent>
            </Card>
          ) : (
            filtered.map((article) => (
              <Card key={article.id} className="rounded-2xl shadow-sm border-border/60 hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-heading font-semibold text-foreground">{article.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            โดย {article.author} • แหล่งที่มา: {article.source || "—"} • {article.updatedAt.slice(0, 10)}
                          </p>
                        </div>
                        <Badge variant={article.isPublished ? "default" : "secondary"} className="shrink-0 text-xs">
                          {article.isPublished ? "เผยแพร่" : "ฉบับร่าง"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1.5">
                        {article.categories.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs gap-1">
                            <Tag className="w-3 h-3" />{c}
                          </Badge>
                        ))}
                      </div>

                      {/* Hashtags */}
                      {article.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {article.hashtags.map((h) => (
                            <span key={h} className="text-xs text-primary font-medium">#{h}</span>
                          ))}
                        </div>
                      )}

                      {/* Target Levels */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">แสดงให้ระดับ:</span>
                        {article.targetLevels.map((l) => (
                          <span key={l} className={`text-xs px-2 py-0.5 rounded-full border ${severityColorMap[l]}`}>
                            {getSeverityLabel(l)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(article)}>
                        <Pencil className="w-3.5 h-3.5" />แก้ไข
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => togglePublish(article)}>
                        {article.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {article.isPublished ? "ซ่อน" : "เผยแพร่"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedArticle(article); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />ลบ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {selectedArticle ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label>ชื่อบทความ *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="เช่น 5 วิธีจัดการความเครียดด้วยตัวเอง"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label>เนื้อหาบทความ</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="เขียนเนื้อหาบทความที่นี่..."
                rows={6}
              />
            </div>

            {/* Source + Author */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ผู้เขียน</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>แหล่งที่มา</Label>
                <Input
                  value={form.source}
                  onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                  placeholder="เช่น กรมสุขภาพจิต"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>หมวดหมู่ (เลือกได้หลายรายการ)</Label>
              <div className="flex flex-wrap gap-2">
                {articleCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.categories.includes(cat)
                        ? "bg-primary text-primary-foreground border-transparent"
                        : "bg-card text-foreground border-border hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label>แฮชแท็ก</Label>
              <div className="flex gap-2">
                <Input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHashtag(); } }}
                  placeholder="พิมพ์แฮชแท็กแล้วกด Enter"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={addHashtag}>
                  <Hash className="w-4 h-4" />
                </Button>
              </div>
              {form.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      #{tag}
                      <button type="button" onClick={() => removeHashtag(tag)} className="ml-0.5 hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Target Severity Levels */}
            <div className="space-y-2">
              <Label>ระดับที่แสดงผลให้นักศึกษา *</Label>
              <p className="text-xs text-muted-foreground">เลือกระดับผลประเมิน DASS-21 ที่จะเห็นบทความนี้</p>
              <div className="flex flex-wrap gap-2">
                {severityLevelOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => toggleLevel(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.targetLevels.includes(opt.value)
                        ? severityColorMap[opt.value]
                        : "bg-card text-foreground border-border hover:bg-secondary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isPublished: v }))}
              />
              <Label className="cursor-pointer">เผยแพร่บทความ</Label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>{selectedArticle ? "บันทึกการแก้ไข" : "เพิ่มบทความ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">ยืนยันการลบบทความ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            คุณต้องการลบบทความ "<strong>{selectedArticle?.title}</strong>" ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete}>ลบบทความ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
