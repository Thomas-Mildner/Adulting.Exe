"use client"

import { useState, useTransition } from "react"
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
import { updateCar, deleteCar } from "@/lib/actions"
import type { Car } from "@/lib/data"
import { Trash2 } from "lucide-react"

export function CarEditDialog({
    car,
    trigger,
    onSuccess,
}: {
    car: Car
    trigger: React.ReactNode
    onSuccess: () => void
}) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations("Garage")

    // Form state initialized with car data
    const [name, setName] = useState(car.name)
    const [brand, setBrand] = useState(car.brand)
    const [model, setModel] = useState(car.model)
    const [licensePlate, setLicensePlate] = useState(car.licensePlate)
    const [purchaseDate, setPurchaseDate] = useState(car.purchaseDate)
    const [purchasePrice, setPurchasePrice] = useState(car.purchasePrice.toString())
    const [nextInspection, setNextInspection] = useState(car.nextInspection || "")
    const [currentTireType, setCurrentTireType] = useState(car.currentTireType)
    const [tireStorageLocation, setTireStorageLocation] = useState(car.tireStorageLocation || "")
    const [firstAidKitExpiry, setFirstAidKitExpiry] = useState(car.firstAidKitExpiry || "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            await updateCar(car.id, {
                name,
                brand,
                model,
                licensePlate,
                purchaseDate,
                purchasePrice: parseFloat(purchasePrice),
                nextInspection: nextInspection || undefined,
                currentTireType,
                tireStorageLocation: tireStorageLocation || undefined,
                firstAidKitExpiry: firstAidKitExpiry || undefined,
            })
            setOpen(false)
            onSuccess()
        })
    }

    const handleDelete = () => {
        if (confirm(t("delete.description"))) {
            startTransition(async () => {
                await deleteCar(car.id)
                setOpen(false)
                // Redirect or handle deletion success (usually navigating back to garage list)
                window.location.reload()
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t("edit.title")}</DialogTitle>
                        <DialogDescription>{t("edit.description")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Fields - identical layout to create form */}
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">{t("form.carName")}</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t("form.carNamePlaceholder")}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-brand">{t("form.brand")}</Label>
                                <Input
                                    id="edit-brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    placeholder={t("form.brandPlaceholder")}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-model">{t("form.model")}</Label>
                                <Input
                                    id="edit-model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder={t("form.modelPlaceholder")}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-licensePlate">{t("form.licensePlate")}</Label>
                            <Input
                                id="edit-licensePlate"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                                placeholder={t("form.licensePlatePlaceholder")}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-purchaseDate">{t("form.purchaseDate")}</Label>
                                <Input
                                    id="edit-purchaseDate"
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-purchasePrice">{t("form.purchasePrice")}</Label>
                                <Input
                                    id="edit-purchasePrice"
                                    type="number"
                                    step="0.01"
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-nextInspection">{t("form.nextInspection")}</Label>
                            <Input
                                id="edit-nextInspection"
                                type="date"
                                value={nextInspection}
                                onChange={(e) => setNextInspection(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-tireType">{t("form.tireType")}</Label>
                            <Select value={currentTireType} onValueChange={setCurrentTireType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="summer">{t("tireReminder.summer")}</SelectItem>
                                    <SelectItem value="winter">{t("tireReminder.winter")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-tireStorage">{t("form.tireStorage")}</Label>
                            <Input
                                id="edit-tireStorage"
                                value={tireStorageLocation}
                                onChange={(e) => setTireStorageLocation(e.target.value)}
                                placeholder={t("form.tireStoragePlaceholder")}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-firstAidExpiry">{t("form.firstAidExpiry")}</Label>
                            <Input
                                id="edit-firstAidExpiry"
                                type="date"
                                value={firstAidKitExpiry}
                                onChange={(e) => setFirstAidKitExpiry(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? t("form.deleting") : t("form.delete")}
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                {t("form.cancel")}
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? t("form.saving") : t("form.save")}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
