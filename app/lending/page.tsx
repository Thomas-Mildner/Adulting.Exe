import { DashboardLayout } from "@/components/dashboard-layout"
import { LendOMeter } from "@/components/lending/lend-o-meter"
import { getLentItems } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function LendingPage() {
  const lentItems = await getLentItems()

  return (
    <DashboardLayout
      title="Verleih-O-Meter"
      subtitle="Vertrauen wird verdient. Werkzeug wird geliehen. Belege werden aufbewahrt."
    >
      <LendOMeter lentItems={lentItems} />
    </DashboardLayout>
  )
}
