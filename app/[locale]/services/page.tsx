import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHub } from "@/components/services/service-hub"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getServiceProviders, getInvoices, getAppConfig } from "@/lib/actions"

import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  const [serviceProviders, invoices, appConfig, t] = await Promise.all([
    getServiceProviders(),
    getInvoices(),
    getAppConfig(),
    getTranslations("Services"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="services"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("services")}
      />
      <ServiceHub serviceProviders={serviceProviders} invoices={invoices} />
    </DashboardLayout>
  )
}
