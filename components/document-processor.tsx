"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SampleDocuments } from "./sample-documents"
import {
  FileText,
  FolderOpen,
  Scan,
  Search,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  Upload,
} from "lucide-react"

interface DocumentProcessorProps {
  scannedImage: string
}

export function DocumentProcessor({ scannedImage }: DocumentProcessorProps) {
  const [activeTab, setActiveTab] = useState("process")
  const [documents, setDocuments] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<any>(null)
  const [filters, setFilters] = useState({ text: "", folder: "" })
  const [uploadedImage, setUploadedImage] = useState<string>("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectSampleDocument = (imageUrl: string) => {
    setUploadedImage(imageUrl)
  }

  const currentImage = uploadedImage || scannedImage

  const handleProcessDocument = async () => {
    if (!currentImage) return
    
    setIsProcessing(true)
    try {
      let extractedText = ""
      let confidence = 0
      
      // First try Tesseract OCR
      if (currentImage.startsWith("data:")) {
        // Convert data URL to blob for FormData
        const response = await fetch(currentImage)
        const blob = await response.blob()
        
        const formData = new FormData()
        formData.append("image", blob, "document.jpg")
        
        const ocrResponse = await fetch("/api/ocr/tesseract", {
          method: "POST",
          body: formData
        })
        
        if (ocrResponse.ok) {
          const ocrData = await ocrResponse.json()
          extractedText = ocrData.text
          confidence = ocrData.confidence / 100 // Convert to 0-1 scale
        }
      }
      
      // If we have text, post-process it with Grok
      let processedData = {
        cleanText: extractedText,
        summary: "متن استخراج شده از تصویر",
        fields: {},
        tables: [],
        meta: { language: "fa", confidence }
      }
      
      if (extractedText && extractedText.trim()) {
        try {
          const grokResponse = await fetch("/api/ocr/grok", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              rawText: extractedText,
              mode: "ocr-postprocess"
            })
          })
          
          if (grokResponse.ok) {
            const grokData = await grokResponse.json()
            if (grokData.result) {
              processedData = { ...processedData, ...grokData.result }
            }
          }
        } catch (error) {
          console.error("Grok post-processing failed:", error)
        }
      }
      
      const newDoc = {
        id: `doc-${Date.now()}`,
        fileName: `document-${Date.now()}.jpg`,
        imageUrl: currentImage,
        scannedAt: new Date(),
        processed: true,
        subscriptionNumber: (processedData.fields as any)?.subscriptionNumber || "نامشخص",
        archiveNumber: (processedData.fields as any)?.archiveNumber || "نامشخص",
        requestNumber: (processedData.fields as any)?.requestNumber || "نامشخص",
        extractedData: {
          text: processedData.cleanText || extractedText,
          confidence: processedData.meta?.confidence || confidence,
          summary: processedData.summary,
          fields: processedData.fields,
          tables: processedData.tables || []
        }
      }
      
      setDocuments(prev => [newDoc, ...prev])
      setCurrentDocument(newDoc)
    } catch (error) {
      console.error("Error processing document:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(filters.text.toLowerCase()) ||
    doc.subscriptionNumber?.includes(filters.text) ||
    doc.archiveNumber?.includes(filters.text)
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="process">پردازش</TabsTrigger>
          <TabsTrigger value="documents">اسناد</TabsTrigger>
          <TabsTrigger value="folders">پوشه‌ها</TabsTrigger>
          <TabsTrigger value="settings">تنظیمات</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">پردازش سند</h3>
                <Badge variant={currentImage ? "default" : "secondary"}>
                  {currentImage ? "آماده پردازش" : "منتظر اسکن"}
                </Badge>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">
                      فایل تصویری را بارگذاری کنید یا از اسکنر استفاده کنید
                    </span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Sample Documents */}
              <SampleDocuments onSelectDocument={handleSelectSampleDocument} />

              {currentImage && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <img 
                      src={currentImage} 
                      alt="Scanned document" 
                      className="max-w-full h-auto rounded"
                    />
                  </div>

                  <Button 
                    onClick={handleProcessDocument}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        شروع پردازش OCR
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={65} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        استخراج متن فارسی...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!currentImage && (
                <div className="text-center py-8 text-muted-foreground">
                  <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لطفاً ابتدا سندی را اسکن کنید یا بارگذاری کنید</p>
                </div>
              )}
            </div>
          </Card>

          {currentDocument && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">نتیجه پردازش</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>شماره اشتراک</Label>
                    <p className="font-mono">{currentDocument.subscriptionNumber}</p>
                  </div>
                  <div>
                    <Label>شماره بایگانی</Label>
                    <p className="font-mono">{currentDocument.archiveNumber}</p>
                  </div>
                </div>
                
                {currentDocument.extractedData.summary && (
                  <div>
                    <Label>خلاصه</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentDocument.extractedData.summary}
                    </p>
                  </div>
                )}
                
                <div>
                  <Label>متن استخراج شده</Label>
                  <ScrollArea className="h-32 w-full border rounded p-3 mt-2">
                    <p className="text-sm whitespace-pre-wrap">
                      {currentDocument.extractedData.text}
                    </p>
                  </ScrollArea>
                </div>

                {currentDocument.extractedData.tables && 
                 currentDocument.extractedData.tables.length > 0 && (
                  <div>
                    <Label>جداول شناسایی شده</Label>
                    <div className="mt-2 space-y-2">
                      {currentDocument.extractedData.tables.map((table: any, index: number) => (
                        <div key={index} className="border rounded p-3">
                          <p className="text-sm font-medium mb-2">جدول {index + 1}</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  {table.headers?.map((header: string, i: number) => (
                                    <th key={i} className="text-right p-2 font-medium">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.rows?.map((row: string[], i: number) => (
                                  <tr key={i} className="border-b">
                                    {row.map((cell: string, j: number) => (
                                      <td key={j} className="p-2">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    دقت: {Math.round((currentDocument.extractedData.confidence || 0) * 100)}%
                  </span>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Search className="h-4 w-4" />
              <Input
                placeholder="جستجو در اسناد..."
                value={filters.text}
                onChange={(e) => setFilters(f => ({ ...f, text: e.target.value }))}
              />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-right p-4 font-medium">نام فایل</th>
                    <th className="text-right p-4 font-medium">تاریخ اسکن</th>
                    <th className="text-right p-4 font-medium">شماره اشتراک</th>
                    <th className="text-right p-4 font-medium">شماره بایگانی</th>
                    <th className="text-right p-4 font-medium">اقدامات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{doc.fileName}</td>
                      <td className="p-4">{new Date(doc.scannedAt).toLocaleString("fa-IR")}</td>
                      <td className="p-4">{doc.subscriptionNumber || "-"}</td>
                      <td className="p-4">{doc.archiveNumber || "-"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentDocument(doc)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            مشاهده
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            دانلود
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>هیچ سندی یافت نشد</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="folders" className="space-y-4">
          <Card className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>پوشه‌ها به صورت خودکار بر اساس شماره اشتراک ایجاد می‌شوند</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">تنظیمات OCR</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="persian-ocr">OCR فارسی</Label>
                <Switch id="persian-ocr" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="table-extraction">استخراج جدول</Label>
                <Switch id="table-extraction" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-organize">سازماندهی خودکار</Label>
                <Switch id="auto-organize" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
