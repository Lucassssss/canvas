"use client"
import * as React from "react"
import { cloudFetch } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { 
  RiArrowLeftLine, 
  RiRefreshLine, 
  RiGlobalLine, 
  RiAppleLine, 
  RiWindowsLine 
} from "@remixicon/react"

// --- Zod Schema ---
const formSchema = z.object({
  // Basic
  name: z.string().min(1, "请输入环境名称"),
  group: z.string().optional(),
  platform: z.string().optional(),
  remark: z.string().optional(),
  // Account
  username: z.string().optional(),
  password: z.string().optional(),
  cookie: z.string().optional(),
  // Device
  deviceId: z.string().optional(),
  // Fingerprint
  os: z.enum(["windows", "macos"]).optional(),
  browser: z.string().optional(),
  browserVersion: z.string().optional(),
  userAgent: z.string().optional(),
  timezoneAuto: z.boolean().optional(),
  webrtcReplace: z.boolean().optional(),
  geolocationAuto: z.boolean().optional(),
  languageAuto: z.boolean().optional(),
  hardwareConcurrency: z.string().optional(),
  deviceMemory: z.string().optional(),
  webglVendor: z.string().optional(),
  webglRenderer: z.string().optional(),
  canvasNoise: z.enum(["real", "noise"]).optional(),
  audioNoise: z.enum(["real", "noise"]).optional(),
  timezone: z.string().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
})

export default function CreateProfilePage() {
  const router = useRouter()
  const [editId, setEditId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("basic")
  const [isMounted, setIsMounted] = React.useState(false)
  const [devices, setDevices] = React.useState<any[]>([])

  React.useEffect(() => {
    setIsMounted(true)
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (id) setEditId(id)

    // Fetch devices
    const loadDevices = async () => {
      try {
        const res = await cloudFetch(`/api/devices`)
        const data = await res.json()
        if (data.success) {
          setDevices(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch devices", err)
      }
    }
    loadDevices()
  }, [])

  React.useEffect(() => {
    const scrollContainer = document.getElementById("scroll-container")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id === "section-basic") setActiveTab("basic")
            if (id === "section-proxy") setActiveTab("proxy")
            if (id === "section-fingerprint") setActiveTab("fingerprint")
          }
        })
      },
      { 
        root: scrollContainer,
        rootMargin: "-20% 0px -70% 0px" 
      }
    )

    const s1 = document.getElementById("section-basic")
    const s2 = document.getElementById("section-proxy")
    const s3 = document.getElementById("section-fingerprint")

    if (s1) observer.observe(s1)
    if (s2) observer.observe(s2)
    if (s3) observer.observe(s3)

    return () => observer.disconnect()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      group: "default",
      platform: "none",
      remark: "",
      username: "",
      password: "",
      cookie: "",
      deviceId: "",
      os: "windows",
      browser: "chrome",
      browserVersion: "147",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
      timezoneAuto: true,
      webrtcReplace: true,
      geolocationAuto: true,
      languageAuto: true,
      hardwareConcurrency: "16",
      deviceMemory: "8",
      webglVendor: "NVIDIA Corporation",
      webglRenderer: "NVIDIA GeForce RTX 4070",
      canvasNoise: "noise",
      audioNoise: "noise",
    },
  });

  React.useEffect(() => {
    if (editId) {
      const loadEnv = async () => {
        try {
          const res = await cloudFetch(`/api/environments/${editId}`)
          const data = await res.json()
          if (data.success && data.data) {
            form.reset(data.data);
          }
        } catch (err) {
          console.error("Failed to load environment:", err)
        }
      }
      loadEnv()
    }
  }, [editId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = editId 
        ? `/api/environments/${editId}` 
        : `/api/environments`;
      const method = editId ? "PUT" : "POST";

      const response = await cloudFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      
      if (data.success) {
        console.log("=== Saved Profile Data ===", data.data);
        router.push("/environments");
        router.refresh(); // Refresh the list
      } else {
        console.error("Failed to save:", data.error);
        alert(`Failed to ${editId ? 'update' : 'create'} environment: ${data.error}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error, could not save.");
    }
  }

  const handleGenerateRandomFingerprint = () => {
    // 简单模拟一套 macOS 随机指纹
    form.setValue("os", "macos")
    form.setValue("browserVersion", "146")
    form.setValue("userAgent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36")
    form.setValue("hardwareConcurrency", "8")
    form.setValue("webglVendor", "Apple")
    form.setValue("webglRenderer", "Apple M2")
  }

  // 监听 deviceId 变化，同步覆盖指纹的地理信息
  React.useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === "deviceId") {
        const deviceId = value.deviceId;
        if (deviceId && deviceId !== "none") {
          const device = devices.find(d => d.id === deviceId);
          if (device) {
            if (device.timezone) form.setValue("timezone", device.timezone);
            if (device.lat) form.setValue("lat", device.lat);
            if (device.lon) form.setValue("lon", device.lon);
            // Optionally set Auto to false since we are manually specifying from device
            form.setValue("timezoneAuto", false);
            form.setValue("geolocationAuto", false);
          }
        } else {
          // If none selected, revert to auto
          form.setValue("timezoneAuto", true);
          form.setValue("geolocationAuto", true);
          form.setValue("timezone", "");
          form.setValue("lat", "");
          form.setValue("lon", "");
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form, devices]);

  const watchOs = form.watch("os")

  return (
    <>
        {/* Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-muted-foreground" />
            <Separator orientation="vertical" className="mr-2 h-4 data-vertical:self-center" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground">
                    <Link href="/environments">环境管理</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground">{isMounted && editId ? '编辑环境' : '新建环境'}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Tab Navigation (Static, Fixed) */}
        <div className="bg-background border-b border-border px-8 py-3 flex gap-6 shrink-0 z-10 relative">
          <button 
            type="button"
            onClick={() => {
              const el = document.getElementById("section-basic")
              const container = document.getElementById("scroll-container")
              if (el && container) container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' })
            }}
            className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            基础设置
          </button>
          <button 
            type="button"
            onClick={() => {
              const el = document.getElementById("section-proxy")
              const container = document.getElementById("scroll-container")
              if (el && container) container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' })
            }}
            className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${activeTab === 'proxy' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            设备设置
          </button>
          <button 
            type="button"
            onClick={() => {
              const el = document.getElementById("section-fingerprint")
              const container = document.getElementById("scroll-container")
              if (el && container) container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' })
            }}
            className={`text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${activeTab === 'fingerprint' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            高级指纹
          </button>
        </div>

        {/* Scrollable Form Content */}
        <main id="scroll-container" className="flex-1 overflow-y-auto min-h-0 bg-background text-foreground flex flex-col relative">
          <div className="flex-1 p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-12 pb-16">
                
                {/* Basic Settings Section */}
                <div id="section-basic" className="space-y-6 scroll-mt-20">
                  <div>
                    <h2 className="text-lg font-medium text-foreground mb-4">基础信息</h2>
                    <div className="grid grid-cols-2 gap-6 p-6 bg-card rounded-xl border border-border shadow-sm">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">环境名称 <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="请输入环境名称，如：FB-001" className="h-10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="group"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">所属分组</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="选择分组" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">默认分组</SelectItem>
                                <SelectItem value="fb">Facebook 跑量组</SelectItem>
                                <SelectItem value="amz">亚马逊养号组</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem className="space-y-2 col-span-2">
                            <FormLabel className="text-foreground">目标平台</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="选择平台 (可选)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">无 / 自定义</SelectItem>
                                <SelectItem value="fb">Facebook</SelectItem>
                                <SelectItem value="amz">Amazon</SelectItem>
                                <SelectItem value="tk">TikTok</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="remark"
                        render={({ field }) => (
                          <FormItem className="space-y-2 col-span-2">
                            <FormLabel className="text-foreground">备注</FormLabel>
                            <FormControl>
                              <Textarea placeholder="输入关于此环境的附加说明..." className="resize-none h-20" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-foreground mb-4">账号设置 (可选)</h2>
                    <div className="grid grid-cols-2 gap-6 p-6 bg-card rounded-xl border border-border shadow-sm">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">账号</FormLabel>
                            <FormControl>
                              <Input placeholder="输入登录账号" className="h-10" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">密码</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="输入登录密码" className="h-10" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cookie"
                        render={({ field }) => (
                          <FormItem className="space-y-2 col-span-2">
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-foreground">Cookie</FormLabel>
                              <span className="text-xs text-primary cursor-pointer hover:underline">格式化解析</span>
                            </div>
                            <FormControl>
                              <Textarea placeholder="粘贴 JSON 或 String 格式的 Cookie" className="resize-none h-32 font-mono text-xs" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Device Settings Section */}
                <div id="section-proxy" className="space-y-6 scroll-mt-20">
                  <div>
                    <h2 className="text-lg font-medium text-foreground mb-4">关联设备</h2>
                    <div className="space-y-6 p-6 bg-card rounded-xl border border-border shadow-sm">
                      <FormField
                        control={form.control}
                        name="deviceId"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">选择设备 <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "none"}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="请选择已配置的代理设备" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">无 / 本机直连网络</SelectItem>
                                {devices.map(device => (
                                  <SelectItem key={device.id} value={device.id}>
                                    [{device.id}] {device.host}:{device.port} ({device.ipLoc || '未知地区'})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              选择设备后，环境指纹的地理位置、时区将自动同步为该设备的解析结果。
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                 </div>

                {/* Fingerprint Settings Section */}
                <div id="section-fingerprint" className="space-y-6 scroll-mt-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-foreground">高级指纹</h2>
                    <Button type="button" onClick={handleGenerateRandomFingerprint} variant="outline" size="sm" className="h-8 text-primary border-primary/30 hover:bg-primary/10 flex items-center gap-1">
                      <RiRefreshLine className="h-4 w-4" />
                      换一套指纹
                    </Button>
                  </div>

                  {/* OS & Browser */}
                  <div className="p-6 bg-card rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-sm font-medium text-card-foreground border-b border-border/50 pb-2">操作系统与浏览器</h3>
                    
                    <FormField
                      control={form.control}
                      name="os"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-neutral-700">操作系统</FormLabel>
                          <div className="flex items-center gap-3">
                            <div 
                              onClick={() => field.onChange("windows")}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm cursor-pointer ${field.value === 'windows' ? 'border-primary bg-primary/10 text-primary' : 'border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                            >
                              <RiWindowsLine className="h-4 w-4" />
                              Windows
                            </div>
                            <div 
                              onClick={() => field.onChange("macos")}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm cursor-pointer ${field.value === 'macos' ? 'border-primary bg-primary/10 text-primary' : 'border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                            >
                              <RiAppleLine className="h-4 w-4" />
                              macOS
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="browser"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">浏览器内核</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="chrome">Chrome (SunBrowser)</SelectItem>
                                <SelectItem value="firefox">Firefox (FlowerBrowser)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="browserVersion"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">内核版本</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="147">147.0.7727.102 (最新)</SelectItem>
                                <SelectItem value="146">146.0.7688.10</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="userAgent"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-neutral-700">User-Agent</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="resize-none h-20 font-mono text-xs bg-muted text-foreground" 
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location & Language */}
                  <div className="p-6 bg-card rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-sm font-medium text-card-foreground border-b border-border/50 pb-2">地理与语言</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                      <FormField
                        control={form.control}
                        name="timezoneAuto"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-foreground">时区 (Timezone)</FormLabel>
                              <FormDescription className="text-xs">基于代理 IP 自动匹配</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="webrtcReplace"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-foreground">WebRTC</FormLabel>
                              <FormDescription className="text-xs">替换真实内网 IP</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="geolocationAuto"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-neutral-700">地理位置 (Geolocation)</FormLabel>
                              <FormDescription className="text-xs">询问/基于 IP 模拟</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="languageAuto"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-neutral-700">语言 (Language)</FormLabel>
                              <FormDescription className="text-xs">基于 IP 自动匹配</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Hardware */}
                  <div className="p-6 bg-card rounded-xl border border-border shadow-sm space-y-6">
                    <h3 className="text-sm font-medium text-card-foreground border-b border-border/50 pb-2">硬件与设备</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="hardwareConcurrency"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-neutral-700">CPU 并发数 (Hardware Concurrency)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="4">4 核心</SelectItem>
                                <SelectItem value="8">8 核心</SelectItem>
                                <SelectItem value="16">16 核心</SelectItem>
                                <SelectItem value="32">32 核心</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="deviceMemory"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-neutral-700">设备内存 (Device Memory)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="4">4 GB</SelectItem>
                                <SelectItem value="8">8 GB</SelectItem>
                                <SelectItem value="16">16 GB</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-foreground">显卡厂商 & 渲染器 (WebGL Vendor & Renderer)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="webglVendor"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="h-10 bg-muted text-foreground font-mono text-xs" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="webglRenderer"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="h-10 bg-muted text-foreground font-mono text-xs" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 pt-4 border-t border-border/50">
                       <FormField
                        control={form.control}
                        name="canvasNoise"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-foreground">Canvas</FormLabel>
                              <FormDescription className="text-xs">真实 / 噪音</FormDescription>
                            </div>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-24 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="real">真实</SelectItem>
                                <SelectItem value="noise">噪音</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="audioNoise"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-foreground">AudioContext</FormLabel>
                              <FormDescription className="text-xs">真实 / 噪音</FormDescription>
                            </div>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-24 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="real">真实</SelectItem>
                                <SelectItem value="noise">噪音</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                 </div>

              </form>
            </Form>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-20 bg-background border-t border-border px-8 py-4 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
            <Button variant="outline" type="button" onClick={() => router.back()}>取消</Button>
            <Button onClick={form.handleSubmit(onSubmit)} type="button" className="bg-primary hover:bg-primary/90 text-primary-foreground">确定创建</Button>
          </div>
        </main>
    </>
  )
}
