"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Leaf, FileText, Package, Calendar } from "lucide-react"
import { type WastePickup } from "@/lib/data"
import Link from "next/link"

const iconMap: Record<string, any> = {
    Trash2,
    Leaf,
    FileText,
    Package,
}

export function WasteCard({ nextPickup }: { nextPickup: WastePickup | null }) {
    if (!nextPickup) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Müllkalender</CardTitle>
                    <p className="text-xs text-muted-foreground">Keine anstehenden Abholungen</p>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                        <Calendar className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs">Alle Tonnen sind geleert (hoffentlich).</p>
                        <Link href="/waste" className="mt-4 text-xs text-primary hover:underline">
                            Termine verwalten
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const Icon = iconMap[nextPickup.wasteType?.icon || "Trash2"] || Trash2
    const date = new Date(nextPickup.date)
    const isToday = new Date().toDateString() === date.toDateString()

    // Calculate relative time
    const diffTime = date.getTime() - new Date().setHours(0, 0, 0, 0)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let relativeText = `In ${diffDays} Tagen`
    if (diffDays === 0) relativeText = "Heute"
    if (diffDays === 1) relativeText = "Morgen"

    return (
        <Card className="h-full overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Müllabfuhr</CardTitle>
                    <Badge variant={isToday ? "destructive" : "secondary"} className="text-[10px] animate-pulse">
                        {relativeText}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Die Tonne wartet nicht auf dich</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 py-2">
                    <div
                        className={`p-3 rounded-full ${!nextPickup.wasteType?.color?.startsWith("#") ? `bg-${nextPickup.wasteType?.color}/10` : ""}`}
                        style={nextPickup.wasteType?.color?.startsWith("#") ? { backgroundColor: `${nextPickup.wasteType.color}1A` } : {}}
                    >
                        <Icon
                            className={`h-6 w-6 ${!nextPickup.wasteType?.color?.startsWith("#") ? `text-${nextPickup.wasteType?.color}` : ""}`}
                            style={nextPickup.wasteType?.color?.startsWith("#") ? { color: nextPickup.wasteType.color } : {}}
                        />
                    </div>
                    <div>
                        <p className="text-lg font-bold leading-tight">{nextPickup.wasteType?.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {date.toLocaleDateString("de-DE", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                    <Link href="/waste" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Vollständigen Kalender ansehen
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
