"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useTranslations } from "next-intl"

export function PrintButton() {
    const t = useTranslations("Vault")

    return (
        <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            {t("detail.print")}
        </Button>
    )
}

