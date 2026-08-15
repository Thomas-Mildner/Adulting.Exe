"use client"

import { useEffect, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { de, enUS } from "date-fns/locale"
import { useLocale } from "next-intl"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Plus, Pencil, Trash2, Fuel, Coins } from "lucide-react"
import { getFuelEntries, deleteFuelEntry, getTollEntries, deleteTollEntry } from "@/lib/actions"
import type { FuelEntry, TollEntry } from "@/lib/data"
import { FuelFormDialog } from "./fuel-form-dialog"
import { TollFormDialog } from "./toll-form-dialog"

export function FuelList({ carId }: { carId: string }) {
    const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([])
    const [tollEntries, setTollEntries] = useState<TollEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations("Garage")
    const locale = useLocale()

    // State for editing
    const [editFuelEntry, setEditFuelEntry] = useState<FuelEntry | undefined>(undefined)
    const [fuelFormOpen, setFuelFormOpen] = useState(false)
    const [editTollEntry, setEditTollEntry] = useState<TollEntry | undefined>(undefined)
    const [tollFormOpen, setTollFormOpen] = useState(false)

    const fetchEntries = async () => {
        setLoading(true)
        try {
            const [fuel, toll] = await Promise.all([
                getFuelEntries(carId),
                getTollEntries(carId)
            ])
            setFuelEntries(fuel)
            setTollEntries(toll)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [carId])

    const handleDeleteFuel = (id: string) => {
        if (confirm(t("delete.confirm"))) {
            startTransition(async () => {
                await deleteFuelEntry(id)
                fetchEntries()
            })
        }
    }

    const handleDeleteToll = (id: string) => {
        if (confirm(t("delete.confirm"))) {
            startTransition(async () => {
                await deleteTollEntry(id)
                fetchEntries()
            })
        }
    }


    if (loading) {
        return <div className="p-4 text-center text-sm text-muted-foreground">{t("loading")}</div>
    }

    return (
        <Tabs defaultValue="fuel" className="w-full">
            <div className="flex items-center justify-between mb-4">
                <TabsList>
                    <TabsTrigger value="fuel">
                        <Fuel className="mr-2 h-4 w-4" />
                        {t("fuel.fuel")}
                    </TabsTrigger>
                    <TabsTrigger value="tolls">
                        <Coins className="mr-2 h-4 w-4" />
                        {t("fuel.tolls")}
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="fuel" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{t("fuel.fuel")}</h3>
                    <FuelFormDialog
                        carId={carId}
                        trigger={
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                {t("fuel.addFuel")}
                            </Button>
                        }
                        onSuccess={fetchEntries}
                    />
                </div>

                {fuelEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        {t("fuel.fuelEmpty")}
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("fuel.date")}</TableHead>
                                    <TableHead>{t("fuel.liters")}</TableHead>
                                    <TableHead>{t("fuel.pricePerLiter")}</TableHead>
                                    <TableHead>{t("fuel.totalCost")}</TableHead>
                                    <TableHead>{t("fuel.mileage")}</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fuelEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {format(new Date(entry.date), "dd. MMM yyyy", { locale: locale === "de" ? de : enUS })}
                                        </TableCell>
                                        <TableCell>{entry.liters.toFixed(2)} L ({t(`fuel.fuelTypes.${entry.fuelType}`)})</TableCell>
                                        <TableCell>{entry.pricePerLiter.toFixed(3)} €</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(entry.totalCost)}
                                        </TableCell>
                                        <TableCell>{entry.mileage} km</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditFuelEntry(entry)
                                                        setFuelFormOpen(true)
                                                    }}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {t("edit.title")}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFuel(entry.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t("delete.confirm")}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="tolls" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{t("fuel.tolls")}</h3>
                    <TollFormDialog
                        carId={carId}
                        trigger={
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                {t("fuel.addToll")}
                            </Button>
                        }
                        onSuccess={fetchEntries}
                    />
                </div>

                {tollEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        {t("fuel.tollEmpty")}
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("fuel.date")}</TableHead>
                                    <TableHead>{t("fuel.route")}</TableHead>
                                    <TableHead>{t("fuel.country")}</TableHead>
                                    <TableHead>{t("fuel.totalCost")}</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tollEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {format(new Date(entry.date), "dd. MMM yyyy", { locale: locale === "de" ? de : enUS })}
                                        </TableCell>
                                        <TableCell>{entry.route || "-"}</TableCell>
                                        <TableCell>{entry.country || "-"}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(entry.cost)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditTollEntry(entry)
                                                        setTollFormOpen(true)
                                                    }}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {t("edit.title")}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteToll(entry.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t("delete.confirm")}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </TabsContent>

            {/* Edit Dialogs */}
            {fuelFormOpen && (
                <FuelFormDialog
                    carId={carId}
                    fuelEntry={editFuelEntry}
                    open={fuelFormOpen}
                    onOpenChange={setFuelFormOpen}
                    onSuccess={() => {
                        setFuelFormOpen(false)
                        setEditFuelEntry(undefined)
                        fetchEntries()
                    }}
                />
            )}
            {tollFormOpen && (
                <TollFormDialog
                    carId={carId}
                    tollEntry={editTollEntry}
                    open={tollFormOpen}
                    onOpenChange={setTollFormOpen}
                    onSuccess={() => {
                        setTollFormOpen(false)
                        setEditTollEntry(undefined)
                        fetchEntries()
                    }}
                />
            )}
        </Tabs>
    )
}
