"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { formatDistanceToNow, addDays, isPast, isToday, format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { completeChore, createChore, deleteChore } from "@/lib/actions"
import { CheckCircle, Trash2, ListTodo, Plus, Calendar } from "lucide-react"
import { toast } from "sonner"

type Chore = any // simplified for now
type Person = any

export function ChoresList({ initialChores, persons }: { initialChores: Chore[], persons: Person[] }) {
    const t = useTranslations("Chores")
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [intervalDays, setIntervalDays] = useState("7")
    const [points, setPoints] = useState("1")
    const [assigneeId, setAssigneeId] = useState<string>("none")
    
    async function handleAdd() {
        if (!title) return
        try {
            await createChore({
                title,
                intervalDays: parseInt(intervalDays),
                points: parseInt(points),
                assigneeId: assigneeId === "none" ? undefined : assigneeId
            })
            setOpen(false)
            setTitle("")
            toast.success(t("toastCreated"))
        } catch (e) {
            toast.error(t("toastCreateError"))
        }
    }

    async function handleComplete(id: string, currentAssigneeId?: string) {
        try {
            await completeChore(id, currentAssigneeId)
            toast.success(t("toastCompleted"))
        } catch (e) {
            toast.error(t("toastCompleteError"))
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteChore(id)
            toast.success(t("toastDeleted"))
        } catch (e) {
            toast.error(t("toastDeleteError"))
        }
    }

    const sortedChores = [...initialChores].sort((a, b) => {
        const nextA = a.lastDone ? addDays(new Date(a.lastDone), a.intervalDays).getTime() : 0
        const nextB = b.lastDone ? addDays(new Date(b.lastDone), b.intervalDays).getTime() : 0
        return nextA - nextB
    })

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-primary" />
                        {t("title")}
                    </CardTitle>
                    <CardDescription>{t("subtitle")}</CardDescription>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            {t("newChore")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("createChore")}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("choreName")}</label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("choreNamePlaceholder")} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("interval")}</label>
                                    <Input type="number" value={intervalDays} onChange={e => setIntervalDays(e.target.value)} min={1} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t("points")}</label>
                                    <Input type="number" value={points} onChange={e => setPoints(e.target.value)} min={1} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t("assignee")}</label>
                                <Select value={assigneeId} onValueChange={setAssigneeId}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{t("unassigned")}</SelectItem>
                                        {persons.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAdd}>{t("createChore")}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto mt-4">
                {sortedChores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground border border-dashed rounded-lg bg-muted/50">
                        <ListTodo className="h-10 w-10 mb-2 opacity-50" />
                        <p>{t("noChores")}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedChores.map(chore => {
                            const nextDue = chore.lastDone ? addDays(new Date(chore.lastDone), chore.intervalDays) : new Date()
                            const isOverdue = isPast(nextDue) && !isToday(nextDue)
                            const isDueToday = isToday(nextDue)
                            
                            return (
                                <div key={chore.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg transition-colors ${isOverdue ? "bg-destructive/5 border-destructive/20" : isDueToday ? "bg-orange-500/5 border-orange-500/20" : "bg-card"}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <Calendar className={`h-5 w-5 ${isOverdue ? "text-destructive" : isDueToday ? "text-orange-500" : "text-muted-foreground"}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{chore.title}</h4>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                {chore.assignee ? (
                                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                        {chore.assignee.name}
                                                    </span>
                                                ) : (
                                                    <span className="bg-muted px-2 py-0.5 rounded-full">
                                                        {t("unassigned")}
                                                    </span>
                                                )}
                                                <span>•</span>
                                                <span>{chore.points} {t("pointsSuffix")}</span>
                                                <span>•</span>
                                                <span>
                                                    {chore.lastDone ? (
                                                        isOverdue ? (
                                                            <span className="text-destructive font-medium">{t("overdue", { days: Math.floor((new Date().getTime() - nextDue.getTime()) / (1000 * 3600 * 24)) })}</span>
                                                        ) : isDueToday ? (
                                                            <span className="text-orange-500 font-medium">{t("dueToday")}</span>
                                                        ) : (
                                                            <span>{t("dueIn", { days: Math.ceil((nextDue.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) })}</span>
                                                        )
                                                    ) : (
                                                        <span className="text-destructive font-medium">{t("dueToday")} ({t("neverDone")})</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(chore.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant={isOverdue || isDueToday ? "default" : "outline"} size="sm" onClick={() => handleComplete(chore.id, chore.assigneeId)}>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {t("completeBtn")}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
