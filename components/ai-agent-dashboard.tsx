"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Play,
  Pause,
  Zap,
  Brain,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Wrench,
  TrendingUp,
  Database,
  Cpu,
} from "lucide-react"
import type { AgentState, AgentTask, KnowledgeEntry, SolutionStrategy, AgentMetrics } from "@/lib/ai-agent-core"

export function AIAgentDashboard() {
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null)
  const [tasks, setTasks] = useState<AgentTask[]>([])
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([])
  const [strategies, setStrategies] = useState<SolutionStrategy[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const getAiAgent = useCallback(async () => {
    const { aiAgent } = await import("@/lib/ai-agent-core")
    return aiAgent
  }, [])

  const updateDashboard = useCallback(async () => {
    const aiAgent = await getAiAgent()
    setAgentState(aiAgent.getState())
    setMetrics(aiAgent.getMetrics())
    setTasks(aiAgent.getTasks())
    setKnowledge(aiAgent.getKnowledge())
    setStrategies(aiAgent.getStrategies())
  }, [getAiAgent])

  useEffect(() => {
    const setup = async () => {
      const aiAgent = await getAiAgent()

      aiAgent.on("stateChange", ({ newState }) => {
        setAgentState(newState)
      })

      aiAgent.on("log", (log) => {
        setLogs((prev) => [log, ...prev].slice(0, 100))
      })

      aiAgent.on("taskComplete", () => {
        updateDashboard()
      })

      await updateDashboard()
    }

    setup()

    const interval = setInterval(updateDashboard, 1000)
    return () => clearInterval(interval)
  }, [updateDashboard, getAiAgent])

  const handleStart = async () => {
    const aiAgent = await getAiAgent()
    await aiAgent.start()
    setIsRunning(true)
    updateDashboard()
  }

  const handleStop = async () => {
    const aiAgent = await getAiAgent()
    await aiAgent.stop()
    setIsRunning(false)
    updateDashboard()
  }

  const handleSelfHealing = async () => {
    const aiAgent = await getAiAgent()
    await aiAgent.triggerSelfHealing()
    updateDashboard()
  }

  const handleSelfImprovement = async () => {
    const aiAgent = await getAiAgent()
    await aiAgent.triggerSelfImprovement()
    updateDashboard()
  }

  const getStateColor = (state: AgentState) => {
    switch (state) {
      case "idle":
        return "bg-agent-idle"
      case "monitoring":
        return "bg-agent-monitoring"
      case "analyzing":
        return "bg-agent-analyzing"
      case "processing":
        return "bg-agent-processing"
      case "learning":
        return "bg-agent-learning"
      case "self-healing":
        return "bg-agent-healing"
      case "self-improving":
        return "bg-agent-improving"
      case "problem-solving":
        return "bg-agent-solving"
      case "executing":
        return "bg-agent-executing"
      default:
        return "bg-agent-idle"
    }
  }

  const getStatePersianName = (state: AgentState) => {
    const names: Record<AgentState, string> = {
      idle: "بیکار",
      monitoring: "نظارت",
      analyzing: "تحلیل",
      processing: "پردازش",
      learning: "یادگیری",
      "self-healing": "خودترمیمی",
      "self-improving": "خودارتقایی",
      "problem-solving": "حل مشکل",
      executing: "اجرا",
    }
    return names[state]
  }

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
  }

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${getStateColor(agentState)} text-white`}>
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">عامل هوش مصنوعی خودمختار</h1>
            <p className="text-muted-foreground">کارگر خودکار با قابلیت خودارتقایی و خودترمیمی</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isRunning ? "default" : "secondary"} className="text-sm px-3 py-1">
            {getStatePersianName(agentState)}
          </Badge>
          {isRunning ? (
            <Button onClick={handleStop} variant="destructive" className="gap-2">
              <Pause className="h-4 w-4" />
              توقف
            </Button>
          ) : (
            <Button onClick={handleStart} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
              <Play className="h-4 w-4" />
              شروع
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <Button
          onClick={handleSelfHealing}
          variant="outline"
          className="h-20 flex-col gap-2 bg-warning/10 border-warning/30 hover:bg-warning/20"
        >
          <Wrench className="h-6 w-6 text-warning-foreground" />
          <span>خودترمیمی</span>
        </Button>
        <Button
          onClick={handleSelfImprovement}
          variant="outline"
          className="h-20 flex-col gap-2 bg-info/10 border-info/30 hover:bg-info/20"
        >
          <TrendingUp className="h-6 w-6 text-info-foreground" />
          <span>خودارتقایی</span>
        </Button>
        <Button
          onClick={updateDashboard}
          variant="outline"
          className="h-20 flex-col gap-2 bg-muted border-border hover:bg-muted/80"
        >
          <RefreshCw className="h-6 w-6 text-muted-foreground" />
          <span>بروزرسانی</span>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto text-info mb-2" />
            <p className="text-2xl font-bold">{metrics ? formatUptime(metrics.uptime) : "00:00:00"}</p>
            <p className="text-xs text-muted-foreground">زمان فعالیت</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold">{metrics?.tasksCompleted || 0}</p>
            <p className="text-xs text-muted-foreground">وظایف تکمیل شده</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 mx-auto text-error mb-2" />
            <p className="text-2xl font-bold">{metrics?.tasksFailed || 0}</p>
            <p className="text-xs text-muted-foreground">وظایف ناموفق</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto text-warning mb-2" />
            <p className="text-2xl font-bold">{metrics?.selfHealingEvents || 0}</p>
            <p className="text-xs text-muted-foreground">خودترمیمی‌ها</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto text-agent-learning mb-2" />
            <p className="text-2xl font-bold">{metrics?.problemsSolved || 0}</p>
            <p className="text-xs text-muted-foreground">مشکلات حل شده</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 mx-auto text-info mb-2" />
            <p className="text-2xl font-bold">{metrics?.autonomyLevel || 100}%</p>
            <p className="text-xs text-muted-foreground">سطح استقلال</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-info" />
            پیشرفت یادگیری
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={metrics?.learningProgress || 0} className="flex-1 h-3" />
            <span className="text-lg font-bold text-info">{(metrics?.learningProgress || 0).toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks" className="gap-2">
            <Zap className="h-4 w-4" />
            وظایف ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <Database className="h-4 w-4" />
            پایگاه دانش ({knowledge.length})
          </TabsTrigger>
          <TabsTrigger value="strategies" className="gap-2">
            <Cpu className="h-4 w-4" />
            استراتژی‌ها ({strategies.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="h-4 w-4" />
            لاگ‌ها ({logs.length})
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>صف وظایف</CardTitle>
              <CardDescription>وظایف در حال اجرا و در انتظار</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {tasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">هیچ وظیفه‌ای وجود ندارد</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-4 rounded-lg border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {task.status === "completed" && <CheckCircle className="h-5 w-5 text-success" />}
                          {task.status === "failed" && <XCircle className="h-5 w-5 text-error" />}
                          {task.status === "in-progress" && <RefreshCw className="h-5 w-5 text-info animate-spin" />}
                          {task.status === "pending" && <Clock className="h-5 w-5 text-muted-foreground" />}
                          {task.status === "retrying" && <AlertTriangle className="h-5 w-5 text-warning" />}
                          <div>
                            <p className="font-medium">{task.description}</p>
                            <p className="text-xs text-muted-foreground">
                              تلاش: {task.attempts}/{task.maxAttempts}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              task.priority === "critical"
                                ? "destructive"
                                : task.priority === "high"
                                  ? "default"
                                  : task.priority === "medium"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {task.priority === "critical"
                              ? "بحرانی"
                              : task.priority === "high"
                                ? "بالا"
                                : task.priority === "medium"
                                  ? "متوسط"
                                  : "پایین"}
                          </Badge>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "failed"
                                  ? "destructive"
                                  : task.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {task.status === "completed"
                              ? "تکمیل"
                              : task.status === "failed"
                                ? "شکست"
                                : task.status === "in-progress"
                                  ? "در حال اجرا"
                                  : task.status === "retrying"
                                    ? "تلاش مجدد"
                                    : "در انتظار"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>پایگاه دانش</CardTitle>
              <CardDescription>دانش برنامه‌ریزی شده و یادگرفته شده</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {knowledge.map((entry) => (
                    <div key={entry.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{entry.category}</Badge>
                          <span className="text-sm font-medium">{entry.topic}</span>
                        </div>
                        <Badge variant={entry.source === "programmed" ? "default" : "secondary"}>
                          {entry.source === "programmed"
                            ? "برنامه‌ریزی"
                            : entry.source === "learned"
                              ? "یادگرفته"
                              : "کشف شده"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>اطمینان: {(entry.confidence * 100).toFixed(0)}%</span>
                        <span>استفاده: {entry.usageCount} بار</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle>استراتژی‌های حل مشکل</CardTitle>
              <CardDescription>راه‌حل‌های از پیش تعریف شده و یادگرفته شده</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{strategy.description}</span>
                        <Badge>{strategy.problemType}</Badge>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">مراحل:</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.steps.map((step, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {i + 1}. {step}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>نرخ موفقیت: {(strategy.successRate * 100).toFixed(0)}%</span>
                        <span>استفاده: {strategy.timesUsed} بار</span>
                        <span>زمان میانگین: {(strategy.averageExecutionTime / 1000).toFixed(1)}ث</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>لاگ‌های فعالیت</CardTitle>
              <CardDescription>رویدادها و اقدامات عامل</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {logs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">هیچ لاگی وجود ندارد</p>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-sm flex items-start gap-3 ${
                          log.level === "error"
                            ? "bg-error/10 border border-error/30"
                            : log.level === "warning"
                              ? "bg-warning/10 border border-warning/30"
                              : "bg-muted border border-border"
                        }`}
                      >
                        {log.level === "error" && <XCircle className="h-4 w-4 text-error mt-0.5" />}
                        {log.level === "warning" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />}
                        {log.level === "info" && <CheckCircle className="h-4 w-4 text-success mt-0.5" />}
                        <div className="flex-1">
                          <p>{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(log.timestamp).toLocaleTimeString("fa-IR")} | وضعیت:{" "}
                            {getStatePersianName(log.agentState)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
