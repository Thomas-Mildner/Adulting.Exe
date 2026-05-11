"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCarMaintenance, getFuelEntries, getTollEntries } from "@/lib/actions"
import type { CarMaintenance, FuelEntry, TollEntry } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function CostAnalytics({ carId }: { carId: string }) {
    const t = useTranslations("Garage")
    const [maintenance, setMaintenance] = useState<CarMaintenance[]>([])
    const [fuel, setFuel] = useState<FuelEntry[]>([])
    const [tolls, setTolls] = useState<TollEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const [m, f, t] = await Promise.all([
                getCarMaintenance(carId),
                getFuelEntries(carId),
                getTollEntries(carId),
            ])
            setMaintenance(m)
            setFuel(f)
            setTolls(t)
            setLoading(false)
        }
        fetchData()
    }, [carId])

    const stats = useMemo(() => {
        const maintenanceCost = maintenance.reduce((sum, item) => sum + item.cost, 0)
        const fuelCost = fuel.reduce((sum, item) => sum + item.totalCost, 0)
        const tollCost = tolls.reduce((sum, item) => sum + item.cost, 0)
        const totalCost = maintenanceCost + fuelCost + tollCost

        return { maintenanceCost, fuelCost, tollCost, totalCost }
    }, [maintenance, fuel, tolls])

    const chartData = useMemo(() => {
        return [
            { name: t("tabs.maintenance"), value: stats.maintenanceCost },
            { name: t("tabs.fuel"), value: stats.fuelCost },
            { name: t("fuel.tolls"), value: stats.tollCost },
        ].filter(item => item.value > 0)
    }, [stats, t])

    const monthlyData = useMemo(() => {
        const data = new Map<string, number>()
        const process = (date: string, cost: number) => {
            const month = date.substring(0, 7) // YYYY-MM
            data.set(month, (data.get(month) || 0) + cost)
        }

        maintenance.forEach(m => process(m.date, m.cost))
        fuel.forEach(f => process(f.date, f.totalCost))
        tolls.forEach(t => process(t.date, t.cost))

        return Array.from(data.entries())
            .map(([month, cost]) => ({ month, cost }))
            .sort((a, b) => a.month.localeCompare(b.month))
    }, [maintenance, fuel, tolls])

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
        </div>
    }

    if (stats.totalCost === 0) {
        return (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                {t("emptyState")}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>{t("costSummary.total")}</CardDescription>
                        <CardTitle className="text-2xl">€{stats.totalCost.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>{t("tabs.fuel")}</CardDescription>
                        <CardTitle className="text-2xl">€{stats.fuelCost.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>{t("tabs.maintenance")}</CardDescription>
                        <CardTitle className="text-2xl">€{stats.maintenanceCost.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>{t("fuel.tolls")}</CardDescription>
                        <CardTitle className="text-2xl">€{stats.tollCost.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("costSummary.distribution")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("costSummary.history")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
                                    <Bar dataKey="cost" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
