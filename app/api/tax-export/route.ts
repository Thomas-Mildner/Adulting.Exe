import { NextResponse } from "next/server"
import { zipSync, strToU8 } from "fflate"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { taxRelevant: true },
      orderBy: { date: "asc" },
    })

    if (invoices.length === 0) {
      return NextResponse.json(
        { error: "No tax-deductible invoices found." },
        { status: 404 }
      )
    }

    // Build CSV content
    const escapeCsvField = (s: string) => `"${s.replace(/"/g, '""')}"`
    const csvHeader = "Date,Provider,Description,Amount (EUR),File Name\n"
    const csvRows = invoices
      .map((inv) => {
        const date = inv.date.toISOString().split("T")[0]
        const amount = inv.amount.toFixed(2)
        return [
          date,
          escapeCsvField(inv.providerName),
          escapeCsvField(inv.description),
          amount,
          escapeCsvField(inv.fileName),
        ].join(",")
      })
      .join("\n")

    const csvContent = csvHeader + csvRows

    // Build a plain-text summary
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const year = new Date().getFullYear()
    const summaryLines = [
      `Tax Export – ${year}`,
      `Generated: ${new Date().toISOString()}`,
      `Total tax-deductible invoices: ${invoices.length}`,
      `Total amount: EUR ${totalAmount.toFixed(2)}`,
      "",
      "Invoices:",
      ...invoices.map(
        (inv) =>
          `  ${inv.date.toISOString().split("T")[0]}  ${inv.providerName}  ${inv.description}  EUR ${inv.amount.toFixed(2)}  [${inv.fileName}]`
      ),
    ]
    const summaryContent = summaryLines.join("\n")

    // Create ZIP with fflate
    const zipData = zipSync({
      "tax-invoices.csv": strToU8(csvContent),
      "summary.txt": strToU8(summaryContent),
    })

    return new NextResponse(zipData, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="tax-export-${year}.zip"`,
        "Content-Length": zipData.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Tax export error:", error)
    return NextResponse.json(
      { error: "Failed to generate tax export." },
      { status: 500 }
    )
  }
}
