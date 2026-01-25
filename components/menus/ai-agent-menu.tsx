"use client"

import { useState } from "react"
import { Bot, Cpu, Zap, BarChart3, Play, Pause, Wrench, TrendingUp, Eye } from "lucide-react"
import { aiAgent } from "@/lib/ai-agent-core"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AIAgentDashboard } from "@/components/ai-agent-dashboard"

export function AiAgentMenu() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [agentState, setAgentState] = useState(aiAgent.getState())

  const handleStart = async () => {
    await aiAgent.start()
    setIsRunning(true)
    setAgentState(aiAgent.getState())
  }

  const handleStop = async () => {
    await aiAgent.stop()
    setIsRunning(false)
    setAgentState(aiAgent.getState())
  }

  const handleSelfHealing = async () => {
    await aiAgent.triggerSelfHealing()
    setAgentState(aiAgent.getState())
  }

  const handleSelfImprovement = async () => {
    await aiAgent.triggerSelfImprovement()
    setAgentState(aiAgent.getState())
  }

  const getStateColor = () => {
    switch (agentState) {
      case "monitoring":
        return "text-green-500"
      case "self-healing":
        return "text-orange-500"
      case "self-improving":
        return "text-cyan-500"
      case "learning":
        return "text-purple-500"
      case "executing":
        return "text-blue-500"
      default:
        return "text-slate-400"
    }
  }

  return (
    <>
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-100 transition-colors">
          <Bot className={`h-4 w-4 ${getStateColor()}`} />
          <span>عامل هوش مصنوعی</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="absolute left-0 mt-2 w-80 p-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 origin-top-left invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 ease-in-out z-50">
          {/* Status Panel */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 rounded-t-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">وضعیت عامل</span>
              <span className={`text-xs font-semibold ${isRunning ? "text-green-600" : "text-slate-500"}`}>
                {isRunning ? "فعال" : "غیرفعال"}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${isRunning ? "bg-green-600" : "bg-slate-400"}`}
                style={{ width: isRunning ? "100%" : "0%" }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {agentState === "monitoring"
                ? "در حال نظارت..."
                : agentState === "self-healing"
                  ? "در حال خودترمیمی..."
                  : agentState === "self-improving"
                    ? "در حال خودارتقایی..."
                    : agentState === "learning"
                      ? "در حال یادگیری..."
                      : agentState === "executing"
                        ? "در حال اجرا..."
                        : "آماده شروع"}
            </p>
          </div>

          {/* AI Models */}
          <div className="p-3 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              ماژول‌های هوشمند
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>موتور خودترمیمی</span>
                <span className="text-green-600">فعال</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>سیستم خودارتقایی</span>
                <span className="text-green-600">فعال</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>حل‌کننده مشکلات</span>
                <span className="text-green-600">فعال</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>پایگاه دانش</span>
                <span className="text-green-600">فعال</span>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="p-3 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              قابلیت‌های خودمختار
            </p>
            <ul className="space-y-1 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>خودترمیمی و رفع خودکار خطاها</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>خودارتقایی و بهبود مستمر</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>یادگیری از تجربیات</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>تشخیص و حل بن‌بست‌ها</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>استقلال کامل در تصمیم‌گیری</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          {isRunning ? (
            <button
              onClick={handleStop}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-red-500 hover:text-white"
            >
              <Pause className="h-5 w-5" />
              <span>توقف عامل</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-green-500 hover:text-white"
            >
              <Play className="h-5 w-5" />
              <span>شروع عامل</span>
            </button>
          )}

          <button
            onClick={handleSelfHealing}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-orange-500 hover:text-white"
          >
            <Wrench className="h-5 w-5" />
            <span>اجرای خودترمیمی</span>
          </button>

          <button
            onClick={handleSelfImprovement}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-cyan-500 hover:text-white"
          >
            <TrendingUp className="h-5 w-5" />
            <span>اجرای خودارتقایی</span>
          </button>

          <button
            onClick={() => setShowDashboard(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-indigo-500 hover:text-white"
          >
            <Eye className="h-5 w-5" />
            <span>مشاهده داشبورد کامل</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-purple-500 hover:text-white">
            <BarChart3 className="h-5 w-5" />
            <span>گزارش عملکرد</span>
          </button>
        </div>
      </div>

      {/* Full Dashboard Dialog */}
      <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <AIAgentDashboard />
        </DialogContent>
      </Dialog>
    </>
  )
}
