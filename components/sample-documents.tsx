"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileImage, Upload } from "lucide-react"

interface SampleDocumentsProps {
  onSelectDocument: (imageUrl: string) => void
}

export function SampleDocuments({ onSelectDocument }: SampleDocumentsProps) {
  const sampleDocs = [
    {
      id: 1,
      name: "اسکن جدول",
      fileName: "اسکن جدول.png",
      type: "جدول",
      description: "نمونه جدول برای تست OCR"
    },
    {
      id: 2,
      name: "قرارداد فروش",
      fileName: "اسکن قرارداد فروش.png", 
      type: "قرارداد",
      description: "نمونه قرارداد فروش"
    }
  ]

  const handleSelectDocument = (fileName: string) => {
    // In a real app, you'd load the actual image file
    // For now, we'll use a placeholder path
    onSelectDocument(`/${fileName}`)
  }

  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-3">اسناد نمونه</h4>
      <div className="space-y-2">
        {sampleDocs.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <FileImage className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {doc.type}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSelectDocument(doc.fileName)}
              >
                <Upload className="h-3 w-3 mr-1" />
                انتخاب
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
