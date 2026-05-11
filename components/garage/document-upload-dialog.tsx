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
import { uploadCarDocument } from "@/lib/actions"

export function DocumentUploadDialog({
    carId,
    trigger,
    onSuccess,
}: {
    carId: string
    trigger: React.ReactNode
    onSuccess: () => void
}) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations("Garage")

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("registration")
    // File input is uncontrolled for now, accessed via form ref or event

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        // Append controlled values if not using name attributes for them, but simpler to use name attributes
        // Actually, select needs hidden input or manual append
        formData.set("category", category)
        formData.set("carId", carId)

        startTransition(async () => {
            try {
                await uploadCarDocument(formData)
                setOpen(false)
                setTitle("")
                setCategory("registration")
                onSuccess()
            } catch (error) {
                console.error("Failed to upload document", error)
                // TODO: Show error toast
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t("documents.upload")}</DialogTitle>
                        <DialogDescription>{t("documents.subtitle")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">{t("documents.fileName")}</Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="z.B. Fahrzeugschein"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">{t("documents.category")}</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="registration">{t("documents.categories.registration")}</SelectItem>
                                    <SelectItem value="insurance">{t("documents.categories.insurance")}</SelectItem>
                                    <SelectItem value="invoice">{t("documents.categories.invoice")}</SelectItem>
                                    <SelectItem value="other">{t("documents.categories.other")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="file">{t("documents.upload")}</Label>
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                required
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
