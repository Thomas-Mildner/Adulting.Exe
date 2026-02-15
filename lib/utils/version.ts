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
 */
export function isVersionLessThan(v1: string, v2: string): boolean {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    
    if (num1 < num2) return true;
    if (num1 > num2) return false;
  }
  
  return false;
}
