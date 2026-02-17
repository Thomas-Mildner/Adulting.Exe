import { DashboardLayout } from "@/components/dashboard-layout"
import { MaintenanceManager } from "@/components/maintenance/maintenance-manager"
import { getMaintenanceTasks } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
  const tasks = await getMaintenanceTasks()
  const t = await getTranslations("Maintenance")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <MaintenanceManager initialTasks={tasks} />
    </DashboardLayout>
  )
}
