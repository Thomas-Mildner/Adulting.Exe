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
import { Plus, Edit2, Trash2, Droplets, CalendarRange } from "lucide-react"

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

import type { IrrigationZone } from "@/lib/data"
import { createIrrigationZone, updateIrrigationZone, deleteIrrigationZone } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function IrrigationSchedules({ initialZones }: { initialZones: IrrigationZone[] }) {
    const t = useTranslations("Outdoor")
    const { toast } = useToast()

    const [zones, setZones] = useState<IrrigationZone[]>(initialZones)
    const [isOpen, setIsOpen] = useState(false)
    const [editingZone, setEditingZone] = useState<IrrigationZone | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [name, setName] = useState("")
    const [schedule, setSchedule] = useState("")
    const [seasonalStart, setSeasonalStart] = useState("")
    const [seasonalEnd, setSeasonalEnd] = useState("")
    const [notes, setNotes] = useState("")

    const openNewDialog = () => {
        setEditingZone(null)
        setName("")
        setSchedule("")
        setSeasonalStart("")
        setSeasonalEnd("")
        setNotes("")
        setIsOpen(true)
    }

    const openEditDialog = (zone: IrrigationZone) => {
        setEditingZone(zone)
        setName(zone.name)
        setSchedule(zone.schedule)
        setSeasonalStart(zone.seasonalStart)
        setSeasonalEnd(zone.seasonalEnd)
        setNotes(zone.notes || "")
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (editingZone) {
                await updateIrrigationZone(editingZone.id, {
                    name,
                    schedule,
                    seasonalStart,
                    seasonalEnd,
                    notes,
                })
                const updated = zones.map(z =>
                    z.id === editingZone.id
                        ? { ...z, name, schedule, seasonalStart, seasonalEnd, notes }
                        : z
                )
                setZones(updated)
            } else {
                await createIrrigationZone({
                    name,
                    schedule,
                    seasonalStart,
                    seasonalEnd,
                    notes,
                })
                window.location.reload()
            }
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save irrigation zone.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this irrigation zone?")) return

        try {
            await deleteIrrigationZone(id)
            setZones(zones.filter(z => z.id !== id))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete irrigation zone.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("tabs.irrigation")}</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Zone
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingZone ? "Edit Irrigation Zone" : "New Irrigation Zone"}</DialogTitle>
                            <DialogDescription>
                                Configure schedule and seasonal rules for your sprinkler or drip lines.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Zone Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="e.g. Front Lawn Sprinklers"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schedule">Schedule</Label>
                                <Input
                                    id="schedule"
                                    value={schedule}
                                    onChange={e => setSchedule(e.target.value)}
                                    required
                                    placeholder="e.g. Mon/Wed/Fri 6:00 AM for 15 mins"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seasonalStart">Active Season Start</Label>
                                    <Input
                                        id="seasonalStart"
                                        value={seasonalStart}
                                        onChange={e => setSeasonalStart(e.target.value)}
                                        required
                                        placeholder="e.g. April 15"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seasonalEnd">Active Season End</Label>
                                    <Input
                                        id="seasonalEnd"
                                        value={seasonalEnd}
                                        onChange={e => setSeasonalEnd(e.target.value)}
                                        required
                                        placeholder="e.g. Nov 1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Valve Location / Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="e.g. Valve master box on East side of house."
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

            {zones.length === 0 ? (
                <div className="text-center p-12 border rounded-lg bg-card/50 text-muted-foreground border-dashed">
                    No irrigation zones configured.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zones.map((zone) => (
                        <Card key={zone.id} className="relative">
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500 rounded-l-lg" />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center">
                                            <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                                            {zone.name}
                                        </CardTitle>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(zone)}>
                                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/80 hover:text-red-600 hover:bg-red-100/50" onClick={() => handleDelete(zone.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted/40 p-3 rounded-md border border-border/50 text-sm">
                                    <div className="font-semibold text-foreground mb-1">Current Schedule</div>
                                    <div className="text-muted-foreground">{zone.schedule}</div>
                                </div>

                                <div className="flex items-center text-sm text-foreground/80">
                                    <CalendarRange className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Activates: <span className="font-medium">{zone.seasonalStart}</span> — Winterize: <span className="font-medium">{zone.seasonalEnd}</span>
                                    </span>
                                </div>

                                {zone.notes && (
                                    <p className="text-sm text-muted-foreground pt-2 border-t mt-3">
                                        {zone.notes}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
