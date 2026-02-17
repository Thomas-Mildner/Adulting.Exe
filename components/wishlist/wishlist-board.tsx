"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, type WishlistProject } from "@/lib/data";
import {
  createWishlistProject,
  updateWishlistProject,
  deleteWishlistProject,
} from "@/lib/actions";

const urgencyConfig: Record<
  WishlistProject["urgency"],
  { labelKey: string; style: string }
> = {
  "nice-to-have": {
    labelKey: "nice-to-have",
    style: "bg-muted text-muted-foreground",
  },
  "should-do": {
    labelKey: "should-do",
    style: "bg-primary/10 text-primary border-primary/20",
  },
  "need-soon": {
    labelKey: "need-soon",
    style: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  "falling-apart": {
    labelKey: "falling-apart",
    style: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const urgencyOptions: WishlistProject["urgency"][] = [
  "nice-to-have",
  "should-do",
  "need-soon",
  "falling-apart",
];

const wishlistCategories = [
  "Renovierung",
  "Garten",
  "Küche",
  "Badezimmer",
  "Technik",
  "Möbel",
  "Außenbereich",
  "Sicherheit",
  "Sonstiges",
];

type WishlistFormData = {
  title: string;
  description: string;
  estimatedCost: number;
  currentSavings: number;
  urgency: WishlistProject["urgency"];
  category: string;
};

const emptyWishlistForm: WishlistFormData = {
  title: "",
  description: "",
  estimatedCost: 0,
  currentSavings: 0,
  urgency: "nice-to-have",
  category: "Sonstiges",
};

export function WishlistBoard({
  wishlistProjects,
}: {
  wishlistProjects: WishlistProject[];
}) {
  const [items, setItems] = useState(wishlistProjects);
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<WishlistFormData>({ ...emptyWishlistForm });
  const t = useTranslations("Wishlist");

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<WishlistFormData>({
    ...emptyWishlistForm,
  });

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalEstimated = items.reduce((s, p) => s + p.estimatedCost, 0);
  const totalSaved = items.reduce((s, p) => s + p.currentSavings, 0);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;

    startTransition(async () => {
      await createWishlistProject(form);
      setItems((prev) => [...prev, { ...form, id: `temp-${Date.now()}` }]);
      setForm({ ...emptyWishlistForm });
      setCreateOpen(false);
    });
  }

  function openEdit(project: WishlistProject) {
    setEditId(project.id);
    setEditForm({
      title: project.title,
      description: project.description,
      estimatedCost: project.estimatedCost,
      currentSavings: project.currentSavings,
      urgency: project.urgency,
      category: project.category,
    });
    setEditOpen(true);
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId || !editForm.title) return;

    startTransition(async () => {
      await updateWishlistProject(editId!, editForm);
      setItems((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...editForm } : p)),
      );
      setEditOpen(false);
      setEditId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteWishlistProject(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
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
              {t("stats.totalProjects")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {items.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {items.filter((p) => p.urgency === "falling-apart").length}{" "}
              {t("stats.urgent")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.estimatedCost")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {formatCurrency(totalEstimated)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("stats.avocadoToasts")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stats.totalSaved")}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalSaved / totalEstimated) * 100)}{t("stats.done")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Project Dialog */}
      <div className="flex justify-end">
        <Dialog
          open={createOpen}
          onOpenChange={(v) => {
            setCreateOpen(v);
            if (!v) setForm({ ...emptyWishlistForm });
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t("create.button")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>{t("create.title")}</DialogTitle>
                <DialogDescription>
                  {t("create.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="wp-title">{t("form.name")}</Label>
                  <Input
                    id="wp-title"
                    placeholder={t("form.namePlaceholder")}
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wp-desc">{t("form.description")}</Label>
                  <Textarea
                    id="wp-desc"
                    placeholder={t("form.descriptionPlaceholder")}
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="wp-cost">{t("form.cost")}</Label>
                    <Input
                      id="wp-cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.estimatedCost || ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          estimatedCost: parseFloat(e.target.value) || 0,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wp-savings">{t("form.savings")}</Label>
                    <Input
                      id="wp-savings"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.currentSavings || ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          currentSavings: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="wp-category">{t("form.category")}</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, category: v }))
                      }
                    >
                      <SelectTrigger id="wp-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {wishlistCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {t(`categories.${c}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("form.urgency")}</Label>
                    <Select
                      value={form.urgency}
                      onValueChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          urgency: v as WishlistProject["urgency"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyOptions.map((u) => (
                          <SelectItem key={u} value={u}>
                            {t(`urgency.${urgencyConfig[u].labelKey}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({ ...emptyWishlistForm });
                    setCreateOpen(false);
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

      {/* Project Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items
          .sort((a, b) => {
            const order: WishlistProject["urgency"][] = [
              "falling-apart",
              "need-soon",
              "should-do",
              "nice-to-have",
            ];
            return order.indexOf(a.urgency) - order.indexOf(b.urgency);
          })
          .map((project) => {
            const pct = Math.round(
              (project.currentSavings / project.estimatedCost) * 100,
            );
            const remaining = project.estimatedCost - project.currentSavings;
            const { labelKey, style } = urgencyConfig[project.urgency];

            return (
              <Card key={project.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium text-foreground">
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {/* Try to translate category, fallback to original if not found (though keys should exist) */}
                        {wishlistCategories.includes(project.category)
                          ? t(`categories.${project.category}`)
                          : project.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${style}`}
                      >
                        {t(`urgency.${labelKey}`)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(project.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">
                        {formatCurrency(project.currentSavings)} /{" "}
                        {formatCurrency(project.estimatedCost)}
                      </span>
                      <span className="font-mono text-foreground font-medium tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <p className="text-[10px] text-muted-foreground pt-1 border-t">
                    {pct >= 90
                      ? t("progress.almost")
                      : pct >= 50
                        ? t("progress.halfway")
                        : t("progress.remote", { amount: formatCurrency(remaining) })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditId(null);
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
              <DialogDescription>
                {t("edit.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-wp-title">{t("form.name")}</Label>
                <Input
                  id="edit-wp-title"
                  placeholder={t("form.namePlaceholder")}
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-wp-desc">{t("form.description")}</Label>
                <Textarea
                  id="edit-wp-desc"
                  placeholder={t("form.descriptionPlaceholder")}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-wp-cost">{t("form.cost")}</Label>
                  <Input
                    id="edit-wp-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.estimatedCost || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        estimatedCost: parseFloat(e.target.value) || 0,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-wp-savings">{t("form.savings")}</Label>
                  <Input
                    id="edit-wp-savings"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.currentSavings || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        currentSavings: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-wp-category">{t("form.category")}</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(v) =>
                      setEditForm((p) => ({ ...p, category: v }))
                    }
                  >
                    <SelectTrigger id="edit-wp-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wishlistCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {t(`categories.${c}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{t("form.urgency")}</Label>
                  <Select
                    value={editForm.urgency}
                    onValueChange={(v) =>
                      setEditForm((p) => ({
                        ...p,
                        urgency: v as WishlistProject["urgency"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyOptions.map((u) => (
                        <SelectItem key={u} value={u}>
                          {t(`urgency.${urgencyConfig[u].labelKey}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
