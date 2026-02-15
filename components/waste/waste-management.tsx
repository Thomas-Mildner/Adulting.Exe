"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Calendar as CalendarIcon, Leaf, FileText, Package, X, Upload, Info } from "lucide-react"
import { type WastePickup, type WasteType } from "@/lib/data"
import { createWastePickup, deleteWastePickup, importIcsWastePickups } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const iconMap: Record<string, any> = {
    Trash2,
    Leaf,
    FileText,
    Package,
}

const colorToHex: Record<string, string> = {
    "green-500": "#22c55e",
    "blue-500": "#3b82f6",
    "yellow-500": "#eab308",
    "gray-500": "#6b7280",
    "orange-500": "#f97316",
    "purple-500": "#a855f7",
    "red-500": "#ef4444",
    "amber-800": "#92400e",
    "black": "#000000"
}

export function WasteManagement({
    pickups,
    wasteTypes
}: {
    pickups: WastePickup[],
    wasteTypes: WasteType[]
}) {
    const [isAdding, setIsAdding] = useState(false)
    const [date, setDate] = useState("")
    const [typeId, setTypeId] = useState("")
    const [recurring, setRecurring] = useState<"none" | "weekly" | "bi-weekly" | "monthly" | "4-weekly">("none")
    const [isUploading, setIsUploading] = useState(false)
    const t = useTranslations("Waste")

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date || !typeId) return
        try {
            await createWastePickup({ date, wasteTypeId: typeId, recurring })
            setIsAdding(false)
            setDate("")
            setTypeId("")
            setRecurring("none")
            toast.success(t("add.success"))
        } catch (error) {
            toast.error(t("add.error"))
        }
    }

    const [importResult, setImportResult] = useState<{ imported: number, totalFound: number, logs: string[] } | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setImportResult(null)
        try {
            const text = await file.text()
            const result = await importIcsWastePickups(text)

            if (result.imported > 0) {
                toast.success(t("import.toast.success", { imported: result.imported, total: result.totalFound }), {
                    description: t("import.toast.details"),
                    action: {
                        label: t("import.toast.protocol"),
                        onClick: () => setImportResult(result)
                    }
                })
            } else {
                toast.warning(t("import.toast.warning", { total: result.totalFound }), {
                    description: t("import.toast.checkNames"),
                    action: {
                        label: t("import.toast.analysis"),
                        onClick: () => setImportResult(result)
                    },
                    duration: 10000
                })
            }
        } catch (error) {
            toast.error(t("import.toast.error"))
        } finally {
            setIsUploading(false)
            // Reset file input
            e.target.value = ""
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight">{t("management.title")}</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Input
                            type="file"
                            accept=".ics"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={isUploading}
                        />
                        <Button variant="outline" size="sm" disabled={isUploading} className="w-full sm:w-auto">
                            <Upload className="h-4 w-4 mr-2" />
                            {t("management.importCsv")}
                        </Button>
                    </div>
                    <Button onClick={() => setIsAdding(true)} size="sm" className="flex-1 sm:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("management.manual")}
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium">{t("add.title")}</CardTitle>
                                <CardDescription className="text-[10px]">{t("add.description")}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">{t("add.startDate")}</label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full sm:w-[160px]"
                                    required
                                />
                            </div>
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">{t("add.wasteType")}</label>
                                <Select value={typeId} onValueChange={setTypeId} required>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder={t("add.wasteTypePlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wasteTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">{t("add.recurrence")}</label>
                                <Select value={recurring} onValueChange={(v: any) => setRecurring(v)}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{t("add.recurrenceOptions.none")}</SelectItem>
                                        <SelectItem value="weekly">{t("add.recurrenceOptions.weekly")}</SelectItem>
                                        <SelectItem value="bi-weekly">{t("add.recurrenceOptions.biWeekly")}</SelectItem>
                                        <SelectItem value="4-weekly">{t("add.recurrenceOptions.fourWeekly")}</SelectItem>
                                        <SelectItem value="monthly">{t("add.recurrenceOptions.monthly")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full sm:w-auto px-8">{t("add.submit")}</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {pickups.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-full py-12 text-center border rounded-lg border-dashed">
                        {t("management.empty")}
                    </p>
                ) : (
                    pickups.map((pickup) => {
                        const Icon = iconMap[pickup.wasteType?.icon || "Trash2"] || Trash2
                        const d = new Date(pickup.date)
                        const isToday = new Date().toDateString() === d.toDateString()
                        const isPast = d < new Date() && !isToday

                        const colorKey = pickup.wasteType?.color || "gray-500"
                        // Try to resolve to a hex if it's a known color name
                        const resolvedColor = colorToHex[colorKey] || colorKey

                        // We will always use inline styles for reliability
                        // Background: 10% opacity, Text: 100% opacity
                        const bgStyle = { backgroundColor: resolvedColor + (resolvedColor.startsWith("#") && resolvedColor.length === 7 ? "1A" : "") }
                        // If it's not a hex with length 7, we can't easily add alpha hex. 
                        // But mostly we deal with our hex map or direct hex. 
                        // Fallback: if it's a named color not in our map (e.g. 'black'), simple text color works.
                        if (colorKey === "black") {
                            bgStyle.backgroundColor = "rgba(0,0,0,0.1)"
                        }

                        const textStyle = { color: resolvedColor }

                        return (
                            <Card key={pickup.id} className={isPast ? "opacity-50" : ""}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="p-2 rounded-full"
                                            style={bgStyle}
                                        >
                                            <Icon
                                                className="h-4 w-4"
                                                style={textStyle}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{pickup.wasteType?.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {d.toLocaleDateString("de-DE", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "long",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isToday && <Badge className="bg-destructive hover:bg-destructive">{t("management.today")}</Badge>}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => deleteWastePickup(pickup.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            <Dialog open={!!importResult} onOpenChange={(open) => !open && setImportResult(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{t("import.dialog.title")}</DialogTitle>
                        <DialogDescription>
                            {importResult && t("import.dialog.description", { imported: importResult.imported, total: importResult.totalFound })}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="space-y-1">
                            {importResult?.logs.map((log, i) => (
                                <div key={i} className={`text-xs font-mono ${log.includes("[MATCH]") ? "text-green-600" : log.includes("[SKIP]") ? "text-muted-foreground" : ""}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
