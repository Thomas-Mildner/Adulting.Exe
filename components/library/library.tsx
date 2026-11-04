"use client";

import React from "react";
import { useState, useMemo, useTransition, useRef } from "react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Upload,
  Pencil,
  Trash2,
} from "lucide-react";
import { type Document } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { createDocument, deleteDocument, updateDocument } from "@/lib/actions";
import { toast } from "sonner";

async function uploadPdf(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: formData });
  const result = await response.json();
  if (!response.ok || typeof result.path !== "string") {
    throw new Error(result.error ?? "PDF upload failed");
  }
  return result.path;
}

function isSafePdfPath(value: string): boolean {
  return value.startsWith("/uploads/vault/") && value.toLowerCase().endsWith(".pdf") && !value.includes("..");
}

const categoryIcons: Record<Document["category"], React.ElementType> = {
  Heating: Flame,
  Plumbing: Droplets,
  "Smart Home": Wifi,
  Structural: Building,
  General: FolderOpen,
};

const categoryColors: Record<Document["category"], string> = {
  Heating: "bg-chart-4/10 text-chart-4",
  Plumbing: "bg-primary/10 text-primary",
  "Smart Home": "bg-chart-5/10 text-chart-5",
  Structural: "bg-chart-3/10 text-chart-3",
  General: "bg-muted text-muted-foreground",
};

const categories: Document["category"][] = [
  "Heating",
  "Plumbing",
  "Smart Home",
  "Structural",
  "General",
];

export function Library({ documents }: { documents: Document[] }) {
  const [items, setItems] = useState(documents);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Library");

  // Create document dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [previewDocumentId, setPreviewDocumentId] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<Document["category"]>("General");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
  const editPdfInputRef = useRef<HTMLInputElement>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] =
    useState<Document["category"]>("General");
  const [docType, setDocType] = useState<Document["type"]>("markdown");
  const [docDescription, setDocDescription] = useState("");
  const [docContent, setDocContent] = useState("");
  const [docPdfFile, setDocPdfFile] = useState<File | null>(null);
  const docPdfInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocumentId, setUploadingDocumentId] = useState<string | null>(null);
  const hasRequiredDocumentContent = docType === "markdown"
    ? Boolean(docContent.trim())
    : docPdfFile !== null;

  function resetForm() {
    setDocTitle("");
    setDocCategory("General");
    setDocType("markdown");
    setDocDescription("");
    setDocContent("");
    setDocPdfFile(null);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!docTitle.trim() || !hasRequiredDocumentContent) return;

    startTransition(async () => {
      try {
        const content = docType === "pdf" && docPdfFile
          ? await uploadPdf(docPdfFile)
          : docContent || undefined;
        await createDocument({
          title: docTitle,
          category: docCategory,
          type: docType,
          description: docDescription,
          content,
          updatedAt: new Date().toISOString().split("T")[0],
        });
        setItems((prev) => [{
          id: `temp-${Date.now()}`,
          title: docTitle,
          category: docCategory,
          type: docType,
          description: docDescription,
          content,
          updatedAt: new Date().toISOString().split("T")[0],
        }, ...prev]);
        setSearch("");
        setActiveCategory("all");
        toast.success(t("create.success"));
        resetForm();
        setCreateOpen(false);
      } catch {
        toast.error(t("preview.uploadError"));
      }
    });
  }

  async function handlePdfAttach(doc: Document, file: File) {
    setUploadingDocumentId(doc.id);
    try {
      const content = await uploadPdf(file);
      await updateDocument(doc.id, { content });
      setItems((prev) => prev.map((item) => item.id === doc.id
        ? { ...item, content, updatedAt: new Date().toISOString().split("T")[0] }
        : item));
      toast.success(t("preview.uploadSuccess"));
    } catch {
      toast.error(t("preview.uploadError"));
    } finally {
      setUploadingDocumentId(null);
    }
  }

  function handleUpdate(e: React.FormEvent, doc: Document) {
    e.preventDefault();
    const content = doc.type === "markdown"
      ? editContent
      : editPdfFile
        ? undefined
        : doc.content;
    if (
      !editTitle.trim() ||
      (doc.type === "markdown" && !editContent.trim()) ||
      (doc.type === "pdf" && !doc.content && !editPdfFile)
    ) return;

    startTransition(async () => {
      try {
        const updatedContent = doc.type === "pdf" && editPdfFile
          ? await uploadPdf(editPdfFile)
          : content;
        await updateDocument(doc.id, {
          title: editTitle,
          category: editCategory,
          description: editDescription,
          content: updatedContent,
        });
        const updatedAt = new Date().toISOString().split("T")[0];
        setItems((prev) => prev.map((item) => item.id === doc.id
          ? {
              ...item,
              title: editTitle,
              category: editCategory,
              description: editDescription,
              content: updatedContent,
              updatedAt,
            }
          : item));
        setEditingDocumentId(null);
        toast.success(t("edit.success"));
      } catch {
        toast.error(t("edit.error"));
      }
    });
  }

  async function handleDelete(doc: Document) {
    try {
      await deleteDocument(doc.id);
      setItems((prev) => prev.filter((item) => item.id !== doc.id));
      setPreviewDocumentId(null);
      toast.success(t("delete.success"));
    } catch {
      toast.error(t("delete.error"));
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items
      .filter(
        (d) =>
          (activeCategory === "all" || d.category === activeCategory) &&
          (d.title.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q)),
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [items, search, activeCategory]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full sm:w-auto"
        >
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {t(`categories.${cat}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>

        {/* Create Document Dialog */}
        <Dialog
          open={createOpen}
          onOpenChange={(v) => {
            setCreateOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              {t("newDocument")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>{t("create.title")}</DialogTitle>
                <DialogDescription>
                  {t("create.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="doc-title">{t("form.title")}</Label>
                  <Input
                    id="doc-title"
                    placeholder={t("form.titlePlaceholder")}
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="doc-category">{t("form.category")}</Label>
                    <Select
                      value={docCategory}
                      onValueChange={(v) =>
                        setDocCategory(v as Document["category"])
                      }
                    >
                      <SelectTrigger id="doc-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {t(`categories.${cat}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("form.type")}</Label>
                    <Select
                      value={docType}
                      onValueChange={(value) => {
                        const nextType = value as Document["type"];
                        setDocType(nextType);
                        if (nextType === "markdown") setDocPdfFile(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doc-desc">{t("form.description")}</Label>
                  <Input
                    id="doc-desc"
                    placeholder={t("form.descriptionPlaceholder")}
                    value={docDescription}
                    onChange={(e) => setDocDescription(e.target.value)}
                  />
                </div>
                {docType === "markdown" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="doc-content">{t("form.content")}</Label>
                    <Textarea
                      id="doc-content"
                      placeholder={t("form.contentPlaceholder")}
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      rows={10}
                      className="font-mono text-xs"
                      required
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="doc-pdf">{t("form.pdfFile")}</Label>
                    <div className="flex min-w-0 items-center gap-3">
                      <input
                        ref={docPdfInputRef}
                      id="doc-pdf"
                      type="file"
                      accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          setDocPdfFile(e.currentTarget.files?.[0] ?? null);
                          e.currentTarget.value = "";
                        }}
                      />
                      <Button type="button" variant="outline" className="shrink-0 gap-2" onClick={() => docPdfInputRef.current?.click()}>
                        <Upload className="h-4 w-4" />
                        {t("form.choosePdf")}
                      </Button>
                      <span className="truncate text-xs text-muted-foreground" aria-live="polite">
                        {docPdfFile?.name ?? t("form.noFileChosen")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setCreateOpen(false);
                  }}
                >
                  {t("create.cancel")}
                </Button>
                <Button type="submit" disabled={isPending || !docTitle.trim() || !hasRequiredDocumentContent}>
                  {isPending ? t("create.saving") : t("create.save")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("empty")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const Icon = categoryIcons[doc.category];
            return (
              <Dialog
                key={doc.id}
                open={previewDocumentId === doc.id}
                onOpenChange={(open) => {
                  setPreviewDocumentId(open ? doc.id : null);
                  if (!open) setEditingDocumentId(null);
                }}
              >
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
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1"
                          >
                            {doc.type === "markdown" ? (
                              <FileCode className="h-2.5 w-2.5" />
                            ) : (
                              <FileText className="h-2.5 w-2.5" />
                            )}
                            {doc.type.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {t("card.updated")}{" "}
                            {new Date(doc.updatedAt).toLocaleDateString(
                              "de-DE",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="flex max-h-[90dvh] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)]">
                  <DialogHeader className="shrink-0 border-b px-6 pb-4 pt-6 pr-12">
                    <DialogTitle className="text-xl">{doc.title}</DialogTitle>
                    <DialogDescription>{doc.description}</DialogDescription>
                  </DialogHeader>
                  <div className={`min-h-0 flex-1 ${doc.type === "pdf" && doc.content && isSafePdfPath(doc.content) ? "flex flex-col overflow-hidden" : "overflow-y-auto px-6 py-5"}`}>
                    <div className={`flex shrink-0 flex-wrap items-center gap-2 ${doc.type === "pdf" && doc.content && isSafePdfPath(doc.content) ? "border-b px-6 py-4" : "mb-5"}`}>
                      <Badge variant="secondary" className="text-xs">
                        {t(`categories.${doc.category}`)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {t("card.updated")} {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {doc.type === "pdf" && doc.content && isSafePdfPath(doc.content) ? (
                      <iframe
                        src={doc.content}
                        title={doc.title}
                        className="h-[60dvh] w-full bg-muted"
                      />
                    ) : doc.type === "markdown" && doc.content ? (
                      <article className="break-words text-sm leading-7 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 className="mb-5 mt-9 text-3xl font-semibold leading-tight">{children}</h1>,
                              h2: ({ children }) => <h2 className="mb-4 mt-8 border-b pb-2 text-2xl font-semibold leading-tight">{children}</h2>,
                              h3: ({ children }) => <h3 className="mb-3 mt-7 text-xl font-semibold leading-snug">{children}</h3>,
                              h4: ({ children }) => <h4 className="mb-2 mt-6 text-lg font-semibold">{children}</h4>,
                              p: ({ children }) => <p className="my-4">{children}</p>,
                              a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-4">{children}</a>,
                              ul: ({ children }) => <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>,
                              ol: ({ children }) => <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>,
                              blockquote: ({ children }) => <blockquote className="my-5 border-l-2 border-primary/40 pl-4 text-muted-foreground">{children}</blockquote>,
                              hr: () => <hr className="my-8 border-border" />,
                              pre: ({ children }) => <pre className="my-5 overflow-x-auto rounded-md border bg-muted/60 p-4 font-mono text-xs leading-6">{children}</pre>,
                              code: ({ children, className }) => className
                                ? <code className={className}>{children}</code>
                                : <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>,
                              table: ({ children }) => <div className="my-5 overflow-x-auto"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
                              th: ({ children }) => <th className="border px-3 py-2 font-semibold">{children}</th>,
                              td: ({ children }) => <td className="border px-3 py-2 align-top">{children}</td>,
                            }}
                          >
                            {doc.content}
                          </ReactMarkdown>
                      </article>
                    ) : doc.type === "pdf" ? (
                      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                        <FileText className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">{t("card.noPdf")}</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            className="sr-only"
                            disabled={uploadingDocumentId === doc.id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handlePdfAttach(doc, file);
                              e.target.value = "";
                            }}
                          />
                          <span className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                            <Upload className="h-4 w-4" />
                            {uploadingDocumentId === doc.id ? t("preview.uploading") : t("preview.uploadPdf")}
                          </span>
                        </label>
                      </div>
                    ) : doc.content ? (
                      <p className="whitespace-pre-wrap text-sm leading-7">{doc.content}</p>
                    ) : (
                      <div className="rounded-lg border border-dashed p-8 text-center">
                        <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">{t("card.noPdf")}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-2 border-t px-6 py-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" size="sm" variant="destructive" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          {t("delete.button")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("delete.description", { title: doc.title })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => void handleDelete(doc)}
                          >
                            {t("delete.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Dialog
                      open={editingDocumentId === doc.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setEditTitle(doc.title);
                          setEditCategory(doc.category);
                          setEditDescription(doc.description);
                          setEditContent(doc.type === "markdown" ? doc.content ?? "" : "");
                          setEditPdfFile(null);
                          setEditingDocumentId(doc.id);
                        } else {
                          setEditingDocumentId(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" size="sm" variant="outline" className="gap-2">
                          <Pencil className="h-4 w-4" />
                          {t("edit.button")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[560px]">
                        <form onSubmit={(e) => handleUpdate(e, doc)}>
                          <DialogHeader>
                            <DialogTitle>{t("edit.title")}</DialogTitle>
                            <DialogDescription>{t("edit.description")}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor={`edit-title-${doc.id}`}>{t("form.title")}</Label>
                              <Input
                                id={`edit-title-${doc.id}`}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`edit-category-${doc.id}`}>{t("form.category")}</Label>
                              <Select
                                value={editCategory}
                                onValueChange={(value) => setEditCategory(value as Document["category"])}
                              >
                                <SelectTrigger id={`edit-category-${doc.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {t(`categories.${category}`)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`edit-description-${doc.id}`}>{t("form.description")}</Label>
                              <Input
                                id={`edit-description-${doc.id}`}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                              />
                            </div>
                            {doc.type === "markdown" ? (
                              <div className="grid gap-2">
                                <Label htmlFor={`edit-content-${doc.id}`}>{t("form.content")}</Label>
                                <Textarea
                                  id={`edit-content-${doc.id}`}
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={10}
                                  className="font-mono text-xs"
                                  required
                                />
                              </div>
                            ) : (
                              <div className="grid gap-2">
                                <Label htmlFor={`edit-pdf-${doc.id}`}>{t("edit.pdfFile")}</Label>
                                <div className="flex min-w-0 items-center gap-3">
                                  <input
                                    ref={editPdfInputRef}
                                    id={`edit-pdf-${doc.id}`}
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                      setEditPdfFile(e.currentTarget.files?.[0] ?? null);
                                      e.currentTarget.value = "";
                                    }}
                                  />
                                  <Button type="button" variant="outline" className="shrink-0 gap-2" onClick={() => editPdfInputRef.current?.click()}>
                                    <Upload className="h-4 w-4" />
                                    {t("form.choosePdf")}
                                  </Button>
                                  <span className="truncate text-xs text-muted-foreground" aria-live="polite">
                                    {editPdfFile?.name ?? (doc.content ? t("edit.pdfRetained") : t("form.noFileChosen"))}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingDocumentId(null)}>
                              {t("create.cancel")}
                            </Button>
                            <Button
                              type="submit"
                              disabled={isPending || !editTitle.trim() || (doc.type === "markdown" ? !editContent.trim() : !doc.content && !editPdfFile)}
                            >
                              {isPending ? t("edit.saving") : t("edit.save")}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
}
