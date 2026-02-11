import { DashboardLayout } from "@/components/dashboard-layout"
import { MaintenanceManager } from "@/components/maintenance/maintenance-manager"
import { getMaintenanceTasks } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
  const tasks = await getMaintenanceTasks()

  return (
    <DashboardLayout
      title="Wartungen"
      subtitle="Planen. Prüfen. Abhaken. Dein Haus dankt es dir."
    >
      <MaintenanceManager initialTasks={tasks} />
    </DashboardLayout>
  )
}
