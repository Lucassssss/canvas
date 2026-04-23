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
    <div className="flex flex-col h-full bg-[#f6f9fc]">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-neutral-500" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild className="text-neutral-500 hover:text-neutral-900">
                  <Link href="/devices">设备管理</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-neutral-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-neutral-900">{isMounted && editId ? '编辑设备' : '新建设备'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="col-span-1 space-y-2">
            <button 
              onClick={() => setProvider("custom")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${provider === "custom" ? "bg-blue-50 text-blue-700 font-medium" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              自定义录入
            </button>
            <button 
              onClick={() => setProvider("aliyun")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${provider === "aliyun" ? "bg-blue-50 text-blue-700 font-medium" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              第三方集成配置
            </button>
          </div>

          {/* Form Content */}
          <div className="col-span-3">
            {provider === "aliyun" ? (
               <div className="p-8 bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                 </div>
                 <h3 className="text-lg font-medium text-neutral-900">云服务集成正在开发中</h3>
                 <p className="text-sm text-neutral-500 max-w-sm">后续将支持一键绑定阿里云、AWS等各大云服务商，直接购买或自动同步弹性IP至平台。</p>
               </div>
            ) : (
              <div className="space-y-6">
                <div className="p-8 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-neutral-900 mb-6">设备与代理参数</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <Label className="text-right text-neutral-600">代理协议</Label>
                        <Select value={type} onValueChange={setType}>
                          <SelectTrigger className="col-span-3 h-10">
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
                            <Label className="text-right text-neutral-600">主机 (Host) <span className="text-red-500">*</span></Label>
                            <Input value={host} onChange={e => setHost(e.target.value)} placeholder="IP 地址或域名" className="col-span-3 h-10" />
                          </div>
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <Label className="text-right text-neutral-600">端口 (Port) <span className="text-red-500">*</span></Label>
                            <Input value={port} onChange={e => setPort(e.target.value)} placeholder="端口号" className="col-span-3 h-10" />
                          </div>
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <Label className="text-right text-neutral-600">认证账号</Label>
                            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="可选" className="col-span-3 h-10" />
                          </div>
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <Label className="text-right text-neutral-600">认证密码</Label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="可选" className="col-span-3 h-10" />
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-4 gap-4 pt-6 border-t border-neutral-100">
                        <div className="col-start-2 col-span-3">
                          <Button 
                            onClick={handleTest} 
                            disabled={testing || (type !== 'direct' && (!host || !port))} 
                            variant="outline" 
                            className="w-full h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            {testing ? "网络请求探测中..." : "测试设备连通性"}
                          </Button>
                        </div>
                      </div>

                      {testResult && (
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-start-2 col-span-3 bg-[#f6f9fc] p-5 rounded-lg text-sm text-neutral-700 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                              <span className="font-medium text-neutral-900">探测结果</span>
                              {testResult.fromDb && <span className="text-xs text-neutral-400">来自历史记录</span>}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">公网 IP</span>
                              <span className="font-medium text-green-600">{testResult.query}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">归属地</span>
                              <span>{testResult.country} {testResult.city ? `/ ${testResult.city}` : ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">时区</span>
                              <span>{testResult.timezone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">经纬度</span>
                              <span>{testResult.lat}, {testResult.lon}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" className="w-24" onClick={() => router.push("/devices")}>取消</Button>
                  <Button className="w-32 bg-blue-600 hover:bg-blue-700 text-white shadow-none" onClick={handleSave}>
                    {editId ? "保存修改" : "确认添加"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
