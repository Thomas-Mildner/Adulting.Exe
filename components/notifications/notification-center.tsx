"use strict";

"use client"

import * as React from "react"
import { Bell, AlertTriangle, Info, XCircle, Check, Loader2 } from "lucide-react"
import { useRouter } from "@/lib/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getNotifications } from "@/lib/actions"
import type { Notification } from "@/lib/data"
import { cn } from "@/lib/utils"

export function NotificationCenter() {
    const router = useRouter()
    const [notifications, setNotifications] = React.useState<Notification[]>([])
    const [loading, setLoading] = React.useState(true)
    const [open, setOpen] = React.useState(false)

    const fetchNotifications = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await getNotifications()
            setNotifications(data)
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchNotifications()
        // Poll every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    const handleNotificationClick = (link?: string) => {
        if (link) {
            router.push(link)
            setOpen(false)
        }
    }

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "error":
                return <XCircle className="h-4 w-4 text-destructive" />
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case "info":
            default:
                return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    const getBadgeVariant = (count: number) => {
        if (count === 0) return "outline"
        const hasError = notifications.some((n) => n.type === "error")
        if (hasError) return "destructive"
        return "default"
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <Badge
                            variant={getBadgeVariant(notifications.length)}
                            className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                        >
                            {notifications.length}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between font-normal">
                    <span className="font-semibold">Benachrichtigungen</span>
                    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <Check className="mb-2 h-8 w-8 text-muted" />
                            <p className="text-sm">Alles erledigt!</p>
                            <p className="text-xs">Keine offenen Aufgaben.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 p-1">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-3 cursor-pointer",
                                        notification.type === "error" && "bg-destructive/5",
                                        notification.type === "warning" && "bg-yellow-500/5",
                                    )}
                                    onClick={() => handleNotificationClick(notification.link)}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        {getIcon(notification.type)}
                                        <span className="flex-1 font-medium leading-none">
                                            {notification.title}
                                        </span>
                                        {notification.date && (
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {notification.date.split("-").reverse().join(".")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="pl-6 text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
