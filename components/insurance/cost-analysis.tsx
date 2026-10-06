"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"
import { type Insurance, formatCurrency } from "@/lib/data"
import { Euro, PieChart as PieChartIcon } from "lucide-react"

function calculateMonthlyPremium(amount: number, frequency: Insurance["paymentFrequency"]): number {
    if (frequency === "Monthly") return amount
    if (frequency === "Quarterly") return amount / 3
    if (frequency === "Annually") return amount / 12
    return 0
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export function CostAnalysis({ insurances }: { insurances: Insurance[] }) {
    const t = useTranslations("Insurance")

    const { monthlyData, policyTypes } = useMemo(() => {
        const data = [
            { name: "Jan" }, { name: "Feb" }, { name: "Mar" }, { name: "Apr" },
            { name: "May" }, { name: "Jun" }, { name: "Jul" }, { name: "Aug" },
            { name: "Sep" }, { name: "Oct" }, { name: "Nov" }, { name: "Dec" }
        ] as any[]

        // Initialize all months with 0 for all known types to ensure consistent stacking
        const types = new Set<string>()
        insurances.forEach(ins => {
            const type = ins.policyType === "Custom" ? (ins.customPolicyType || "Other") : t(`policyTypes.${ins.policyType}` as any)
            types.add(type)
        })
        const typeList = Array.from(types)

        data.forEach(month => {
            typeList.forEach(type => {
                month[type] = 0
            })
            month.total = 0 // Keep total for tooltip/reference if needed
        })

        insurances.forEach((ins) => {
            const amount = ins.premiumAmount
            const startMonth = new Date(ins.startDate).getMonth()
            const type = ins.policyType === "Custom" ? (ins.customPolicyType || "Other") : t(`policyTypes.${ins.policyType}` as any)

            const addToMonth = (monthIndex: number, val: number) => {
                data[monthIndex][type] += val
                data[monthIndex].total += val
            }

            if (ins.paymentFrequency === "Monthly") {
                for (let i = 0; i < 12; i++) addToMonth(i, amount)
            } else if (ins.paymentFrequency === "Quarterly") {
                for (let i = startMonth; i < 12; i += 3) addToMonth(i % 12, amount)
            } else if (ins.paymentFrequency === "Annually") {
                addToMonth(startMonth, amount)
            }
        })

        return { monthlyData: data, policyTypes: typeList }
    }, [insurances, t])

    const categoryData = useMemo(() => {
        const data: Record<string, number> = {}

        insurances.forEach(ins => {
            const type = ins.policyType === "Custom" ? (ins.customPolicyType || "Other") : t(`policyTypes.${ins.policyType}` as any)

            let annualCost = 0
            if (ins.paymentFrequency === "Monthly") annualCost = ins.premiumAmount * 12
            else if (ins.paymentFrequency === "Quarterly") annualCost = ins.premiumAmount * 4
            else annualCost = ins.premiumAmount

            data[type] = (data[type] || 0) + annualCost
        })

        return Object.entries(data)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
    }, [insurances, t])

    const totalAnnual = monthlyData.reduce((sum, item) => sum + item.total, 0)
    const averageMonthly = totalAnnual / 12

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Euro className="h-4 w-4" />
                        {t("analysis.monthlyCost")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}€`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="mb-2 font-medium text-[10px] uppercase text-muted-foreground">
                                                        {label}
                                                    </div>
                                                    <div className="grid gap-1">
                                                        {payload.map((entry: any, index: number) => (
                                                            entry.value > 0 && (
                                                                <div key={index} className="flex items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <div
                                                                            className="h-2 w-2 rounded-full"
                                                                            style={{ backgroundColor: entry.color }}
                                                                        />
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {entry.name}
                                                                        </span>
                                                                    </div>
                                                                    <span className="font-bold text-xs tabular-nums">
                                                                        {formatCurrency(entry.value)}
                                                                    </span>
                                                                </div>
                                                            )
                                                        ))}
                                                        <div className="mt-1 flex items-center justify-between border-t pt-1">
                                                            <span className="text-xs font-medium">Gesamt</span>
                                                            <span className="font-bold text-xs tabular-nums">
                                                                {formatCurrency(payload.reduce((sum, e) => sum + (e.value as number), 0))}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                {policyTypes.map((type, index) => (
                                    <Bar
                                        key={type}
                                        dataKey={type}
                                        stackId="a"
                                        fill={COLORS[index % COLORS.length]}
                                        radius={[0, 0, 0, 0]}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                            Ø {formatCurrency(averageMonthly)} / {t("paymentFrequency.Monthly").toLowerCase()}
                        </div>
                        <div className="font-medium">
                            Σ {formatCurrency(totalAnnual)} / {t("paymentFrequency.Annually").toLowerCase()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4" />
                        {t("analysis.costDistribution")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
