import { DashboardLayout } from "@/components/dashboard-layout"
import { WasteManagement } from "@/components/waste/waste-management"
import { WasteCalendarView } from "@/components/waste/waste-calendar-view"
import { getWastePickups, getWasteTypes } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function WastePage() {
    const [pickups, wasteTypes] = await Promise.all([
        getWastePickups(),
        getWasteTypes(),
    ])
    const t = await getTranslations("Waste")

    return (
        <DashboardLayout
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <WasteManagement pickups={pickups} wasteTypes={wasteTypes} />
                </div>
                <div>
                    <WasteCalendarView pickups={pickups} />
                </div>
            </div>
        </DashboardLayout>
    )
}
