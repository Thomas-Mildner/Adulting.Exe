"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import QRCode from "react-qr-code"

export function QRCodeDialog({ id, name }: { id: string, name: string }) {
    // Use window.location.origin if available, otherwise fallback
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const url = `${origin}/vault/${id}`

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <QrCode className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>QR-Code für {name}</DialogTitle>
                    <DialogDescription>
                        Drucke diesen Code aus und klebe ihn auf den Karton.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="p-4 bg-white rounded-lg border shadow-sm">
                        <QRCode value={url} size={200} />
                    </div>
                    <p className="text-xs text-center text-muted-foreground break-all">
                        {url}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
