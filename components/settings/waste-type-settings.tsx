"use client"

import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { createWasteType, deleteWasteType } from "@/lib/actions"
import { type WasteType } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Leaf, FileText, Package, Zap, Armchair, AlertTriangle, Recycle, Apple, GlassWater, Monitor } from "lucide-react"
import { toast } from "sonner"

const iconMap: Record<string, any> = {
    Trash2,
    Leaf,
    Apple,
    FileText,
    Package,
    Recycle,
    GlassWater,
    Zap,
    Monitor,
    Armchair,
    AlertTriangle
}

const colorMap: Record<string, string> = {
    "green-500": "green",
    "blue-500": "blue",
    "yellow-500": "yellow",
    "gray-500": "gray",
    "orange-500": "orange",
    "purple-500": "purple",
    "red-500": "red",
    "amber-800": "brown", // Brownish
    "black": "black"
}

const colorToHex: Record<string, string> = {
    "green-500": "#22c55e",
    "blue-500": "#3b82f6",
    "yellow-500": "#eab308",
    "gray-500": "#6b7280",
    "orange-500": "#f97316",
    "purple-500": "#a855f7",
    "red-500": "#ef4444",
    "amber-800": "#92400e",
    "black": "#000000"
}

// Helper to get style safely
const getBgStyle = (colorKey: string) => {
    const hex = colorToHex[colorKey] || colorKey
    if (hex.startsWith("#")) return { backgroundColor: hex }
    return {}
}

// Helper to get bg class safely (only for safelisted/fallback)
const getBgClass = (colorKey: string) => {
    // If it's a known tailwind color that we might not have safelisted, prefer style
    if (colorToHex[colorKey] || colorKey.startsWith("#")) return ""
    return `bg-${colorKey}`
}

export function WasteTypeSettings({ initialTypes }: { initialTypes: WasteType[] }) {
    const t = useTranslations("Settings.waste")
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useState("")
    const [color, setColor] = useState("gray-500")
    const [icon, setIcon] = useState("Trash2")

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        startTransition(async () => {
            try {
                await createWasteType({ name, color, icon })
                setName("")
                toast.success(t("success"))
            } catch (error) {
                toast.error(t("error"))
            }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            try {
                await deleteWasteType(id)
                toast.success("Gelöscht") // Fallback if no translation for generic success
            } catch (error) {
                toast.error("Nicht möglich")
            }
        })
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                    {t("description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleCreate} className="space-y-3 p-3 border rounded-md bg-muted/40">
                    <div className="space-y-1">
                        <Label htmlFor="type-name" className="text-xs">{t("create")}</Label>
                        <Input
                            id="type-name"
                            placeholder={t("placeholder")}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8 text-sm"
                            disabled={isPending}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={color} onValueChange={setColor} disabled={isPending}>
                            <SelectTrigger className="h-8 flex-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(colorMap).map(([value, labelKey]) => (
                                    <SelectItem key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${getBgClass(value)}`} style={getBgStyle(value)} />
                                            {t(`colors.${labelKey}`)}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={icon} onValueChange={setIcon} disabled={isPending}>
                            <SelectTrigger className="h-8 w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(iconMap).map((iconKey) => {
                                    const Icon = iconMap[iconKey]
                                    return (
                                        <SelectItem key={iconKey} value={iconKey}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-3 w-3" />
                                                <span className="text-xs">{iconKey}</span>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" size="sm" className="w-full h-8" disabled={isPending || !name}>
                        <Plus className="h-3 w-3 mr-1" />
                        {t("create")}
                    </Button>
                </form>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    <Label className="text-xs text-muted-foreground">{t("list")}</Label>
                    {initialTypes.map((type) => {
                        const Icon = iconMap[type.icon] || Trash2
                        const colorClass = getBgClass(type.color)

                        return (
                            <div key={type.id} className="flex items-center justify-between p-2 rounded border bg-card text-xs">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${colorClass}`}
                                        style={getBgStyle(type.color)}
                                    />
                                    <Icon className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{type.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDelete(type.id)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
