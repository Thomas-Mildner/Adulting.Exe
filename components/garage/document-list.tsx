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
import { MoreHorizontal, Plus, Trash2, FileText, Download } from "lucide-react"
import { getCarDocuments, deleteCarDocument } from "@/lib/actions"
import type { CarDocument } from "@/lib/data"
import { DocumentUploadDialog } from "./document-upload-dialog"

export function DocumentList({ carId }: { carId: string }) {
    const [documents, setDocuments] = useState<CarDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations("Garage")
    const locale = useLocale()

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const data = await getCarDocuments(carId)
            setDocuments(data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [carId])

    const handleDelete = (id: string) => {
        if (confirm(t("delete.confirm"))) {
            startTransition(async () => {
                await deleteCarDocument(id)
                fetchDocuments()
            })
        }
    }

    if (loading) {
        return <div className="p-4 text-center text-sm text-muted-foreground">{t("loading")}</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("documents.title")}</h3>
                <DocumentUploadDialog
                    carId={carId}
                    trigger={
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            {t("documents.upload")}
                        </Button>
                    }
                    onSuccess={fetchDocuments}
                />
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    {t("documents.empty")}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("documents.fileName")}</TableHead>
                                <TableHead>{t("documents.category")}</TableHead>
                                <TableHead>{t("documents.uploadDate")}</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {doc.title || doc.fileName}
                                        </div>
                                    </TableCell>
                                    <TableCell>{t(`documents.categories.${doc.category}`)}</TableCell>
                                    <TableCell>
                                        {format(new Date(doc.uploadDate), "dd. MMM yyyy", { locale: locale === "de" ? de : enUS })}
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
                                                <DropdownMenuItem asChild>
                                                    <a href={`/uploads/${doc.fileName}`} download target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        {t("documents.download") || "Download"}
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc.id)}>
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
        </div>
    )
}
