"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { HouseHealth } from "@/components/dashboard/house-health"
import { MaintenanceCard } from "@/components/dashboard/maintenance-card"
import { LendingCard } from "@/components/dashboard/lending-card"
import { EnergyCard } from "@/components/dashboard/energy-card"
import { WarrantyOverview } from "@/components/dashboard/warranty-overview"

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Willkommen zurueck. Dein Haus hat dich vermisst.">
      <div className="space-y-6">
        <HouseHealth />
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-2">
          <MaintenanceCard />
          <WarrantyOverview />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <EnergyCard />
          <LendingCard />
        </div>
      </div>
    </DashboardLayout>
  )
}
