"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { type PackageReturn, formatCurrency } from "@/lib/data";
import { createPackageReturn, updatePackageReturn, deletePackageReturn, fetchTrackingStatus } from "@/lib/actions";
import { PackageOpen, Camera, Pencil, Trash2, CheckCircle2, RotateCcw, AlertTriangle, RefreshCw } from "lucide-react";
import { BarcodeScanner } from "./barcode-scanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ReturnsManager({ initialReturns }: { initialReturns: PackageReturn[] }) {
    const [items, setItems] = useState<PackageReturn[]>(initialReturns);
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const t = useTranslations("Returns");

    // Form state
    const [trackingId, setTrackingId] = useState("");
    const [carrier, setCarrier] = useState("");
    const [targetVendor, setTargetVendor] = useState("");
    const [status, setStatus] = useState("Sent");
    const [amountExpected, setAmountExpected] = useState<number | "">("");
    const [refundReceived, setRefundReceived] = useState(false);
    const [dateSent, setDateSent] = useState(() => new Date().toISOString().split("T")[0]);
    const [returnWindow, setReturnWindow] = useState("");
    const [receiptPhoto, setReceiptPhoto] = useState("");

    const [scannerOpen, setScannerOpen] = useState(false);

    // Edit dialog
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Delete confirm
    const [deleteId, setDeleteId] = useState<string | null>(null);

    function resetForm() {
        setTrackingId("");
        setCarrier("");
        setTargetVendor("");
        setStatus("Sent");
        setAmountExpected("");
        setRefundReceived(false);
        setDateSent(new Date().toISOString().split("T")[0]);
        setReturnWindow("");
        setReceiptPhoto("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!trackingId || !carrier || !targetVendor || amountExpected === "") return;

        startTransition(async () => {
            await createPackageReturn({
                trackingId,
                carrier,
                targetVendor,
                status,
                amountExpected: Number(amountExpected),
                refundReceived,
                dateSent,
                returnWindow,
                receiptPhoto: receiptPhoto || undefined,
            });
            setOpen(false);
            resetForm();
            // Wait for revalidation or optimistic update
            window.location.reload();
        });
    }

    function openEdit(entry: PackageReturn) {
        setEditId(entry.id);
        setTrackingId(entry.trackingId);
        setCarrier(entry.carrier);
        setTargetVendor(entry.targetVendor);
        setStatus(entry.status);
        setAmountExpected(entry.amountExpected);
        setRefundReceived(entry.refundReceived);
        setDateSent(entry.dateSent);
        setReturnWindow(entry.returnWindow);
        setReceiptPhoto(entry.receiptPhoto || "");
        setEditOpen(true);
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editId || !trackingId || !carrier || !targetVendor || amountExpected === "") return;

        startTransition(async () => {
            await updatePackageReturn(editId, {
                trackingId,
                carrier,
                targetVendor,
                status,
                amountExpected: Number(amountExpected),
                refundReceived,
                dateSent,
                returnWindow,
                receiptPhoto: receiptPhoto || undefined,
            });
            setEditOpen(false);
            setEditId(null);
            resetForm();
            window.location.reload();
        });
    }

    function handleDelete(id: string) {
        startTransition(async () => {
            await deletePackageReturn(id);
            setDeleteId(null);
            window.location.reload();
        });
    }

    async function handleRefreshTracking() {
        setIsRefreshing(true);
        try {
            // Loop over active items and query their status
            const activeItems = items.filter(i => i.status !== "Completed" && i.status !== "Refund Received");
            for (const item of activeItems) {
                const result = await fetchTrackingStatus(item.trackingId, item.carrier);
                if (result.status !== item.status) {
                    await updatePackageReturn(item.id, { status: result.status });
                }
            }
            window.location.reload();
        } finally {
            setIsRefreshing(false);
        }
    }

    // Calculate Money Back? Alert
    const nowTime = new Date().getTime();
    const alertItems = items.filter(item => {
        if (item.status === "Delivered" && !item.refundReceived) {
            const updatedTime = new Date(item.updatedAt).getTime();
            const differenceDays = (nowTime - updatedTime) / (1000 * 3600 * 24);
            return differenceDays > 7;
        }
        return false;
    });

    return (
        <div className="space-y-6">
            {/* ── Money Back Alert ── */}
            {alertItems.length > 0 && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="tracking-tight uppercase text-xs font-bold leading-none mb-1 mt-0.5">
                        {t("alerts.moneyBackTitle")}
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                        {t("alerts.moneyBackMessage")}
                        <ul className="mt-2 text-xs space-y-1">
                            {alertItems.map(item => (
                                <li key={item.id} className="font-medium">• {item.targetVendor} - {formatCurrency(item.amountExpected)}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* ── Main Panel ── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleRefreshTracking}
                                disabled={isRefreshing}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                {t("scanToTrack")} Update Check
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <PackageOpen className="h-4 w-4" />
                                        {t("addReturn")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <form onSubmit={handleSubmit}>
                                        <DialogHeader>
                                            <DialogTitle>{t("addReturn")}</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">

                                            <div className="grid gap-2">
                                                <Label>{t("form.trackingId")}</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="e.g. 1Z9999999999999999"
                                                        value={trackingId}
                                                        onChange={(e) => setTrackingId(e.target.value)}
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => setScannerOpen(true)}
                                                        className="shrink-0"
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>{t("form.carrier")}</Label>
                                                    <Select value={carrier} onValueChange={setCarrier} required>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("form.carrierPlaceholder")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="DHL">{t("carriers.DHL")}</SelectItem>
                                                            <SelectItem value="UPS">{t("carriers.UPS")}</SelectItem>
                                                            <SelectItem value="Hermes">{t("carriers.Hermes")}</SelectItem>
                                                            <SelectItem value="GLS">{t("carriers.GLS")}</SelectItem>
                                                            <SelectItem value="FedEx">{t("carriers.FedEx")}</SelectItem>
                                                            <SelectItem value="Other">{t("carriers.Other")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>{t("form.targetVendor")}</Label>
                                                    <Input
                                                        placeholder={t("form.targetVendorPlaceholder")}
                                                        value={targetVendor}
                                                        onChange={(e) => setTargetVendor(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>{t("form.dateSent")}</Label>
                                                    <Input
                                                        type="date"
                                                        value={dateSent}
                                                        onChange={(e) => setDateSent(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>{t("form.returnWindow")}</Label>
                                                    <Input
                                                        type="date"
                                                        value={returnWindow}
                                                        onChange={(e) => setReturnWindow(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>{t("form.amountExpected")}</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={amountExpected}
                                                        onChange={(e) => setAmountExpected(e.target.value ? Number(e.target.value) : "")}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>{t("form.status")}</Label>
                                                    <Select value={status} onValueChange={setStatus} required>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Sent">{t("status.Sent")}</SelectItem>
                                                            <SelectItem value="In Transit">{t("status.In Transit")}</SelectItem>
                                                            <SelectItem value="Delivered">{t("status.Delivered")}</SelectItem>
                                                            <SelectItem value="Refund Received">{t("status.Refund Received")}</SelectItem>
                                                            <SelectItem value="Completed">{t("status.Completed")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>{t("form.receiptPhoto")}</Label>
                                                <Input
                                                    placeholder={t("form.receiptPhotoPlaceholder")}
                                                    value={receiptPhoto}
                                                    onChange={(e) => setReceiptPhoto(e.target.value)}
                                                />
                                            </div>

                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                                {t("cancel")}
                                            </Button>
                                            <Button type="submit" disabled={isPending}>
                                                {t("save")}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">{t("table.vendor")}</TableHead>
                                <TableHead className="text-xs">{t("table.trackingId")}</TableHead>
                                <TableHead className="text-xs">{t("table.status")}</TableHead>
                                <TableHead className="text-xs text-right hidden sm:table-cell">{t("table.amount")}</TableHead>
                                <TableHead className="text-xs text-right">{t("table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12 text-sm text-muted-foreground"
                                    >
                                        {t("emptyState")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-sm font-medium">
                                            {item.targetVendor}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {item.carrier} / {item.trackingId}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] uppercase font-semibold tracking-widest ${item.status === "Sent" ? "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" :
                                                    item.status === "In Transit" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                        item.status === "Delivered" && !item.refundReceived ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" :
                                                            "bg-success/10 text-success border-success/20"
                                                    }`}
                                            >
                                                {item.status === "Delivered" && !item.refundReceived ? t("status.Delivered") :
                                                    item.status === "In Transit" ? t("status.In Transit") :
                                                        t(`status.${item.status as any}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-right tabular-nums hidden sm:table-cell">
                                            {formatCurrency(item.amountExpected)}
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ── Edit Dialog ── */}
            <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) resetForm(); }}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>{t("editReturn")}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">

                            <div className="grid gap-2">
                                <Label>{t("form.trackingId")}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setScannerOpen(true)}
                                        className="shrink-0"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>{t("form.carrier")}</Label>
                                    <Select value={carrier} onValueChange={setCarrier} required>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DHL">{t("carriers.DHL")}</SelectItem>
                                            <SelectItem value="UPS">{t("carriers.UPS")}</SelectItem>
                                            <SelectItem value="Hermes">{t("carriers.Hermes")}</SelectItem>
                                            <SelectItem value="GLS">{t("carriers.GLS")}</SelectItem>
                                            <SelectItem value="FedEx">{t("carriers.FedEx")}</SelectItem>
                                            <SelectItem value="Other">{t("carriers.Other")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t("form.targetVendor")}</Label>
                                    <Input
                                        value={targetVendor}
                                        onChange={(e) => setTargetVendor(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>{t("form.amountExpected")}</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={amountExpected}
                                        onChange={(e) => setAmountExpected(e.target.value ? Number(e.target.value) : "")}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t("form.status")}</Label>
                                    <Select value={status} onValueChange={setStatus} required>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sent">{t("status.Sent")}</SelectItem>
                                            <SelectItem value="In Transit">{t("status.In Transit")}</SelectItem>
                                            <SelectItem value="Delivered">{t("status.Delivered")}</SelectItem>
                                            <SelectItem value="Refund Received">{t("status.Refund Received")}</SelectItem>
                                            <SelectItem value="Completed">{t("status.Completed")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2 pb-1 border-t mt-2">
                                <Switch
                                    id="refund-received"
                                    checked={refundReceived}
                                    onCheckedChange={setRefundReceived}
                                />
                                <Label htmlFor="refund-received" className="cursor-pointer">{t("form.refundReceived")}</Label>
                            </div>

                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {t("save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Scanner Dialog ── */}
            <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("scanToTrack")}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-square w-full rounded-md overflow-hidden bg-muted/50 p-2">
                        {scannerOpen && (
                            <BarcodeScanner
                                onScan={(code) => {
                                    setTrackingId(code);
                                    setScannerOpen(false);
                                }}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirmation ── */}
            <Dialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{t("delete.title")}</DialogTitle>
                        <DialogDescription>{t("delete.description")}</DialogDescription>
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
                            {t("delete.action")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
