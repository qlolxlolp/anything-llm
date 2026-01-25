"use client"

import ShaderCanvas from "@/components/landing/ShaderCanvas"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const durationMs = 11000
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      setProgress(Math.floor(t * 100))
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        window.location.href = "/login"
      }
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ShaderCanvas />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary-foreground drop-shadow">
          CanScan
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
          نسل جدید اسکن و بایگانی هوشمند با پردازش OCR و جریان USB پویا
        </p>

        <div className="mt-10 w-full max-w-xl">
          <div className="h-3 rounded-full bg-black/40 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <div
              className="h-3 rounded-full bg-[oklch(0.35_0.12_260)] shadow-[0_0_40px_rgba(37,99,235,0.7)] transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-primary-foreground/70">در حال آماده‌سازی... {progress}%</div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground shadow hover:opacity-90 transition"
          >
            ورود/ثبت‌نام
          </Link>
          <Link
            href="/gallery"
            className="px-5 py-2 rounded-md bg-accent text-accent-foreground shadow hover:opacity-90 transition"
          >
            گالری اسناد
          </Link>
        </div>
      </div>
    </div>
  )
}
