import { SeverityLevel, getSeverityLabel } from "@/lib/dass21";

interface SeverityBadgeProps {
  level: SeverityLevel;
  size?: "sm" | "md" | "lg";
}

export default function SeverityBadge({ level, size = "md" }: SeverityBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${level === "normal" ? "severity-normal" : ""} ${level === "mild" ? "severity-mild" : ""} ${level === "moderate" ? "severity-moderate" : ""} ${level === "severe" ? "severity-severe" : ""} ${level === "very-severe" ? "severity-very-severe" : ""} ${sizeClasses[size]}`}>
      {getSeverityLabel(level)}
    </span>
  );
}
