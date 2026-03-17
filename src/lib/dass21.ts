export type SeverityLevel = "normal" | "mild" | "moderate" | "severe" | "very-severe";

export interface DASS21Scores {
  depression: number;
  anxiety: number;
  stress: number;
}

export interface SeverityResult {
  level: SeverityLevel;
  label: string;
  color: string;
}

const severityLabels: Record<SeverityLevel, string> = {
  normal: "ปกติ",
  mild: "เล็กน้อย",
  moderate: "ปานกลาง",
  severe: "รุนแรง",
  "very-severe": "รุนแรงมาก",
};

const severityColors: Record<SeverityLevel, string> = {
  normal: "severity-normal",
  mild: "severity-mild",
  moderate: "severity-moderate",
  severe: "severity-severe",
  "very-severe": "severity-very-severe",
};

export function getDepressionSeverity(score: number): SeverityResult {
  let level: SeverityLevel;
  if (score <= 4) level = "normal";
  else if (score <= 6) level = "mild";
  else if (score <= 10) level = "moderate";
  else if (score <= 13) level = "severe";
  else level = "very-severe";
  return { level, label: severityLabels[level], color: severityColors[level] };
}

export function getAnxietySeverity(score: number): SeverityResult {
  let level: SeverityLevel;
  if (score <= 3) level = "normal";
  else if (score <= 5) level = "mild";
  else if (score <= 7) level = "moderate";
  else if (score <= 9) level = "severe";
  else level = "very-severe";
  return { level, label: severityLabels[level], color: severityColors[level] };
}

export function getStressSeverity(score: number): SeverityResult {
  let level: SeverityLevel;
  if (score <= 7) level = "normal";
  else if (score <= 9) level = "mild";
  else if (score <= 12) level = "moderate";
  else if (score <= 16) level = "severe";
  else level = "very-severe";
  return { level, label: severityLabels[level], color: severityColors[level] };
}

export function getOverallSeverity(scores: DASS21Scores): SeverityLevel {
  const d = getDepressionSeverity(scores.depression).level;
  const a = getAnxietySeverity(scores.anxiety).level;
  const s = getStressSeverity(scores.stress).level;
  const levels: SeverityLevel[] = ["normal", "mild", "moderate", "severe", "very-severe"];
  const maxIndex = Math.max(levels.indexOf(d), levels.indexOf(a), levels.indexOf(s));
  return levels[maxIndex];
}

export function isUrgentCase(scores: DASS21Scores): boolean {
  const d = getDepressionSeverity(scores.depression).level;
  const a = getAnxietySeverity(scores.anxiety).level;
  const s = getStressSeverity(scores.stress).level;
  return [d, a, s].some((l) => l === "severe" || l === "very-severe");
}

export function getSeverityLabel(level: SeverityLevel): string {
  return severityLabels[level];
}

export function calculateUrgencyScore(scores: DASS21Scores): number {
  // Higher = more urgent
  const levels: SeverityLevel[] = ["normal", "mild", "moderate", "severe", "very-severe"];
  const d = levels.indexOf(getDepressionSeverity(scores.depression).level);
  const a = levels.indexOf(getAnxietySeverity(scores.anxiety).level);
  const s = levels.indexOf(getStressSeverity(scores.stress).level);
  return d + a + s;
}
