import { DashboardLayout } from "@/components/dashboard-layout"
import { UtilityTracker } from "@/components/utilities/utility-tracker"
import { getTranslations } from "next-intl/server"
import { getMeterReadings, getAppConfig } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function UtilitiesPage() {
  const [meterHistory, appConfig] = await Promise.all([
    getMeterReadings(),
    getAppConfig()
  ])
  const t = await getTranslations("Utilities")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <UtilityTracker meterHistory={meterHistory} heatingType={appConfig.heatingType} />
    </DashboardLayout>
  )
}
