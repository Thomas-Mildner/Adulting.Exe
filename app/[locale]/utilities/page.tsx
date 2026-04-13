import { DashboardLayout } from "@/components/dashboard-layout"
import { UtilityTracker } from "@/components/utilities/utility-tracker"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getTranslations } from "next-intl/server"
import { getMeterReadings, getAppConfig } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function UtilitiesPage() {
  const [meterHistory, appConfig, t] = await Promise.all([
    getMeterReadings(),
    getAppConfig(),
    getTranslations("Utilities"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="utilities"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("utilities")}
      />
      <UtilityTracker meterHistory={meterHistory} heatingType={appConfig.heatingType} />
    </DashboardLayout>
  )
}
