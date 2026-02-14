"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDaysRemaining, type LentItem } from "@/lib/data";
import { createLentItem, updateLentItem, deleteLentItem } from "@/lib/actions";
import { ShieldAlert, ShieldCheck, Plus, Pencil, Trash2 } from "lucide-react";

function TrustStars({ level }: { level: number }) {
  const t = useTranslations("Lending.trust");
  // keys: level1, level2, level3, level4, level5
  const labelKey = `level${level}` as "level1" | "level2" | "level3" | "level4" | "level5";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-sm ${i < level ? "bg-primary" : "bg-border"
              }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">{t(labelKey)}</span>
    </div>
  );
}

function TrustLevelSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const t = useTranslations("Lending.trust");

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((level) => {
        const labelKey = `level${level}` as "level1" | "level2" | "level3" | "level4" | "level5";
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level as 1 | 2 | 3 | 4 | 5)}
            className={`flex flex-col items-center gap-0.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${value === level
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/50"
              }`}
          >
            <div className="flex gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-2 rounded-sm ${i < level ? "bg-primary" : "bg-border"
                    }`}
                />
              ))}
            </div>
            <span className="text-[10px]">{t(labelKey)}</span>
          </button>
        )
      })}
    </div>
  );
}

export function LendOMeter({ lentItems }: { lentItems: LentItem[] }) {
  const [items, setItems] = useState(lentItems);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Lending");

  // Form state
  const [item, setItem] = useState("");
  const [borrower, setBorrower] = useState("");
  const [lentDate, setLentDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [expectedReturn, setExpectedReturn] = useState("");
  const [trustLevel, setTrustLevel] = useState<1 | 2 | 3 | 4 | 5>(3);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState("");
  const [editBorrower, setEditBorrower] = useState("");
  const [editLentDate, setEditLentDate] = useState("");
  const [editExpectedReturn, setEditExpectedReturn] = useState("");
  const [editTrustLevel, setEditTrustLevel] = useState<1 | 2 | 3 | 4 | 5>(3);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const overdue = items.filter((i) => getDaysRemaining(i.expectedReturn) < 0);
  const active = items.filter((i) => getDaysRemaining(i.expectedReturn) >= 0);

  function resetForm() {
    setItem("");
    setBorrower("");
    setLentDate(new Date().toISOString().split("T")[0]);
    setExpectedReturn("");
    setTrustLevel(3);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !borrower || !lentDate || !expectedReturn) return;

    startTransition(async () => {
      await createLentItem({
        item,
        borrower,
        lentDate,
        expectedReturn,
        trustLevel,
      });
      setItems((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          item,
          borrower,
          lentDate,
          expectedReturn,
          trustLevel,
        },
      ]);
      resetForm();
      setOpen(false);
    });
  }

  function openEdit(entry: LentItem) {
    setEditId(entry.id);
    setEditItem(entry.item);
    setEditBorrower(entry.borrower);
    setEditLentDate(entry.lentDate);
    setEditExpectedReturn(entry.expectedReturn);
    setEditTrustLevel(entry.trustLevel);
    setEditOpen(true);
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !editId ||
      !editItem ||
      !editBorrower ||
      !editLentDate ||
      !editExpectedReturn
    )
      return;

    startTransition(async () => {
      const updated = {
        item: editItem,
        borrower: editBorrower,
        lentDate: editLentDate,
        expectedReturn: editExpectedReturn,
        trustLevel: editTrustLevel,
      };
      await updateLentItem(editId!, updated);
      setItems((prev) =>
        prev.map((i) => (i.id === editId ? { ...i, ...updated } : i)),
      );
      setEditOpen(false);
      setEditId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteLentItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.totalItems")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {items.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("stats.scattered")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.onTime")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-success mt-1">
              {active.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("stats.faith")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.overdue")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-destructive mt-1">
              {overdue.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {overdue.length > 0
                ? t("stats.awkwardMessage")
                : t("stats.noPassiveAggressive")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">
                {t("list.title")}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {t("list.description")}
              </p>
            </div>
            <Dialog
              open={open}
              onOpenChange={(v) => {
                setOpen(v);
                if (!v) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  {t("create.button")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{t("create.title")}</DialogTitle>
                    <DialogDescription>
                      {t("create.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="item">{t("form.item")}</Label>
                      <Input
                        id="item"
                        placeholder={t("form.itemPlaceholder")}
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="borrower">{t("form.borrower")}</Label>
                      <Input
                        id="borrower"
                        placeholder={t("form.borrowerPlaceholder")}
                        value={borrower}
                        onChange={(e) => setBorrower(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="lentDate">{t("form.lentDate")}</Label>
                        <Input
                          id="lentDate"
                          type="date"
                          value={lentDate}
                          onChange={(e) => setLentDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="expectedReturn">{t("form.expectedReturn")}</Label>
                        <Input
                          id="expectedReturn"
                          type="date"
                          value={expectedReturn}
                          onChange={(e) => setExpectedReturn(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>{t("form.trustLevel")}</Label>
                      <TrustLevelSelector
                        value={trustLevel}
                        onChange={setTrustLevel}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setOpen(false);
                      }}
                    >
                      {t("form.cancel")}
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? t("form.saving") : t("form.save")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t("table.status")}</TableHead>
                <TableHead className="text-xs">{t("table.item")}</TableHead>
                <TableHead className="text-xs">{t("table.borrower")}</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">
                  {t("table.lentDate")}
                </TableHead>
                <TableHead className="text-xs">{t("table.returnBy")}</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">
                  {t("table.trustLevel")}
                </TableHead>
                <TableHead className="text-xs text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-sm text-muted-foreground"
                  >
                    {t("list.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                items
                  .sort(
                    (a, b) =>
                      getDaysRemaining(a.expectedReturn) -
                      getDaysRemaining(b.expectedReturn),
                  )
                  .map((item) => {
                    const days = getDaysRemaining(item.expectedReturn);
                    const isOverdue = days < 0;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          {isOverdue ? (
                            <ShieldAlert className="h-4 w-4 text-destructive" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-success" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">
                          {item.item}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {item.borrower}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground tabular-nums hidden sm:table-cell">
                          {new Date(item.lentDate).toLocaleDateString("de-DE", {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${isOverdue
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : days <= 3
                                  ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                                  : "text-muted-foreground"
                              }`}
                          >
                            {isOverdue
                              ? t("list.overdueBadge", { days: Math.abs(days) })
                              : t("list.remainingBadge", { days })}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <TrustStars level={item.trustLevel} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEdit(item)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditId(null);
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
              <DialogDescription>
                {t("edit.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-item">{t("form.item")}</Label>
                <Input
                  id="edit-item"
                  placeholder={t("form.itemPlaceholder")}
                  value={editItem}
                  onChange={(e) => setEditItem(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-borrower">{t("form.borrower")}</Label>
                <Input
                  id="edit-borrower"
                  placeholder={t("form.borrowerPlaceholder")}
                  value={editBorrower}
                  onChange={(e) => setEditBorrower(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lentDate">{t("form.lentDate")}</Label>
                  <Input
                    id="edit-lentDate"
                    type="date"
                    value={editLentDate}
                    onChange={(e) => setEditLentDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expectedReturn">{t("form.expectedReturn")}</Label>
                  <Input
                    id="edit-expectedReturn"
                    type="date"
                    value={editExpectedReturn}
                    onChange={(e) => setEditExpectedReturn(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t("form.trustLevel")}</Label>
                <TrustLevelSelector
                  value={editTrustLevel}
                  onChange={setEditTrustLevel}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditOpen(false);
                  setEditId(null);
                }}
              >
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.saving") : t("form.editSave")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("delete.title")}</DialogTitle>
            <DialogDescription>
              {t("delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("delete.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? t("delete.deleting") : t("delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
