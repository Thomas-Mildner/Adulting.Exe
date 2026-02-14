import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHub } from "@/components/services/service-hub"
import { getServiceProviders, getInvoices } from "@/lib/actions"

import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  const [serviceProviders, invoices, t] = await Promise.all([
    getServiceProviders(),
    getInvoices(),
    getTranslations("Services"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ServiceHub serviceProviders={serviceProviders} invoices={invoices} />
    </DashboardLayout>
  )
}
