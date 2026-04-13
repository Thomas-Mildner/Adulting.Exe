"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { completeTutorial } from "@/lib/actions"
import {
  ChevronLeft,
  ChevronRight,
  X,
  PackageOpen,
  Wrench,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Zap,
  CreditCard,
  Sparkles,
  HandCoins,
  FileCheck,
  ShieldCheck,
  Receipt,
  FolderSearch,
  Bell,
  ListChecks,
  RotateCcw,
  BarChart3,
  Ban,
  Wallet,
  UserCheck,
  AlertCircle,
  ScanLine,
} from "lucide-react"

type TutorialStep = {
  icon: React.ComponentType<{ className?: string }>
  titleKey: string
  descriptionKey: string
  featuresKeys?: string[]
}

const MODULE_STEPS: Record<string, TutorialStep[]> = {
  vault: [
    {
      icon: PackageOpen,
      titleKey: "vault.step1.title",
      descriptionKey: "vault.step1.description",
      featuresKeys: ["vault.step1.feature1", "vault.step1.feature2", "vault.step1.feature3"],
    },
    {
      icon: ShieldCheck,
      titleKey: "vault.step2.title",
      descriptionKey: "vault.step2.description",
      featuresKeys: ["vault.step2.feature1", "vault.step2.feature2"],
    },
    {
      icon: Bell,
      titleKey: "vault.step3.title",
      descriptionKey: "vault.step3.description",
    },
  ],
  services: [
    {
      icon: Wrench,
      titleKey: "services.step1.title",
      descriptionKey: "services.step1.description",
      featuresKeys: ["services.step1.feature1", "services.step1.feature2", "services.step1.feature3"],
    },
    {
      icon: ListChecks,
      titleKey: "services.step2.title",
      descriptionKey: "services.step2.description",
      featuresKeys: ["services.step2.feature1", "services.step2.feature2"],
    },
    {
      icon: Receipt,
      titleKey: "services.step3.title",
      descriptionKey: "services.step3.description",
    },
  ],
  library: [
    {
      icon: BookOpen,
      titleKey: "library.step1.title",
      descriptionKey: "library.step1.description",
      featuresKeys: ["library.step1.feature1", "library.step1.feature2", "library.step1.feature3"],
    },
    {
      icon: FolderSearch,
      titleKey: "library.step2.title",
      descriptionKey: "library.step2.description",
      featuresKeys: ["library.step2.feature1", "library.step2.feature2"],
    },
  ],
  waste: [
    {
      icon: CalendarDays,
      titleKey: "waste.step1.title",
      descriptionKey: "waste.step1.description",
      featuresKeys: ["waste.step1.feature1", "waste.step1.feature2", "waste.step1.feature3"],
    },
    {
      icon: Bell,
      titleKey: "waste.step2.title",
      descriptionKey: "waste.step2.description",
      featuresKeys: ["waste.step2.feature1", "waste.step2.feature2"],
    },
  ],
  maintenance: [
    {
      icon: ClipboardCheck,
      titleKey: "maintenance.step1.title",
      descriptionKey: "maintenance.step1.description",
      featuresKeys: ["maintenance.step1.feature1", "maintenance.step1.feature2", "maintenance.step1.feature3"],
    },
    {
      icon: RotateCcw,
      titleKey: "maintenance.step2.title",
      descriptionKey: "maintenance.step2.description",
      featuresKeys: ["maintenance.step2.feature1", "maintenance.step2.feature2"],
    },
  ],
  utilities: [
    {
      icon: Zap,
      titleKey: "utilities.step1.title",
      descriptionKey: "utilities.step1.description",
      featuresKeys: ["utilities.step1.feature1", "utilities.step1.feature2", "utilities.step1.feature3"],
    },
    {
      icon: BarChart3,
      titleKey: "utilities.step2.title",
      descriptionKey: "utilities.step2.description",
      featuresKeys: ["utilities.step2.feature1", "utilities.step2.feature2"],
    },
  ],
  contracts: [
    {
      icon: CreditCard,
      titleKey: "contracts.step1.title",
      descriptionKey: "contracts.step1.description",
      featuresKeys: ["contracts.step1.feature1", "contracts.step1.feature2", "contracts.step1.feature3"],
    },
    {
      icon: Ban,
      titleKey: "contracts.step2.title",
      descriptionKey: "contracts.step2.description",
      featuresKeys: ["contracts.step2.feature1", "contracts.step2.feature2"],
    },
  ],
  wishlist: [
    {
      icon: Sparkles,
      titleKey: "wishlist.step1.title",
      descriptionKey: "wishlist.step1.description",
      featuresKeys: ["wishlist.step1.feature1", "wishlist.step1.feature2", "wishlist.step1.feature3"],
    },
    {
      icon: Wallet,
      titleKey: "wishlist.step2.title",
      descriptionKey: "wishlist.step2.description",
      featuresKeys: ["wishlist.step2.feature1", "wishlist.step2.feature2"],
    },
  ],
  lending: [
    {
      icon: HandCoins,
      titleKey: "lending.step1.title",
      descriptionKey: "lending.step1.description",
      featuresKeys: ["lending.step1.feature1", "lending.step1.feature2", "lending.step1.feature3"],
    },
    {
      icon: UserCheck,
      titleKey: "lending.step2.title",
      descriptionKey: "lending.step2.description",
      featuresKeys: ["lending.step2.feature1", "lending.step2.feature2"],
    },
  ],
  documents: [
    {
      icon: FileCheck,
      titleKey: "documents.step1.title",
      descriptionKey: "documents.step1.description",
      featuresKeys: ["documents.step1.feature1", "documents.step1.feature2", "documents.step1.feature3"],
    },
    {
      icon: AlertCircle,
      titleKey: "documents.step2.title",
      descriptionKey: "documents.step2.description",
      featuresKeys: ["documents.step2.feature1", "documents.step2.feature2"],
    },
    {
      icon: ScanLine,
      titleKey: "documents.step3.title",
      descriptionKey: "documents.step3.description",
    },
  ],
}

interface ModuleTutorialProps {
  moduleKey: string
  isFirstVisit: boolean
}

export function ModuleTutorial({ moduleKey, isFirstVisit }: ModuleTutorialProps) {
  const t = useTranslations("Tutorial")
  const [open, setOpen] = useState(isFirstVisit)
  const [step, setStep] = useState(0)
  const [, startTransition] = useTransition()

  const steps = MODULE_STEPS[moduleKey] ?? []
  if (steps.length === 0) return null

  const totalSteps = steps.length
  const current = steps[step]
  const IconComponent = current.icon
  const progressValue = ((step + 1) / totalSteps) * 100

  function handleDismiss() {
    startTransition(async () => {
      await completeTutorial(moduleKey)
    })
    setOpen(false)
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
    } else {
      handleDismiss()
    }
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss() }}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{t(`${moduleKey}.step${step + 1}.title`)}</DialogTitle>
        </DialogHeader>

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx <= step ? "bg-primary w-6" : "bg-muted-foreground/20 w-4"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            aria-label={t("skip")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Progress value={progressValue} className="h-0.5 rounded-none" />

        {/* Content */}
        <div className="px-6 py-6 min-h-[280px] flex flex-col">
          {/* Icon & title */}
          <div className="flex flex-col items-center text-center gap-3 mb-5">
            <div className="rounded-xl bg-primary/10 p-4">
              <IconComponent className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {t(current.titleKey)}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t(current.descriptionKey)}
              </p>
            </div>
          </div>

          {/* Feature list */}
          {current.featuresKeys && current.featuresKeys.length > 0 && (
            <ul className="space-y-2 mt-auto">
              {current.featuresKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-5 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("back")}
          </Button>

          <span className="text-xs text-muted-foreground">
            {t("stepOf", { current: step + 1, total: totalSteps })}
          </span>

          <Button size="sm" onClick={handleNext} className="gap-1">
            {step < totalSteps - 1 ? (
              <>
                {t("next")}
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              t("gotIt")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
