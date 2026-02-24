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
import { Plus, Edit2, Trash2, Droplets, Sun } from "lucide-react"
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

import type { Plant } from "@/lib/data"
import { createPlant, updatePlant, deletePlant } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function PlantsGrid({ initialPlants }: { initialPlants: Plant[] }) {
    const t = useTranslations("Outdoor")
    const path = usePathname()
    const locale = path.split("/")[1]
    const dateLocale = locale === "de" ? de : enUS
    const { toast } = useToast()

    const [plants, setPlants] = useState<Plant[]>(initialPlants)
    const [isOpen, setIsOpen] = useState(false)
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [name, setName] = useState("")
    const [species, setSpecies] = useState("")
    const [purchaseDate, setPurchaseDate] = useState("")
    const [sunlight, setSunlight] = useState("")
    const [waterFrequency, setWaterFrequency] = useState("")
    const [notes, setNotes] = useState("")

    const openNewDialog = () => {
        setEditingPlant(null)
        setName("")
        setSpecies("")
        setPurchaseDate(new Date().toISOString().split("T")[0])
        setSunlight("")
        setWaterFrequency("")
        setNotes("")
        setIsOpen(true)
    }

    const openEditDialog = (plant: Plant) => {
        setEditingPlant(plant)
        setName(plant.name)
        setSpecies(plant.species)
        setPurchaseDate(plant.purchaseDate)
        setSunlight(plant.sunlight)
        setWaterFrequency(plant.waterFrequency)
        setNotes(plant.notes || "")
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (editingPlant) {
                await updatePlant(editingPlant.id, {
                    name,
                    species,
                    purchaseDate,
                    sunlight,
                    waterFrequency,
                    notes,
                })
                const updated = plants.map(p =>
                    p.id === editingPlant.id
                        ? { ...p, name, species, purchaseDate, sunlight, waterFrequency, notes }
                        : p
                )
                setPlants(updated)
            } else {
                // Optimistic update - actual ID would come from server in a real implementation
                // or we'd refetch data. For this example, we'll reload after to keep it simple,
                // or just let Server Components handle the refresh.
                await createPlant({
                    name,
                    species,
                    purchaseDate,
                    sunlight,
                    waterFrequency,
                    notes,
                })
                // Force refresh by reloading window for simplicity in this demo, 
                // normally we'd rely on Next.js Server Actions `revalidatePath` to trigger a re-render.
                window.location.reload()
            }
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save plant data.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this plant?")) return

        try {
            await deletePlant(id)
            setPlants(plants.filter(p => p.id !== id))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete plant.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("tabs.plants")}</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Plant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingPlant ? "Edit Plant" : "Add New Plant"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for your plant below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name / Nickname</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="e.g. Bob the Ficus"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="species">Species / Variety</Label>
                                <Input
                                    id="species"
                                    value={species}
                                    onChange={e => setSpecies(e.target.value)}
                                    required
                                    placeholder="e.g. Ficus elastica"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate">Planted / Purchased Date</Label>
                                <Input
                                    id="purchaseDate"
                                    type="date"
                                    value={purchaseDate}
                                    onChange={e => setPurchaseDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sunlight">Sunlight</Label>
                                    <Select value={sunlight} onValueChange={setSunlight} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full Sun">Full Sun</SelectItem>
                                            <SelectItem value="Partial Sun">Partial Sun</SelectItem>
                                            <SelectItem value="Shade">Shade</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="waterFrequency">Watering</Label>
                                    <Select value={waterFrequency} onValueChange={setWaterFrequency} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="As Needed">As Needed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes / Care Instructions</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="e.g. Very dramatic when thirsty."
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

            {plants.length === 0 ? (
                <div className="text-center p-12 border rounded-lg bg-card/50 text-muted-foreground border-dashed">
                    No plants added yet. Start tracking your garden!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plants.map((plant) => (
                        <Card key={plant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-2 w-full bg-green-500/20" />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{plant.name}</CardTitle>
                                        <CardDescription className="font-mono text-xs mt-1">{plant.species}</CardDescription>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(plant)}>
                                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/80 hover:text-red-600 hover:bg-red-100/50" onClick={() => handleDelete(plant.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pb-4">
                                <div className="flex space-x-4 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                    <div className="flex items-center" title="Sunlight Requirement">
                                        <Sun className="h-4 w-4 mr-1.5 text-amber-500" />
                                        <span className="text-xs">{plant.sunlight}</span>
                                    </div>
                                    <div className="flex items-center" title="Watering Frequency">
                                        <Droplets className="h-4 w-4 mr-1.5 text-blue-500" />
                                        <span className="text-xs">{plant.waterFrequency}</span>
                                    </div>
                                </div>

                                {plant.notes && (
                                    <p className="text-sm line-clamp-2 text-foreground/80 mt-2">
                                        {plant.notes}
                                    </p>
                                )}

                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest pt-2 border-t mt-3">
                                    Added: {format(new Date(plant.purchaseDate), "MMM yyyy", { locale: dateLocale })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
