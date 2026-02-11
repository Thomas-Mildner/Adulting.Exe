import { DashboardLayout } from "@/components/dashboard-layout"
import { UtilityTracker } from "@/components/utilities/utility-tracker"
import { getMeterReadings } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function UtilitiesPage() {
  const meterHistory = await getMeterReadings()

  return (
    <DashboardLayout
      title={'Der Ressourcenfresser'}
      subtitle="Sieh deinem Geld in Echtzeit beim Verdampfen zu."
    >
      <UtilityTracker meterHistory={meterHistory} />
    </DashboardLayout>
  )
}
