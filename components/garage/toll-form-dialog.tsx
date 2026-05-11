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
import { createTollEntry, updateTollEntry } from "@/lib/actions"
import type { TollEntry } from "@/lib/data"

export function TollFormDialog({
    carId,
    tollEntry,
    trigger,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSuccess,
}: {
    carId: string
    tollEntry?: TollEntry
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

    const [date, setDate] = useState(tollEntry?.date || new Date().toISOString().split("T")[0])
    const [cost, setCost] = useState(tollEntry?.cost.toString() || "")
    const [route, setRoute] = useState(tollEntry?.route || "")
    const [country, setCountry] = useState(tollEntry?.country || "")

    useEffect(() => {
        if (open) {
            setDate(tollEntry?.date || new Date().toISOString().split("T")[0])
            setCost(tollEntry?.cost.toString() || "")
            setRoute(tollEntry?.route || "")
            setCountry(tollEntry?.country || "")
        }
    }, [open, tollEntry])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            if (tollEntry) {
                await updateTollEntry(tollEntry.id, {
                    date,
                    cost: parseFloat(cost),
                    route,
                    country,
                })
            } else {
                await createTollEntry({
                    carId,
                    date,
                    cost: parseFloat(cost),
                    route,
                    country,
                })
            }
            setOpen(false)
            if (!tollEntry) {
                setCost("")
                setRoute("")
                setCountry("")
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
                            {tollEntry ? t("fuel.editToll") : t("fuel.addToll")}
                        </DialogTitle>
                        <DialogDescription>
                            {t("fuel.subtitle")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">{t("fuel.date")}</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cost">{t("fuel.totalCost")}</Label>
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
                            <Label htmlFor="route">{t("fuel.route")}</Label>
                            <Input
                                id="route"
                                value={route}
                                onChange={(e) => setRoute(e.target.value)}
                                placeholder={t("fuel.routePlaceholder")}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">{t("fuel.country")}</Label>
                            <Input
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
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
