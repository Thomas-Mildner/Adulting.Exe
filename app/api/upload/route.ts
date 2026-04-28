import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const ALLOWED_TYPES: Record<string, { ext: string; magic: number[][] }> = {
  "image/jpeg": { ext: ".jpg", magic: [[0xff, 0xd8, 0xff]] },
  "image/png": { ext: ".png", magic: [[0x89, 0x50, 0x4e, 0x47]] },
  "image/webp": { ext: ".webp", magic: [[0x52, 0x49, 0x46, 0x46]] },
  "image/gif": { ext: ".gif", magic: [[0x47, 0x49, 0x46, 0x38]] },
  "application/pdf": { ext: ".pdf", magic: [[0x25, 0x50, 0x44, 0x46]] },
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

function matchesMagicBytes(buffer: Buffer, signatures: number[][]): boolean {
  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const typeConfig = ALLOWED_TYPES[file.type]
    if (!typeConfig) {
      return NextResponse.json(
        { error: "Invalid file type. Only images (JPEG, PNG, WebP, GIF) and PDFs are allowed." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Verify file contents match declared MIME type via magic bytes
    if (!matchesMagicBytes(buffer, typeConfig.magic)) {
      return NextResponse.json(
        { error: "File content does not match declared type." },
        { status: 400 }
      )
    }

    // Use UUID for filename to avoid collisions and path traversal
    const uniqueName = `${randomUUID()}${typeConfig.ext}`

    const uploadDir = path.join(process.cwd(), "public", "uploads", "vault")
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)

    const publicPath = `/uploads/vault/${uniqueName}`
    return NextResponse.json({ path: publicPath }, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
