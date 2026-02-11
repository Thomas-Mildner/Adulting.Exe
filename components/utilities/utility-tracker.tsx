"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { type MeterReading } from "@/lib/data"
import { createMeterReading } from "@/lib/actions"
import { Zap, Droplets, Flame, TrendingUp } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

function getPainLevel(current: number, previous: number) {
  const delta = ((current - previous) / previous) * 100
  if (delta > 10) return { level: "Existenzielle Angst", color: "text-destructive" }
  if (delta > 5) return { level: "Leichte Panik", color: "text-chart-3" }
  if (delta > 0) return { level: "Leichte Sorge", color: "text-chart-3" }
  if (delta === 0) return { level: "Zen", color: "text-success" }
  return { level: "Ueberraschend gut", color: "text-success" }
}

export function UtilityTracker({ meterHistory }: { meterHistory: MeterReading[] }) {
  const [powerInput, setPowerInput] = useState("")
  const [waterInput, setWaterInput] = useState("")
  const [heatingInput, setHeatingInput] = useState("")
  const [saving, setSaving] = useState(false)

  const latest = meterHistory[meterHistory.length - 1]
  const prev = meterHistory.length >= 2 ? meterHistory[meterHistory.length - 2] : latest

  const powerPain = getPainLevel(latest.power, prev.power)
  const waterPain = getPainLevel(latest.water, prev.water)
  const heatingPain = getPainLevel(latest.heating, prev.heating)

  const handleSave = async () => {
    if (!powerInput && !waterInput && !heatingInput) return
    setSaving(true)
    const now = new Date()
    const month = now.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    await createMeterReading({
      month,
      power: powerInput ? parseFloat(powerInput) : latest.power,
      water: waterInput ? parseFloat(waterInput) : latest.water,
      heating: heatingInput ? parseFloat(heatingInput) : latest.heating,
    })
    setPowerInput("")
    setWaterInput("")
    setHeatingInput("")
    setSaving(false)
  }

  const resources = [
    {
      label: "Strom",
      value: `${latest.power} kWh`,
      icon: Zap,
      pain: powerPain,
      accent: "bg-chart-1/10 text-chart-1",
    },
    {
      label: "Wasser",
      value: `${latest.water} m\u00B3`,
      icon: Droplets,
      pain: waterPain,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Heizung",
      value: `${latest.heating} kWh`,
      icon: Flame,
      pain: heatingPain,
      accent: "bg-chart-4/10 text-chart-4",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current readings with pain levels */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {resources.map((r) => (
          <Card key={r.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {r.label}
                  </p>
                  <p className="text-2xl font-semibold tabular-nums text-foreground tracking-tight">
                    {r.value}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <TrendingUp className={`h-3 w-3 ${r.pain.color}`} />
                    <span className={`text-[11px] font-medium ${r.pain.color}`}>
                      Schmerzlevel: {r.pain.level}
                    </span>
                  </div>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.accent}`}>
                  <r.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Verbrauchshistorie
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {"6-Monats-Ueberblick. Halt dich fest."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meterHistory}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
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
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid hsl(220, 13%, 91%)",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,.05)",
                    }}
                  />
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Bar
                    dataKey="power"
                    name="Strom (kWh)"
                    fill="hsl(220, 72%, 50%)"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="heating"
                    name="Heizung (kWh)"
                    fill="hsl(350, 65%, 55%)"
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
              Wasserverbrauch-Trend
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {"Jeder Tropfen zaehlt. Wortwrtlich."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={meterHistory}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(220, 72%, 50%)"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(220, 72%, 50%)"
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
                    dataKey="water"
                    stroke="hsl(220, 72%, 50%)"
                    strokeWidth={2}
                    fill="url(#waterGrad)"
                    name="Wasser (m\u00B3)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meter reading input */}
      <Card>
        <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Neue Zaehlerstaende erfassen
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {"Zeit fuer deinen monatlichen Termin mit den Zaehlerstaenden."}
            </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="power" className="text-xs">
                Strom (kWh)
              </Label>
              <Input
                id="power"
                type="number"
                placeholder={`Letzter: ${latest.power}`}
                value={powerInput}
                onChange={(e) => setPowerInput(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="water" className="text-xs">
                Wasser (m{"\u00B3"})
              </Label>
              <Input
                id="water"
                type="number"
                placeholder={`Letzter: ${latest.water}`}
                value={waterInput}
                onChange={(e) => setWaterInput(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heating" className="text-xs">
                Heizung (kWh)
              </Label>
              <Input
                id="heating"
                type="number"
                placeholder={`Letzter: ${latest.heating}`}
                value={heatingInput}
                onChange={(e) => setHeatingInput(e.target.value)}
                className="h-9 text-sm"
              />
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
  )
}
