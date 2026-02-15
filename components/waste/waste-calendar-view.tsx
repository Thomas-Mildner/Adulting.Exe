"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Calendar } from "@/components/ui/calendar"
import { type WastePickup } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const colorToHex: Record<string, string> = {
    "green-500": "#22c55e",
    "blue-500": "#3b82f6",
    "yellow-500": "#eab308",
    "gray-500": "#6b7280",
    "orange-500": "#f97316",
    "purple-500": "#a855f7",
    "red-500": "#ef4444",
    "amber-800": "#92400e",
    "black": "#000000"
}

export function WasteCalendarView({ pickups }: { pickups: WastePickup[] }) {
    const t = useTranslations("Waste.calendar")

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
                    modifiers={
                        pickups.reduce((acc, pickup) => {
                            const color = pickup.wasteType?.color
                            if (!color) return acc

                            const hex = colorToHex[color] || color

                            if (!acc[hex]) {
                                acc[hex] = []
                            }
                            acc[hex].push(new Date(pickup.date))

                            return acc
                        }, {} as Record<string, Date[]>)
                    }
                    modifiersStyles={
                        pickups.reduce((acc, pickup) => {
                            const color = pickup.wasteType?.color
                            if (!color) return acc

                            const hex = colorToHex[color] || color
                            acc[hex] = {
                                backgroundColor: hex,
                                color: 'white',
                                borderRadius: '100%',
                            }
                            return acc
                        }, {} as Record<string, React.CSSProperties>)
                    }
                />

                <div className="space-y-4 flex-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("legend")}</h4>
                    <div className="grid gap-2">
                        {Array.from(new Set(pickups.map(p => p.wasteType?.name))).map(name => {
                            const pickup = pickups.find(p => p.wasteType?.name === name)
                            if (!pickup?.wasteType) return null

                            const colorKey = pickup.wasteType.color
                            const hex = colorToHex[colorKey] || colorKey // Fallback to key if it's a hex or unknown
                            const isHex = hex.startsWith("#")

                            return (
                                <div key={name} className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${!isHex ? `bg-${colorKey}` : ""}`}
                                        style={isHex ? { backgroundColor: hex } : {}}
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
