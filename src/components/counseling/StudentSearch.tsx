import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { searchStudents } from "@/lib/mock-student-data";
import { Search, User } from "lucide-react";

interface StudentSearchProps {
  onSelect: (studentId: string) => void;
}

export default function StudentSearch({ onSelect }: StudentSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchStudents>>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = searchStudents(query);
    setResults(r);
    setOpen(r.length > 0 && query.length >= 2);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาด้วยชื่อหรือรหัสนักศึกษา..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((s) => (
            <button
              key={s.studentId}
              type="button"
              onClick={() => {
                onSelect(s.studentId);
                setQuery(`${s.studentId} — ${s.namePrefix}${s.fullName}`);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  <span className="text-primary font-semibold">{s.studentId}</span>
                  {" — "}
                  {s.namePrefix}{s.fullName}
                </p>
                <p className="text-xs text-muted-foreground">{s.faculty}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
