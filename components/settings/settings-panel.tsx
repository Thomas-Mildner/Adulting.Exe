"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Terminal } from "lucide-react";

export function NotificationSettings() {
  const t = useTranslations("Settings.notifications");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">
            {t("title")}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            title: t("warranty"),
            desc: t("warrantyDesc"),
            defaultOn: true,
          },
          {
            title: t("maintenance"),
            desc: t("maintenanceDesc"),
            defaultOn: true,
          },
          {
            title: t("lending"),
            desc: t("lendingDesc"),
            defaultOn: true,
          },
          {
            title: t("meter"),
            desc: t("meterDesc"),
            defaultOn: false,
          },
          {
            title: t("wishlist"),
            desc: t("wishlistDesc"),
            defaultOn: false,
          },
        ].map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <Switch defaultChecked={item.defaultOn} />
            </div>
            {idx < 4 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DataSettings() {
  const t = useTranslations("Settings.data");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">
            {t("title")}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {t("exportTitle")}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t("exportDesc")}
            </p>
          </div>
          <Button variant="outline" size="sm">
            {t("exportBtn")}
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {t("deleteTitle")}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t("deleteDesc")}
            </p>
          </div>
          <Button variant="destructive" size="sm">
            {t("deleteBtn")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AboutSettings() {
  const t = useTranslations("Settings.about");
  const [version, setVersion] = React.useState<string>("...");
  const [releaseUrl, setReleaseUrl] = React.useState<string>("");

  React.useEffect(() => {
    fetch('/api/version')
      .then(res => res.json())
      .then(data => {
        setVersion(data.version || "1.0.0");
        setReleaseUrl(data.releaseUrl || `https://github.com/Thomas-Mildner/Adulting.Exe/releases/tag/v${data.version}`);
      })
      .catch(err => {
        console.error("Failed to fetch version:", err);
        setVersion("1.0.0");
        setReleaseUrl("https://github.com/Thomas-Mildner/Adulting.Exe/releases");
      });
  }, []);

  return (
    <Card className="border-dashed">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Terminal className="h-4 w-4 text-primary" />
          </div>
          <div>
            <a
              href={releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Adulting.exe v{version}
            </a>
            <p className="text-[11px] text-muted-foreground">
              {t("funny")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-2xl">
      <NotificationSettings />
      <DataSettings />
      <AboutSettings />
    </div>
  );
}
