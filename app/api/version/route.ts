import { NextResponse } from 'next/server';
import pkg from '@/package.json';
import { GITHUB_REPO } from '@/lib/utils/version';
import fs from 'fs';
import path from 'path';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body?: string;
}

interface CachedVersionInfo {
  version: string;
  timestamp: number;
  releaseUrl: string;
  publishedAt: string;
  releaseNotes?: string;
  name?: string;
}

function getFallbackChangelog(): { releaseNotes?: string } {
  try {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    if (fs.existsSync(changelogPath)) {
      const content = fs.readFileSync(changelogPath, 'utf-8');
      const parts = content.split(/^#\s+/m);
      if (parts.length > 1) {
        return { releaseNotes: `# ${parts[1].trim()}` };
      }
    }
  } catch {
    // Ignore read errors
  }
  return {};
}

let cachedVersion: CachedVersionInfo | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    // Check if we have a valid cached version
    if (cachedVersion && Date.now() - cachedVersion.timestamp < CACHE_DURATION) {
      return NextResponse.json({ 
        version: cachedVersion.version,
        cached: true,
        releaseUrl: cachedVersion.releaseUrl,
        publishedAt: cachedVersion.publishedAt,
        releaseNotes: cachedVersion.releaseNotes,
        name: cachedVersion.name,
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
      // If we can't fetch from GitHub, fall back to package.json version and local CHANGELOG.md
      const fallbackNotes = getFallbackChangelog();
      return NextResponse.json({ 
        version: pkg.version,
        fallback: true,
        releaseUrl: `https://github.com/${GITHUB_REPO}/releases`,
        releaseNotes: fallbackNotes.releaseNotes || '',
        name: `v${pkg.version}`,
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
      releaseUrl: release.html_url,
      publishedAt: release.published_at,
      releaseNotes: release.body || '',
      name: release.name || `v${version}`,
    };

    return NextResponse.json({ 
      version,
      cached: false,
      releaseUrl: release.html_url,
      publishedAt: release.published_at,
      releaseNotes: release.body || '',
      name: release.name || `v${version}`,
    });
  } catch (error) {
    console.error('Error fetching version from GitHub:', error);
    
    // Fall back to package.json version and local changelog
    const fallbackNotes = getFallbackChangelog();
    return NextResponse.json({ 
      version: pkg.version,
      fallback: true,
      releaseUrl: `https://github.com/${GITHUB_REPO}/releases`,
      releaseNotes: fallbackNotes.releaseNotes || '',
      name: `v${pkg.version}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

