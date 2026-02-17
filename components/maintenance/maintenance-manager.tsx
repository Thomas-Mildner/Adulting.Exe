"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type MaintenanceTask } from "@/lib/data"
import {
  createMaintenanceTask,
  updateMaintenanceTask,
  toggleMaintenanceTask,
  deleteMaintenanceTask,
} from "@/lib/actions"
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  ArrowDown,
} from "lucide-react"

const priorityConfig: Record<
  string,
  { labelKey: string; style: string; icon: typeof AlertTriangle }
> = {
  high: {
    labelKey: "high",
    style: "bg-destructive/10 text-destructive border-destructive/20",
    icon: AlertTriangle,
  },
  medium: {
    labelKey: "medium",
    style: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    icon: Clock,
  },
  low: {
    labelKey: "low",
    style: "bg-muted text-muted-foreground border-border",
    icon: ArrowDown,
  },
}

const recurringOptions = [
  "once",
  "weekly",
  "monthly",
  "quarterly",
  "biannually",
  "yearly",
]

type FormData = {
  title: string
  dueDate: string
  recurring: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

const emptyForm: FormData = {
  title: "",
  dueDate: new Date().toISOString().split("T")[0],
  recurring: "once",
  priority: "medium",
  completed: false,
}

function TaskFormFields({
  form,
  setForm,
}: {
  form: FormData
  setForm: (fn: (prev: FormData) => FormData) => void
}) {
  const t = useTranslations("Maintenance.form")
  const tRec = useTranslations("Maintenance.recurring")

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">{t("task")}</Label>
        <Input
          id="title"
          placeholder={t("taskPlaceholder")}
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="dueDate">{t("dueDate")}</Label>
          <Input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="recurring">{t("recurring")}</Label>
          <Select
            value={form.recurring}
            onValueChange={(v) =>
              setForm((prev) => ({ ...prev, recurring: v }))
            }
          >
            <SelectTrigger id="recurring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {recurringOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {tRec(opt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>{t("priority")}</Label>
        <div className="flex gap-2">
          {(["high", "medium", "low"] as const).map((p) => {
            const cfg = priorityConfig[p]
            return (
              <button
                key={p}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition-colors ${form.priority === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
              >
                <cfg.icon className="h-3 w-3" />
                {useTranslations("Maintenance.priority")(cfg.labelKey)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function MaintenanceManager({
  initialTasks,
}: {
  initialTasks: MaintenanceTask[]
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Maintenance")

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<FormData>({ ...emptyForm })

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormData>({ ...emptyForm })

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Stats
  const openTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)
  const overdue = openTasks.filter(
    (t) => new Date(t.dueDate) < new Date(new Date().toISOString().split("T")[0])
  )
  const highPrio = openTasks.filter((t) => t.priority === "high")

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.title || !createForm.dueDate) return

    startTransition(async () => {
      await createMaintenanceTask(createForm)
      // Optimistic: add to local state
      setTasks((prev) => [
        ...prev,
        { ...createForm, id: `temp-${Date.now()}` },
      ])
      setCreateForm({ ...emptyForm })
      setCreateOpen(false)
    })
  }

  function openEdit(task: MaintenanceTask) {
    setEditId(task.id)
    setEditForm({
      title: task.title,
      dueDate: task.dueDate,
      recurring: task.recurring, // This might need mapping back if stored as localized string in DB? Assuming DB has English keys or identifiers
      priority: task.priority,
      completed: task.completed,
    })
    setEditOpen(true)
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editId || !editForm.title || !editForm.dueDate) return

    startTransition(async () => {
      await updateMaintenanceTask(editId!, editForm)
      setTasks((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, ...editForm } : t))
      )
      setEditOpen(false)
      setEditId(null)
    })
  }

  function handleToggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
    startTransition(async () => {
      await toggleMaintenanceTask(id)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMaintenanceTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setDeleteId(null)
    })
  }

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const prio = { high: 0, medium: 1, low: 2 }
    return prio[a.priority] - prio[b.priority] || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.total")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {tasks.length}
            </p>
            <p className="text-xs text-muted-foreground">{t("stats.tasks")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.open")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-chart-3 mt-1">
              {openTasks.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {highPrio.length > 0
                ? t("stats.highPriorityCount", { count: highPrio.length })
                : t("stats.allGood")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.overdue")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-destructive mt-1">
              {overdue.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {overdue.length > 0
                ? t("stats.betterToday")
                : t("stats.onTime")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.done")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-success mt-1">
              {completedTasks.length}
            </p>
            <p className="text-xs text-muted-foreground">{t("stats.wellDone")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table with actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">
                {t("list.title")}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {t("list.description")}
              </p>
            </div>

            {/* ── Create Dialog ── */}
            <Dialog
              open={createOpen}
              onOpenChange={(v) => {
                setCreateOpen(v)
                if (!v) setCreateForm({ ...emptyForm })
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  {t("create.button")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>{t("create.title")}</DialogTitle>
                    <DialogDescription>
                      {t("create.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <TaskFormFields form={createForm} setForm={setCreateForm} />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateForm({ ...emptyForm })
                        setCreateOpen(false)
                      }}
                    >
                      {t("form.cancel")}
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? t("form.saving") : t("form.save")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-10">{t("table.status")}</TableHead>
                <TableHead className="text-xs">{t("table.task")}</TableHead>
                <TableHead className="text-xs">{t("table.due")}</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">
                  {t("table.recurring")}
                </TableHead>
                <TableHead className="text-xs">{t("table.priority")}</TableHead>
                <TableHead className="text-xs text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-sm text-muted-foreground"
                  >
                    {t("list.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((task) => {
                  const isOverdue =
                    !task.completed &&
                    new Date(task.dueDate) <
                    new Date(new Date().toISOString().split("T")[0])
                  const cfg = priorityConfig[task.priority]

                  return (
                    <TableRow
                      key={task.id}
                      className={task.completed ? "opacity-50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggle(task.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell
                        className={`text-sm font-medium ${task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                          }`}
                      >
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm tabular-nums ${isOverdue
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                            }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {isOverdue && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-[10px] bg-destructive/10 text-destructive border-destructive/20"
                          >
                            {t("list.overdueBadge")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                        {/* Try to map legacy german strings to keys if they exist, else just show string */}
                        {recurringOptions.includes(task.recurring) ? t(`recurring.${task.recurring}`) : task.recurring}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${cfg.style}`}
                        >
                          {t(`priority.${cfg.labelKey}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(task)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(task.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v)
          if (!v) setEditId(null)
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
              <DialogDescription>
                {t("edit.description")}
              </DialogDescription>
            </DialogHeader>
            <TaskFormFields form={editForm} setForm={setEditForm} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false)
                  setEditId(null)
                }}
              >
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.saving") : t("form.editSave")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null)
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("delete.title")}</DialogTitle>
            <DialogDescription>
              {t("delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("delete.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? t("delete.deleting") : t("delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
