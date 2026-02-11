"use client"

import React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Flame,
  Droplets,
  Wifi,
  Building,
  FolderOpen,
  FileText,
  FileCode,
  ExternalLink,
} from "lucide-react"
import { type Document } from "@/lib/data"
import { Button } from "@/components/ui/button"

const categoryIcons: Record<Document["category"], React.ElementType> = {
  Heating: Flame,
  Plumbing: Droplets,
  "Smart Home": Wifi,
  Structural: Building,
  General: FolderOpen,
}

const categoryColors: Record<Document["category"], string> = {
  Heating: "bg-chart-4/10 text-chart-4",
  Plumbing: "bg-primary/10 text-primary",
  "Smart Home": "bg-chart-5/10 text-chart-5",
  Structural: "bg-chart-3/10 text-chart-3",
  General: "bg-muted text-muted-foreground",
}

const categories: Document["category"][] = [
  "Heating",
  "Plumbing",
  "Smart Home",
  "Structural",
  "General",
]

export function Library({ documents }: { documents: Document[] }) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return documents
      .filter(
        (d) =>
          (activeCategory === "all" || d.category === activeCategory) &&
          (d.title.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
  }, [search, activeCategory])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full sm:w-auto"
        >
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">Alle</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Dokumente suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {"Keine Dokumente gefunden. Die Wissensgötter haben dich verlassen."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const Icon = categoryIcons[doc.category]
            return (
              <Dialog key={doc.id}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${categoryColors[doc.category]}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground leading-snug">
                            {doc.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] gap-1">
                            {doc.type === "markdown" ? (
                              <FileCode className="h-2.5 w-2.5" />
                            ) : (
                              <FileText className="h-2.5 w-2.5" />
                            )}
                            {doc.type.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            Aktualisiert{" "}
                            {new Date(doc.updatedAt).toLocaleDateString("de-DE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base">{doc.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {doc.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {doc.description}
                    </p>
                    {doc.content && (
                      <div className="rounded-lg bg-muted/50 p-4 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed border">
                        {doc.content}
                      </div>
                    )}
                    {!doc.content && (
                      <div className="rounded-lg border border-dashed p-8 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {"PDF-Vorschau nicht verfügbar. Aber immerhin weißt du, dass es existiert."}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        Herunterladen
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      )}
    </div>
  )
}
