import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "File not specified" }, { status: 400 })
    }

    const uploadsBase = path.resolve(process.cwd(), "public", "uploads")
    const targetFile = path.resolve(uploadsBase, ...pathSegments)

    // Security: prevent directory traversal
    if (!targetFile.startsWith(uploadsBase)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    try {
      await stat(targetFile)
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(targetFile)
    const ext = path.extname(targetFile).toLowerCase()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": fileBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    }

    if (request.nextUrl.searchParams.has("download")) {
      const filename = path.basename(targetFile)
      headers["Content-Disposition"] = `attachment; filename="${filename}"`
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error serving uploaded file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

