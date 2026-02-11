"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { VaultGrid } from "@/components/vault/vault-grid"

export default function VaultPage() {
  return (
    <DashboardLayout
      title="Der Garantie- & Kartontresor"
      subtitle="Wo Quittungen ihr bestes Leben fuehren."
    >
      <VaultGrid />
    </DashboardLayout>
  )
}
