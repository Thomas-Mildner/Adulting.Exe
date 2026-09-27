import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function getPainLevel(current: number, previous: number) {
  const delta = ((current - previous) / previous) * 100;
  if (delta > 10)
    return { level: "painLevels.existential", color: "text-destructive", delta };
  if (delta > 5)
    return { level: "painLevels.panic", color: "text-chart-3", delta };
  if (delta > 0)
    return { level: "painLevels.worry", color: "text-chart-3", delta };
  if (delta === 0) return { level: "painLevels.zen", color: "text-success", delta };
  return { level: "painLevels.good", color: "text-success", delta };
}

export function getDeltaIcon(delta: number) {
  if (delta > 0) return <ArrowUpRight className="h-3 w-3" />;
  if (delta < 0) return <ArrowDownRight className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
}

export function getEfficiencyGrade(avgDelta: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (avgDelta <= -10)
    return { grade: "A+", label: "efficiencyGrades.exemplary", color: "text-success" };
  if (avgDelta <= -5)
    return { grade: "A", label: "efficiencyGrades.veryGood", color: "text-success" };
  if (avgDelta <= 0) return { grade: "B", label: "efficiencyGrades.good", color: "text-primary" };
  if (avgDelta <= 5)
    return { grade: "C", label: "efficiencyGrades.expandable", color: "text-chart-3" };
  if (avgDelta <= 10)
    return { grade: "D", label: "efficiencyGrades.critical", color: "text-destructive" };
  return { grade: "F", label: "efficiencyGrades.catastrophe", color: "text-destructive" };
}

export const CHART_COLORS = {
  power: "hsl(220, 72%, 50%)",
  water: "hsl(197, 71%, 52%)",
  heating: "hsl(350, 65%, 55%)",
};

export const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid hsl(220, 13%, 91%)",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
};

export const MONTHS_DE_SHORT = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

export function parseGermanMonth(str: string): Date | null {
  const cleaned = str.replace(/\./g, "").trim();
  for (let i = 0; i < MONTHS_DE_SHORT.length; i++) {
    if (cleaned.startsWith(MONTHS_DE_SHORT[i])) {
      const yearMatch = cleaned.match(/\d{4}/);
      if (yearMatch) {
        return new Date(parseInt(yearMatch[0]), i, 1);
      }
    }
  }
  return null;
}

export function formatMonthDE(date: Date): string {
  return date.toLocaleDateString("de-DE", { month: "short", year: "numeric" });
}

export function linearRegression(values: number[]): { slope: number; intercept: number } {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] || 0 };
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) * (i - xMean);
  }
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}

