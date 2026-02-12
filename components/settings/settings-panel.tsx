"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Bell, Shield, Terminal } from "lucide-react";

export function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Benachrichtigungen
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {"Wähle, welche Erinnerungen du ignorieren möchtest."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "Garantie-Ablauf-Warnungen",
              desc: "30 Tage bevor eine Garantie in den Zombie-Modus wechselt.",
              defaultOn: true,
            },
            {
              title: "Wartungserinnerungen",
              desc: "Weil sich dein HVAC-Filter nicht von selbst wechselt.",
              defaultOn: true,
            },
            {
              title: "Verleih-O-Meter Warnungen",
              desc: "Wenn Nachbarn ihr Werkzeug-Willkommen überstrapazieren.",
              defaultOn: true,
            },
            {
              title: "Zählerstand-Erinnerungen",
              desc: "Monatlicher Stupser, die unbeliebteste Ecke im Keller zu besuchen.",
              defaultOn: false,
            },
            {
              title: "Wunschlisten-Meilensteine",
              desc: "Wenn ein Sparziel 50%, 75% oder 100% erreicht.",
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

      {/* Data */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              Daten & Datenschutz
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {"Deine Daten. Deine Regeln."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                Daten exportieren
              </p>
              <p className="text-[11px] text-muted-foreground">
                Alles als JSON herunterladen. Perfekt für deine nächste
                Tabellen-Obsession.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Exportieren
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                Alle Daten löschen
              </p>
              <p className="text-[11px] text-muted-foreground">
                Die nukleare Option. Kein Rückgängig. Keine Reue (hoffentlich).
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Löschen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-dashed">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Adulting.exe v2.0
              </p>
              <p className="text-[11px] text-muted-foreground">
                {"Immer noch Beta. Genau wie deine Erwachsenen-Fähigkeiten."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
