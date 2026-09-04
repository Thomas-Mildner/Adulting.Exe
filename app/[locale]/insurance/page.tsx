import { DashboardLayout } from "@/components/dashboard-layout"
import { InsuranceList } from "@/components/insurance/insurance-list"
import { CostAnalysis } from "@/components/insurance/cost-analysis"
import { CoverageCheck } from "@/components/insurance/coverage-check"
import { RenewalCalendar } from "@/components/insurance/renewal-calendar"
import { getTranslations } from "next-intl/server"
import { getInsurances } from "@/lib/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function InsurancePage() {
  const insurances = await getInsurances()
  const t = await getTranslations("Insurance")

  return (
    <DashboardLayout
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">{t("list.title")}</TabsTrigger>
          <TabsTrigger value="analysis">{t("analysis.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-1 md:col-span-2 lg:col-span-5">
              <InsuranceList insurances={insurances} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
              <RenewalCalendar insurances={insurances} />
              <CoverageCheck insurances={insurances} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <CostAnalysis insurances={insurances} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
