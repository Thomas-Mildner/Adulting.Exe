/**
 * Version utility functions and constants
 */

// GitHub repository information
export const GITHUB_REPO_OWNER = 'Thomas-Mildner';
export const GITHUB_REPO_NAME = 'Adulting.Exe';
export const GITHUB_REPO = `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;

// Fallback version when version cannot be determined
export const FALLBACK_VERSION = '1.0.0';

function parseSemver(v: string) {
  const clean = v.replace(/^v/, "").trim();
  const [core, prerelease] = clean.split("-");
  const parts = core.split(".").map((p) => parseInt(p, 10) || 0);
  return {
    major: parts[0] ?? 0,
    minor: parts[1] ?? 0,
    patch: parts[2] ?? 0,
    prerelease: prerelease ?? null,
  };
}

/**
 * Compare two semantic versions, supporting pre-releases (e.g., "1.10.0-rc.1")
 * @param v1 - First version string (e.g., "1.2.3" or "1.10.0-rc.1")
 * @param v2 - Second version string (e.g., "1.3.0" or "1.10.0")
 * @returns true if v1 < v2, false otherwise
 */
export function isVersionLessThan(v1: string, v2: string): boolean {
  const p1 = parseSemver(v1);
  const p2 = parseSemver(v2);

  if (p1.major !== p2.major) return p1.major < p2.major;
  if (p1.minor !== p2.minor) return p1.minor < p2.minor;
  if (p1.patch !== p2.patch) return p1.patch < p2.patch;

  // If core versions match: a pre-release is strictly older than the final release
  if (p1.prerelease && !p2.prerelease) return true;
  if (!p1.prerelease && p2.prerelease) return false;
  if (p1.prerelease && p2.prerelease) {
    return p1.prerelease.localeCompare(p2.prerelease, undefined, { numeric: true }) < 0;
  }

  return false;
}
