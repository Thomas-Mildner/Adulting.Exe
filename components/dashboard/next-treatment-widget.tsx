import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getSoilTreatments } from "@/lib/actions"
import { TestTube2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { de, enUS } from "date-fns/locale"
// Normally you'd get the locale from the request headers or context, but since this is a server component 
// running within the localized tree, we will assume English as default or we can get it if passed as prop.

export async function NextTreatmentWidget({ locale }: { locale: string }) {
    const treatments = await getSoilTreatments()
    const dateLocale = locale === "de" ? de : enUS

    // Find the most recent treatment, or assume some default schedule.
    // Real world implementation might use "MaintenanceTasks" to find *future* scheduled treatments
    // Since `SoilTreatment` only records past entries, we'll show the "Last Treatment" 
    // and suggest when the next one is due (e.g., 3 months later).

    const lastTreatment = treatments.length > 0 ? treatments[0] : null

    let content = null

    if (!lastTreatment) {
        content = (
            <div className="text-sm text-muted-foreground p-4 text-center">
                No treatments logged yet.
            </div>
        )
    } else {
        // Arbitrary simple rule: Next treatment is 60 days after the last one
        const nextDate = new Date(lastTreatment.date)
        nextDate.setDate(nextDate.getDate() + 60)

        const isOverdue = nextDate < new Date()

        content = (
            <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-full ${isOverdue ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}>
                            <TestTube2 className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none">
                                {isOverdue ? "Overdue" : "Next Treatment"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Based on: {lastTreatment.type}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-sm font-medium ${isOverdue ? "text-red-500" : ""}`}>
                            {format(nextDate, "MMM d, yyyy", { locale: dateLocale })}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center">
                    <TestTube2 className="h-4 w-4 mr-2" />
                    Outdoor & Garden
                </CardTitle>
                <CardDescription>Estimated upcoming care</CardDescription>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}
