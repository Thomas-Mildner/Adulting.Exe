"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

const pages = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, keywords: ["start", "übersicht", "home"] },
  { title: "Der Tresor", href: "/vault", icon: PackageOpen, keywords: ["garantie", "gerät", "quittung", "appliance"] },
  { title: "Rettungsteam", href: "/services", icon: Wrench, keywords: ["handwerker", "dienstleister", "rechnung", "invoice"] },
  { title: "Bibliothek", href: "/library", icon: BookOpen, keywords: ["dokument", "pdf", "datei"] },
  { title: "Wartungen", href: "/maintenance", icon: ClipboardCheck, keywords: ["aufgabe", "fällig", "reparatur", "prüfen"] },
  { title: "Ressourcenfresser", href: "/utilities", icon: Gauge, keywords: ["strom", "wasser", "heizung", "zählerstand", "verbrauch"] },
  { title: "Wunschliste", href: "/wishlist", icon: Sparkles, keywords: ["projekt", "sparen", "wunsch", "traum"] },
  { title: "Verleih-O-Meter", href: "/lending", icon: HandCoins, keywords: ["verliehen", "gegenstand", "rückgabe", "leihen"] },
  { title: "Einstellungen", href: "/settings", icon: Settings, keywords: ["profil", "benachrichtigung", "daten", "export"] },
]

const quickActions = [
  { title: "Neues Gerät erfassen", href: "/vault", keywords: ["erstellen", "hinzufügen", "gerät"] },
  { title: "Wartung anlegen", href: "/maintenance", keywords: ["erstellen", "neue wartung"] },
  { title: "Rechnung erfassen", href: "/services", keywords: ["neue rechnung", "invoice"] },
  { title: "Zählerstände eintragen", href: "/utilities", keywords: ["ablesen", "strom", "wasser"] },
]

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

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
          placeholder="Alles durchsuchen..."
          className="pl-8 h-8 text-xs bg-background cursor-pointer"
          tabIndex={-1}
        />
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Seite, Aktion oder Stichwort suchen..." />
        <CommandList>
          <CommandEmpty>Nichts gefunden. Versuch ein anderes Stichwort.</CommandEmpty>

          <CommandGroup heading="Seiten">
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

          <CommandGroup heading="Schnellaktionen">
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
