"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Calendar, TestTube2 } from "lucide-react"
import { format } from "date-fns"
import { de, enUS } from "date-fns/locale"
import { usePathname } from "next/navigation"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { SoilTreatment } from "@/lib/data"
import { createSoilTreatment, updateSoilTreatment, deleteSoilTreatment } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function SoilHistory({ initialTreatments }: { initialTreatments: SoilTreatment[] }) {
    const t = useTranslations("Outdoor")
    const path = usePathname()
    const locale = path.split("/")[1]
    const dateLocale = locale === "de" ? de : enUS
    const { toast } = useToast()

    const [treatments, setTreatments] = useState<SoilTreatment[]>(initialTreatments)
    const [isOpen, setIsOpen] = useState(false)
    const [editingTreatment, setEditingTreatment] = useState<SoilTreatment | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [type, setType] = useState("")
    const [date, setDate] = useState("")
    const [appliedTo, setAppliedTo] = useState("")
    const [notes, setNotes] = useState("")

    const openNewDialog = () => {
        setEditingTreatment(null)
        setType("")
        setDate(new Date().toISOString().split("T")[0])
        setAppliedTo("")
        setNotes("")
        setIsOpen(true)
    }

    const openEditDialog = (treatment: SoilTreatment) => {
        setEditingTreatment(treatment)
        setType(treatment.type)
        setDate(treatment.date)
        setAppliedTo(treatment.appliedTo)
        setNotes(treatment.notes || "")
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (editingTreatment) {
                await updateSoilTreatment(editingTreatment.id, {
                    type,
                    date,
                    appliedTo,
                    notes,
                })
                const updated = treatments.map(t =>
                    t.id === editingTreatment.id
                        ? { ...t, type, date, appliedTo, notes }
                        : t
                )
                // Sort descending by date
                setTreatments(updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            } else {
                await createSoilTreatment({
                    type,
                    date,
                    appliedTo,
                    notes,
                })
                window.location.reload()
            }
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save treatment data.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this log entry?")) return

        try {
            await deleteSoilTreatment(id)
            setTreatments(treatments.filter(t => t.id !== id))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete log entry.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("tabs.soil")}</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Log Treatment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingTreatment ? "Edit Treatment Log" : "New Treatment Log"}</DialogTitle>
                            <DialogDescription>
                                Record fertilizer, testing, or other lawn/soil care.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Treatment Type</Label>
                                <Select value={type} onValueChange={setType} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                                        <SelectItem value="Aeration">Aeration / Scarifying</SelectItem>
                                        <SelectItem value="Pest Control">Pest Control</SelectItem>
                                        <SelectItem value="Weed Control">Weed Control</SelectItem>
                                        <SelectItem value="Soil Test">Soil Test</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appliedTo">Area / Plants</Label>
                                <Input
                                    id="appliedTo"
                                    value={appliedTo}
                                    onChange={e => setAppliedTo(e.target.value)}
                                    required
                                    placeholder="e.g. Front Lawn, Rose Bushes"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date Applied</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Product Used / Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="e.g. Used XYZ granular fertilizer. Watered in well."
                                    className="resize-none h-20"
                                />
                            </div>
                            <div className="pt-2 flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {treatments.length === 0 ? (
                <div className="text-center p-12 border rounded-lg bg-card/50 text-muted-foreground border-dashed">
                    No treatments logged yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {treatments.map((treatment) => (
                        <Card key={treatment.id} className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-700/60 rounded-l-lg" />
                            <CardHeader className="py-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base flex items-center">
                                            <TestTube2 className="h-4 w-4 mr-2 text-amber-700/80" />
                                            {treatment.type}
                                        </CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {format(new Date(treatment.date), "PPP", { locale: dateLocale })}
                                            <span className="mx-2">•</span>
                                            <span className="font-medium text-foreground">{treatment.appliedTo}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(treatment)}>
                                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/80 hover:text-red-600 hover:bg-red-100/50" onClick={() => handleDelete(treatment.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            {treatment.notes && (
                                <CardContent className="pt-0 pb-4 text-sm text-foreground/80">
                                    <div className="bg-muted/30 p-3 rounded-md line-clamp-3">
                                        {treatment.notes}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
