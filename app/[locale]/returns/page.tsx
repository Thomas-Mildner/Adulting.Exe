import { DashboardLayout } from "@/components/dashboard-layout"
import { ReturnsManager } from "@/components/returns/returns-manager"
import { getPackageReturns } from "@/lib/actions"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function ReturnsPage() {
    const returns = await getPackageReturns()
    const t = await getTranslations("Returns")

    return (
        <DashboardLayout
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <ReturnsManager initialReturns={returns} />
        </DashboardLayout>
    )
}
