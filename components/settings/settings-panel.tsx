"use client";

import * as React from "react";
import { useState, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, Terminal } from "lucide-react";
import { GITHUB_REPO } from "@/lib/utils/version";
import { useVersionCheck } from "@/hooks/use-version-check";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsAlertOpen(true);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      const text = await selectedFile.text();
      const jsonData = JSON.parse(text);

      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        toast.success(t("importSuccess"));
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(t("importError"));
      }
    } catch (error) {
      toast.error(t("importError"));
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
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
            <Button variant="outline" size="sm" asChild>
              <a href="/api/export" download="adulting-export.json">
                {t("exportBtn")}
              </a>
            </Button>
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                {t("importTitle")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("importDesc")}
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                {t("importBtn")}
              </Button>
            </div>
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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("importWarningTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("importWarningDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}>
              {t("importCancelBtn")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleImport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("importConfirmBtn")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function AboutSettings() {
  const t = useTranslations("Settings.about");
  const { latestVersion, currentVersion: builtVersion, releaseUrl, isUpdateAvailable } = useVersionCheck();
  const version = latestVersion || builtVersion;

  return (
    <Card className="border-dashed">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
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
          {isUpdateAvailable && (
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                <p className="text-[10px] font-medium text-primary">
                  Update available
                </p>
              </div>
            </div>
          )}
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
