import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { HouseHealth } from "@/components/dashboard/house-health"
import { MaintenanceCard } from "@/components/dashboard/maintenance-card"
import { LendingCard } from "@/components/dashboard/lending-card"
import { EnergyCard } from "@/components/dashboard/energy-card"
import { WarrantyOverview } from "@/components/dashboard/warranty-overview"
import { WasteCard } from "@/components/dashboard/waste-card"
import { DocumentsCard } from "@/components/dashboard/documents-card"
import {
  getAppliances,
  getMaintenanceTasks,
  getLentItems,
  getMeterReadings,
  getTotalTaxDeductible,
  getNextWastePickup,
  getIdentityDocuments,
} from "@/lib/actions"

export const dynamic = "force-dynamic"

import { getTranslations } from "next-intl/server"

export default async function DashboardPage() {
  const [appliances, maintenanceTasks, lentItems, meterHistory, taxDeductible, t, nextWastePickup, documents] =
    await Promise.all([
      getAppliances(),
      getMaintenanceTasks(),
      getLentItems(),
      getMeterReadings(),
      getTotalTaxDeductible(),
      getTranslations("Dashboard"),
      getNextWastePickup(),
      getIdentityDocuments(),
    ])

  return (
    <DashboardLayout title={t("welcome")} subtitle={t("subtitle")}>
      <div className="space-y-6">
        <HouseHealth appliances={appliances} maintenanceTasks={maintenanceTasks} lentItems={lentItems} />
        <StatsCards appliances={appliances} maintenanceTasks={maintenanceTasks} taxDeductible={taxDeductible} />
        <div className="grid gap-6 lg:grid-cols-3">
          <WasteCard nextPickup={nextWastePickup} />
          <MaintenanceCard initialTasks={maintenanceTasks} />
          <DocumentsCard documents={documents} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <WarrantyOverview appliances={appliances} />
          <EnergyCard meterHistory={meterHistory} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <LendingCard lentItems={lentItems} />
        </div>
      </div>
    </DashboardLayout>
  )
}
