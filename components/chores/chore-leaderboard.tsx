"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"

type LeaderboardEntry = {
    id: string
    name: string
    points: number
}

export function ChoreLeaderboard({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
    const t = useTranslations("Chores")

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    {t("leaderboard")}
                </CardTitle>
                <CardDescription>{t("leaderboardDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-2">
                    {leaderboard.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data yet.</p>
                    ) : (
                        leaderboard.map((entry, idx) => {
                            let icon = <Award className="h-4 w-4 text-muted-foreground" />
                            if (idx === 0) icon = <Trophy className="h-5 w-5 text-yellow-500" />
                            else if (idx === 1) icon = <Medal className="h-5 w-5 text-gray-400" />
                            else if (idx === 2) icon = <Medal className="h-5 w-5 text-amber-600" />

                            return (
                                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{entry.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold font-mono">{entry.points}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("pointsSuffix")}</p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
