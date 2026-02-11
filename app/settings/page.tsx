"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsPanel } from "@/components/settings/settings-panel"

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Einstellungen"
      subtitle="Konfiguriere deine digitale Festung."
    >
      <SettingsPanel />
    </DashboardLayout>
  )
}
