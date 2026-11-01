import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
}

const SAFE_RECEIPT_PATH = /^\/uploads\/vault\/[a-zA-Z0-9_-]+\.[a-zA-Z]{3,4}$/

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get("id")
    const customPath = searchParams.get("path")

    let receiptPath: string | null = null
    let downloadFilename = "Quittung"

    if (id) {
      const appliance = await prisma.appliance.findUnique({
        where: { id },
        select: { id: true, name: true, brand: true, receiptPath: true },
      })

      if (!appliance || !appliance.receiptPath) {
        return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
      }

      receiptPath = appliance.receiptPath
      const ext = path.extname(receiptPath).toLowerCase()
      const sanitizedName = `${appliance.name}-${appliance.brand}`.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_")
      downloadFilename = `${sanitizedName}-Quittung${ext}`
    } else if (customPath) {
      receiptPath = customPath
      const ext = path.extname(receiptPath).toLowerCase()
      downloadFilename = `Quittung-${path.basename(receiptPath, ext)}${ext}`
    } else {
      return NextResponse.json({ error: "Missing 'id' or 'path' parameter" }, { status: 400 })
    }

    if (!SAFE_RECEIPT_PATH.test(receiptPath)) {
      return NextResponse.json({ error: "Invalid attachment path" }, { status: 400 })
    }

    const uploadsBaseDir = path.resolve(process.cwd(), "public", "uploads", "vault")
    const filePath = path.resolve(process.cwd(), "public", receiptPath.replace(/^\//, ""))

    if (!filePath.startsWith(uploadsBaseDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    try {
      await stat(filePath)
    } catch {
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`,
        "Content-Length": fileBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Vault attachment download error:", error)
    return NextResponse.json({ error: "Failed to download attachment" }, { status: 500 })
  }
}
