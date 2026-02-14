"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type MeterReading, formatCurrency } from "@/lib/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function EnergyCard({ meterHistory }: { meterHistory: MeterReading[] }) {
  const t = useTranslations("EnergyCard");

  if (!meterHistory || meterHistory.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {t("title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t("noData")}
          </p>
        </CardHeader>
      </Card>
    );
  }

  const latest = meterHistory[meterHistory.length - 1];
  const prev =
    meterHistory.length >= 2 ? meterHistory[meterHistory.length - 2] : latest;
  const latestTotal = latest.powerCost + latest.waterCost + latest.heatingCost;
  const prevTotal = prev.powerCost + prev.waterCost + prev.heatingCost;
  const costDelta = latestTotal - prevTotal;

  const chartData = meterHistory.map((r) => ({
    month: r.month,
    Gesamt: r.powerCost + r.waterCost + r.heatingCost,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {t("title")}
          </CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground">
            {costDelta > 0 ? "+" : ""}
            {t("comparison", { amount: formatCurrency(costDelta) })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(350, 65%, 55%)"
                    stopOpacity={0.15}
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
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(220, 13%, 91%)",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
                }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Area
                type="monotone"
                dataKey="Gesamt"
                stroke="hsl(350, 65%, 55%)"
                strokeWidth={2}
                fill="url(#powerGrad)"
                name={t("totalCost")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
