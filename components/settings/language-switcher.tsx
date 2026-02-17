"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/lib/navigation"
import { useTransition } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    function handleLocaleChange(newLocale: string) {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        })
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">Sprache / Language</CardTitle>
                </div>
                <CardDescription className="text-xs">
                    Wähle deine bevorzugte Sprache.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <Label htmlFor="language-select" className="sr-only">
                        Sprache
                    </Label>
                    <Select
                        defaultValue={locale}
                        onValueChange={handleLocaleChange}
                        disabled={isPending}
                    >
                        <SelectTrigger id="language-select">
                            <SelectValue placeholder="Sprache wählen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
