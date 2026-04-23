"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function CreateDevicePage() {
  const router = useRouter()
  const [editId, setEditId] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  // Form State
  const [provider, setProvider] = React.useState("custom")
  const [type, setType] = React.useState("socks5")
  const [host, setHost] = React.useState("")
  const [port, setPort] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [testResult, setTestResult] = React.useState<any>(null)
  const [testing, setTesting] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (id) {
      setEditId(id)
      // Fetch device data
      fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProvider(data.data.provider)
            setType(data.data.type)
            setHost(data.data.host)
            setPort(data.data.port)
            setUsername(data.data.username || "")
            setPassword(data.data.password || "")
            if (data.data.ip) {
              setTestResult({
                query: data.data.ip,
                country: data.data.country,
                city: data.data.city,
                timezone: data.data.timezone,
                lat: data.data.lat,
                lon: data.data.lon,
                fromDb: true // flag to indicate it's not a fresh test
              })
            }
          }
        })
        .catch(err => console.error(err))
    }
  }, [])

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, host, port, username, password })
      })
      const data = await res.json()
      if (data.success) {
        setTestResult(data.data)
      } else {
        alert("测试失败：" + data.error)
      }
    } catch (err) {
      alert("测试异常：" + err)
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    if (!testResult && type !== "direct") {
      if (!confirm("尚未成功测试代理连通性，确定要直接保存吗？")) return
    }

    try {
      const url = editId
        ? `${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices/${editId}`
        : `${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices`;
      const method = editId ? "PUT" : "POST";

      const payload: any = {
        provider,
        type,
        host,
        port,
        username,
        password,
      }

      if (testResult && !testResult.fromDb) {
        payload.ip = testResult.query || ""
        payload.ipLoc = `${testResult.country}/${testResult.city}`
        payload.timezone = testResult.timezone || ""
        payload.country = testResult.country || ""
        payload.city = testResult.city || ""
        payload.lat = testResult.lat?.toString() || ""
        payload.lon = testResult.lon?.toString() || ""
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        router.push("/devices")
      } else {
        alert("保存失败：" + data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4 [-webkit-app-region:drag]">
        <div className="flex items-center gap-2 [-webkit-app-region:no-drag]">
          <SidebarTrigger className="-ml-1 text-muted-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/devices">设备管理</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">{isMounted && editId ? '编辑设备' : '新建设备'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">

          {/* Sidebar Navigation */}
          <div className="w-36 shrink-0 border-r border-border/60 bg-transparent p-4 overflow-y-auto space-y-1">
            <button
              onClick={() => setProvider("custom")}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${provider === "custom" ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"}`}
            >
              自定义设备
            </button>
            <button
              onClick={() => setProvider("aliyun")}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${provider === "aliyun" ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"}`}
            >
              购买设备
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              {provider === "aliyun" ? (
                <div className="p-8 bg-card rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <h3 className="text-lg font-medium text-card-foreground">云服务集成正在开发中</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">后续将支持一键绑定阿里云、AWS等各大云服务商，直接购买或自动同步弹性IP至平台。</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-8 bg-card rounded-xl border border-border shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-card-foreground mb-6">设备与代理参数</h2>

                      <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4 items-center">
                          <Label className="text-right text-muted-foreground">代理协议</Label>
                          <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="col-span-3 h-10 border-input bg-background shadow-none focus:ring-1 focus:ring-primary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="direct">直连 (Direct)</SelectItem>
                              <SelectItem value="http">HTTP</SelectItem>
                              <SelectItem value="https">HTTPS</SelectItem>
                              <SelectItem value="socks5">Socks5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {type !== "direct" && (
                          <>
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <Label className="text-right text-foreground font-normal">主机 (Host) <span className="text-destructive">*</span></Label>
                              <Input value={host} onChange={e => setHost(e.target.value)} placeholder="IP 地址或域名" className="col-span-3 h-10 border-input bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary" />
                            </div>
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <Label className="text-right text-foreground font-normal">端口 (Port) <span className="text-destructive">*</span></Label>
                              <Input value={port} onChange={e => setPort(e.target.value)} placeholder="端口号" className="col-span-3 h-10 border-input bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary" />
                            </div>
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <Label className="text-right text-foreground font-normal">认证账号</Label>
                              <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="可选" className="col-span-3 h-10 border-input bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary" />
                            </div>
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <Label className="text-right text-foreground font-normal">认证密码</Label>
                              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="可选" className="col-span-3 h-10 border-input bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary" />
                            </div>
                          </>
                        )}

                        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border/50">
                          <div className="col-start-2 col-span-3">
                            <Button
                              onClick={handleTest}
                              disabled={testing || (type !== 'direct' && (!host || !port))}
                              variant="outline"
                              className="w-full h-10 text-primary border-primary/30 bg-background hover:bg-primary/10 font-normal shadow-none"
                            >
                              {testing ? "网络请求探测中..." : "测试设备连通性"}
                            </Button>
                          </div>
                        </div>

                        {testResult && (
                          <div className="grid grid-cols-4 gap-4">
                            <div className="col-start-2 col-span-3 bg-muted/50 p-5 rounded-lg text-sm text-foreground space-y-3">
                              <div className="flex justify-between items-center pb-2 border-b border-border">
                                <span className="font-medium text-foreground">探测结果</span>
                                {testResult.fromDb && <span className="text-xs text-muted-foreground">来自历史记录</span>}
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">公网 IP</span>
                                <span className="font-medium text-green-600 dark:text-green-500">{testResult.query}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">归属地</span>
                                <span>{testResult.country} {testResult.city ? `/ ${testResult.city}` : ''}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">时区</span>
                                <span>{testResult.timezone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">经纬度</span>
                                <span>{testResult.lat}, {testResult.lon}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 flex justify-end gap-4 p-4 border-t border-border bg-background">
          <Button variant="outline" className="w-24 [-webkit-app-region:no-drag] text-foreground font-normal hover:bg-accent hover:text-accent-foreground border-input shadow-none" onClick={() => router.push("/devices")}>取消</Button>
          <Button className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground font-normal shadow-none border-transparent [-webkit-app-region:no-drag]" onClick={handleSave}>
            {editId ? "保存修改" : "确认添加"}
          </Button>
        </div>
      </div>
    </div>
  )
}
