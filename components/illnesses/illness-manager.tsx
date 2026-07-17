"use client"

import { useMemo, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  Activity,
  CalendarDays,
  Pencil,
  Plus,
  Stethoscope,
  Thermometer,
  Trash2,
  User,
  Users,
} from "lucide-react"

import type { Illness, Person } from "@/lib/data"
import { createIllness, deleteIllness, updateIllness } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { PersonDialog } from "@/components/documents/person-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  persons: Person[]
  illnesses: Illness[]
}

type IllnessFormData = {
  personId: string
  name: string
  startDate: string
  endDate: string
  notes: string
}

type DayCell = {
  date: string
  count: number
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0]
}

function emptyIllnessForm(personId: string): IllnessFormData {
  return {
    personId,
    name: "",
    startDate: getTodayISO(),
    endDate: "",
    notes: "",
  }
}

function toDateOnly(dateString: string) {
  const date = new Date(dateString)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(toDateOnly(dateString))
}

function formatDateRange(illness: Illness, ongoingLabel: string) {
  const start = formatDate(illness.startDate)
  const end = illness.endDate ? formatDate(illness.endDate) : ongoingLabel
  return `${start} – ${end}`
}

function getIllnessStatus(illness: Illness): "active" | "resolved" {
  const today = toDateOnly(getTodayISO())
  const start = toDateOnly(illness.startDate)
  const end = illness.endDate ? toDateOnly(illness.endDate) : today

  if (start <= today && end >= today) {
    return "active"
  }

  return "resolved"
}

function getTrackedDays(illness: Illness) {
  const start = toDateOnly(illness.startDate)
  const end = illness.endDate ? toDateOnly(illness.endDate) : toDateOnly(getTodayISO())
  const diff = end.getTime() - start.getTime()

  return diff >= 0 ? Math.floor(diff / 86400000) + 1 : 0
}

function getCoverageMap(illnesses: Illness[], year: number) {
  const dayMap = new Map<string, number>()
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)
  yearStart.setHours(0, 0, 0, 0)
  yearEnd.setHours(0, 0, 0, 0)
  const today = toDateOnly(getTodayISO())

  for (const illness of illnesses) {
    const illnessStart = toDateOnly(illness.startDate)
    const illnessEnd = illness.endDate ? toDateOnly(illness.endDate) : today
    const rangeStart = illnessStart > yearStart ? illnessStart : yearStart
    const rangeEnd = illnessEnd < yearEnd ? illnessEnd : yearEnd

    if (rangeEnd < rangeStart) continue

    const cursor = new Date(rangeStart)
    while (cursor <= rangeEnd) {
      const key = cursor.toISOString().split("T")[0]
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  return dayMap
}

function getWeeksForYear(year: number, dayMap: Map<string, number>) {
  const firstDay = new Date(year, 0, 1)
  const lastDay = new Date(year, 11, 31)
  firstDay.setHours(0, 0, 0, 0)
  lastDay.setHours(0, 0, 0, 0)

  const dayCount = Math.floor((lastDay.getTime() - firstDay.getTime()) / 86400000) + 1
  const weekCount = Math.ceil((dayCount + firstDay.getDay()) / 7)
  const weeks = Array.from({ length: weekCount }, () => Array<DayCell | null>(7).fill(null))

  const cursor = new Date(firstDay)
  while (cursor <= lastDay) {
    const offset = Math.floor((cursor.getTime() - firstDay.getTime()) / 86400000)
    const weekIndex = Math.floor((offset + firstDay.getDay()) / 7)
    const weekdayIndex = cursor.getDay()
    const key = cursor.toISOString().split("T")[0]

    weeks[weekIndex][weekdayIndex] = {
      date: key,
      count: dayMap.get(key) ?? 0,
    }

    cursor.setDate(cursor.getDate() + 1)
  }

  return weeks
}

function getYears(illnesses: Illness[]) {
  const years = new Set<number>([new Date().getFullYear()])

  for (const illness of illnesses) {
    years.add(toDateOnly(illness.startDate).getFullYear())
    years.add(toDateOnly(illness.endDate ?? getTodayISO()).getFullYear())
  }

  return Array.from(years).sort((a, b) => b - a)
}

function getIntensityClass(count: number) {
  if (count <= 0) return "bg-muted/40 border-border/40"
  if (count === 1) return "bg-emerald-200 border-emerald-300 dark:bg-emerald-900/70 dark:border-emerald-800"
  if (count === 2) return "bg-emerald-300 border-emerald-400 dark:bg-emerald-800 dark:border-emerald-700"
  return "bg-emerald-500 border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500"
}

function YearHeatmap({ illnesses, year }: { illnesses: Illness[]; year: number }) {
  const t = useTranslations("Illnesses")
  const dayMap = useMemo(() => getCoverageMap(illnesses, year), [illnesses, year])
  const weeks = useMemo(() => getWeeksForYear(year, dayMap), [dayMap, year])
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { month: "short" }),
    []
  )

  const monthLabels = Array.from({ length: 12 }, (_, month) => {
    const firstOfMonth = new Date(year, month, 1)
    const offset = Math.floor((firstOfMonth.getTime() - new Date(year, 0, 1).getTime()) / 86400000)
    const weekIndex = Math.floor((offset + new Date(year, 0, 1).getDay()) / 7)

    return {
      label: monthFormatter.format(firstOfMonth),
      weekIndex,
    }
  })

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{year}</CardTitle>
            <CardDescription>{t("heatmapDescription")}</CardDescription>
          </div>
          <Badge variant="secondary">{t("sickDaysCount", { count: dayMap.size })}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <div className="min-w-max space-y-2">
            <div className="relative h-4">
              {monthLabels.map((month) => (
                <span
                  key={`${year}-${month.label}`}
                  className="absolute text-[10px] text-muted-foreground"
                  style={{ left: `${month.weekIndex * 15}px` }}
                >
                  {month.label}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={`${year}-week-${weekIndex}`} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day?.date ?? `${year}-empty-${weekIndex}-${dayIndex}`}
                      className={cn(
                        "h-3 w-3 rounded-[3px] border transition-colors",
                        day ? getIntensityClass(day.count) : "border-transparent bg-transparent"
                      )}
                      title={day ? `${formatDate(day.date)} · ${t("heatmapTooltip", { count: day.count })}` : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
          <span>{t("legendLess")}</span>
          {[0, 1, 2, 3].map((count) => (
            <span key={count} className={cn("h-3 w-3 rounded-[3px] border", getIntensityClass(count))} />
          ))}
          <span>{t("legendMore")}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function IllnessCard({
  illness,
  onEdit,
  onDelete,
}: {
  illness: Illness
  onEdit: (illness: Illness) => void
  onDelete: (illness: Illness) => void
}) {
  const t = useTranslations("Illnesses")
  const isActive = getIllnessStatus(illness) === "active"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{illness.name}</CardTitle>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? t("status.active") : t("status.resolved")}
              </Badge>
            </div>
            <CardDescription>{illness.personName}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(illness)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">{t("editIllness")}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(illness)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t("deleteIllness")}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDateRange(illness, t("ongoing"))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Activity className="h-4 w-4" />
            {t("trackedDays", { count: getTrackedDays(illness) })}
          </span>
        </div>
        {illness.notes && <p className="text-muted-foreground leading-relaxed">{illness.notes}</p>}
      </CardContent>
    </Card>
  )
}

export function IllnessManager({ persons, illnesses }: Props) {
  const t = useTranslations("Illnesses")
  const [selectedTab, setSelectedTab] = useState<string>(persons[0]?.id ?? "overview")
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState(false)
  const [isIllnessDialogOpen, setIsIllnessDialogOpen] = useState(false)
  const [editingIllness, setEditingIllness] = useState<Illness | undefined>(undefined)
  const [form, setForm] = useState<IllnessFormData>(emptyIllnessForm(persons[0]?.id ?? ""))
  const [isPending, startTransition] = useTransition()

  const currentYear = new Date().getFullYear()
  const currentYearDayMap = useMemo(() => getCoverageMap(illnesses, currentYear), [illnesses, currentYear])
  const activeIllnesses = useMemo(
    () => illnesses.filter((illness) => getIllnessStatus(illness) === "active").length,
    [illnesses]
  )
  const illnessesByPerson = useMemo(
    () => persons.map((person) => ({
      person,
      illnesses: illnesses.filter((illness) => illness.personId === person.id),
    })),
    [illnesses, persons]
  )

  function openCreateDialog() {
    const defaultPersonId = selectedTab !== "overview" ? selectedTab : (persons[0]?.id ?? "")
    setEditingIllness(undefined)
    setForm(emptyIllnessForm(defaultPersonId))
    setIsIllnessDialogOpen(true)
  }

  function openEditDialog(illness: Illness) {
    setEditingIllness(illness)
    setForm({
      personId: illness.personId,
      name: illness.name,
      startDate: illness.startDate,
      endDate: illness.endDate ?? "",
      notes: illness.notes ?? "",
    })
    setIsIllnessDialogOpen(true)
  }

  function handleDialogChange(open: boolean) {
    setIsIllnessDialogOpen(open)
    if (!open) {
      setEditingIllness(undefined)
      setForm(emptyIllnessForm(selectedTab !== "overview" ? selectedTab : (persons[0]?.id ?? "")))
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.personId) {
      toast.error(t("validation.personRequired"))
      return
    }

    if (form.endDate && form.endDate < form.startDate) {
      toast.error(t("validation.endDate"))
      return
    }

    startTransition(async () => {
      try {
        if (editingIllness) {
          await updateIllness(editingIllness.id, {
            personId: form.personId,
            name: form.name,
            startDate: form.startDate,
            endDate: form.endDate,
            notes: form.notes,
          })
          toast.success(t("messages.updated"))
        } else {
          await createIllness({
            personId: form.personId,
            name: form.name,
            startDate: form.startDate,
            endDate: form.endDate || undefined,
            notes: form.notes || undefined,
          })
          toast.success(t("messages.created"))
        }

        handleDialogChange(false)
      } catch {
        toast.error(t("messages.error"))
      }
    })
  }

  function handleDelete(illness: Illness) {
    if (!confirm(t("deleteConfirm", { name: illness.name }))) {
      return
    }

    startTransition(async () => {
      try {
        await deleteIllness(illness.id)
        toast.success(t("messages.deleted"))
      } catch {
        toast.error(t("messages.error"))
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 flex-1">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{persons.length}</p>
                <p className="text-xs text-muted-foreground">{t("stats.familyMembers")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{illnesses.length}</p>
                <p className="text-xs text-muted-foreground">{t("stats.entries")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Thermometer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{activeIllnesses}</p>
                <p className="text-xs text-muted-foreground">{t("stats.active")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{currentYearDayMap.size}</p>
                <p className="text-xs text-muted-foreground">{t("stats.currentYearDays", { year: currentYear })}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsPersonDialogOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            {t("addPerson")}
          </Button>
          <Button onClick={openCreateDialog} disabled={persons.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addIllness")}
          </Button>
        </div>
      </div>

      {persons.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>{t("noPeople")}</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            {persons.map((person) => (
              <TabsTrigger key={person.id} value={person.id}>
                {person.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {illnessesByPerson.map(({ person, illnesses: personIllnesses }) => {
                const personDayMap = getCoverageMap(personIllnesses, currentYear)
                return (
                  <Card key={person.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{person.name}</CardTitle>
                      <CardDescription>{t(`relationTypes.${person.relation}`)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("yearlySummary", { year: currentYear })}</span>
                        <span className="font-medium">{t("sickDaysCount", { count: personDayMap.size })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("records")}</span>
                        <span className="font-medium">{personIllnesses.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{t("allEntries")}</h2>
                <p className="text-sm text-muted-foreground">{t("allEntriesDescription")}</p>
              </div>

              {illnesses.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <p>{t("noIllnesses")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {illnesses.map((illness) => (
                    <IllnessCard
                      key={illness.id}
                      illness={illness}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {illnessesByPerson.map(({ person, illnesses: personIllnesses }) => {
            const years = getYears(personIllnesses)
            const currentPersonDayMap = getCoverageMap(personIllnesses, currentYear)

            return (
              <TabsContent key={person.id} value={person.id} className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    <CardDescription>{t("personSummaryDescription", { name: person.name })}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("sickDaysThisYear", { year: currentYear })}</p>
                      <p className="mt-1 text-2xl font-semibold">{currentPersonDayMap.size}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("records")}</p>
                      <p className="mt-1 text-2xl font-semibold">{personIllnesses.length}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("currentlySick")}</p>
                      <p className="mt-1 text-2xl font-semibold">
                        {personIllnesses.filter((illness) => getIllnessStatus(illness) === "active").length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">{t("activityByYear")}</h2>
                    <p className="text-sm text-muted-foreground">{t("activityByYearDescription")}</p>
                  </div>

                  <div className="grid gap-4">
                    {years.map((year) => (
                      <YearHeatmap key={`${person.id}-${year}`} illnesses={personIllnesses} year={year} />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">{t("entriesForPerson", { name: person.name })}</h2>
                    <p className="text-sm text-muted-foreground">{t("entriesForPersonDescription")}</p>
                  </div>

                  {personIllnesses.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground">
                        <p>{t("noIllnessesForPerson", { name: person.name })}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {personIllnesses.map((illness) => (
                        <IllnessCard
                          key={illness.id}
                          illness={illness}
                          onEdit={openEditDialog}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      )}

      <PersonDialog
        open={isPersonDialogOpen}
        onOpenChange={setIsPersonDialogOpen}
        descriptionOverride={t("personDialogDescription")}
      />

      <Dialog open={isIllnessDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingIllness ? t("editIllness") : t("addIllness")}</DialogTitle>
              <DialogDescription>{t("dialogDescription")}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="illness-person">{t("form.person")}</Label>
                <Select
                  value={form.personId}
                  onValueChange={(value) => setForm((current) => ({ ...current, personId: value }))}
                >
                  <SelectTrigger id="illness-person">
                    <SelectValue placeholder={t("form.personPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {persons.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="illness-name">{t("form.name")}</Label>
                <Input
                  id="illness-name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder={t("form.namePlaceholder")}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="illness-start">{t("form.startDate")}</Label>
                  <Input
                    id="illness-start"
                    type="date"
                    value={form.startDate}
                    onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="illness-end">{t("form.endDate")}</Label>
                  <Input
                    id="illness-end"
                    type="date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="illness-notes">{t("form.notes")}</Label>
                <Textarea
                  id="illness-notes"
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder={t("form.notesPlaceholder")}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {editingIllness ? t("save") : t("add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
