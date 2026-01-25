"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { storageManager } from "@/lib/storage-manager"
import {
  ImageIcon,
  SearchIcon,
  EditIcon,
  ScissorsIcon,
  PrinterIcon,
  FileEditIcon,
  FolderIcon,
  TrashIcon,
  RotateCwIcon,
} from "lucide-react"
import type { Device, ScannedDocument } from "@/lib/types"
import Image from "next/image"

export default function GalleryPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [documents, setDocuments] = useState<ScannedDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<ScannedDocument[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [tab, setTab] = useState<"current" | "folders" | "search">("current")
  const [folderNames, setFolderNames] = useState<Record<string, string>>({})
  const [docMeta, setDocMeta] = useState<Record<string, { fileSize?: number; width?: number; height?: number }>>({})

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = documents.filter(
        (doc) =>
          doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.extractedData?.text?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          doc.subscriptionNumber?.includes(searchQuery) ||
          doc.archiveNumber?.includes(searchQuery) ||
          (folderNames[doc.id]?.toLowerCase().includes(searchQuery.toLowerCase()) || false),
      )
      setFilteredDocuments(filtered)
    } else {
      setFilteredDocuments(documents)
    }
  }, [searchQuery, documents, folderNames])

  const loadDocuments = async () => {
    try {
      const docs = await storageManager.loadDocuments()
      setDocuments(docs)
      setFilteredDocuments(docs)
      const { ocrProcessor } = await import("@/lib/ocr-processor")
      const names: Record<string, string> = {}
      const meta: Record<string, { fileSize?: number; width?: number; height?: number }> = {}
      for (const d of docs) {
        if (d.folderId) {
          const f = await ocrProcessor.getFolder(d.folderId)
          if (f?.name) names[d.id] = f.name
        }
        if (typeof d.imageUrl === "string" && d.imageUrl.startsWith("data:")) {
          const size = approximateSizeFromDataUrl(d.imageUrl)
          meta[d.id] = { ...(meta[d.id] || {}), fileSize: size }
        }
        await new Promise<void>((resolve) => {
          const img = document.createElement('img')
          img.onload = () => {
            meta[d.id] = { ...(meta[d.id] || {}), width: img.width, height: img.height }
            resolve()
          }
          img.onerror = () => resolve()
          img.src = d.imageUrl || ""
        })
      }
      setFolderNames(names)
      setDocMeta(meta)
    } catch (error) {
      
    }
  }

  const handleReOCR = async (doc: ScannedDocument) => {
    const { ocrProcessor } = await import("@/lib/ocr-processor")
    const updated = await ocrProcessor.reprocessExistingDocument(doc)
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setFilteredDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setSelectedDoc(updated)
  }

  const handlePrint = (doc: ScannedDocument) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print - ${doc.fileName}</title></head>
          <body style="margin: 0; padding: 20px;">
            <img src="${doc.imageUrl}" style="max-width: 100%; height: auto;" />
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDelete = async (doc: ScannedDocument) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این سند را حذف کنید؟")) return

    const updatedDocs = documents.filter((d) => d.id !== doc.id)
    setDocuments(updatedDocs)
    setFilteredDocuments((prev) => prev.filter((d) => d.id !== doc.id))
    await storageManager.deleteDocument(doc.id)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const approximateSizeFromDataUrl = (dataUrl: string): number => {
    const base64 = dataUrl.split(",")[1] || ""
    try {
      const len = atob(base64).length
      return len
    } catch {
      return base64.length
    }
  }

  const handleRename = async (doc: ScannedDocument) => {
    const newName = prompt("نام جدید فایل را وارد کنید", doc.fileName)
    if (!newName || newName.trim() === "" || newName === doc.fileName) return
    const updated = { ...doc, fileName: newName.trim() }
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setFilteredDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
    setSelectedDoc(updated)
    await storageManager.saveDocument(updated)
  }

  const handleOpenFolder = async (doc: ScannedDocument) => {
    if (!doc.folderId) return
    const { ocrProcessor } = await import("@/lib/ocr-processor")
    const folder = await ocrProcessor.getFolder(doc.folderId)
    if (folder) {
      alert(`پوشه: ${folder.name}`)
    }
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar
        devices={devices}
        selectedDevice={selectedDevice}
        onSelectDevice={setSelectedDevice}
        onRequestDevice={async () => {}}
      />

      <main className="flex-1 flex flex-col h-screen">
        <Header selectedDevice={selectedDevice} scannedImage="" onScannedImage={() => {}} />

        <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <SearchIcon className="w-4 h-4 text-[var(--windows-text-secondary)]" />
                <Input
                  type="text"
                  placeholder="جستجو در اسناد، شماره اشتراک، محتوا..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 windows-button"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="windows-button"
                >
                  نمای شبکه‌ای
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="windows-button"
                >
                  نمای لیست
                </Button>
                <Badge variant="secondary">{filteredDocuments.length} سند</Badge>
              </div>
            </div>
          </Card>

          <ScrollArea className="flex-1">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-1">
                {filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="group cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="aspect-[3/4] relative bg-muted">
                      <Image
                        src={doc.imageUrl || "/placeholder.svg"}
                        alt={doc.fileName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{doc.fileName}</p>
                      {docMeta[doc.id]?.fileSize !== undefined && (
                        <p className="text-xs text-muted-foreground">{formatFileSize(docMeta[doc.id]!.fileSize!)}</p>
                      )}
                      {doc.subscriptionNumber && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {doc.subscriptionNumber}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative bg-muted rounded">
                        <Image
                          src={doc.imageUrl || "/placeholder.svg"}
                          alt={doc.fileName}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(doc.scannedAt).toLocaleString("fa-IR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.subscriptionNumber && <Badge variant="outline">{doc.subscriptionNumber}</Badge>}
                        {folderNames[doc.id] && (
                          <Badge variant="secondary">
                            <FolderIcon className="w-3 h-3 ml-1" />
                            {folderNames[doc.id]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>

      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedDoc?.fileName}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Image preview */}
            <div className="flex-1 relative bg-muted rounded">
                {selectedDoc && (
                  <Image
                  src={selectedDoc.imageUrl || "/placeholder.svg"}
                  alt={selectedDoc.fileName}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              )}
            </div>

            {/* Details and actions */}
            <ScrollArea className="w-80">
              <div className="space-y-4">
                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="windows-button bg-transparent"
                    onClick={() => selectedDoc && handleReOCR(selectedDoc)}
                  >
                    <RotateCwIcon className="w-4 h-4 ml-2" />
                    OCR مجدد
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="windows-button bg-transparent"
                    onClick={() => selectedDoc && handlePrint(selectedDoc)}
                  >
                    <PrinterIcon className="w-4 h-4 ml-2" />
                    چاپ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="windows-button bg-transparent"
                    onClick={() => selectedDoc && handleOpenFolder(selectedDoc)}
                  >
                    <EditIcon className="w-4 h-4 ml-2" />
                    مشاهده پوشه
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="windows-button bg-transparent"
                    onClick={() => selectedDoc && handleRename(selectedDoc)}
                  >
                    <FileEditIcon className="w-4 h-4 ml-2" />
                    تغییر نام
                  </Button>
                </div>

                <div className="windows-menu-separator" />

                {/* Document details */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">مشخصات فایل</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>اندازه: {selectedDoc && formatFileSize(selectedDoc.extractedData?.confidence || 0)}</p>
                      <p>
                        {selectedDoc && docMeta[selectedDoc.id]?.width && docMeta[selectedDoc.id]?.height
                          ? `ابعاد: ${docMeta[selectedDoc.id]!.width} × ${docMeta[selectedDoc.id]!.height}`
                          : "ابعاد نامشخص"}
                      </p>
                      <p>تاریخ: {selectedDoc && new Date(selectedDoc.scannedAt).toLocaleString("fa-IR")}</p>
                    </div>
                  </div>

                  {selectedDoc?.subscriptionNumber && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">شماره اشتراک</h4>
                      <Badge variant="default" className="text-sm">
                        {selectedDoc.subscriptionNumber}
                      </Badge>
                    </div>
                  )}

                  {selectedDoc?.archiveNumber && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">شماره بایگانی</h4>
                      <Badge variant="secondary" className="text-sm">
                        {selectedDoc.archiveNumber}
                      </Badge>
                    </div>
                  )}

                  {selectedDoc?.folderId && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">پوشه</h4>
                      <Badge variant="outline" className="text-sm">
                        <FolderIcon className="w-3 h-3 ml-1" />
                        {selectedDoc.folderId}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-1">متن استخراج شده (OCR)</h4>
                    <ScrollArea className="h-40 rounded border p-2 text-sm">
                      {selectedDoc?.extractedData?.text || "متن استخراج نشده است"}
                    </ScrollArea>
                  </div>
                </div>

                <div className="windows-menu-separator" />

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (selectedDoc) {
                      handleDelete(selectedDoc)
                      setSelectedDoc(null)
                    }
                  }}
                >
                  <TrashIcon className="w-4 h-4 ml-2" />
                  حذف سند
                </Button>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
