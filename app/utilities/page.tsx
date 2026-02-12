import { DashboardLayout } from "@/components/dashboard-layout"
import { UtilityTracker } from "@/components/utilities/utility-tracker"
import { getMeterReadings, getAppConfig } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function UtilitiesPage() {
  const [meterHistory, appConfig] = await Promise.all([
    getMeterReadings(),
    getAppConfig()
  ])

  return (
    <DashboardLayout
      title={'Der Ressourcenfresser'}
      subtitle="Sieh deinem Geld in Echtzeit beim Verdampfen zu."
    >
      <UtilityTracker meterHistory={meterHistory} heatingType={appConfig.heatingType} />
    </DashboardLayout>
  )
}
