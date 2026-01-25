"use client"

import { useEffect, useState } from "react"
import { registerEmail, loginEmail, oauthAvailable } from "@/lib/auth-local"
import Link from "next/link"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [providers, setProviders] = useState({ google: false, github: false, microsoft: false })

  useEffect(() => {
    oauthAvailable().then(setProviders)
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      if (mode === "register") {
        await registerEmail(email, password, name)
        setMessage("ثبت نام انجام شد. اکنون وارد شوید.")
        setMode("login")
      } else {
        await loginEmail(email, password)
        setMessage("ورود موفق. هدایت به گالری اسناد...")
        setTimeout(() => (window.location.href = "/gallery"), 600)
      }
    } catch (err: any) {
      setMessage(err?.message || "خطای غیرمنتظره")
    }
  }

  const oauthClick = (provider: "google" | "github" | "microsoft") => {
    if (!providers[provider]) {
      setMessage(`پیکربندی ${provider} موجود نیست. متغیر محیطی مربوطه را تنظیم کنید.`)
      return
    }
    window.location.href = `/api/auth/signin/${provider}`
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "ورود" : "ثبت‌نام"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          برای استفاده از امکانات CanScan وارد شوید یا ثبت‌نام کنید.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="text-sm">نام</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
              />
            </div>
          )}
          <div>
            <label className="text-sm">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>
          <div>
            <label className="text-sm">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>
          <button type="submit" className="w-full mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground">
            {mode === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        </form>

        <div className="my-4 h-px bg-border" />

        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition"
            onClick={() => oauthClick("google")}
          >
            ورود/ثبت‌نام با Google
          </button>
          <button
            className="w-full px-4 py-2 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition"
            onClick={() => oauthClick("github")}
          >
            ورود/ثبت‌نام با GitHub
          </button>
          <button
            className="w-full px-4 py-2 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition"
            onClick={() => oauthClick("microsoft")}
          >
            ورود/ثبت‌نام با Microsoft
          </button>
        </div>

        {message && <div className="mt-4 text-sm text-muted-foreground">{message}</div>}

        <div className="mt-6 text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              حساب ندارید؟{" "}
              <button className="text-primary underline" onClick={() => setMode("register")}>
                ثبت‌نام
              </button>
            </>
          ) : (
            <>
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <button className="text-primary underline" onClick={() => setMode("login")}>
                ورود
              </button>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/landing" className="text-sm text-primary underline">
            صفحه فرود
          </Link>
          <Link href="/gallery" className="text-sm text-primary underline">
            گالری اسناد
          </Link>
        </div>
      </div>
    </div>
  )
}
