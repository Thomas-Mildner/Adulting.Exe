/**
 * Version utility functions and constants
 */

// GitHub repository information
export const GITHUB_REPO_OWNER = 'Thomas-Mildner';
export const GITHUB_REPO_NAME = 'Adulting.Exe';
export const GITHUB_REPO = `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;

// Fallback version when version cannot be determined
export const FALLBACK_VERSION = '1.0.0';

/**
 * Compare two semantic versions
 * @param v1 - First version string (e.g., "1.2.3")
 * @param v2 - Second version string (e.g., "1.3.0")
 * @returns true if v1 < v2, false otherwise
 * 
 * Note: This is a simple comparison that works for standard semantic versions (X.Y.Z).
 * It does not handle pre-release versions (e.g., "1.0.0-beta") or build metadata.
 * For more complex version comparison needs, consider using the 'semver' library.
 */
export function isVersionLessThan(v1: string, v2: string): boolean {
  const parseSemver = (v: string) => {
    const clean = v.replace(/^v/, '').trim();
    const [versionCore, ...preParts] = clean.split('-');
    const core = versionCore.split('.').map((n) => parseInt(n, 10) || 0);
    const pre = preParts.join('-');
    return { core, pre };
  };

  const parsed1 = parseSemver(v1);
  const parsed2 = parseSemver(v2);

  // Compare core numbers [major, minor, patch]
  for (let i = 0; i < Math.max(parsed1.core.length, parsed2.core.length); i++) {
    const num1 = parsed1.core[i] || 0;
    const num2 = parsed2.core[i] || 0;
    if (num1 < num2) return true;
    if (num1 > num2) return false;
  }

  // If core numbers are equal, check pre-release
  // A version without pre-release is greater than one with pre-release (1.10.0 > 1.10.0-rc.1)
  if (!parsed1.pre && parsed2.pre) return false;
  if (parsed1.pre && !parsed2.pre) return true;
  if (parsed1.pre && parsed2.pre) {
    return parsed1.pre.localeCompare(parsed2.pre, undefined, { numeric: true }) < 0;
  }

  return false;
}
