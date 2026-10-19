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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Coins, Ruler, Calendar } from "lucide-react"
import { updateLocalizationPreferences } from "@/lib/actions"
import { toast } from "sonner"

interface LocalizationSettingsProps {
  initialConfig: {
    currency?: string
    unitSystem?: string
    firstDayOfWeek?: number
  }
}

export function LocalizationSettings({ initialConfig }: LocalizationSettingsProps) {
  const t = useTranslations("Settings.localization")
  const [isPending, startTransition] = useTransition()

  const [currency, setCurrency] = useState(initialConfig.currency || "EUR")
  const [unitSystem, setUnitSystem] = useState(initialConfig.unitSystem || "metric")
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(
    (initialConfig.firstDayOfWeek ?? 1).toString()
  )

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    startTransition(async () => {
      try {
        await updateLocalizationPreferences({ currency: newCurrency })
        toast.success(t("saved"))
      } catch {
        toast.error(t("error"))
      }
    })
  }

  const handleUnitSystemChange = (newUnit: string) => {
    setUnitSystem(newUnit)
    startTransition(async () => {
      try {
        await updateLocalizationPreferences({ unitSystem: newUnit })
        toast.success(t("saved"))
      } catch {
        toast.error(t("error"))
      }
    })
  }

  const handleFirstDayChange = (newDay: string) => {
    setFirstDayOfWeek(newDay)
    startTransition(async () => {
      try {
        await updateLocalizationPreferences({ firstDayOfWeek: parseInt(newDay, 10) })
        toast.success(t("saved"))
      } catch {
        toast.error(t("error"))
      }
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currency */}
        <div className="grid gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            <Label htmlFor="currency-select" className="text-xs cursor-pointer">
              {t("currency")}
            </Label>
          </div>
          <Select
            value={currency}
            onValueChange={handleCurrencyChange}
            disabled={isPending}
          >
            <SelectTrigger id="currency-select" className="h-9 text-xs">
              <SelectValue placeholder={t("currencyPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">{t("currencies.EUR")}</SelectItem>
              <SelectItem value="USD">{t("currencies.USD")}</SelectItem>
              <SelectItem value="GBP">{t("currencies.GBP")}</SelectItem>
              <SelectItem value="CHF">{t("currencies.CHF")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Unit System */}
        <div className="grid gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Ruler className="h-3.5 w-3.5 text-blue-500" />
            <Label htmlFor="unit-system-select" className="text-xs cursor-pointer">
              {t("unitSystem")}
            </Label>
          </div>
          <Select
            value={unitSystem}
            onValueChange={handleUnitSystemChange}
            disabled={isPending}
          >
            <SelectTrigger id="unit-system-select" className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">{t("units.metric")}</SelectItem>
              <SelectItem value="imperial">{t("units.imperial")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* First Day of Week */}
        <div className="grid gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
            <Label htmlFor="first-day-select" className="text-xs cursor-pointer">
              {t("firstDayOfWeek")}
            </Label>
          </div>
          <Select
            value={firstDayOfWeek}
            onValueChange={handleFirstDayChange}
            disabled={isPending}
          >
            <SelectTrigger id="first-day-select" className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t("days.1")}</SelectItem>
              <SelectItem value="0">{t("days.0")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
