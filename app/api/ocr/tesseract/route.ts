import { NextResponse } from "next/server"
import { createWorker } from "tesseract.js"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Initialize Tesseract worker
    const worker = await createWorker("fas+eng", 1, {
      logger: m => console.log(m)
    })

    try {
      // Perform OCR
      const { data } = await worker.recognize(buffer)
      
      return NextResponse.json({
        text: data.text,
        confidence: data.confidence,
        words: data.words?.length || 0,
        lines: data.lines?.length || 0,
        paragraphs: data.paragraphs?.length || 0,
        blocks: data.blocks?.length || 0
      })
    } finally {
      await worker.terminate()
    }
  } catch (error: any) {
    console.error("OCR Error:", error)
    return NextResponse.json(
      { error: "OCR processing failed", details: error.message },
      { status: 500 }
    )
  }
}
