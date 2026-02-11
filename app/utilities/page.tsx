"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { UtilityTracker } from "@/components/utilities/utility-tracker"

export default function UtilitiesPage() {
  return (
    <DashboardLayout
      title={'Der Ressourcenfresser'}
      subtitle="Sieh deinem Geld in Echtzeit beim Verdampfen zu."
    >
      <UtilityTracker />
    </DashboardLayout>
  )
}
