"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Library } from "@/components/library/library"

export default function LibraryPage() {
  return (
    <DashboardLayout
      title="Die Bibliothek"
      subtitle="Alle Anleitungen, die du erst oeffnest, wenn etwas kaputtgeht."
    >
      <Library />
    </DashboardLayout>
  )
}
