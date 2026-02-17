"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  Wrench, 
  Paintbrush, 
  AlertTriangle, 
  Cpu,
  Hammer,
  Bandage,
  Sparkles as SparklesIcon,
  Star
} from "lucide-react"
import type { Room, RoomEvent } from "@/lib/data"
import { createRoomEvent, updateRoomEvent, deleteRoomEvent } from "@/lib/actions"
import { useState, useTransition, useMemo } from "react"

type FormData = {
  timestamp: string
  category: RoomEvent["category"]
  description: string
  metadata: Record<string, any>
  vibeRating?: number
}

const emptyForm: FormData = {
  timestamp: new Date().toISOString().slice(0, 16),
  category: "Maintenance",
  description: "",
  metadata: {},
  vibeRating: undefined,
}

const categoryIcons = {
  Maintenance: Wrench,
  Aesthetics: Paintbrush,
  Incident: AlertTriangle,
  Tech: Cpu,
  Surgery: Hammer,
  "Band-aid": Bandage,
  "Face-lift": SparklesIcon,
}

function RoomEventFormFields({
  form,
  setForm,
}: {
  form: FormData
  setForm: (fn: (prev: FormData) => FormData) => void
}) {
  const t = useTranslations("Rooms")

  const categories: RoomEvent["category"][] = [
    "Maintenance",
    "Aesthetics",
    "Incident",
    "Tech",
    "Surgery",
    "Band-aid",
    "Face-lift",
  ]

  // Metadata fields based on category
  const renderMetadataFields = () => {
    switch (form.category) {
      case "Aesthetics":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("metadata.brand")}</Label>
              <Input
                value={form.metadata.brand || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    metadata: { ...p.metadata, brand: e.target.value },
                  }))
                }
                placeholder={t("metadata.brand")}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("metadata.finish")}</Label>
              <Input
                value={form.metadata.finish || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    metadata: { ...p.metadata, finish: e.target.value },
                  }))
                }
                placeholder="Matte/Gloss"
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("metadata.colorCode")}</Label>
              <Input
                value={form.metadata.colorCode || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    metadata: { ...p.metadata, colorCode: e.target.value },
                  }))
                }
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        )
      case "Maintenance":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("metadata.bulbType")}</Label>
              <Input
                value={form.metadata.bulbType || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    metadata: { ...p.metadata, bulbType: e.target.value },
                  }))
                }
                placeholder="E27, 4000K"
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("metadata.batteryType")}</Label>
              <Input
                value={form.metadata.batteryType || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    metadata: { ...p.metadata, batteryType: e.target.value },
                  }))
                }
                placeholder="CR2032"
              />
            </div>
          </div>
        )
      default:
        return (
          <div className="grid gap-2">
            <Label>{t("metadata.notes")}</Label>
            <Input
              value={form.metadata.notes || ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  metadata: { ...p.metadata, notes: e.target.value },
                }))
              }
              placeholder={t("metadata.notes")}
            />
          </div>
        )
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="timestamp">{t("timeline.timestamp")}</Label>
          <Input
            id="timestamp"
            type="datetime-local"
            value={form.timestamp}
            onChange={(e) => setForm((p) => ({ ...p, timestamp: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">{t("timeline.category")}</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((p) => ({ ...p, category: v as RoomEvent["category"] }))}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {t(`categories.${cat}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">{t("timeline.description")}</Label>
        <Textarea
          id="description"
          placeholder={t("timeline.description")}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
          rows={3}
        />
      </div>

      {renderMetadataFields()}

      <div className="grid gap-2">
        <Label>{t("timeline.vibeRating")}</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant={form.vibeRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setForm((p) => ({ ...p, vibeRating: rating }))}
            >
              <Star className="h-4 w-4" />
            </Button>
          ))}
          {form.vibeRating && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setForm((p) => ({ ...p, vibeRating: undefined }))}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function RoomTimeline({ room, events }: { room: Room; events: RoomEvent[] }) {
  const t = useTranslations("Rooms")
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<RoomEvent | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const handleCreate = () => {
    startTransition(async () => {
      await createRoomEvent({
        roomId: room.id,
        ...form,
        timestamp: new Date(form.timestamp).toISOString().split("T")[0],
      })
      setDialogOpen(false)
      setForm(emptyForm)
    })
  }

  const handleUpdate = () => {
    if (!editingEvent) return
    startTransition(async () => {
      await updateRoomEvent(editingEvent.id, {
        ...form,
        timestamp: new Date(form.timestamp).toISOString().split("T")[0],
      })
      setDialogOpen(false)
      setEditingEvent(null)
      setForm(emptyForm)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm(t("timeline.deleteConfirm"))) return
    startTransition(async () => {
      await deleteRoomEvent(id)
    })
  }

  const openCreateDialog = () => {
    setEditingEvent(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (event: RoomEvent) => {
    setEditingEvent(event)
    setForm({
      timestamp: new Date(event.timestamp).toISOString().slice(0, 16),
      category: event.category,
      description: event.description,
      metadata: event.metadata || {},
      vibeRating: event.vibeRating,
    })
    setDialogOpen(true)
  }

  // Get paint/flooring events for swatch library
  const paintEvents = useMemo(() => {
    return events
      .filter((e) => e.category === "Aesthetics" && e.metadata?.colorCode)
      .slice(0, 3)
  }, [events])

  // Statistics
  const stats = useMemo(() => {
    const incidentCount = events.filter((e) => e.category === "Incident").length
    const maintenanceCount = events.filter((e) => e.category === "Maintenance").length
    const lastEvent = events.length > 0 ? events[0] : null

    return {
      total: events.length,
      incidents: incidentCount,
      maintenance: maintenanceCount,
      lastUpdate: lastEvent?.timestamp,
    }
  }, [events])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.totalEvents")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.maintenance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.incidents")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incidents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.lastUpdate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">
              {stats.lastUpdate || "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swatch Library */}
      {paintEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("swatchLibrary.title")}</CardTitle>
            <CardDescription>{t("swatchLibrary.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {paintEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div
                    className="w-12 h-12 rounded border-2"
                    style={{ backgroundColor: event.metadata?.colorCode || "#ccc" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {event.metadata?.brand || "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.metadata?.colorCode || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.metadata?.finish || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("timeline.title")}</CardTitle>
              <CardDescription>
                {room.description || t("emptyState")}
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("timeline.addEvent")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? t("timeline.editEvent") : t("timeline.createEvent")}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEvent ? t("timeline.updateEvent") : t("timeline.createEvent")}
                  </DialogDescription>
                </DialogHeader>
                <RoomEventFormFields form={form} setForm={setForm} />
                <DialogFooter>
                  <Button
                    onClick={editingEvent ? handleUpdate : handleCreate}
                    disabled={isPending || !form.description}
                  >
                    {editingEvent ? t("timeline.updateEvent") : t("timeline.createEvent")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">{t("timeline.noEvents")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => {
                const Icon = categoryIcons[event.category] || Calendar
                return (
                  <div
                    key={event.id}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {index < events.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{t(`categories.${event.category}`)}</Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {event.timestamp}
                            </span>
                            {event.vibeRating && (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: event.vibeRating }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm">{event.description}</p>
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(event.metadata).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  <span className="font-medium">{key}:</span> {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(event)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
