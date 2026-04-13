import { DashboardLayout } from "@/components/dashboard-layout"
import { WasteManagement } from "@/components/waste/waste-management"
import { WasteCalendarView } from "@/components/waste/waste-calendar-view"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getWastePickups, getWasteTypes, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function WastePage() {
    const [pickups, wasteTypes, appConfig, t] = await Promise.all([
        getWastePickups(),
        getWasteTypes(),
        getAppConfig(),
        getTranslations("Waste"),
    ])

    return (
        <DashboardLayout
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <ModuleTutorial
                moduleKey="waste"
                isFirstVisit={!appConfig.tutorialCompletedModules.includes("waste")}
            />
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
