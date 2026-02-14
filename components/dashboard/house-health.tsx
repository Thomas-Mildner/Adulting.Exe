"use client";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import {
  getDaysRemaining,
  type Appliance,
  type MaintenanceTask,
  type LentItem,
} from "@/lib/data";

type HouseHealthProps = {
  appliances: Appliance[];
  maintenanceTasks: MaintenanceTask[];
  lentItems: LentItem[];
};

export function HouseHealth({
  appliances,
  maintenanceTasks,
  lentItems,
}: HouseHealthProps) {
  const t = useTranslations("HouseHealth");
  const activeWarranties = appliances.filter(
    (a) => a.status === "protected",
  ).length;
  const totalAppliances = appliances.length;
  const pendingTasks = maintenanceTasks.filter((t) => !t.completed).length;
  const highPriority = maintenanceTasks.filter(
    (t) => t.priority === "high" && !t.completed,
  ).length;
  const overdueItems = lentItems.filter(
    (i) => getDaysRemaining(i.expectedReturn) < 0,
  ).length;

  const score =
    totalAppliances === 0 && pendingTasks === 0 && lentItems.length === 0
      ? 100
      : Math.round(
        (activeWarranties / Math.max(totalAppliances, 1)) * 40 +
        (1 - highPriority / Math.max(pendingTasks, 1)) * 40 +
        (1 - overdueItems / Math.max(lentItems.length, 1)) * 20,
      );

  const getVerdict = () => {
    if (score >= 80) return { text: t("verdicts.excellent"), color: "text-success" };
    if (score >= 60)
      return { text: t("verdicts.good"), color: "text-chart-3" };
    if (score >= 40)
      return { text: t("verdicts.warning"), color: "text-warning" };
    return { text: t("verdicts.critical"), color: "text-destructive" };
  };

  const verdict = getVerdict();

  return (
    <Card className="border-dashed">
      <CardContent className="py-4 px-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("title")}
            </p>
            <p className={`text-lg font-semibold ${verdict.color}`}>
              {verdict.text}
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums text-foreground">
              {score}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              /100
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
