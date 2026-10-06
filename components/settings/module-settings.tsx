"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Layers } from "lucide-react";
import { updateDisabledModules } from "@/lib/actions";

const ALL_MODULES = [
  "vault",
  "services",
  "documents",
  "library",
  "waste",
  "maintenance",
  "utilities",
  "contracts",
  "wishlist",
  "lending",
  "pets",
  "illnesses",
  "garage",
  "meals",
  "insurance",
] as const;

type ModuleKey = (typeof ALL_MODULES)[number];

interface ModuleSettingsProps {
  disabledModules: string[];
}

export function ModuleSettings({ disabledModules }: ModuleSettingsProps) {
  const t = useTranslations("Settings.modules");
  const [disabled, setDisabled] = React.useState<Set<string>>(
    new Set(disabledModules)
  );
  const [pending, setPending] = React.useState<string | null>(null);

  async function handleToggle(key: ModuleKey, enabled: boolean) {
    const previous = new Set(disabled);
    const next = new Set(disabled);
    if (enabled) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setDisabled(next);
    setPending(key);
    try {
      await updateDisabledModules(Array.from(next));
      toast.success(t("saved"));
    } catch {
      setDisabled(previous);
      toast.error(t("error"));
    } finally {
      setPending(null);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ALL_MODULES.map((key, idx) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {t(`${key}.title`)}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
              </div>
              <Switch
                checked={!disabled.has(key)}
                disabled={pending === key}
                onCheckedChange={(checked) => handleToggle(key, checked)}
              />
            </div>
            {idx < ALL_MODULES.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
