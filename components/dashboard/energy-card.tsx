"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type MeterReading } from "@/lib/data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function EnergyCard({ meterHistory }: { meterHistory: MeterReading[] }) {
  const latest = meterHistory[meterHistory.length - 1]
  const prev = meterHistory.length >= 2 ? meterHistory[meterHistory.length - 2] : latest
  const powerDelta = latest.power - prev.power

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Ressourcenfresser</CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground">
            Strom {powerDelta > 0 ? "+" : ""}
            {powerDelta} kWh ggue. Vormonat
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {"Wohin dein Geld verschwindet, visualisiert"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={meterHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 72%, 50%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(220, 72%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
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
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(220, 13%, 91%)",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
                }}
              />
              <Area
                type="monotone"
                dataKey="power"
                stroke="hsl(220, 72%, 50%)"
                strokeWidth={2}
                fill="url(#powerGrad)"
                name="Strom (kWh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
