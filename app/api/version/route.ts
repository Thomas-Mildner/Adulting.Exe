import { NextResponse } from 'next/server';
import pkg from '@/package.json';
import { GITHUB_REPO } from '@/lib/utils/version';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

/**
 * Module-level cache for the latest version.
 * 
 * Note: This is a simple in-memory cache that works well for traditional deployments
 * but has limitations in serverless environments:
 * - Cache is lost between cold starts
 * - Each serverless instance maintains its own cache
 * - Cache doesn't persist across deployments
 * 
 * For production serverless deployments, consider using a distributed cache
 * like Redis or Vercel KV. However, for this use case (displaying version info),
 * the 5-minute cache window is acceptable and helps reduce GitHub API calls.
 * 
 * Authentication:
 * - For public repositories: No authentication required
 * - For private repositories: Set GITHUB_TOKEN or GH_TOKEN environment variable
 *   with a GitHub Personal Access Token that has 'repo' scope
 */
let cachedVersion: { version: string; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    // Check if we have a valid cached version
    if (cachedVersion && Date.now() - cachedVersion.timestamp < CACHE_DURATION) {
      return NextResponse.json({ 
        version: cachedVersion.version,
        cached: true 
      });
    }

    // Prepare headers for GitHub API
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Adulting.Exe-App',
    };

    // Add authentication if GitHub token is available (required for private repos)
    const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Fetch latest release from GitHub
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers,
        // Don't cache in Next.js, we'll handle our own caching
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      // If we can't fetch from GitHub, fall back to package.json version
      return NextResponse.json({ 
        version: pkg.version,
        fallback: true,
        error: `GitHub API returned ${response.status}`
      });
    }

    const release: GitHubRelease = await response.json();
    // Remove 'v' prefix if present
    const version = release.tag_name.startsWith('v') 
      ? release.tag_name.substring(1) 
      : release.tag_name;

    // Update cache
    cachedVersion = {
      version,
      timestamp: Date.now(),
    };

    return NextResponse.json({ 
      version,
      cached: false,
      releaseUrl: release.html_url,
      publishedAt: release.published_at,
    });
  } catch (error) {
    console.error('Error fetching version from GitHub:', error);
    
    // Fall back to package.json version
    return NextResponse.json({ 
      version: pkg.version,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
