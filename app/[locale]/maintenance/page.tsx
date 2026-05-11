import { DashboardLayout } from "@/components/dashboard-layout"
import { MaintenanceManager } from "@/components/maintenance/maintenance-manager"
import { ModuleTutorial } from "@/components/tutorial/module-tutorial"
import { getMaintenanceTasks, getAppConfig } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
  const [tasks, appConfig, t] = await Promise.all([
    getMaintenanceTasks(),
    getAppConfig(),
    getTranslations("Maintenance"),
  ])

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ModuleTutorial
        moduleKey="maintenance"
        isFirstVisit={!appConfig.tutorialCompletedModules.includes("maintenance")}
      />
      <MaintenanceManager initialTasks={tasks} />
    </DashboardLayout>
  )
}
