"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Star,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Receipt,
  FileText,
} from "lucide-react"
import { serviceProviders, invoices, formatCurrency } from "@/lib/data"
import { Button } from "@/components/ui/button"

function DirectoryTab() {
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return serviceProviders.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Dienstleister suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {"Keine Dienstleister gefunden. Diesmal bist du auf dich allein gestellt."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((provider) => {
            const isExpanded = expandedId === provider.id
            const totalCost = provider.history.reduce((s, h) => s + h.cost, 0)

            return (
              <Card key={provider.id} className="transition-all">
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : provider.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                        {provider.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {provider.name}
                          </p>
                          <Badge variant="secondary" className="text-[10px]">
                            {provider.specialty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Phone className="h-3 w-3" /> {provider.phone}
                          </span>
                          <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Mail className="h-3 w-3" /> {provider.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < provider.rating
                                  ? "fill-chart-3 text-chart-3"
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </button>

                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Servicehistorie
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gesamt: {formatCurrency(totalCost)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {provider.history.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              {entry.description}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {new Date(entry.date).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-medium tabular-nums text-foreground">
                              {formatCurrency(entry.cost)}
                            </span>
                            {entry.taxRelevant && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-success/10 text-success border-success/20"
                              >
                                Steuer
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {provider.history.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        {"Noch keine Reparaturen. Drueck die Daumen."}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InvoicesTab() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return invoices.filter(
      (i) =>
        i.providerName.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.fileName.toLowerCase().includes(q)
    )
  }, [search])

  const taxTotal = filtered
    .filter((i) => i.taxRelevant)
    .reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechnungen suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Receipt className="h-3 w-3 mr-1" />
            Steuerlich absetzbar: {formatCurrency(taxTotal)}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Datum</TableHead>
                <TableHead className="text-xs">Dienstleister</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Beschreibung</TableHead>
                <TableHead className="text-xs text-right">Betrag</TableHead>
                <TableHead className="text-xs text-center">Steuer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                    {"Noch keine Rechnungen. Dein Geldbeutel dankt es dir."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm tabular-nums">
                      {new Date(inv.date).toLocaleDateString("de-DE", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {inv.providerName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                      {inv.description}
                    </TableCell>
                    <TableCell className="text-sm font-medium tabular-nums text-right text-foreground">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      {inv.taxRelevant ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-success/10 text-success border-success/20"
                        >
                          Ja
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nein</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function ServiceHub() {
  return (
    <Tabs defaultValue="directory" className="space-y-4">
      <TabsList>
        <TabsTrigger value="directory" className="gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          Verzeichnis
        </TabsTrigger>
        <TabsTrigger value="invoices" className="gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Rechnungen (Handwerkerkosten)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="directory">
        <DirectoryTab />
      </TabsContent>
      <TabsContent value="invoices">
        <InvoicesTab />
      </TabsContent>
    </Tabs>
  )
}
