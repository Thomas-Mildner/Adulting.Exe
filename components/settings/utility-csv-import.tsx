"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Download, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { importMeterReadings } from "@/lib/actions";
import type { MeterReading } from "@/lib/data";

type MeterReadingImport = Partial<MeterReading> & Pick<MeterReading, "month">;
type ImportField = Exclude<keyof MeterReadingImport, "month">;

const MONTHS_DE_SHORT = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function parseCsv(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = (firstLine.match(/;/g) ?? []).length > (firstLine.match(/,/g) ?? []).length ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') {
      field += '"';
      index++;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("quote");
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function normalizeHeader(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
}

function parseMonth(value: string): string | null {
  const text = value.trim();
  const isoMatch = text.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  const numericMatch = text.match(/^(\d{1,2})[./](\d{4})$/);
  let year: number;
  let monthIndex: number;

  if (isoMatch) {
    year = Number(isoMatch[1]);
    monthIndex = Number(isoMatch[2]) - 1;
  } else if (numericMatch) {
    monthIndex = Number(numericMatch[1]) - 1;
    year = Number(numericMatch[2]);
  } else {
    const nameMatch = text.match(/^([\p{L}.]+)\s+(\d{4})$/u);
    if (!nameMatch) return null;
    const monthNames = [
      ["jan", "january", "januar"], ["feb", "february", "februar"],
      ["mar", "march", "marz", "maerz"], ["apr", "april"], ["may", "mai"],
      ["jun", "june", "juni"], ["jul", "july", "juli"], ["aug", "august"],
      ["sep", "september"], ["oct", "okt", "october", "oktober"],
      ["nov", "november"], ["dec", "dez", "december", "dezember"],
    ];
    const monthName = normalizeHeader(nameMatch[1].replace(/\.$/, ""));
    monthIndex = monthNames.findIndex((names) => names.includes(monthName));
    year = Number(nameMatch[2]);
  }

  if (monthIndex < 0 || monthIndex > 11 || year < 1000) return null;
  return `${MONTHS_DE_SHORT[monthIndex]} ${year}`;
}

function parseNumber(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "");
  if (!normalized) return null;
  const decimalSeparator = normalized.lastIndexOf(",") > normalized.lastIndexOf(".") ? "," : ".";
  const parsed = Number(normalized.replace(/[,.]/g, (separator) => (separator === decimalSeparator ? "." : "")));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseMeterReadingsCsv(text: string): MeterReadingImport[] {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length < 2) throw new Error("empty");

  const aliases: Record<string, keyof MeterReadingImport> = {
    month: "month", monat: "month", date: "month", datum: "month",
    power: "power", strom: "power", electricity: "power",
    water: "water", wasser: "water", heating: "heating", heizung: "heating",
    powercost: "powerCost", costpower: "powerCost", stromkosten: "powerCost",
    watercost: "waterCost", costwater: "waterCost", wasserkosten: "waterCost",
    heatingcost: "heatingCost", costheating: "heatingCost", heizungskosten: "heatingCost",
  };
  const columns = rows[0].map((header) => aliases[normalizeHeader(header)]);
  const monthColumn = columns.indexOf("month");
  if (monthColumn < 0 || !columns.some((column) => column && column !== "month")) {
    throw new Error("headers");
  }

  return rows.slice(1).map((cells) => {
    const month = parseMonth(cells[monthColumn] ?? "");
    if (!month) throw new Error("month");
    const reading: MeterReadingImport = { month };
    for (const [index, column] of columns.entries()) {
      if (!column || column === "month" || !(cells[index] ?? "").trim()) continue;
      const value = parseNumber(cells[index]);
      if (value === null) throw new Error("number");
      reading[column as ImportField] = value;
    }
    if (Object.keys(reading).length === 1) throw new Error("row");
    return reading;
  });
}

export function UtilityCsvImport({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("Utilities");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImporting(true);
    try {
      const result = await importMeterReadings(parseMeterReadingsCsv(await file.text()));
      toast.success(t("importSuccess", { count: result.imported }));
    } catch {
      toast.error(t("importError"));
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = "Monat;Strom;Wasser;Heizung;Stromkosten;Wasserkosten;Heizungskosten\n2026-01;120;8;95;42,50;18,00;65,00\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ressourcen-vorlage.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const controls = (
    <>
      <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
      <Button type="button" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={importing}>
        <FileUp className="h-4 w-4" />
        {importing ? t("importing") : t("importCsv")}
      </Button>
      <Button type="button" size="sm" variant="outline" className="gap-2" onClick={downloadTemplate}>
        <Download className="h-4 w-4" />
        {t("downloadTemplate")}
      </Button>
    </>
  );

  if (compact) return controls;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{t("importCsvTitle")}</CardTitle>
        <CardDescription>{t("importDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">Monat;Strom;Wasser;Heizung;Stromkosten;Wasserkosten;Heizungskosten{"\n"}2026-01;120;8;95;42,50;18,00;65,00</pre>
        <div className="flex flex-wrap gap-2">{controls}</div>
      </CardContent>
    </Card>
  );
}