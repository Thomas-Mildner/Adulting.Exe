"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type MeterReading, formatCurrency } from "@/lib/data";
import { createMeterReading } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  Droplets,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Target,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────

function getPainLevel(current: number, previous: number) {
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

function getDeltaIcon(delta: number) {
  if (delta > 0) return <ArrowUpRight className="h-3 w-3" />;
  if (delta < 0) return <ArrowDownRight className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
}

function getEfficiencyGrade(avgDelta: number): {
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

const CHART_COLORS = {
  power: "hsl(220, 72%, 50%)",
  water: "hsl(197, 71%, 52%)",
  heating: "hsl(350, 65%, 55%)",
};

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid hsl(220, 13%, 91%)",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
};

// ─── Projection Helpers ─────────────────────────────────────────────────

const MONTHS_DE_SHORT = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

function parseGermanMonth(str: string): Date | null {
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

function formatMonthDE(date: Date): string {
  return date.toLocaleDateString("de-DE", { month: "short", year: "numeric" });
}

function linearRegression(values: number[]): { slope: number; intercept: number } {
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

// ─── Component ──────────────────────────────────────────────────────────

export function UtilityTracker({
  meterHistory,
  heatingType = "Gas",
}: {
  meterHistory: MeterReading[];
  heatingType?: string;
}) {
  const t = useTranslations("Utilities");
  const heatingUnit = heatingType === "Gas" ? "m³" : heatingType === "Oil" ? "Liter" : heatingType === "Pellets" ? "kg" : "kWh";
  const [powerInput, setPowerInput] = useState("");
  const [waterInput, setWaterInput] = useState("");
  const [heatingInput, setHeatingInput] = useState("");
  const [powerCostInput, setPowerCostInput] = useState("");
  const [waterCostInput, setWaterCostInput] = useState("");
  const [heatingCostInput, setHeatingCostInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dlgPower, setDlgPower] = useState("");
  const [dlgWater, setDlgWater] = useState("");
  const [dlgHeating, setDlgHeating] = useState("");
  const [dlgPowerCost, setDlgPowerCost] = useState("");
  const [dlgWaterCost, setDlgWaterCost] = useState("");
  const [dlgHeatingCost, setDlgHeatingCost] = useState("");
  const [dlgMonth, setDlgMonth] = useState(
    new Date().toLocaleDateString("de-DE", { month: "short", year: "numeric" }),
  );

  const handleDialogSave = async () => {
    if (!dlgPower && !dlgWater && !dlgHeating) return;
    setSaving(true);
    await createMeterReading({
      month: dlgMonth,
      power: dlgPower ? parseFloat(dlgPower) : 0,
      water: dlgWater ? parseFloat(dlgWater) : 0,
      heating: dlgHeating ? parseFloat(dlgHeating) : 0,
      powerCost: dlgPowerCost ? parseFloat(dlgPowerCost) : 0,
      waterCost: dlgWaterCost ? parseFloat(dlgWaterCost) : 0,
      heatingCost: dlgHeatingCost ? parseFloat(dlgHeatingCost) : 0,
    });
    setDlgPower("");
    setDlgWater("");
    setDlgHeating("");
    setDlgPowerCost("");
    setDlgWaterCost("");
    setDlgHeatingCost("");
    setSaving(false);
    setAddDialogOpen(false);
  };

  const addMeterDialog = (
    <Dialog
      open={addDialogOpen}
      onOpenChange={(v) => {
        setAddDialogOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          {t("addReading")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("addDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("addDialogDesc")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="dlg-month">{t("month")}</Label>
            <Input
              id="dlg-month"
              placeholder={t("placeholders.month")}
              value={dlgMonth}
              onChange={(e) => setDlgMonth(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-chart-1" />
                <Label className="text-xs font-medium">{t("power")} (kWh)</Label>
              </div>
              <Input
                type="number"
                placeholder={t("placeholders.consumption", { unit: "kWh" })}
                value={dlgPower}
                onChange={(e) => setDlgPower(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium">{t("cost")} {t("power")} (€)</Label>
              <Input
                type="number"
                placeholder={t("placeholders.cost")}
                value={dlgPowerCost}
                onChange={(e) => setDlgPowerCost(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-primary" />
                <Label className="text-xs font-medium">{t("water")} (m³)</Label>
              </div>
              <Input
                type="number"
                placeholder={t("placeholders.consumption", { unit: "m³" })}
                value={dlgWater}
                onChange={(e) => setDlgWater(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium">{t("cost")} {t("water")} (€)</Label>
              <Input
                type="number"
                placeholder={t("placeholders.cost")}
                value={dlgWaterCost}
                onChange={(e) => setDlgWaterCost(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-chart-4" />
                <Label className="text-xs font-medium">{t("heating")} ({heatingUnit})</Label>
              </div>
              <Input
                type="number"
                placeholder={t("placeholders.consumption", { unit: heatingUnit })}
                value={dlgHeating}
                onChange={(e) => setDlgHeating(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium">{t("cost")} {t("heating")} (€)</Label>
              <Input
                type="number"
                placeholder={t("placeholders.cost")}
                value={dlgHeatingCost}
                onChange={(e) => setDlgHeatingCost(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setAddDialogOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleDialogSave} disabled={saving}>
            {saving ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const latest =
    meterHistory.length > 0 ? meterHistory[meterHistory.length - 1] : null;
  const prev =
    meterHistory.length >= 2 ? meterHistory[meterHistory.length - 2] : latest;

  if (!latest || !prev) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("trackerTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("noData")}
          </p>
        </CardHeader>
        <CardContent>{addMeterDialog}</CardContent>
      </Card>
    );
  }

  // ─── Analytics ──────────────────────────────────────────────────────

  const analytics = useMemo(() => {
    const n = meterHistory.length;

    // Total costs
    const totalPowerCost = meterHistory.reduce((s, r) => s + r.powerCost, 0);
    const totalWaterCost = meterHistory.reduce((s, r) => s + r.waterCost, 0);
    const totalHeatingCost = meterHistory.reduce(
      (s, r) => s + r.heatingCost,
      0,
    );
    const totalCost = totalPowerCost + totalWaterCost + totalHeatingCost;

    // Averages
    const avgPower = meterHistory.reduce((s, r) => s + r.power, 0) / n;
    const avgWater = meterHistory.reduce((s, r) => s + r.water, 0) / n;
    const avgHeating = meterHistory.reduce((s, r) => s + r.heating, 0) / n;
    const avgMonthlyCost = totalCost / n;

    // Month-over-month deltas
    const deltas = meterHistory.slice(1).map((r, i) => {
      const p = meterHistory[i];
      return {
        month: r.month,
        powerDelta: ((r.power - p.power) / p.power) * 100,
        waterDelta: ((r.water - p.water) / p.water) * 100,
        heatingDelta:
          p.heating > 0 ? ((r.heating - p.heating) / p.heating) * 100 : 0,
        costDelta:
          p.powerCost + p.waterCost + p.heatingCost > 0
            ? ((r.powerCost +
              r.waterCost +
              r.heatingCost -
              (p.powerCost + p.waterCost + p.heatingCost)) /
              (p.powerCost + p.waterCost + p.heatingCost)) *
            100
            : 0,
      };
    });

    // Last quarter
    const lastQ = meterHistory.slice(-3);
    const qCost = lastQ.reduce(
      (s, r) => s + r.powerCost + r.waterCost + r.heatingCost,
      0,
    );

    // Peak & cheapest month
    const costByMonth = meterHistory.map((r) => ({
      month: r.month,
      total: r.powerCost + r.waterCost + r.heatingCost,
    }));
    const peakMonth = costByMonth.reduce((a, b) => (a.total > b.total ? a : b));
    const cheapestMonth = costByMonth.reduce((a, b) =>
      a.total < b.total ? a : b,
    );

    // Cost breakdown for pie chart
    const costBreakdown = [
      { name: "Strom", value: totalPowerCost, fill: CHART_COLORS.power },
      { name: "Wasser", value: totalWaterCost, fill: CHART_COLORS.water },
      { name: "Heizung", value: totalHeatingCost, fill: CHART_COLORS.heating },
    ];

    // Cost trend data
    const costTrend = meterHistory.map((r) => ({
      month: r.month,
      Strom: r.powerCost,
      Wasser: r.waterCost,
      Heizung: r.heatingCost,
      Gesamt: r.powerCost + r.waterCost + r.heatingCost,
    }));

    // Efficiency score
    const recentDeltas = deltas.slice(-3);
    const avgCostDelta =
      recentDeltas.length > 0
        ? recentDeltas.reduce((s, d) => s + d.costDelta, 0) /
        recentDeltas.length
        : 0;
    const efficiency = getEfficiencyGrade(avgCostDelta);

    // Year projection
    const yearProjection = avgMonthlyCost * 12;

    // Per-unit costs (latest)
    const latestPricePerKwh =
      latest.power > 0 ? latest.powerCost / latest.power : 0;
    const latestPricePerM3 =
      latest.water > 0 ? latest.waterCost / latest.water : 0;
    const latestPricePerKwhHeating =
      latest.heating > 0 ? latest.heatingCost / latest.heating : 0;

    // ─── Projection (Hochrechnung) ──────────────────────────────────
    const PROJ_MONTHS = 6;
    const powerCostReg = linearRegression(meterHistory.map((r) => r.powerCost));
    const waterCostReg = linearRegression(meterHistory.map((r) => r.waterCost));
    const heatingCostReg = linearRegression(
      meterHistory.map((r) => r.heatingCost),
    );
    const powerUsageReg = linearRegression(meterHistory.map((r) => r.power));
    const waterUsageReg = linearRegression(meterHistory.map((r) => r.water));
    const heatingUsageReg = linearRegression(
      meterHistory.map((r) => r.heating),
    );

    const lastMonthParsed = parseGermanMonth(meterHistory[n - 1].month);
    const lastActualMonth = meterHistory[n - 1].month;

    // Cost projection data
    const projectionData = meterHistory.map((r) => ({
      month: r.month,
      Gesamt: r.powerCost + r.waterCost + r.heatingCost,
      Strom: r.powerCost,
      Wasser: r.waterCost,
      Heizung: r.heatingCost,
      GesamtPrognose: null as number | null,
      StromPrognose: null as number | null,
      WasserPrognose: null as number | null,
      HeizungPrognose: null as number | null,
    }));

    // Bridge last actual point → first projection point for line continuity
    const lastPoint = projectionData[n - 1];
    lastPoint.GesamtPrognose = lastPoint.Gesamt;
    lastPoint.StromPrognose = lastPoint.Strom;
    lastPoint.WasserPrognose = lastPoint.Wasser;
    lastPoint.HeizungPrognose = lastPoint.Heizung;

    if (lastMonthParsed) {
      for (let offset = 1; offset <= PROJ_MONTHS; offset++) {
        const futureDate = new Date(
          lastMonthParsed.getFullYear(),
          lastMonthParsed.getMonth() + offset,
          1,
        );
        const idx = n - 1 + offset;
        const pP = Math.max(
          0,
          powerCostReg.slope * idx + powerCostReg.intercept,
        );
        const pW = Math.max(
          0,
          waterCostReg.slope * idx + waterCostReg.intercept,
        );
        const pH = Math.max(
          0,
          heatingCostReg.slope * idx + heatingCostReg.intercept,
        );
        projectionData.push({
          month: formatMonthDE(futureDate),
          Gesamt: null as unknown as number,
          Strom: null as unknown as number,
          Wasser: null as unknown as number,
          Heizung: null as unknown as number,
          GesamtPrognose: Math.round((pP + pW + pH) * 100) / 100,
          StromPrognose: Math.round(pP * 100) / 100,
          WasserPrognose: Math.round(pW * 100) / 100,
          HeizungPrognose: Math.round(pH * 100) / 100,
        });
      }
    }

    // Consumption projection data
    const consumptionProjection = meterHistory.map((r) => ({
      month: r.month,
      Strom: r.power,
      Wasser: r.water,
      Heizung: r.heating,
      StromPrognose: null as number | null,
      WasserPrognose: null as number | null,
      HeizungPrognose: null as number | null,
    }));

    const lastCons = consumptionProjection[n - 1];
    lastCons.StromPrognose = lastCons.Strom;
    lastCons.WasserPrognose = lastCons.Wasser;
    lastCons.HeizungPrognose = lastCons.Heizung;

    if (lastMonthParsed) {
      for (let offset = 1; offset <= PROJ_MONTHS; offset++) {
        const futureDate = new Date(
          lastMonthParsed.getFullYear(),
          lastMonthParsed.getMonth() + offset,
          1,
        );
        const idx = n - 1 + offset;
        consumptionProjection.push({
          month: formatMonthDE(futureDate),
          Strom: null as unknown as number,
          Wasser: null as unknown as number,
          Heizung: null as unknown as number,
          StromPrognose: Math.max(
            0,
            Math.round(
              (powerUsageReg.slope * idx + powerUsageReg.intercept) * 10,
            ) / 10,
          ),
          WasserPrognose: Math.max(
            0,
            Math.round(
              (waterUsageReg.slope * idx + waterUsageReg.intercept) * 100,
            ) / 100,
          ),
          HeizungPrognose: Math.max(
            0,
            Math.round(
              (heatingUsageReg.slope * idx + heatingUsageReg.intercept) * 10,
            ) / 10,
          ),
        });
      }
    }

    // Projected annual costs (next 12 months via regression)
    const projAnnualPowerCost = Array.from({ length: 12 }, (_, i) =>
      Math.max(0, powerCostReg.slope * (n + i) + powerCostReg.intercept),
    ).reduce((s, v) => s + v, 0);
    const projAnnualWaterCost = Array.from({ length: 12 }, (_, i) =>
      Math.max(0, waterCostReg.slope * (n + i) + waterCostReg.intercept),
    ).reduce((s, v) => s + v, 0);
    const projAnnualHeatingCost = Array.from({ length: 12 }, (_, i) =>
      Math.max(0, heatingCostReg.slope * (n + i) + heatingCostReg.intercept),
    ).reduce((s, v) => s + v, 0);
    const projAnnualTotal =
      projAnnualPowerCost + projAnnualWaterCost + projAnnualHeatingCost;

    // Overall trend direction
    const totalCostReg = linearRegression(
      meterHistory.map((r) => r.powerCost + r.waterCost + r.heatingCost),
    );
    const projTrendDirection: "up" | "down" | "stable" =
      totalCostReg.slope > 2
        ? "up"
        : totalCostReg.slope < -2
          ? "down"
          : "stable";

    return {
      totalCost,
      totalPowerCost,
      totalWaterCost,
      totalHeatingCost,
      avgPower,
      avgWater,
      avgHeating,
      avgMonthlyCost,
      deltas,
      qCost,
      peakMonth,
      cheapestMonth,
      costBreakdown,
      costTrend,
      efficiency,
      yearProjection,
      latestPricePerKwh,
      latestPricePerM3,
      latestPricePerKwhHeating,
      projectionData,
      consumptionProjection,
      lastActualMonth,
      projAnnualPowerCost,
      projAnnualWaterCost,
      projAnnualHeatingCost,
      projAnnualTotal,
      projTrendDirection,
    };
  }, [meterHistory, latest]);

  const powerPain = getPainLevel(latest.power, prev.power);
  const waterPain = getPainLevel(latest.water, prev.water);
  const heatingPain =
    prev.heating > 0
      ? getPainLevel(latest.heating, prev.heating)
      : { level: "Zen", color: "text-success", delta: 0 };

  // ─── Save handler ─────────────────────────────────────────────────

  const handleSave = async () => {
    if (!powerInput && !waterInput && !heatingInput) return;
    setSaving(true);
    const now = new Date();
    // TODO: Use locale from hook
    const month = now.toLocaleDateString("de-DE", {
      month: "short",
      year: "numeric",
    });
    await createMeterReading({
      month,
      power: powerInput ? parseFloat(powerInput) : latest.power,
      water: waterInput ? parseFloat(waterInput) : latest.water,
      heating: heatingInput ? parseFloat(heatingInput) : latest.heating,
      powerCost: powerCostInput ? parseFloat(powerCostInput) : 0,
      waterCost: waterCostInput ? parseFloat(waterCostInput) : 0,
      heatingCost: heatingCostInput ? parseFloat(heatingCostInput) : 0,
    });
    setPowerInput("");
    setWaterInput("");
    setHeatingInput("");
    setPowerCostInput("");
    setWaterCostInput("");
    setHeatingCostInput("");
    setSaving(false);
  };

  // ─── Resource cards config ────────────────────────────────────────

  const resources = [
    {
      label: t("power"),
      unit: "kWh",
      value: latest.power,
      cost: latest.powerCost,
      icon: Zap,
      pain: powerPain,
      accent: "bg-chart-1/10 text-chart-1",
      avg: analytics.avgPower,
    },
    {
      label: t("water"),
      unit: "m\u00B3",
      value: latest.water,
      cost: latest.waterCost,
      icon: Droplets,
      pain: waterPain,
      accent: "bg-primary/10 text-primary",
      avg: analytics.avgWater,
    },
    {
      label: t("heating"),
      unit: heatingUnit,
      value: latest.heating,
      cost: latest.heatingCost,
      icon: Flame,
      pain: heatingPain,
      accent: "bg-chart-4/10 text-chart-4",
      avg: analytics.avgHeating,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Add Button ── */}
      <div className="flex justify-end">{addMeterDialog}</div>

      {/* ── KPI Row ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                <Euro className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {t("totalCost")}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(analytics.totalCost)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {t("overMonths", { count: meterHistory.length })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                <BarChart3 className="h-4 w-4 text-chart-3" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {t("avgMonth")}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(analytics.avgMonthlyCost)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {t("projection", { amount: formatCurrency(analytics.yearProjection) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <Target className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {t("efficiencyGrade")}
                </p>
                <p
                  className={`text-lg font-bold ${analytics.efficiency.color}`}
                >
                  {analytics.efficiency.grade}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {t(analytics.efficiency.label)} (letzte 3 Monate)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  {t("lastQuarter")}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(analytics.qCost)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {t("mostExpensive")}: {analytics.peakMonth.month} (
              {formatCurrency(analytics.peakMonth.total)})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Current Readings Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {resources.map((r) => {
          const vsAvg = r.avg > 0 ? ((r.value - r.avg) / r.avg) * 100 : 0;

          return (
            <Card key={r.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {r.label}
                    </p>
                    <p className="text-2xl font-semibold tabular-nums text-foreground tracking-tight">
                      {r.value} {r.unit}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {getDeltaIcon(r.pain.delta)}
                      <span
                        className={`text-[11px] font-medium ${r.pain.color}`}
                      >
                        {r.pain.delta > 0 ? "+" : ""}
                        {t("comparison", { amount: r.pain.delta.toFixed(1) + "%" })}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.accent}`}
                  >
                    <r.icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{t("cost")}</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(r.cost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      {t("vsAverage")}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${vsAvg > 0 ? "text-destructive border-destructive/20" : "text-success border-success/20"}`}
                    >
                      {vsAvg > 0 ? "+" : ""}
                      {vsAvg.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{t("painLevel")}</span>
                    <span className={`font-medium ${r.pain.color}`}>
                      {t(r.pain.level)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Charts Tabs ── */}
      <Tabs defaultValue="costs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="costs" className="text-xs">
            {t("tabs.costs")}
          </TabsTrigger>
          <TabsTrigger value="consumption" className="text-xs">
            {t("tabs.consumption")}
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="text-xs">
            {t("tabs.breakdown")}
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">
            {t("tabs.trends")}
          </TabsTrigger>
          <TabsTrigger value="projection" className="text-xs">
            Hochrechnung
          </TabsTrigger>
        </TabsList>

        {/* Cost Tab */}
        <TabsContent value="costs">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("charts.monthlyCosts")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("charts.monthlyCostsDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.costTrend}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(220, 13%, 91%)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}€`}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar
                        dataKey="Strom"
                        stackId="a"
                        fill={CHART_COLORS.power}
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="Wasser"
                        stackId="a"
                        fill={CHART_COLORS.water}
                      />
                      <Bar
                        dataKey="Heizung"
                        stackId="a"
                        fill={CHART_COLORS.heating}
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("charts.totalCostTrend")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("charts.totalCostTrendDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics.costTrend}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="totalCostGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(350, 65%, 55%)"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(350, 65%, 55%)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(220, 13%, 91%)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}€`}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                      <Area
                        type="monotone"
                        dataKey="Gesamt"
                        stroke="hsl(350, 65%, 55%)"
                        strokeWidth={2}
                        fill="url(#totalCostGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consumption Tab */}
        <TabsContent value="consumption">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("charts.consumptionHistory")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("charts.consumptionHistoryDesc", { count: meterHistory.length })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={meterHistory}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(220, 13%, 91%)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar
                        dataKey="power"
                        name={t("power") + " (kWh)"}
                        fill={CHART_COLORS.power}
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="heating"
                        name={`${t("heating")} (${heatingUnit})`}
                        fill={CHART_COLORS.heating}
                        radius={[3, 3, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="water"
                        name={t("water") + " (m³)"}
                        stroke={CHART_COLORS.water}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        yAxisId={0}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("charts.waterTrend")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("charts.waterTrendDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={meterHistory}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="waterGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.water}
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.water}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(220, 13%, 91%)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area
                        type="monotone"
                        dataKey="water"
                        stroke={CHART_COLORS.water}
                        strokeWidth={2}
                        fill="url(#waterGrad)"
                        name={t("water") + " (m³)"}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("charts.costDistribution")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("charts.costDistributionDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.costBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {analytics.costBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number) => formatCurrency(v)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {analytics.costBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {item.name}: {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {t("charts.unitCosts")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t("charts.unitCostsDesc")}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-chart-1" />
                        <span>{t("power")}</span>
                      </div>
                      <span className="font-mono font-medium tabular-nums">
                        {analytics.latestPricePerKwh.toFixed(2)} €/kWh
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (analytics.latestPricePerKwh / 0.5) * 100,
                      )}
                      className="h-2"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t("averageOf", { amount: "0,32", unit: "kWh" })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-3.5 w-3.5 text-primary" />
                        <span>{t("water")}</span>
                      </div>
                      <span className="font-mono font-medium tabular-nums">
                        {analytics.latestPricePerM3.toFixed(2)} €/m³
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (analytics.latestPricePerM3 / 5.0) * 100,
                      )}
                      className="h-2"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t("averageOf", { amount: "2,20", unit: "m³" })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5 text-chart-4" />
                        <span>{t("heating")}</span>
                      </div>
                      <span className="font-mono font-medium tabular-nums">
                        {analytics.latestPricePerKwhHeating.toFixed(2)} €/{heatingUnit}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (analytics.latestPricePerKwhHeating / 0.2) * 100,
                      )}
                      className="h-2"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t("averageOf", { amount: "0,11", unit: heatingUnit })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Monatliche Veränderung (%)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Positiv = mehr Schmerz. Negativ = Hoffnung.
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.deltas}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(220, 13%, 91%)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v: number) => `${v.toFixed(1)}%`}
                      />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        type="monotone"
                        dataKey="powerDelta"
                        name="Strom"
                        stroke={CHART_COLORS.power}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="waterDelta"
                        name="Wasser"
                        stroke={CHART_COLORS.water}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="costDelta"
                        name="Gesamtkosten"
                        stroke={CHART_COLORS.heating}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Monatsvergleich
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Alle Monate auf einen Blick. Sortiert nach Schmerz.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[340px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sticky top-0 bg-card">
                          Monat
                        </TableHead>
                        <TableHead className="text-xs text-right sticky top-0 bg-card">
                          Strom
                        </TableHead>
                        <TableHead className="text-xs text-right sticky top-0 bg-card">
                          Wasser
                        </TableHead>
                        <TableHead className="text-xs text-right sticky top-0 bg-card">
                          Heizung
                        </TableHead>
                        <TableHead className="text-xs text-right sticky top-0 bg-card">
                          Gesamt
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...meterHistory].reverse().map((r) => {
                        const total = r.powerCost + r.waterCost + r.heatingCost;
                        const isMax = total === analytics.peakMonth.total;
                        const isMin = total === analytics.cheapestMonth.total;
                        return (
                          <TableRow
                            key={r.month}
                            className={
                              isMax
                                ? "bg-destructive/5"
                                : isMin
                                  ? "bg-success/5"
                                  : ""
                            }
                          >
                            <TableCell className="text-xs font-medium">
                              {r.month}
                              {isMax && (
                                <Badge
                                  variant="outline"
                                  className="ml-1.5 text-[9px] text-destructive border-destructive/20"
                                >
                                  Teuerster
                                </Badge>
                              )}
                              {isMin && (
                                <Badge
                                  variant="outline"
                                  className="ml-1.5 text-[9px] text-success border-success/20"
                                >
                                  Günstigster
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums">
                              {formatCurrency(r.powerCost)}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums">
                              {formatCurrency(r.waterCost)}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums">
                              {formatCurrency(r.heatingCost)}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums font-medium">
                              {formatCurrency(total)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projection Tab */}
        <TabsContent value="projection">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cost Projection Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Kostenprognose
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Basierend auf deinem bisherigen Verbrauch — so sieht deine
                  finanzielle Zukunft aus. Gestrichelt = Prognose.
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={analytics.projectionData}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="projGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(260, 60%, 55%)"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(260, 60%, 55%)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="projGradDashed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(260, 60%, 55%)"
                            stopOpacity={0.08}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(260, 60%, 55%)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(220, 13%, 91%)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 9, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                        angle={-30}
                        textAnchor="end"
                        height={45}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}\u202F€`}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(v, name) =>
                          v != null
                            ? [
                                formatCurrency(Number(v)),
                                String(name).replace("Prognose", "(Prognose)"),
                              ]
                            : ["-", String(name)]
                        }
                      />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                      <ReferenceLine
                        x={analytics.lastActualMonth}
                        stroke="hsl(220, 8%, 70%)"
                        strokeDasharray="3 3"
                        label={{
                          value: "Heute",
                          fontSize: 10,
                          fill: "hsl(220, 8%, 46%)",
                        }}
                      />
                      {/* Actual */}
                      <Area
                        type="monotone"
                        dataKey="Gesamt"
                        stroke="hsl(260, 60%, 55%)"
                        strokeWidth={2}
                        fill="url(#projGrad)"
                        name="Gesamt (Ist)"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Strom"
                        stroke={CHART_COLORS.power}
                        strokeWidth={1.5}
                        dot={false}
                        name="Strom (Ist)"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Wasser"
                        stroke={CHART_COLORS.water}
                        strokeWidth={1.5}
                        dot={false}
                        name="Wasser (Ist)"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Heizung"
                        stroke={CHART_COLORS.heating}
                        strokeWidth={1.5}
                        dot={false}
                        name="Heizung (Ist)"
                        connectNulls={false}
                      />
                      {/* Projected */}
                      <Line
                        type="monotone"
                        dataKey="GesamtPrognose"
                        stroke="hsl(260, 60%, 55%)"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        dot={{ r: 2, fill: "hsl(260, 60%, 55%)" }}
                        name="Gesamt (Prognose)"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="StromPrognose"
                        stroke={CHART_COLORS.power}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        dot={false}
                        name="Strom (Prognose)"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="WasserPrognose"
                        stroke={CHART_COLORS.water}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        dot={false}
                        name="Wasser (Prognose)"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="HeizungPrognose"
                        stroke={CHART_COLORS.heating}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        dot={false}
                        name="Heizung (Prognose)"
                        connectNulls={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Projected Annual Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Jahresprognose
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Hochgerechnete Kosten für die nächsten 12 Monate
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold tabular-nums">
                      {formatCurrency(analytics.projAnnualTotal)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Geschätztes Jahrestotal
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        label: "Strom",
                        value: analytics.projAnnualPowerCost,
                        icon: Zap,
                        color: CHART_COLORS.power,
                        iconClass: "text-chart-1",
                      },
                      {
                        label: "Wasser",
                        value: analytics.projAnnualWaterCost,
                        icon: Droplets,
                        color: CHART_COLORS.water,
                        iconClass: "text-primary",
                      },
                      {
                        label: "Heizung",
                        value: analytics.projAnnualHeatingCost,
                        icon: Flame,
                        color: CHART_COLORS.heating,
                        iconClass: "text-chart-4",
                      },
                    ].map((r) => (
                      <div key={r.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <r.icon className={`h-3 w-3 ${r.iconClass}`} />
                            <span>{r.label}</span>
                          </div>
                          <span className="font-medium tabular-nums">
                            {formatCurrency(r.value)}
                          </span>
                        </div>
                        <Progress
                          value={
                            analytics.projAnnualTotal > 0
                              ? (r.value / analytics.projAnnualTotal) * 100
                              : 0
                          }
                          className="h-1.5"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          ~ {formatCurrency(r.value / 12)}/Monat
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Trend-Info</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {analytics.projTrendDirection === "up"
                          ? "Deine Kosten zeigen einen steigenden Trend. Zeit für Sparmaßnahmen!"
                          : analytics.projTrendDirection === "down"
                            ? "Gute Nachrichten! Deine Kosten sind rückläufig."
                            : "Deine Kosten sind relativ stabil. Weiter so!"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Consumption Projection */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Verbrauchsprognose
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                So entwickelt sich dein Verbrauch voraussichtlich weiter.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={analytics.consumptionProjection}
                    margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(220, 13%, 91%)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 9, fill: "hsl(220, 8%, 46%)" }}
                      axisLine={false}
                      tickLine={false}
                      angle={-30}
                      textAnchor="end"
                      height={45}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                    <ReferenceLine
                      x={analytics.lastActualMonth}
                      stroke="hsl(220, 8%, 70%)"
                      strokeDasharray="3 3"
                    />
                    <Bar
                      dataKey="Strom"
                      name="Strom kWh (Ist)"
                      fill={CHART_COLORS.power}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="Heizung"
                      name="Heizung kWh (Ist)"
                      fill={CHART_COLORS.heating}
                      radius={[3, 3, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="Wasser"
                      name="Wasser m³ (Ist)"
                      stroke={CHART_COLORS.water}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="StromPrognose"
                      name="Strom (Prognose)"
                      stroke={CHART_COLORS.power}
                      strokeDasharray="4 3"
                      strokeWidth={2}
                      dot={{ r: 2, fill: CHART_COLORS.power }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="HeizungPrognose"
                      name="Heizung (Prognose)"
                      stroke={CHART_COLORS.heating}
                      strokeDasharray="4 3"
                      strokeWidth={2}
                      dot={{ r: 2, fill: CHART_COLORS.heating }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="WasserPrognose"
                      name="Wasser (Prognose)"
                      stroke={CHART_COLORS.water}
                      strokeDasharray="4 3"
                      strokeWidth={2}
                      dot={{ r: 2, fill: CHART_COLORS.water }}
                      connectNulls={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Meter Reading Input ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Neue Zählerstände erfassen
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Zeit für deinen monatlichen Termin mit den Zählerständen.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-chart-1" />
                <Label className="text-xs font-medium">Strom</Label>
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={`Verbrauch kWh (Letzter: ${latest.power})`}
                  value={powerInput}
                  onChange={(e) => setPowerInput(e.target.value)}
                  className="h-9 text-sm"
                />
                <Input
                  type="number"
                  placeholder={`Kosten € (Letzter: ${latest.powerCost?.toFixed(2)})`}
                  value={powerCostInput}
                  onChange={(e) => setPowerCostInput(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-primary" />
                <Label className="text-xs font-medium">Wasser</Label>
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={`Verbrauch m³ (Letzter: ${latest.water})`}
                  value={waterInput}
                  onChange={(e) => setWaterInput(e.target.value)}
                  className="h-9 text-sm"
                />
                <Input
                  type="number"
                  placeholder={`Kosten € (Letzter: ${latest.waterCost?.toFixed(2)})`}
                  value={waterCostInput}
                  onChange={(e) => setWaterCostInput(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-chart-4" />
                <Label className="text-xs font-medium">Heizung</Label>
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={`Verbrauch ${heatingUnit} (Letzter: ${latest.heating})`}
                  value={heatingInput}
                  onChange={(e) => setHeatingInput(e.target.value)}
                  className="h-9 text-sm"
                />
                <Input
                  type="number"
                  placeholder={`Kosten € (Letzter: ${latest.heatingCost?.toFixed(2)})`}
                  value={heatingCostInput}
                  onChange={(e) => setHeatingCostInput(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Speichert..." : "Speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
