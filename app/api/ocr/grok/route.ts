import { NextResponse } from "next/server"

const GROK_API_URL = "https://api.x.ai/v1/chat/completions"

type GrokMode = "ocr-postprocess" | "agent-analysis"

interface GrokRequestBody {
  rawText?: string
  mode?: GrokMode
  context?: any
}

function getSystemPrompt(mode: GrokMode): string {
  if (mode === "agent-analysis") {
    return [
      "You are an autonomous debugging and analysis agent.",
      "You receive Persian and English technical logs, errors, and problem descriptions.",
      "Analyze root causes, propose step-by-step solutions, and highlight risks.",
      "Always respond strictly in valid JSON without any extra text.",
    ].join(" ")
  }

  return [
    "You are an advanced OCR post-processing engine for Persian and English documents.",
    "You receive raw OCR text that may contain noise, broken lines, and recognition errors.",
    "Your job is to clean the text, infer structured fields, and detect table-like structures.",
    "Always respond strictly in valid JSON without any extra text.",
  ].join(" ")
}

export async function POST(req: Request) {
  const apiKey = process.env.GROK_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "GROK_API_KEY is not configured on the server" }, { status: 500 })
  }

  let body: GrokRequestBody

  try {
    body = (await req.json()) as GrokRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const mode: GrokMode = body.mode === "agent-analysis" ? "agent-analysis" : "ocr-postprocess"
  const rawText = body.rawText?.trim()

  if (!rawText) {
    return NextResponse.json({ error: "rawText is required" }, { status: 400 })
  }

  const systemPrompt = getSystemPrompt(mode)

  const userContent =
    mode === "ocr-postprocess"
      ? `متن OCR خام:\n${rawText}\n\nخروجی را فقط به صورت JSON با ساختار زیر برگردان:\n{\n  "cleanText": "متن تصحیح شده و تمیز شده",\n  "summary": "خلاصه کوتاه از محتوا",\n  "fields": { "buyerName": "نام خریدار", "nationalId": "کد ملی", "address": "آدرس", "companyName": "نام شرکت", "totalAmount": "مبلغ کل" },\n  "tables": [ { "headers": ["ستون۱", "ستون۲", "ستون۳"], "rows": [ ["سطر۱-۱", "سطر۱-۲", "سطر۱-۳"] ] } ],\n  "meta": { "language": "fa", "confidence": 0.0 }\n}`
      : `شرح مشکل یا داده برای تحلیل:\n${rawText}\n\nخروجی را فقط به صورت JSON با ساختار زیر برگردان:\n{\n  "analysis": "تحلیل دقیق مشکل یا داده",\n  "steps": ["گام ۱", "گام ۲"],\n  "risks": ["ریسک ۱", "ریسک ۲"],\n  "summary": "جمع‌بندی کوتاه"\n}`

  const model = process.env.GROK_MODEL || "grok-3-mini"

  try {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      return NextResponse.json(
        {
          error: "Grok API request failed",
          status: response.status,
          details: errorText.slice(0, 500),
        },
        { status: 502 },
      )
    }

    const data = (await response.json()) as any
    const content = data.choices?.[0]?.message?.content

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid response from Grok API" }, { status: 502 })
    }

    let parsed: any

    try {
      parsed = JSON.parse(content)
    } catch {
      parsed = { raw: content }
    }

    return NextResponse.json({
      mode,
      result: parsed,
      model: data.model ?? model,
      usage: data.usage ?? null,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to call Grok API",
        details: String(error?.message ?? error),
      },
      { status: 500 },
    )
  }
}
