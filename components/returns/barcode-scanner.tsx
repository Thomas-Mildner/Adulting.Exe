"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useTranslations } from "next-intl";

export function BarcodeScanner({
    onScan,
}: {
    onScan: (decodedText: string) => void;
}) {
    const t = useTranslations("Returns");
    const [scannerReady, setScannerReady] = useState(false);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        // We run it on mount
        scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                // Stop scanning after success
                scanner?.clear();
                onScan(decodedText);
            },
            (errorMessage) => {
                // We can ignore parsing errors (they happen every frame that fails)
            }
        );
        setScannerReady(true);

        return () => {
            if (scanner) {
                scanner.clear().catch(e => console.error("Failed to clear scanner", e));
            }
        };
    }, [onScan]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div id="reader" className="w-full max-w-sm overflow-hidden rounded-lg border border-border"></div>
        </div>
    );
}
