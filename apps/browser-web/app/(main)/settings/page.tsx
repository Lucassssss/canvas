"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ label: "团队管理" }, { label: "全局设置" }]} />
      <div className="flex flex-1 overflow-hidden bg-background">
        
        {/* Settings Sidebar */}
        <div className="w-48 border-r border-border bg-muted/10 p-4 space-y-1">
          <div className="px-3 py-2 text-sm text-primary bg-primary/10 rounded-md font-medium cursor-pointer">偏好设置</div>
          <div className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer">安全配置</div>
          <div className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer">本地存储</div>
          <div className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer">关于关于</div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground">偏好设置</h2>
              <p className="text-sm text-muted-foreground mt-1">管理系统界面显示与基本交互习惯。</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">启动后最小化到托盘</Label>
                    <p className="text-sm text-muted-foreground">关闭主窗口时，程序在后台继续运行并保持环境连接。</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="h-px w-full bg-border"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">语言区域 (Language)</Label>
                    <p className="text-sm text-muted-foreground">界面默认使用的语言。</p>
                  </div>
                  <Button variant="outline" className="w-32 border-input justify-between">
                    简体中文 <span className="text-xs text-muted-foreground">▼</span>
                  </Button>
                </div>
              </div>

              <div className="h-px w-full bg-border"></div>
              
              <div className="space-y-4">
                <Label className="text-base">默认浏览器主页</Label>
                <p className="text-sm text-muted-foreground">拉起环境时浏览器默认加载的起始页。</p>
                <Input defaultValue="https://www.google.com" className="bg-background border-input max-w-md" />
              </div>
            </div>

            <div className="pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">保存更改</Button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
