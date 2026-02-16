"use client"

import { useState, useTransition, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createCarMaintenance, updateCarMaintenance } from "@/lib/actions"
import type { CarMaintenance } from "@/lib/data"

export function MaintenanceFormDialog({
    carId,
    maintenance,
    trigger,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSuccess,
}: {
    carId: string
    maintenance?: CarMaintenance
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess: () => void
}) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations("Garage")

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen

    const [date, setDate] = useState(maintenance?.date || new Date().toISOString().split("T")[0])
    const [description, setDescription] = useState(maintenance?.description || "")
    const [cost, setCost] = useState(maintenance?.cost.toString() || "")
    const [mileage, setMileage] = useState(maintenance?.mileage?.toString() || "")
    const [category, setCategory] = useState(maintenance?.category || "other")

    // Sync state when dialog opens or maintenance prop changes
    useEffect(() => {
        if (open) {
            setDate(maintenance?.date || new Date().toISOString().split("T")[0])
            setDescription(maintenance?.description || "")
            setCost(maintenance?.cost.toString() || "")
            setMileage(maintenance?.mileage?.toString() || "")
            setCategory(maintenance?.category || "other")
        }
    }, [open, maintenance])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            if (maintenance) {
                await updateCarMaintenance(maintenance.id, {
                    date,
                    description,
                    cost: parseFloat(cost),
                    mileage: mileage ? parseInt(mileage) : undefined,
                    category,
                })
            } else {
                await createCarMaintenance({
                    carId,
                    date,
                    description,
                    cost: parseFloat(cost),
                    mileage: mileage ? parseInt(mileage) : undefined,
                    category,
                })
            }
            setOpen(false)
            // Reset form if creating new
            if (!maintenance) {
                setDescription("")
                setCost("")
                setMileage("")
                setCategory("other")
            }
            onSuccess()
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {maintenance ? t("maintenance.editEntry") : t("maintenance.addEntry")}
                        </DialogTitle>
                        <DialogDescription>
                            {t("maintenance.subtitle")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">{t("maintenance.date")}</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">{t("maintenance.description")}</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="cost">{t("maintenance.cost")}</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    step="0.01"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="mileage">{t("maintenance.mileage")}</Label>
                                <Input
                                    id="mileage"
                                    type="number"
                                    value={mileage}
                                    onChange={(e) => setMileage(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">{t("maintenance.category")}</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oil_change">{t("maintenance.categories.oil_change")}</SelectItem>
                                    <SelectItem value="repair">{t("maintenance.categories.repair")}</SelectItem>
                                    <SelectItem value="inspection">{t("maintenance.categories.inspection")}</SelectItem>
                                    <SelectItem value="parts">{t("maintenance.categories.parts")}</SelectItem>
                                    <SelectItem value="other">{t("maintenance.categories.other")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            {t("form.cancel")}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? t("form.saving") : t("form.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
