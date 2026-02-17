import * as React from "react";
import { isVersionLessThan, FALLBACK_VERSION, GITHUB_REPO } from "@/lib/utils/version";

interface VersionCheckResult {
    latestVersion: string | null;
    currentVersion: string;
    isUpdateAvailable: boolean;
    releaseUrl: string;
    lastChecked: Date | null;
    isLoading: boolean;
    error: Error | null;
}

const DEFAULT_POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useVersionCheck(pollingIntervalMs: number = DEFAULT_POLLING_INTERVAL): VersionCheckResult {
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || FALLBACK_VERSION;
    const [latestVersion, setLatestVersion] = React.useState<string | null>(null);
    const [releaseUrl, setReleaseUrl] = React.useState<string>(`https://github.com/${GITHUB_REPO}/releases`);
    const [isUpdateAvailable, setIsUpdateAvailable] = React.useState<boolean>(false);
    const [lastChecked, setLastChecked] = React.useState<Date | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Error | null>(null);

    const checkVersion = React.useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/version", { signal });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.version) {
                setLatestVersion(data.version);
                setLastChecked(new Date());

                if (data.releaseUrl) {
                    setReleaseUrl(data.releaseUrl);
                } else {
                    setReleaseUrl(`https://github.com/${GITHUB_REPO}/releases/tag/v${data.version}`);
                }

                // Check if update is available using semantic version comparison
                if (!data.fallback && isVersionLessThan(currentVersion, data.version)) {
                    setIsUpdateAvailable(true);
                } else {
                    setIsUpdateAvailable(false);
                }
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                console.error("Failed to fetch version:", err);
                setError(err instanceof Error ? err : new Error(String(err)));
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentVersion]);

    React.useEffect(() => {
        const abortController = new AbortController();

        // Initial check
        checkVersion(abortController.signal);

        // Set up polling
        if (pollingIntervalMs > 0) {
            const intervalId = setInterval(() => {
                checkVersion();
            }, pollingIntervalMs);

            return () => {
                clearInterval(intervalId);
                abortController.abort();
            };
        }

        return () => {
            abortController.abort();
        };
    }, [checkVersion, pollingIntervalMs]);

    return {
        latestVersion,
        currentVersion,
        isUpdateAvailable,
        releaseUrl,
        lastChecked,
        isLoading,
        error
    };
}
