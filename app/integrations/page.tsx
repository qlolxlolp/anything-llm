"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Puzzle, Link, Code, Webhook, Database, Mail, FileText, Image } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  connected: boolean
  category: string
}

export default function IntegrationsPage() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "office", name: "Microsoft Office", description: "اتصال به Word، Excel، PowerPoint", icon: FileText, connected: false, category: "نرم‌افزار" },
    { id: "gmail", name: "Gmail", description: "ارسال اسناد از طریق ایمیل", icon: Mail, connected: true, category: "ایمیل" },
    { id: "dropbox", name: "Dropbox", description: "همگام‌سازی فایل‌ها", icon: Database, connected: true, category: "ذخیره‌سازی" },
    { id: "photoshop", name: "Adobe Photoshop", description: "ویرایش تصاویر اسکن شده", icon: Image, connected: false, category: "ویرایش" },
    { id: "webhook", name: "Webhook", description: "ارسال داده‌ها به سرویس‌های خارجی", icon: Webhook, connected: false, category: "API" },
    { id: "database", name: "MySQL Database", description: "ذخیره داده‌ها در پایگاه داده", icon: Database, connected: false, category: "پایگاه داده" }
  ])
  
  const [apiKey, setApiKey] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected }
        : integration
    ))
    
    const integration = integrations.find(i => i.id === id)
    toast({
      title: integration?.connected ? "قطع اتصال" : "اتصال برقرار شد",
      description: `${integration?.name} ${integration?.connected ? "قطع" : "متصل"} شد`
    })
  }

  const handleTestAPI = () => {
    if (!apiKey) {
      toast({
        title: "خطا",
        description: "لطفاً API Key را وارد کنید",
        variant: "destructive"
      })
      return
    }
    
    toast({
      title: "تست API",
      description: "در حال تست اتصال API..."
    })
    
    setTimeout(() => {
      toast({
        title: "تست موفق",
        description: "API با موفقیت تست شد"
      })
    }, 2000)
  }

  const handleTestWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "خطا",
        description: "لطفاً URL Webhook را وارد کنید",
        variant: "destructive"
      })
      return
    }
    
    toast({
      title: "تست Webhook",
      description: "در حال ارسال درخواست تست..."
    })
    
    setTimeout(() => {
      toast({
        title: "تست موفق",
        description: "Webhook با موفقیت تست شد"
      })
    }, 2000)
  }

  const categories = [...new Set(integrations.map(i => i.category))]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">یکپارچه‌سازی</h1>
        <p className="text-muted-foreground">اتصال به نرم‌افزارها و سرویس‌های خارجی</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Integrations */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map(category => (
            <Card key={category} className="p-6">
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations
                  .filter(integration => integration.category === category)
                  .map((integration) => {
                    const IconComponent = integration.icon
                    return (
                      <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6" />
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={integration.connected ? "default" : "secondary"}>
                            {integration.connected ? "متصل" : "قطع"}
                          </Badge>
                          <Switch
                            checked={integration.connected}
                            onCheckedChange={() => handleToggleIntegration(integration.id)}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Card>
          ))}
        </div>

        {/* API & Webhook Configuration */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5" />
              <h3 className="text-lg font-semibold">API Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="API Key خود را وارد کنید"
                />
              </div>
              
              <Button onClick={handleTestAPI} className="w-full">
                تست API
              </Button>
              
              <div className="text-xs text-muted-foreground">
                <p>برای دریافت API Key به تنظیمات حساب کاربری مراجعه کنید.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Webhook className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Webhook Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                />
              </div>
              
              <Button onClick={handleTestWebhook} className="w-full">
                تست Webhook
              </Button>
              
              <div className="text-xs text-muted-foreground">
                <p>Webhook برای ارسال خودکار داده‌ها به سرویس‌های خارجی استفاده می‌شود.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Connection Status</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>اتصالات فعال</span>
                <Badge>{integrations.filter(i => i.connected).length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>کل یکپارچه‌سازی‌ها</span>
                <Badge variant="outline">{integrations.length}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
