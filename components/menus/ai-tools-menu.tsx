"use client"

import { Lightbulb, MessageSquare, ImageIcon, FileText, Languages, Wand2, Brain, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AiToolsMenuProps {
  scannedImage: string
}

export function AiToolsMenu({ scannedImage }: AiToolsMenuProps) {
  const { toast } = useToast()

  const handleOCR = async () => {
    if (!scannedImage) {
      toast({
        title: "خطا",
        description: "ابتدا تصویری را اسکن کنید",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "در حال پردازش...",
      description: "استخراج متن از تصویر در حال انجام"
    })

    // Simulate OCR processing
    setTimeout(() => {
      toast({
        title: "OCR تکمیل شد",
        description: "متن با موفقیت استخراج شد"
      })
    }, 2000)
  }

  const handleDocumentAnalysis = (type: string) => {
    if (!scannedImage) {
      toast({
        title: "خطا",
        description: "ابتدا تصویری را اسکن کنید",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "در حال تحلیل...",
      description: `${type} در حال انجام`
    })
  }

  const handleTranslation = (direction: string) => {
    toast({
      title: "در حال ترجمه...",
      description: `ترجمه ${direction} در حال انجام`
    })
  }

  const handleImageEnhancement = (type: string) => {
    if (!scannedImage) {
      toast({
        title: "خطا",
        description: "ابتدا تصویری را اسکن کنید",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "در حال بهبود...",
      description: `${type} در حال انجام`
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Lightbulb className="h-4 w-4 text-indigo-500" />
          ابزارهای هوش مصنوعی
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuItem onClick={() => window.open('/ai-chat', '_blank')}>
          <MessageSquare className="h-4 w-4 mr-2" />
          دستیار گفتگوی هوشمند
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileText className="h-4 w-4 mr-2" />
            تحلیل اسناد
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuItem onClick={handleOCR}>
              <FileText className="h-4 w-4 mr-2" />
              استخراج متن (OCR)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDocumentAnalysis("تشخیص نوع سند")}>
              <Brain className="h-4 w-4 mr-2" />
              تشخیص نوع سند
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDocumentAnalysis("استخراج داده‌های ساختاریافته")}>
              <Sparkles className="h-4 w-4 mr-2" />
              استخراج داده‌های ساختاریافته
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDocumentAnalysis("تحلیل فاکتور و رسید")}>
              <Wand2 className="h-4 w-4 mr-2" />
              تحلیل فاکتور و رسید
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDocumentAnalysis("تحلیل قرارداد")}>
              <FileText className="h-4 w-4 mr-2" />
              تحلیل قرارداد
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDocumentAnalysis("تشخیص امضا و مهر")}>
              <FileText className="h-4 w-4 mr-2" />
              تشخیص امضا و مهر
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="h-4 w-4 mr-2" />
            ترجمه هوشمند
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            <DropdownMenuItem onClick={() => handleTranslation("فارسی به انگلیسی")}>
              فارسی به انگلیسی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTranslation("انگلیسی به فارسی")}>
              انگلیسی به فارسی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTranslation("چند زبانه")}>
              ترجمه چند زبانه
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTranslation("تشخیص خودکار زبان")}>
              تشخیص خودکار زبان
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem onClick={() => toast({ title: "تولید تصویر", description: "به زودی..." })}>
          <ImageIcon className="h-4 w-4 mr-2" />
          تولید تصویر هوشمند
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Wand2 className="h-4 w-4 mr-2" />
            بهبود تصویر
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuItem onClick={() => handleImageEnhancement("افزایش وضوح")}>
              افزایش وضوح (Upscale)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImageEnhancement("حذف نویز")}>
              حذف نویز
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImageEnhancement("تنظیم خودکار نور")}>
              تنظیم خودکار نور
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImageEnhancement("تیزسازی لبه‌ها")}>
              تیزسازی لبه‌ها
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImageEnhancement("حذف پس‌زمینه")}>
              حذف پس‌زمینه
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleImageEnhancement("تبدیل به سیاه و سفید")}>
              تبدیل به سیاه و سفید حرفه‌ای
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
