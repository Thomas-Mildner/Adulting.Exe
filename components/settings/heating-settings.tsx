"use client"

import { useTranslations } from "next-intl"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateHeatingType } from "@/lib/actions"
import { Flame } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const heatingTypes = [
    { value: "Gas", label: "Gas (m³)" },
    { value: "Oil", label: "Öl (Liter)" },
    { value: "Fernwärme", label: "Fernwärme (kWh)" }, // Sometimes MWh, but let's stick to kWh for now
    { value: "Wärmepumpe", label: "Wärmepumpe (kWh)" },
    { value: "Pellets", label: "Pellets (kg)" },
]

export function HeatingSettings({ currentType }: { currentType: string }) {
    const t = useTranslations("Settings.heating")
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState(currentType)

    function handleChange(newValue: string) {
        setValue(newValue)
        startTransition(async () => {
            try {
                await updateHeatingType(newValue)
                toast.success(t("success"))
            } catch (e) {
                toast.error(t("error"))
            }
        })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                    {t("description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <Label htmlFor="heating-type" className="sr-only">
                        Heizungstyp
                    </Label>
                    <Select value={value} onValueChange={handleChange} disabled={isPending}>
                        <SelectTrigger id="heating-type">
                            <SelectValue placeholder={t("placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {heatingTypes.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
