"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, ShieldCheck } from "lucide-react"
import { type Insurance } from "@/lib/data"

export function CoverageCheck({ insurances }: { insurances: Insurance[] }) {
    const t = useTranslations("Insurance")

    const checkResults = [
        {
            id: "liability",
            label: t("policyTypes.Private Liability"),
            required: true,
            found: insurances.some(i => i.policyType === "Private Liability"),
        },
        {
            id: "health",
            label: "Health Insurance", // Assuming generic or mapped
            required: true,
            // Logic: Check for explicit health insurance or ignore if statutory is assumed.
            // For this demo, let's assume if they have "Custom" with "Kranken" in name or specific type
            found: insurances.some(i => i.policyType === "Custom" && i.customPolicyType?.toLowerCase().includes("kranken")),
            ignore: true // Disabling this check for now as it's often statutory and not entered
        },
        {
            id: "disability",
            label: t("policyTypes.Disability"),
            required: true,
            found: insurances.some(i => i.policyType === "Disability"),
        },
        {
            id: "contents",
            label: t("policyTypes.Home Contents"),
            required: false,
            found: insurances.some(i => i.policyType === "Home Contents"),
        },
    ].filter(c => !c.ignore)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {t("coverage.title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {checkResults.map((check) => (
                        <div key={check.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${check.found ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : check.required ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"}`}>
                                    {check.found ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{check.label}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {check.found ? t("coverage.covered") : check.required ? t("coverage.missingEssential") : t("coverage.missingRecommended")}
                                    </span>
                                </div>
                            </div>
                            {check.found ? (
                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                                    {t("coverage.status.ok")}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className={check.required ? "border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900" : "border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900"}>
                                    {t("coverage.status.missing")}
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
