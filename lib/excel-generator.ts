import * as XLSX from "xlsx"
import type { DocumentFolder } from "./types"

const isBrowser = typeof window !== "undefined"

export class ExcelGenerator {
  generateArchiveExcel(folder: DocumentFolder, options?: { mergeMode?: "override" | "parallel" }): Blob {
    console.log("[v0] Generating Excel for folder:", folder.name)

    const workbook = XLSX.utils.book_new()

    const mergeMode = options?.mergeMode || "override"

    const summaryData = [
      ["گزارش بایگانی اسناد"],
      [""],
      ["شماره اشتراک:", folder.subscriptionNumber],
      ["تعداد اسناد:", folder.documents.length],
      ["تاریخ ایجاد:", new Date(folder.createdAt).toLocaleDateString("fa-IR")],
      ["آخرین بروزرسانی:", new Date(folder.updatedAt).toLocaleDateString("fa-IR")],
      [""],
      ["فهرست اسناد:"],
      ["ردیف", "نام فایل", "تاریخ اسکن", "شماره اشتراک", "شماره بایگانی", "خلاصه Grok", "تعداد جداول Grok"],
    ]

    folder.documents.forEach((doc, idx) => {
      const grokSummary = doc.grokAnalysis?.summary ? String(doc.grokAnalysis.summary) : "-"
      const grokTablesCount = doc.grokAnalysis?.tables ? doc.grokAnalysis.tables.length : 0
      summaryData.push([
        idx + 1,
        doc.fileName,
        new Date(doc.scannedAt).toLocaleDateString("fa-IR"),
        doc.subscriptionNumber || "-",
        doc.archiveNumber || "-",
        grokSummary,
        grokTablesCount,
      ] as any)
    })

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, "خلاصه")

    folder.documents.forEach((doc, idx) => {
      if (doc.extractedData?.tables && doc.extractedData.tables.length > 0) {
        doc.extractedData.tables.forEach((table: any, tableIdx: number) => {
          const tableData = []

          if (table.headers) {
            tableData.push(table.headers)
          }

          table.rows.forEach((row: any) => {
            tableData.push(row)
          })

          const sheet = XLSX.utils.aoa_to_sheet(tableData)
          const sheetName = `سند${idx + 1}_جدول${tableIdx + 1}`.substring(0, 31)
          XLSX.utils.book_append_sheet(workbook, sheet, sheetName)
        })
      }

      if (doc.extractedData) {
        const detailData = [["اطلاعات سند: " + doc.fileName], [""], ["فیلدهای استخراج شده:"]]

        if (doc.extractedData.fields) {
          Object.entries(doc.extractedData.fields).forEach(([key, value]) => {
            detailData.push([key, value as string])
          })
        }

        detailData.push([""], ["متن کامل:"], [doc.extractedData.text])

        if (mergeMode === "override") {
          const mergedFields: Record<string, string> = {
            ...(doc.extractedData?.fields || {}),
            ...(doc.grokAnalysis?.fields || {}),
          }
          if (Object.keys(mergedFields).length > 0) {
            detailData.push([""], ["فیلدهای نهایی (با اولویت Grok):"])
            Object.entries(mergedFields).forEach(([key, value]) => {
              detailData.push([key, value])
            })
          }
        }

        if (doc.grokAnalysis && doc.grokAnalysis.fields && Object.keys(doc.grokAnalysis.fields).length > 0) {
          detailData.push([""], ["فیلدهای Grok:"])
          Object.entries(doc.grokAnalysis.fields).forEach(([key, value]) => {
            detailData.push([key, value as string])
          })
        }

        if (doc.grokAnalysis && doc.grokAnalysis.cleanText) {
          detailData.push([""], ["متن تصحیح‌شده Grok:"], [doc.grokAnalysis.cleanText])
        }

        const detailSheet = XLSX.utils.aoa_to_sheet(detailData)
        const sheetName = `سند${idx + 1}_جزئیات`.substring(0, 31)
        XLSX.utils.book_append_sheet(workbook, detailSheet, sheetName)
      }

      if (doc.grokAnalysis?.tables && doc.grokAnalysis.tables.length > 0) {
        doc.grokAnalysis.tables.forEach((table: any, tableIdx: number) => {
          const tableData = []
          if (table.headers) {
            tableData.push(table.headers)
          }
          table.rows.forEach((row: any) => {
            tableData.push(row)
          })
          const sheet = XLSX.utils.aoa_to_sheet(tableData)
          const sheetName = `سند${idx + 1}_Grok${tableIdx + 1}`.substring(0, 31)
          XLSX.utils.book_append_sheet(workbook, sheet, sheetName)
        })
      }
    })

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  }

  downloadExcel(blob: Blob, fileName: string) {
    if (!isBrowser) return

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  generateFullReport(folders: DocumentFolder[]): Blob {
    const workbook = XLSX.utils.book_new()

    const overallData = [
      ["گزارش کامل بایگانی"],
      [""],
      ["تعداد کل پوشه‌ها:", folders.length],
      ["تعداد کل اسناد:", folders.reduce((sum, f) => sum + f.documents.length, 0)],
      ["تاریخ گزارش:", new Date().toLocaleDateString("fa-IR")],
      [""],
      ["فهرست پوشه‌ها:"],
      ["ردیف", "شماره اشتراک", "تعداد اسناد", "تاریخ ایجاد", "آخرین بروزرسانی"],
    ]

    folders.forEach((folder, idx) => {
      overallData.push([
        idx + 1,
        folder.subscriptionNumber,
        folder.documents.length,
        new Date(folder.createdAt).toLocaleDateString("fa-IR"),
        new Date(folder.updatedAt).toLocaleDateString("fa-IR"),
      ] as any)
    })

    const overallSheet = XLSX.utils.aoa_to_sheet(overallData)
    XLSX.utils.book_append_sheet(workbook, overallSheet, "خلاصه کلی")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  }
}

export const excelGenerator = new ExcelGenerator()
