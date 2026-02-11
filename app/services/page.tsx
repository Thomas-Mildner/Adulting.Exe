"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHub } from "@/components/services/service-hub"

export default function ServicesPage() {
  return (
    <DashboardLayout
      title={'Das Rettungsteam'}
      subtitle="Deine Handwerker-Avengers. Hoffentlich gehen sie ans Telefon."
    >
      <ServiceHub />
    </DashboardLayout>
  )
}
