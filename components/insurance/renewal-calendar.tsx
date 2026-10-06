"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, AlertCircle } from "lucide-react"
import { type Insurance, getDaysRemaining } from "@/lib/data"

export function RenewalCalendar({ insurances }: { insurances: Insurance[] }) {
    const t = useTranslations("Insurance")

    const upcomingRenewals = insurances
        .map(ins => ({
            ...ins,
            daysRemaining: getDaysRemaining(ins.cancellationDeadline)
        }))
        .filter(ins => ins.daysRemaining >= 0) // Only future deadlines
        .sort((a, b) => a.daysRemaining - b.daysRemaining)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {t("calendar.title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {upcomingRenewals.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            {t("calendar.empty")}
                        </p>
                    ) : (
                        upcomingRenewals.map((item) => (
                            <div key={item.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-md ${item.daysRemaining <= 30 ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" : item.daysRemaining <= 90 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" : "bg-muted text-muted-foreground"}`}>
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{item.providerName}</h4>
                                        <p className="text-[10px] text-muted-foreground">
                                            {t("calendar.deadline")}: {new Date(item.cancellationDeadline).toLocaleDateString("de-DE")}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={item.daysRemaining <= 30 ? "destructive" : item.daysRemaining <= 90 ? "secondary" : "outline"}>
                                        {item.daysRemaining} {t("calendar.days")}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
