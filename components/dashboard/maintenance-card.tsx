"use client"

import { useFormatter, useTranslations } from "next-intl"

import { useState, useOptimistic } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { type MaintenanceTask } from "@/lib/data"
import { toggleMaintenanceTask } from "@/lib/actions"

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  low: "bg-muted text-muted-foreground border-border",
}

export function MaintenanceCard({ initialTasks }: { initialTasks: MaintenanceTask[] }) {
  const t = useTranslations("MaintenanceCard")
  const format = useFormatter()
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
    await toggleMaintenanceTask(id)
  }

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const prio = { high: 0, medium: 1, low: 2 }
    return prio[a.priority] - prio[b.priority]
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
          <Badge variant="secondary" className="text-[10px] font-mono">
            {t("openCount", { count: tasks.filter((t) => !t.completed).length })}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {sorted.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="h-4 w-4"
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-none ${task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
                  }`}
              >
                {task.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {t("due")}{" "}
                {format.dateTime(new Date(task.dueDate), {
                  month: "short",
                  day: "numeric",
                })}{" "}
                &middot; {(() => {
                  const map: Record<string, string> = {
                    "Jährlich": "yearly",
                    "Monatlich": "monthly",
                    "Alle 2 Monate": "every2months",
                    "Alle 3 Monate": "every3months",
                    "Alle 6 Monate": "every6months",
                  }
                  const key = map[task.recurring]
                  return key ? t(`recurring.${key}`) : task.recurring
                })()}
              </p>
            </div>
            <Badge variant="outline" className={`text-[10px] ${priorityStyles[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
