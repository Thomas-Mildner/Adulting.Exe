import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { HouseHealth } from "@/components/dashboard/house-health"
import { MaintenanceCard } from "@/components/dashboard/maintenance-card"
import { LendingCard } from "@/components/dashboard/lending-card"
import { EnergyCard } from "@/components/dashboard/energy-card"
import { WarrantyOverview } from "@/components/dashboard/warranty-overview"
import {
  getAppliances,
  getMaintenanceTasks,
  getLentItems,
  getMeterReadings,
  getTotalTaxDeductible,
} from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [appliances, maintenanceTasks, lentItems, meterHistory, taxDeductible] =
    await Promise.all([
      getAppliances(),
      getMaintenanceTasks(),
      getLentItems(),
      getMeterReadings(),
      getTotalTaxDeductible(),
    ])

  return (
    <DashboardLayout title="Dashboard" subtitle="Willkommen zurück. Dein Haus hat dich vermisst.">
      <div className="space-y-6">
        <HouseHealth appliances={appliances} maintenanceTasks={maintenanceTasks} lentItems={lentItems} />
        <StatsCards appliances={appliances} maintenanceTasks={maintenanceTasks} taxDeductible={taxDeductible} />
        <div className="grid gap-6 lg:grid-cols-2">
          <MaintenanceCard initialTasks={maintenanceTasks} />
          <WarrantyOverview appliances={appliances} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <EnergyCard meterHistory={meterHistory} />
          <LendingCard lentItems={lentItems} />
        </div>
      </div>
    </DashboardLayout>
  )
}
