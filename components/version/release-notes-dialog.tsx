"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  Wrench,
  AlertTriangle,
  GitCommit,
  ExternalLink,
  Tag,
  Calendar,
  CheckCircle2,
  ArrowUpCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"

interface ParsedItem {
  raw: string
  scope?: string
  text: string
  commitHash?: string
  commitUrl?: string
}

interface ParsedSection {
  title: string
  type: "features" | "fixes" | "breaking" | "other"
  items: ParsedItem[]
}

function parseReleaseNotes(markdown: string): { intro: string; sections: ParsedSection[] } {
  if (!markdown) return { intro: "", sections: [] }

  const lines = markdown.split("\n")
  const sections: ParsedSection[] = []
  let currentSection: ParsedSection | null = null
  const introLines: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()

    // Match headers like ### Features or ### Bug Fixes or ## Features
    if (line.startsWith("###") || line.startsWith("##")) {
      const headerTitle = line.replace(/^#+\s*/, "").trim()
      const lower = headerTitle.toLowerCase()

      let type: ParsedSection["type"] = "other"
      if (lower.includes("feat")) {
        type = "features"
      } else if (lower.includes("fix") || lower.includes("bug")) {
        type = "fixes"
      } else if (lower.includes("break")) {
        type = "breaking"
      }

      currentSection = {
        title: headerTitle,
        type,
        items: [],
      }
      sections.push(currentSection)
      continue
    }

    // Match list items: * or -
    if (line.startsWith("*") || line.startsWith("-")) {
      const itemContent = line.replace(/^[-*]\s*/, "").trim()

      // Extract scope: e.g. **vault:** or **(vault):**
      let scope: string | undefined
      let remaining = itemContent
      const scopeMatch = remaining.match(/^\*\*\(?([a-zA-Z0-9_\- ]+)\)?:\*\*\s*(.*)$/)
      if (scopeMatch) {
        scope = scopeMatch[1]
        remaining = scopeMatch[2]
      }

      // Extract commit link: e.g. ([abc1234](https://github.com/...))
      let commitHash: string | undefined
      let commitUrl: string | undefined
      const commitMatch = remaining.match(/\(\[([a-f0-9]{7,})\]\((https?:\/\/[^\s)]+)\)\)$/)
      if (commitMatch) {
        commitHash = commitMatch[1]
        commitUrl = commitMatch[2]
        remaining = remaining.replace(/\s*\(\[[a-f0-9]{7,}\]\(https?:\/\/[^\s)]+\)\)$/, "").trim()
      }

      const parsedItem: ParsedItem = {
        raw: line,
        scope,
        text: remaining,
        commitHash,
        commitUrl,
      }

      if (currentSection) {
        currentSection.items.push(parsedItem)
      } else {
        // Fallback section if bullet appears before header
        currentSection = {
          title: "Changes",
          type: "other",
          items: [parsedItem],
        }
        sections.push(currentSection)
      }
      continue
    }

    // If it's a non-empty line before any section header, treat as intro
    if (line && !currentSection && !line.startsWith("#")) {
      introLines.push(line)
    }
  }

  return {
    intro: introLines.join(" "),
    sections,
  }
}

interface ReleaseNotesDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  currentVersion: string
  latestVersion?: string | null
  isUpdateAvailable?: boolean
  releaseNotes?: string | null
  releaseName?: string | null
  releaseUrl: string
  publishedAt?: string | null
}

export function ReleaseNotesDialog({
  open,
  onOpenChange,
  trigger,
  currentVersion,
  latestVersion,
  isUpdateAvailable = false,
  releaseNotes,
  releaseName,
  releaseUrl,
  publishedAt,
}: ReleaseNotesDialogProps) {
  const t = useTranslations("ReleaseNotes")

  const displayVersion = isUpdateAvailable && latestVersion ? latestVersion : currentVersion
  const parsed = React.useMemo(() => parseReleaseNotes(releaseNotes || ""), [releaseNotes])

  const formattedDate = React.useMemo(() => {
    if (!publishedAt) return null
    try {
      return new Date(publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return null
    }
  }, [publishedAt])

  const getSectionIcon = (type: ParsedSection["type"]) => {
    switch (type) {
      case "features":
        return <Sparkles className="h-4 w-4 text-emerald-500" />
      case "fixes":
        return <Wrench className="h-4 w-4 text-amber-500" />
      case "breaking":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <GitCommit className="h-4 w-4 text-primary" />
    }
  }

  const getSectionBadgeClass = (type: ParsedSection["type"]) => {
    switch (type) {
      case "features":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "fixes":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "breaking":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {releaseName || `Adulting.exe v${displayVersion}`}
                </DialogTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  v{displayVersion}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                <span>{t("subtitle")}</span>
                {formattedDate && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </span>
                )}
              </DialogDescription>
            </div>
            {isUpdateAvailable ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs shrink-0 flex items-center gap-1.5 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {t("updateAvailable")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs shrink-0 flex items-center gap-1 py-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {t("upToDate")}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {parsed.intro && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {parsed.intro}
              </p>
            )}

            {parsed.sections.length > 0 ? (
              parsed.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getSectionIcon(section.type)}
                    <h3 className="text-sm font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${getSectionBadgeClass(section.type)}`}
                    >
                      {section.items.length}
                    </Badge>
                  </div>

                  <div className="rounded-lg border bg-card/50 divide-y overflow-hidden shadow-xs">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="p-3 text-xs leading-relaxed flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="space-y-1">
                          {item.scope && (
                            <Badge
                              variant="secondary"
                              className="mr-2 text-[10px] font-mono uppercase tracking-wider py-0"
                            >
                              {item.scope}
                            </Badge>
                          )}
                          <span className="text-foreground">{item.text}</span>
                        </div>

                        {item.commitHash && item.commitUrl && (
                          <a
                            href={item.commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5 bg-muted/60 px-1.5 py-0.5 rounded border"
                            title="View commit on GitHub"
                          >
                            <span>{item.commitHash}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : releaseNotes ? (
              <div className="rounded-lg bg-muted/40 p-4 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed border">
                {releaseNotes}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center space-y-2">
                <GitCommit className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs text-muted-foreground">{t("noNotes")}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t bg-muted/20 flex sm:justify-between items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
            <a href={releaseUrl} target="_blank" rel="noopener noreferrer">
              <span>{t("viewOnGithub")}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          {onOpenChange && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
