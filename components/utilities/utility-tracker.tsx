"use client";

import { useState, useMemo } from "react";
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
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────

function getPainLevel(current: number, previous: number) {
  const delta = ((current - previous) / previous) * 100;
  if (delta > 10)
    return { level: "Existenzielle Angst", color: "text-destructive", delta };
  if (delta > 5)
    return { level: "Leichte Panik", color: "text-chart-3", delta };
  if (delta > 0)
    return { level: "Leichte Sorge", color: "text-chart-3", delta };
  if (delta === 0) return { level: "Zen", color: "text-success", delta };
  return { level: "Überraschend gut", color: "text-success", delta };
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
    return { grade: "A+", label: "Vorbildlich", color: "text-success" };
  if (avgDelta <= -5)
    return { grade: "A", label: "Sehr gut", color: "text-success" };
  if (avgDelta <= 0) return { grade: "B", label: "Gut", color: "text-primary" };
  if (avgDelta <= 5)
    return { grade: "C", label: "Ausbaufähig", color: "text-chart-3" };
  if (avgDelta <= 10)
    return { grade: "D", label: "Kritisch", color: "text-destructive" };
  return { grade: "F", label: "Katastrophe", color: "text-destructive" };
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

// ─── Component ──────────────────────────────────────────────────────────

export function UtilityTracker({
  meterHistory,
}: {
  meterHistory: MeterReading[];
}) {
  const [powerInput, setPowerInput] = useState("");
  const [waterInput, setWaterInput] = useState("");
  const [heatingInput, setHeatingInput] = useState("");
  const [powerCostInput, setPowerCostInput] = useState("");
  const [waterCostInput, setWaterCostInput] = useState("");
  const [heatingCostInput, setHeatingCostInput] = useState("");
  const [saving, setSaving] = useState(false);

  const latest =
    meterHistory.length > 0 ? meterHistory[meterHistory.length - 1] : null;
  const prev =
    meterHistory.length >= 2 ? meterHistory[meterHistory.length - 2] : latest;

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nebenkosten-Tracker</CardTitle>
          <p className="text-sm text-muted-foreground">
            Noch keine Zählerstände vorhanden – erfasse deinen ersten Monat
            oben.
          </p>
        </CardHeader>
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
      label: "Strom",
      unit: "kWh",
      value: latest.power,
      cost: latest.powerCost,
      icon: Zap,
      pain: powerPain,
      accent: "bg-chart-1/10 text-chart-1",
      avg: analytics.avgPower,
    },
    {
      label: "Wasser",
      unit: "m\u00B3",
      value: latest.water,
      cost: latest.waterCost,
      icon: Droplets,
      pain: waterPain,
      accent: "bg-primary/10 text-primary",
      avg: analytics.avgWater,
    },
    {
      label: "Heizung",
      unit: "kWh",
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
                  Gesamtkosten
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(analytics.totalCost)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Über {meterHistory.length} Monate
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
                  Ø Monat
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(analytics.avgMonthlyCost)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Hochrechnung: {formatCurrency(analytics.yearProjection)}/Jahr
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
                  Effizienz-Note
                </p>
                <p
                  className={`text-lg font-bold ${analytics.efficiency.color}`}
                >
                  {analytics.efficiency.grade}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {analytics.efficiency.label} (letzte 3 Monate)
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
                  Letztes Quartal
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(analytics.qCost)}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Teuerster: {analytics.peakMonth.month} (
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
                        {r.pain.delta.toFixed(1)}% ggü. Vormonat
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
                    <span className="text-muted-foreground">Kosten</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(r.cost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      vs. Durchschnitt
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
                    <span className="text-muted-foreground">Schmerzlevel</span>
                    <span className={`font-medium ${r.pain.color}`}>
                      {r.pain.level}
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="costs" className="text-xs">
            Kosten
          </TabsTrigger>
          <TabsTrigger value="consumption" className="text-xs">
            Verbrauch
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="text-xs">
            Verteilung
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Cost Tab */}
        <TabsContent value="costs">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Monatliche Kosten
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Aufgeschlüsselt nach Ressource — sieh deinem Geld beim
                  Verdampfen zu.
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
                  Gesamtkosten-Verlauf
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Die Kurve deines finanziellen Schmerzes.
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
                  Verbrauchshistorie
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {meterHistory.length}-Monats-Überblick. Halt dich fest.
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
                        name="Strom (kWh)"
                        fill={CHART_COLORS.power}
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="heating"
                        name="Heizung (kWh)"
                        fill={CHART_COLORS.heating}
                        radius={[3, 3, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="water"
                        name="Wasser (m³)"
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
                  Wasserverbrauch-Trend
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Jeder Tropfen zählt. Wortwörtlich.
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
                        name="Wasser (m³)"
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
                  Kostenverteilung
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Wo dein Geld wirklich hingeht.
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
                  Stückkosten
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Was dich jede Einheit tatsächlich kostet.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-chart-1" />
                        <span>Strom</span>
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
                      Bundesdurchschnitt: ~0,32 €/kWh
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-3.5 w-3.5 text-primary" />
                        <span>Wasser</span>
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
                      Bundesdurchschnitt: ~2,20 €/m³
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5 text-chart-4" />
                        <span>Heizung</span>
                      </div>
                      <span className="font-mono font-medium tabular-nums">
                        {analytics.latestPricePerKwhHeating.toFixed(2)} €/kWh
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
                      Bundesdurchschnitt: ~0,11 €/kWh
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
                  placeholder={`Verbrauch kWh (Letzter: ${latest.heating})`}
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
