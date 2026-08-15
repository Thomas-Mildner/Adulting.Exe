import { DashboardLayout } from "@/components/dashboard-layout"
import { getTranslations } from "next-intl/server"
import { getChores, getChoreLeaderboard, getPersons } from "@/lib/actions"
import { ChoresList } from "@/components/chores/chores-list"
import { ChoreLeaderboard } from "@/components/chores/chore-leaderboard"

export const dynamic = "force-dynamic"

export default async function ChoresPage() {
    const t = await getTranslations("Chores")
    const [chores, leaderboard, persons] = await Promise.all([
        getChores(),
        getChoreLeaderboard(),
        getPersons()
    ])

    return (
        <DashboardLayout
            title={t("title")}
            subtitle={t("subtitle")}
        >
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 h-[80vh]">
                    <ChoresList initialChores={chores} persons={persons} />
                </div>
                <div className="lg:col-span-1 h-[80vh]">
                    <ChoreLeaderboard leaderboard={leaderboard} />
                </div>
            </div>
        </DashboardLayout>
    )
}
