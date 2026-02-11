import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHub } from "@/components/services/service-hub"
import { getServiceProviders, getInvoices } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  const [serviceProviders, invoices] = await Promise.all([
    getServiceProviders(),
    getInvoices(),
  ])

  return (
    <DashboardLayout
      title={'Das Rettungsteam'}
      subtitle="Deine Handwerker-Avengers. Hoffentlich gehen sie ans Telefon."
    >
      <ServiceHub serviceProviders={serviceProviders} invoices={invoices} />
    </DashboardLayout>
  )
}
