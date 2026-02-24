"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Camera, Calendar, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { de, enUS } from "date-fns/locale"
import { usePathname } from "next/navigation"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { LandscapingProject } from "@/lib/data"
import { createLandscapingProject, updateLandscapingProject, deleteLandscapingProject } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function GardenGallery({ initialProjects }: { initialProjects: LandscapingProject[] }) {
    const t = useTranslations("Outdoor")
    const path = usePathname()
    const locale = path.split("/")[1]
    const dateLocale = locale === "de" ? de : enUS
    const { toast } = useToast()

    const [projects, setProjects] = useState<LandscapingProject[]>(initialProjects)
    const [isOpen, setIsOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<LandscapingProject | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")
    const [beforeImagePath, setBeforeImagePath] = useState("")
    const [afterImagePath, setAfterImagePath] = useState("")

    const openNewDialog = () => {
        setEditingProject(null)
        setTitle("")
        setDate(new Date().toISOString().split("T")[0])
        setDescription("")
        setBeforeImagePath("")
        setAfterImagePath("")
        setIsOpen(true)
    }

    const openEditDialog = (project: LandscapingProject) => {
        setEditingProject(project)
        setTitle(project.title)
        setDate(project.date)
        setDescription(project.description || "")
        setBeforeImagePath(project.beforeImagePath || "")
        setAfterImagePath(project.afterImagePath || "")
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Temporary path until real upload mechanism is implemented.
            let finalBeforePath = beforeImagePath
            let finalAfterPath = afterImagePath

            if (editingProject) {
                await updateLandscapingProject(editingProject.id, {
                    title,
                    date,
                    description,
                    beforeImagePath: finalBeforePath,
                    afterImagePath: finalAfterPath,
                })
                const updated = projects.map(p =>
                    p.id === editingProject.id
                        ? { ...p, title, date, description, beforeImagePath: finalBeforePath, afterImagePath: finalAfterPath }
                        : p
                )
                setProjects(updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            } else {
                await createLandscapingProject({
                    title,
                    date,
                    description,
                    beforeImagePath: finalBeforePath,
                    afterImagePath: finalAfterPath,
                })
                window.location.reload()
            }
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save project data.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return

        try {
            await deleteLandscapingProject(id)
            setProjects(projects.filter(p => p.id !== id))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete project.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("tabs.gallery")}</h3>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingProject ? "Edit Project" : "New Landscaping Project"}</DialogTitle>
                            <DialogDescription>
                                Document your hard work. Log before and after photos.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g. Backyard Mulch & Planting"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Completion Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="e.g. Planted 5 new Hydrangeas and laid 3 yards of mulch."
                                    className="resize-none h-20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="beforeImage">Before Image URL (Optional)</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="beforeImage"
                                            value={beforeImagePath}
                                            onChange={e => setBeforeImagePath(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="afterImage">After Image URL (Optional)</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="afterImage"
                                            value={afterImagePath}
                                            onChange={e => setAfterImagePath(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length === 0 ? (
                <div className="text-center p-12 border rounded-lg bg-card/50 text-muted-foreground border-dashed">
                    No projects documented. Capture your next landscaping change!
                </div>
            ) : (
                <div className="space-y-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="overflow-hidden">
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{project.title}</CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {format(new Date(project.date), "PPP", { locale: dateLocale })}
                                        </CardDescription>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(project)}>
                                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/80 hover:text-red-600 hover:bg-red-100/50" onClick={() => handleDelete(project.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {project.description && (
                                    <div className="p-4 text-sm text-foreground/80 border-b">
                                        {project.description}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 divide-x">
                                    <div className="p-4 bg-muted/10">
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 flex items-center">
                                            <Camera className="h-3.5 w-3.5 mr-1.5" />
                                            Before
                                        </div>
                                        {project.beforeImagePath ? (
                                            <div className="aspect-[4/3] rounded-md overflow-hidden bg-black/5 relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={project.beforeImagePath}
                                                    alt={`Before: ${project.title}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[4/3] rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground/50 bg-background/50">
                                                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                                <span className="text-xs">No image provided</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-muted/10">
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 flex items-center">
                                            <Camera className="h-3.5 w-3.5 mr-1.5" />
                                            After
                                        </div>
                                        {project.afterImagePath ? (
                                            <div className="aspect-[4/3] rounded-md overflow-hidden bg-black/5 relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={project.afterImagePath}
                                                    alt={`After: ${project.title}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[4/3] rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground/50 bg-background/50">
                                                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                                <span className="text-xs">No image provided</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
