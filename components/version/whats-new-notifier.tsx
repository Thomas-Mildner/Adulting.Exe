"use client"

import * as React from "react"
import { useVersionCheck } from "@/hooks/use-version-check"
import { ReleaseNotesDialog } from "@/components/version/release-notes-dialog"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

const STORAGE_KEY = "adulting_last_seen_version"

export function WhatsNewNotifier() {
  const t = useTranslations("ReleaseNotes")
  const {
    currentVersion,
    latestVersion,
    isUpdateAvailable,
    releaseNotes,
    releaseName,
    releaseUrl,
    publishedAt,
  } = useVersionCheck()

  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || !currentVersion) return

    try {
      const lastSeen = localStorage.getItem(STORAGE_KEY)

      if (!lastSeen) {
        // First install, initialize without toast
        localStorage.setItem(STORAGE_KEY, currentVersion)
        return
      }

      if (lastSeen !== currentVersion) {
        // App was updated to a newer version!
        localStorage.setItem(STORAGE_KEY, currentVersion)

        toast(t("updatedNotification", { version: currentVersion }), {
          description: t("subtitle"),
          duration: 10000,
          action: {
            label: t("whatsNew"),
            onClick: () => setDialogOpen(true),
          },
        })
      }
    } catch {
      // Ignore localStorage exceptions (e.g. private browsing storage restrictions)
    }
  }, [currentVersion, t])

  return (
    <ReleaseNotesDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      currentVersion={currentVersion}
      latestVersion={latestVersion}
      isUpdateAvailable={isUpdateAvailable}
      releaseNotes={releaseNotes}
      releaseName={releaseName}
      releaseUrl={releaseUrl}
      publishedAt={publishedAt}
    />
  )
}
