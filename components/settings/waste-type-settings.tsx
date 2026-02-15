"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Palette } from "lucide-react"
import { type WasteType } from "@/lib/data"
import { createWasteType, deleteWasteType } from "@/lib/actions"
import { toast } from "sonner"

export function WasteTypeSettings({ wasteTypes }: { wasteTypes: WasteType[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState("")
    const [newColor, setNewColor] = useState("#000000")

    const handleCreate = async () => {
        if (!newName) return
        try {
            await createWasteType({ name: newName, color: newColor })
            setNewName("")
            setNewColor("#000000")
            setIsAdding(false)
            toast.success("Mülltyp erstellt")
        } catch (e) {
            toast.error("Fehler beim Erstellen")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteWasteType(id)
            toast.success("Mülltyp gelöscht")
        } catch (e) {
            toast.error("Fehler beim Löschen")
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Mülltypen & Farben</CardTitle>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setIsAdding(!isAdding)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Neu
                    </Button>
                </div>
                <CardDescription className="text-xs">
                    Verwalte hier deine Tonnen. Klicke auf "Neu", um einen eigenen Typ anzulegen.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isAdding && (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                        <Input
                            placeholder="Name (z.B. Sondermüll)"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="h-8 text-xs"
                        />
                        <div className="relative w-8 h-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-full border shadow-sm">
                            <Input
                                type="color"
                                value={newColor}
                                onChange={e => setNewColor(e.target.value)}
                                className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                            />
                        </div>
                        <Button size="sm" onClick={handleCreate} disabled={!newName}>OK</Button>
                    </div>
                )}

                <div className="space-y-2">
                    {wasteTypes.map((type) => {
                        const isHex = type.color.startsWith("#")
                        return (
                            <div key={type.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-4 h-4 rounded-full border shadow-sm ${!isHex ? `bg-${type.color}` : ""}`}
                                        style={isHex ? { backgroundColor: type.color } : {}}
                                    />
                                    <span className="text-sm font-medium">{type.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                    onClick={() => handleDelete(type.id)}
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
