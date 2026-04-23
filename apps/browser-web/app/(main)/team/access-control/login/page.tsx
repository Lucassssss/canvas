"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export default function LoginControlPage() {
  return (
    <>
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 text-foreground">
        <div className="max-w-4xl w-full space-y-6">
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>设备限制配置</CardTitle>
              <CardDescription>控制团队成员只能在绑定的设备上登录系统。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">开启设备白名单验证</Label>
                  <p className="text-sm text-muted-foreground mt-1">开启后，新设备登录需管理员审批或邮箱验证。</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>登录地区与 IP 限制</CardTitle>
              <CardDescription>限定团队成员只能在特定的 IP 或地理区域登录。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">开启办公区 IP 限制</Label>
                  <p className="text-sm text-muted-foreground mt-1">仅允许下方列表中的 IP 地址登录。</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-2">
                <Label className="text-sm text-muted-foreground">允许的 IP 地址或网段 (每行一个)</Label>
                <textarea 
                  className="w-full mt-2 h-32 p-3 text-sm bg-muted/20 border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  defaultValue="192.168.1.0/24&#10;10.0.0.1"
                  placeholder="例如: 12.34.56.78"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>登录时段控制</CardTitle>
              <CardDescription>限定成员的工作时间段，非工作时间禁止登录系统。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">开启工作时间限制</Label>
                  <p className="text-sm text-muted-foreground mt-1">非允许时段内登录将自动被拦截。</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center gap-4 pt-2">
                 <div className="flex flex-col gap-1.5 flex-1">
                   <Label className="text-xs text-muted-foreground">允许登录时间</Label>
                   <Input type="time" defaultValue="09:00" className="border-input bg-background" />
                 </div>
                 <span className="text-muted-foreground mt-5">至</span>
                 <div className="flex flex-col gap-1.5 flex-1">
                   <Label className="text-xs text-muted-foreground">最晚在线时间</Label>
                   <Input type="time" defaultValue="22:00" className="border-input bg-background" />
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-2 flex justify-end">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">保存配置</Button>
          </div>

        </div>
      </div>
    </>
  )
}
