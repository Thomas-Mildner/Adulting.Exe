"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gauge, Zap, Droplets, Flame, Save } from "lucide-react"
import { updateUtilityTariffs } from "@/lib/actions"
import { toast } from "sonner"

interface UtilityTariffsSettingsProps {
  initialConfig: {
    electricityRate: number
    electricityBaseFee: number
    waterRate: number
    waterBaseFee: number
    heatingRate: number
    heatingBaseFee: number
  }
}

export function UtilityTariffsSettings({ initialConfig }: UtilityTariffsSettingsProps) {
  const t = useTranslations("Settings.tariffs")
  const [isPending, startTransition] = useTransition()

  const [electricityRate, setElectricityRate] = useState(
    initialConfig.electricityRate?.toString() || "0.35"
  )
  const [electricityBaseFee, setElectricityBaseFee] = useState(
    initialConfig.electricityBaseFee?.toString() || "10"
  )
  const [waterRate, setWaterRate] = useState(
    initialConfig.waterRate?.toString() || "2.5"
  )
  const [waterBaseFee, setWaterBaseFee] = useState(
    initialConfig.waterBaseFee?.toString() || "5"
  )
  const [heatingRate, setHeatingRate] = useState(
    initialConfig.heatingRate?.toString() || "0.12"
  )
  const [heatingBaseFee, setHeatingBaseFee] = useState(
    initialConfig.heatingBaseFee?.toString() || "15"
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        await updateUtilityTariffs({
          electricityRate: parseFloat(electricityRate) || 0,
          electricityBaseFee: parseFloat(electricityBaseFee) || 0,
          waterRate: parseFloat(waterRate) || 0,
          waterBaseFee: parseFloat(waterBaseFee) || 0,
          heatingRate: parseFloat(heatingRate) || 0,
          heatingBaseFee: parseFloat(heatingBaseFee) || 0,
        })
        toast.success(t("saved"))
      } catch {
        toast.error(t("error"))
      }
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <form onSubmit={handleSave} className="space-y-4">
          {/* Electricity */}
          <div className="space-y-2 p-3 rounded-lg border bg-card/50">
            <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
              <span>{t("electricity")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="elec-rate" className="text-[11px] text-muted-foreground">
                  {t("electricityRate")}
                </Label>
                <Input
                  id="elec-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="elec-base" className="text-[11px] text-muted-foreground">
                  {t("electricityBase")}
                </Label>
                <Input
                  id="elec-base"
                  type="number"
                  step="0.1"
                  min="0"
                  value={electricityBaseFee}
                  onChange={(e) => setElectricityBaseFee(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Water */}
          <div className="space-y-2 p-3 rounded-lg border bg-card/50">
            <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
              <Droplets className="h-3.5 w-3.5 text-blue-500" />
              <span>{t("water")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="water-rate" className="text-[11px] text-muted-foreground">
                  {t("waterRate")}
                </Label>
                <Input
                  id="water-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={waterRate}
                  onChange={(e) => setWaterRate(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="water-base" className="text-[11px] text-muted-foreground">
                  {t("waterBase")}
                </Label>
                <Input
                  id="water-base"
                  type="number"
                  step="0.1"
                  min="0"
                  value={waterBaseFee}
                  onChange={(e) => setWaterBaseFee(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Heating */}
          <div className="space-y-2 p-3 rounded-lg border bg-card/50">
            <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>{t("heating")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="heating-rate" className="text-[11px] text-muted-foreground">
                  {t("heatingRate")}
                </Label>
                <Input
                  id="heating-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={heatingRate}
                  onChange={(e) => setHeatingRate(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="heating-base" className="text-[11px] text-muted-foreground">
                  {t("heatingBase")}
                </Label>
                <Input
                  id="heating-base"
                  type="number"
                  step="0.1"
                  min="0"
                  value={heatingBaseFee}
                  onChange={(e) => setHeatingBaseFee(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="w-full gap-1.5 h-8 text-xs mt-2"
          >
            <Save className="h-3.5 w-3.5" />
            {isPending ? t("saving") : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
