"use client"

import { useState } from "react"
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

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date || !typeId) return
        try {
            await createWastePickup({ date, wasteTypeId: typeId, recurring })
            setIsAdding(false)
            setDate("")
            setTypeId("")
            setRecurring("none")
            toast.success("Termin(e) erfolgreich angelegt")
        } catch (error) {
            toast.error("Fehler beim Anlegen")
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
                toast.success(`${result.imported} von ${result.totalFound} Terminen importiert`, {
                    description: "Details findest du im Import-Protokoll.",
                    action: {
                        label: "Protokoll",
                        onClick: () => setImportResult(result)
                    }
                })
            } else {
                toast.warning(`0 von ${result.totalFound} Terminen importiert`, {
                    description: "Prüfe, ob die Mülltypen-Namen übereinstimmen.",
                    action: {
                        label: "Fehleranalyse",
                        onClick: () => setImportResult(result)
                    },
                    duration: 10000
                })
            }
            // Also set result immediately if 0 imported so they can see it? No, toast action is better.
        } catch (error) {
            toast.error("Fehler beim Importieren der ICS-Datei")
        } finally {
            setIsUploading(false)
            // Reset file input
            e.target.value = ""
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight">Abholtermine</h2>
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
                            ICS Import
                        </Button>
                    </div>
                    <Button onClick={() => setIsAdding(true)} size="sm" className="flex-1 sm:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        Manuell
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium">Neuen Termin planen</CardTitle>
                                <CardDescription className="text-[10px]">Erstelle einen Einzeltermin oder ein Muster</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">Startdatum</label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full sm:w-[160px]"
                                    required
                                />
                            </div>
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">Müllart</label>
                                <Select value={typeId} onValueChange={setTypeId} required>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder="Wählen..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wasteTypes.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">Wiederholung</label>
                                <Select value={recurring} onValueChange={(v: any) => setRecurring(v)}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Keine</SelectItem>
                                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                                        <SelectItem value="bi-weekly">Alle 2 Wochen</SelectItem>
                                        <SelectItem value="4-weekly">Alle 4 Wochen</SelectItem>
                                        <SelectItem value="monthly">Monatlich</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full sm:w-auto px-8">Anlegen</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {pickups.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-full py-12 text-center border rounded-lg border-dashed">
                        Keine Termine gefunden. Zeit, den Kalender zu füllen!
                    </p>
                ) : (
                    pickups.map((pickup) => {
                        const Icon = iconMap[pickup.wasteType?.icon || "Trash2"] || Trash2
                        const d = new Date(pickup.date)
                        const isToday = new Date().toDateString() === d.toDateString()
                        const isPast = d < new Date() && !isToday

                        // Fallback for legacy tailwind colors if needed, but ideally we migrate or handle both
                        const tailwindClass = !pickup.wasteType?.color?.startsWith("#")
                            ? `text-${pickup.wasteType?.color} bg-${pickup.wasteType?.color}/10`
                            : ""

                        return (
                            <Card key={pickup.id} className={isPast ? "opacity-50" : ""}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-full ${tailwindClass}`}
                                            style={pickup.wasteType?.color?.startsWith("#") ? { backgroundColor: `${pickup.wasteType.color}1A` } : {}}
                                        >
                                            <Icon
                                                className={`h-4 w-4 ${!pickup.wasteType?.color?.startsWith("#") ? `text-${pickup.wasteType?.color}` : ""}`}
                                                style={pickup.wasteType?.color?.startsWith("#") ? { color: pickup.wasteType.color } : {}}
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
                                        {isToday && <Badge className="bg-destructive hover:bg-destructive">Heute</Badge>}
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
                        <DialogTitle>Import-Protokoll</DialogTitle>
                        <DialogDescription>
                            {importResult?.imported} von {importResult?.totalFound} Terminen importiert.
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
