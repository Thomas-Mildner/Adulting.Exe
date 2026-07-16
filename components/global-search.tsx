"use client"

import * as React from "react"
import { useRouter } from "@/lib/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  PackageOpen,
  Wrench,
  BookOpen,
  Gauge,
  Sparkles,
  HandCoins,
  ClipboardCheck,
  Settings,
  Search,
  Stethoscope,
  Trash2,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"

export function GlobalSearch() {
  const t = useTranslations("GlobalSearch")
  const tNav = useTranslations("Navigation")
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const pages = [
    { title: tNav("dashboard"), href: "/", icon: LayoutDashboard, keywords: ["start", "home", "dashboard"] },
    { title: tNav("vault"), href: "/vault", icon: PackageOpen, keywords: ["warranty", "appliance", "garantie", "gerät", "quittung"] },
    { title: tNav("services"), href: "/services", icon: Wrench, keywords: ["service", "provider", "invoice", "handwerker", "dienstleister", "rechnung"] },
    { title: tNav("library"), href: "/library", icon: BookOpen, keywords: ["library", "document", "pdf", "bibliothek", "datei"] },
    { title: tNav("maintenance"), href: "/maintenance", icon: ClipboardCheck, keywords: ["maintenance", "task", "due", "repair", "wartung", "aufgabe", "fällig", "reparatur"] },
    { title: tNav("utilities"), href: "/utilities", icon: Gauge, keywords: ["utilities", "power", "water", "heating", "consumption", "ressourcen", "strom", "wasser", "heizung", "verbrauch"] },
    { title: tNav("wishlist"), href: "/wishlist", icon: Sparkles, keywords: ["wishlist", "project", "saving", "dream", "wunschliste", "projekt", "sparen", "traum"] },
    { title: tNav("lending"), href: "/lending", icon: HandCoins, keywords: ["lending", "borrow", "item", "return", "verleih", "verliehen", "gegenstand", "rückgabe"] },
    { title: tNav("illnesses"), href: "/illnesses", icon: Stethoscope, keywords: ["illness", "sick", "health", "fever", "krankheit", "krank", "gesundheit", "fieber"] },
    { title: tNav("waste"), href: "/waste", icon: Trash2, keywords: ["waste", "calendar", "garbage", "trash", "pickup", "müll", "kalender", "abfall", "tonne", "leerung"] },
    { title: tNav("settings"), href: "/settings", icon: Settings, keywords: ["settings", "profile", "notification", "data", "einstellungen", "profil", "benachrichtigung", "daten"] },
  ]

  const quickActions = [
    { title: t("actions.newAppliance"), href: "/vault", keywords: ["create", "add", "appliance", "erstellen", "hinzufügen", "gerät"] },
    { title: t("actions.newMaintenance"), href: "/maintenance", keywords: ["create", "maintenance", "erstellen", "neue wartung"] },
    { title: t("actions.newInvoice"), href: "/services", keywords: ["create", "invoice", "neue rechnung"] },
    { title: t("actions.newReading"), href: "/utilities", keywords: ["record", "reading", "meter", "ablesen", "strom", "wasser"] },
  ]

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const navigate = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-56 hidden md:flex items-center"
      >
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          readOnly
          placeholder={t("placeholder")}
          className="pl-8 h-8 text-xs bg-background cursor-pointer"
          tabIndex={-1}
        />
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("commandPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("empty")}</CommandEmpty>

          <CommandGroup heading={t("sections.pages")}>
            {pages.map((page) => (
              <CommandItem
                key={page.href}
                value={`${page.title} ${page.keywords.join(" ")}`}
                onSelect={() => navigate(page.href)}
              >
                <page.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{page.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={t("sections.actions")}>
            {quickActions.map((action) => (
              <CommandItem
                key={action.title}
                value={`${action.title} ${action.keywords.join(" ")}`}
                onSelect={() => navigate(action.href)}
              >
                <span className="mr-2 text-muted-foreground">→</span>
                <span>{action.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
