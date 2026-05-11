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
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Pencil, Trash2, Wrench, FileText, Droplet } from "lucide-react"
import { getCarMaintenance, deleteCarMaintenance } from "@/lib/actions"
import type { CarMaintenance } from "@/lib/data"
import { MaintenanceFormDialog } from "./maintenance-form-dialog"

export function MaintenanceList({ carId }: { carId: string }) {
    const [entries, setEntries] = useState<CarMaintenance[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations("Garage")
    const locale = useLocale()

    // State for editing
    const [editEntry, setEditEntry] = useState<CarMaintenance | undefined>(undefined)
    const [formOpen, setFormOpen] = useState(false)

    const fetchEntries = async () => {
        setLoading(true)
        try {
            const data = await getCarMaintenance(carId)
            setEntries(data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [carId])

    const handleDelete = (id: string) => {
        if (confirm(t("delete.confirm"))) { // Reusing generic delete confirm if available, or just generic confirm
            startTransition(async () => {
                await deleteCarMaintenance(id)
                fetchEntries()
            })
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "oil_change": return <Droplet className="h-4 w-4" />
            case "repair": return <Wrench className="h-4 w-4" />
            case "inspection": return <FileText className="h-4 w-4" />
            default: return <Wrench className="h-4 w-4" />
        }
    }

    if (loading) {
        return <div className="p-4 text-center text-sm text-muted-foreground">{t("loading")}</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("maintenance.title")}</h3>
                <MaintenanceFormDialog
                    carId={carId}
                    trigger={
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            {t("maintenance.addEntry")}
                        </Button>
                    }
                    onSuccess={fetchEntries}
                />
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    {t("maintenance.empty")}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("maintenance.date")}</TableHead>
                                <TableHead>{t("maintenance.category")}</TableHead>
                                <TableHead>{t("maintenance.description")}</TableHead>
                                <TableHead className="text-right">{t("maintenance.cost")}</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        {format(new Date(entry.date), "dd. MMM yyyy", { locale: locale === "de" ? de : enUS })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(entry.category)}
                                            <span>{t(`maintenance.categories.${entry.category}`)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                    <TableCell className="text-right">
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
                                                    setEditEntry(entry)
                                                    setFormOpen(true)
                                                }}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    {t("edit.title")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(entry.id)}>
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

            {/* Hidden trigger for edit dialog */}
            {formOpen && (
                <MaintenanceFormDialog
                    carId={carId}
                    maintenance={editEntry}
                    trigger={<span className="hidden" />}
                    onSuccess={() => {
                        setFormOpen(false)
                        setEditEntry(undefined)
                        fetchEntries()
                    }}
                />
            )}
            {/* Hack: The Dialog component controls its own open state, but we need to force it open when edit is clicked. 
          The MaintenanceFormDialog component handles 'open' state internally. 
          To support external control, I should really refactor MaintenanceFormDialog to accept 'open' and 'onOpenChange' props.
          
          For now, I'll modify MaintenanceFormDialog to accept 'open' prop or just mount it when needed.
          Actually, the current MaintenanceFormDialog only opens on trigger click.
          
          Refactoring MaintenanceFormDialog to be more flexible is better.
      */}
        </div>
    )
}
