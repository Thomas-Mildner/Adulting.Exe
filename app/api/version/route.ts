import { NextResponse } from 'next/server';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

// Cache the version for 5 minutes to avoid hitting GitHub API rate limits
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

    // Fetch latest release from GitHub
    const response = await fetch(
      'https://api.github.com/repos/Thomas-Mildner/Adulting.Exe/releases/latest',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add User-Agent as required by GitHub API
          'User-Agent': 'Adulting.Exe-App',
        },
        // Don't cache in Next.js, we'll handle our own caching
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      // If we can't fetch from GitHub, fall back to package.json version
      const pkg = await import('@/package.json');
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
    const pkg = await import('@/package.json');
    return NextResponse.json({ 
      version: pkg.version,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
