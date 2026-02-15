"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Calendar } from "@/components/ui/calendar"
import { type WastePickup } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function WasteCalendarView({ pickups }: { pickups: WastePickup[] }) {
    // Create modifiers for each waste type based on their color/name
    const modifiers: Record<string, Date[]> = {}
    const modifierStyles: Record<string, React.CSSProperties> = {}
    const t = useTranslations("Waste.calendar")

    pickups.forEach((pickup) => {
        const date = new Date(pickup.date)
        const typeName = pickup.wasteType?.name || "unknown"

        if (!modifiers[typeName]) {
            modifiers[typeName] = []
        }
        modifiers[typeName].push(date)

        // Attempt to map tailwind-like color names to CSS colors if possible, 
        // but for now let's just use a default dot/indicator logic 
        // or better: use the color from the type if it's a hex or known class
    })

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <Calendar
                    mode="multiple"
                    selected={pickups.map(p => new Date(p.date))}
                    className="rounded-md border shadow"
                // We can't easily color individual days via standard react-day-picker props 
                // without deep CSS hackery in this specific UI component, 
                // so we'll use a legend and simple selection highlighting for now.
                />

                <div className="space-y-4 flex-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("legend")}</h4>
                    <div className="grid gap-2">
                        {Array.from(new Set(pickups.map(p => p.wasteType?.name))).map(name => {
                            const pickup = pickups.find(p => p.wasteType?.name === name)
                            return (
                                <div key={name} className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${!pickup?.wasteType?.color?.startsWith("#") ? `bg-${pickup?.wasteType?.color}` : ""}`}
                                        style={pickup?.wasteType?.color?.startsWith("#") ? { backgroundColor: pickup.wasteType.color } : {}}
                                    />
                                    <span className="text-sm">{name}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("upcoming")}</h4>
                        <div className="space-y-2">
                            {pickups
                                .filter(p => new Date(p.date).getTime() >= new Date().setHours(0, 0, 0, 0))
                                .slice(0, 3)
                                .map(p => (
                                    <div key={p.id} className="text-xs flex justify-between">
                                        <span>{p.wasteType?.name}</span>
                                        <span className="text-muted-foreground">
                                            {new Date(p.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
