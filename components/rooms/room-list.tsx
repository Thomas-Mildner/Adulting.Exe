"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Home, Pencil, Trash2, Calendar } from "lucide-react"
import type { Room } from "@/lib/data"
import { createRoom, updateRoom, deleteRoom } from "@/lib/actions"
import { useState, useTransition } from "react"
import { Link } from "@/lib/navigation"

type FormData = {
  name: string
  type: string
  floor?: string
  description?: string
}

const emptyForm: FormData = {
  name: "",
  type: "other",
  floor: "ground",
  description: "",
}

function RoomFormFields({
  form,
  setForm,
}: {
  form: FormData
  setForm: (fn: (prev: FormData) => FormData) => void
}) {
  const t = useTranslations("Rooms")

  const roomTypes = [
    "kitchen",
    "bedroom",
    "bathroom",
    "living",
    "dining",
    "office",
    "garage",
    "basement",
    "attic",
    "hallway",
    "laundry",
    "storage",
    "other",
  ]

  const floors = ["basement", "ground", "first", "second", "third", "attic"]

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">{t("roomName")}</Label>
        <Input
          id="name"
          placeholder={t("roomName")}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="type">{t("roomType")}</Label>
          <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`roomTypes.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="floor">{t("floor")}</Label>
          <Select value={form.floor} onValueChange={(v) => setForm((p) => ({ ...p, floor: v }))}>
            <SelectTrigger id="floor">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {floors.map((floor) => (
                <SelectItem key={floor} value={floor}>
                  {t(`floors.${floor}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Input
          id="description"
          placeholder={t("description")}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />
      </div>
    </div>
  )
}

export function RoomList({ rooms }: { rooms: Room[] }) {
  const t = useTranslations("Rooms")
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const handleCreate = () => {
    startTransition(async () => {
      await createRoom(form)
      setDialogOpen(false)
      setForm(emptyForm)
    })
  }

  const handleUpdate = () => {
    if (!editingRoom) return
    startTransition(async () => {
      await updateRoom(editingRoom.id, form)
      setDialogOpen(false)
      setEditingRoom(null)
      setForm(emptyForm)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm(t("deleteConfirm"))) return
    startTransition(async () => {
      await deleteRoom(id)
    })
  }

  const openCreateDialog = () => {
    setEditingRoom(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (room: Room) => {
    setEditingRoom(room)
    setForm({
      name: room.name,
      type: room.type,
      floor: room.floor,
      description: room.description,
    })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addRoom")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? t("editRoom") : t("createRoom")}
              </DialogTitle>
              <DialogDescription>
                {editingRoom ? t("updateRoom") : t("createRoom")}
              </DialogDescription>
            </DialogHeader>
            <RoomFormFields form={form} setForm={setForm} />
            <DialogFooter>
              <Button
                onClick={editingRoom ? handleUpdate : handleCreate}
                disabled={isPending || !form.name}
              >
                {editingRoom ? t("updateRoom") : t("createRoom")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">{t("noRooms")}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{room.name}</CardTitle>
                    <CardDescription>
                      {t(`roomTypes.${room.type}`)}
                      {room.floor && ` · ${t(`floors.${room.floor}`)}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(room)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {room.description && (
                  <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {room.eventCount || 0} {t("stats.totalEvents")}
                    </span>
                  </div>
                  <Link href={`/rooms/${room.id}`}>
                    <Button variant="outline" size="sm">
                      {t("timeline.title")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
