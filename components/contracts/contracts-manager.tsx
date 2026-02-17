"use client";

import { useState, useTransition, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDaysRemaining, formatCurrency, type Contract } from "@/lib/data";
import { createContract, updateContract, deleteContract, generateContractCancellationLetter } from "@/lib/actions";
import { Plus, Pencil, Trash2, AlertTriangle, FileText, TrendingDown, CreditCard } from "lucide-react";

const CATEGORIES = ["Utilities", "Entertainment", "Fitness", "Software", "Guilty Pleasure", "Other"] as const;
const TRIAL_ALERT_THRESHOLD_DAYS = 2; // Must match notification threshold in lib/actions.ts

function RegretMeter({ contract }: { contract: Contract }) {
  const t = useTranslations("Contracts");
  
  if (!contract.lastUsedDate) {
    return null;
  }
  
  const daysSinceUse = Math.abs(getDaysRemaining(contract.lastUsedDate));
  const monthsSinceUse = Math.floor(daysSinceUse / 30);
  const wastedAmount = monthsSinceUse * contract.monthlyCost;
  
  // Calculate regret percentage (capped at 100%)
  const regretPercent = Math.min(100, (monthsSinceUse / 12) * 100);
  
  if (monthsSinceUse < 1) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{t("regretMeter")}</span>
        <span className="font-medium text-destructive">
          {formatCurrency(wastedAmount)} {t("wasted")}
        </span>
      </div>
      <Progress value={regretPercent} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {t("lastUsed")}: {monthsSinceUse} {t("monthsAgo")}
      </p>
    </div>
  );
}

export function ContractsManager({ contracts: initialContracts }: { contracts: Contract[] }) {
  const [contracts, setContracts] = useState(initialContracts);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [cancellationLetter, setCancellationLetter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const t = useTranslations("Contracts");

  // Form state
  const [providerName, setProviderName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [yearlyCost, setYearlyCost] = useState("");
  const [category, setCategory] = useState<Contract["category"]>("Entertainment");
  const [lastUsedDate, setLastUsedDate] = useState("");
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setProviderName("");
    setAccountId("");
    setMonthlyCost("");
    setYearlyCost("");
    setCategory("Entertainment");
    setLastUsedDate("");
    setIsTrial(false);
    setTrialEndDate("");
    setNextBillingDate("");
    setNotes("");
  };

  const loadContractForEdit = (contract: Contract) => {
    setProviderName(contract.providerName);
    setAccountId(contract.accountId || "");
    setMonthlyCost(contract.monthlyCost.toString());
    setYearlyCost(contract.yearlyCost?.toString() || "");
    setCategory(contract.category);
    setLastUsedDate(contract.lastUsedDate || "");
    setIsTrial(contract.isTrial);
    setTrialEndDate(contract.trialEndDate || "");
    setNextBillingDate(contract.nextBillingDate);
    setNotes(contract.notes || "");
  };

  const handleCreate = () => {
    if (!providerName || !monthlyCost || !nextBillingDate) return;

    startTransition(async () => {
      const newContract: Omit<Contract, "id"> = {
        providerName,
        accountId: accountId || undefined,
        monthlyCost: parseFloat(monthlyCost),
        yearlyCost: yearlyCost ? parseFloat(yearlyCost) : undefined,
        category,
        lastUsedDate: lastUsedDate || undefined,
        isTrial,
        trialEndDate: trialEndDate || undefined,
        nextBillingDate,
        notes: notes || undefined,
      };

      await createContract(newContract);
      // Reload contracts from server to get the actual ID
      window.location.reload();
    });
  };

  const handleEdit = () => {
    if (!selectedContract || !providerName || !monthlyCost || !nextBillingDate) return;

    startTransition(async () => {
      const updated: Partial<Omit<Contract, "id">> = {
        providerName,
        accountId: accountId || undefined,
        monthlyCost: parseFloat(monthlyCost),
        yearlyCost: yearlyCost ? parseFloat(yearlyCost) : undefined,
        category,
        lastUsedDate: lastUsedDate || undefined,
        isTrial,
        trialEndDate: trialEndDate || undefined,
        nextBillingDate,
        notes: notes || undefined,
      };

      await updateContract(selectedContract.id, updated);
      setContracts(contracts.map((c) => (c.id === selectedContract.id ? { ...c, ...updated } : c)));
      resetForm();
      setSelectedContract(null);
      setEditOpen(false);
    });
  };

  const handleDelete = () => {
    if (!selectedContract) return;

    startTransition(async () => {
      await deleteContract(selectedContract.id);
      setContracts(contracts.filter((c) => c.id !== selectedContract.id));
      setSelectedContract(null);
      setDeleteOpen(false);
    });
  };

  const handleGenerateCancellation = async (contract: Contract) => {
    setSelectedContract(contract);
    const letter = await generateContractCancellationLetter(contract.id);
    setCancellationLetter(letter);
    setCancellationOpen(true);
  };

  const copyCancellationLetter = () => {
    navigator.clipboard.writeText(cancellationLetter);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const monthlyBleed = contracts.reduce((sum, c) => sum + c.monthlyCost, 0);
    const yearlyBleed = monthlyBleed * 12;
    const trialCount = contracts.filter(c => c.isTrial).length;
    
    // Calculate regret amount
    const regretAmount = contracts.reduce((sum, c) => {
      if (!c.lastUsedDate) return sum;
      const daysSinceUse = Math.abs(getDaysRemaining(c.lastUsedDate));
      const monthsSinceUse = Math.floor(daysSinceUse / 30);
      return sum + (monthsSinceUse * c.monthlyCost);
    }, 0);

    // Category distribution
    const categorySpending = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = contracts
        .filter(c => c.category === cat)
        .reduce((sum, c) => sum + c.monthlyCost, 0);
      return acc;
    }, {} as Record<string, number>);

    return { monthlyBleed, yearlyBleed, trialCount, regretAmount, categorySpending };
  }, [contracts]);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    if (categoryFilter === "all") return contracts;
    return contracts.filter(c => c.category === categoryFilter);
  }, [contracts, categoryFilter]);

  // Sort by next billing date
  const sortedContracts = useMemo(() => {
    return [...filteredContracts].sort((a, b) => 
      new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
    );
  }, [filteredContracts]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("burnRate")}</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyBleed)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.yearlyBleed)}/year
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("burnRateNote")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalContracts")}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-xs text-muted-foreground">
              {stats.trialCount} {t("activeTrials")}
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("cumulativeDonation")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(stats.regretAmount)}</div>
            <p className="text-xs text-muted-foreground">{t("regretMeterSubtitle")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="all">{t("allCategories")}</TabsTrigger>
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat}>
                {t(`categories.${cat}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              {t("create.title")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("create.title")}</DialogTitle>
              <DialogDescription>{t("create.description")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="providerName">{t("fields.providerName")}</Label>
                <Input
                  id="providerName"
                  placeholder={t("placeholders.providerName")}
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accountId">{t("fields.accountId")}</Label>
                <Input
                  id="accountId"
                  placeholder={t("placeholders.accountId")}
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="monthlyCost">{t("fields.monthlyCost")}</Label>
                  <Input
                    id="monthlyCost"
                    type="number"
                    step="0.01"
                    placeholder="19.99"
                    value={monthlyCost}
                    onChange={(e) => setMonthlyCost(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yearlyCost">{t("fields.yearlyCost")}</Label>
                  <Input
                    id="yearlyCost"
                    type="number"
                    step="0.01"
                    placeholder="239.88"
                    value={yearlyCost}
                    onChange={(e) => setYearlyCost(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">{t("fields.category")}</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Contract["category"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {t(`categories.${cat}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTrial"
                  checked={isTrial}
                  onCheckedChange={(checked) => setIsTrial(checked as boolean)}
                />
                <Label htmlFor="isTrial" className="text-sm font-normal">
                  {t("fields.isTrial")}
                </Label>
              </div>
              {isTrial && (
                <div className="grid gap-2">
                  <Label htmlFor="trialEndDate">{t("fields.trialEndDate")}</Label>
                  <Input
                    id="trialEndDate"
                    type="date"
                    value={trialEndDate}
                    onChange={(e) => setTrialEndDate(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="nextBillingDate">{t("fields.nextBillingDate")}</Label>
                <Input
                  id="nextBillingDate"
                  type="date"
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastUsedDate">{t("fields.lastUsedDate")}</Label>
                <Input
                  id="lastUsedDate"
                  type="date"
                  value={lastUsedDate}
                  onChange={(e) => setLastUsedDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">{t("fields.notes")}</Label>
                <Input
                  id="notes"
                  placeholder={t("placeholders.notes")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                {t("create.action")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {contracts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CreditCard className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("emptyState.title")}</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {t("emptyState.message")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contracts Table */}
      {sortedContracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("tableTitle")}</CardTitle>
            <CardDescription>{t("tableSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.provider")}</TableHead>
                  <TableHead>{t("table.category")}</TableHead>
                  <TableHead>{t("table.monthlyCost")}</TableHead>
                  <TableHead>{t("table.nextBilling")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead className="text-right">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedContracts.map((contract) => {
                  const daysUntilBilling = getDaysRemaining(contract.nextBillingDate);
                  const isTrialEndingSoon = contract.isTrial && contract.trialEndDate && getDaysRemaining(contract.trialEndDate) <= TRIAL_ALERT_THRESHOLD_DAYS;
                  
                  return (
                    <TableRow key={contract.id} className="group">
                      <TableCell className="font-medium">
                        <div>
                          <div className="flex items-center gap-2">
                            {contract.providerName}
                            {isTrialEndingSoon && (
                              <Badge variant="destructive" className="text-xs">
                                🚨 {t("trialTrapAlert")}
                              </Badge>
                            )}
                          </div>
                          {contract.accountId && (
                            <div className="text-xs text-muted-foreground">
                              {contract.accountId}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`categories.${contract.category}`)}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(contract.monthlyCost)}</TableCell>
                      <TableCell>
                        <div>
                          {new Date(contract.nextBillingDate).toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {daysUntilBilling > 0 ? `in ${daysUntilBilling}d` : `${Math.abs(daysUntilBilling)}d ago`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {contract.isTrial ? (
                          <Badge variant="secondary">{t("trial")}</Badge>
                        ) : (
                          <Badge>{t("active")}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleGenerateCancellation(contract)}
                            title={t("killSwitch")}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedContract(contract);
                              loadContractForEdit(contract);
                              setEditOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedContract(contract);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("edit.title")}</DialogTitle>
            <DialogDescription>{t("edit.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-providerName">{t("fields.providerName")}</Label>
              <Input
                id="edit-providerName"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-accountId">{t("fields.accountId")}</Label>
              <Input
                id="edit-accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-monthlyCost">{t("fields.monthlyCost")}</Label>
                <Input
                  id="edit-monthlyCost"
                  type="number"
                  step="0.01"
                  value={monthlyCost}
                  onChange={(e) => setMonthlyCost(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-yearlyCost">{t("fields.yearlyCost")}</Label>
                <Input
                  id="edit-yearlyCost"
                  type="number"
                  step="0.01"
                  value={yearlyCost}
                  onChange={(e) => setYearlyCost(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">{t("fields.category")}</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Contract["category"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isTrial"
                checked={isTrial}
                onCheckedChange={(checked) => setIsTrial(checked as boolean)}
              />
              <Label htmlFor="edit-isTrial" className="text-sm font-normal">
                {t("fields.isTrial")}
              </Label>
            </div>
            {isTrial && (
              <div className="grid gap-2">
                <Label htmlFor="edit-trialEndDate">{t("fields.trialEndDate")}</Label>
                <Input
                  id="edit-trialEndDate"
                  type="date"
                  value={trialEndDate}
                  onChange={(e) => setTrialEndDate(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-nextBillingDate">{t("fields.nextBillingDate")}</Label>
              <Input
                id="edit-nextBillingDate"
                type="date"
                value={nextBillingDate}
                onChange={(e) => setNextBillingDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-lastUsedDate">{t("fields.lastUsedDate")}</Label>
              <Input
                id="edit-lastUsedDate"
                type="date"
                value={lastUsedDate}
                onChange={(e) => setLastUsedDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">{t("fields.notes")}</Label>
              <Input
                id="edit-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleEdit} disabled={isPending}>
              {t("edit.action")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete.title")}</DialogTitle>
            <DialogDescription>{t("delete.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {t("delete.action")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Letter Dialog */}
      <Dialog open={cancellationOpen} onOpenChange={setCancellationOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t("cancellation.title")}</DialogTitle>
            <DialogDescription>{t("cancellation.description")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
              {cancellationLetter}
            </pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancellationOpen(false)}>
              {t("close")}
            </Button>
            <Button onClick={copyCancellationLetter}>
              {t("cancellation.copy")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
