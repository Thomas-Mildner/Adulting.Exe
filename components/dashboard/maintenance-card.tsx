"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { maintenanceTasks } from "@/lib/data"

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  low: "bg-muted text-muted-foreground border-border",
}

export function MaintenanceCard() {
  const [tasks, setTasks] = useState(maintenanceTasks)

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
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
          <CardTitle className="text-sm font-medium">Offene Wartungen</CardTitle>
          <Badge variant="secondary" className="text-[10px] font-mono">
            {tasks.filter((t) => !t.completed).length} offen
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {"Dinge, die sich leider nicht von selbst reparieren"}
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
                className={`text-sm leading-none ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Faellig{" "}
                {new Date(task.dueDate).toLocaleDateString("de-DE", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                &middot; {task.recurring}
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
