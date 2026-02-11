"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { LendOMeter } from "@/components/lending/lend-o-meter"

export default function LendingPage() {
  return (
    <DashboardLayout
      title="Verleih-O-Meter"
      subtitle="Vertrauen wird verdient. Werkzeug wird geliehen. Belege werden aufbewahrt."
    >
      <LendOMeter />
    </DashboardLayout>
  )
}
