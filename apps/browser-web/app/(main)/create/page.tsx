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
  RiShuffleLine,
  RiGlobalLine, 
  RiAppleLine, 
  RiWindowsLine,
  RiFacebookCircleFill,
  RiAmazonFill,
  RiTiktokFill,
  RiPaypalFill,
  RiGoogleFill,
  RiPinterestFill,
  RiTwitterXFill,
  RiStore2Line
} from "@remixicon/react"

// --- Zod Schema ---
const formSchema = z.object({
  // Basic
  name: z.string().min(1, "请输入环境名称"),
  groupId: z.string().optional(),
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
  language: z.string().optional(),
  hardwareConcurrency: z.string().optional(),
  deviceMemory: z.string().optional(),
  webglMode: z.enum(["custom", "disabled", "real"]).optional(),
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
  const [groups, setGroups] = React.useState<any[]>([])

  React.useEffect(() => {
    setIsMounted(true)
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (id) setEditId(id)

    // Fetch devices and groups
    const loadData = async () => {
      try {
        const [devRes, grpRes] = await Promise.all([
          cloudFetch(`/api/devices`),
          cloudFetch(`/api/groups`)
        ])
        const devData = await devRes.json()
        const grpData = await grpRes.json()
        if (devData.success) {
          setDevices(devData.data)
        }
        if (grpData.success) {
          setGroups(grpData.data)
        }
      } catch (err) {
        console.error("Failed to fetch data", err)
      }
    }
    loadData()
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
      groupId: "default",
      platform: "none",
      remark: "",
      username: "",
      password: "",
      cookie: "",
      deviceId: "",
      os: "windows",
      browser: "chrome",
      browserVersion: "142.0.7444.175",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      timezoneAuto: true,
      webrtcReplace: true,
      geolocationAuto: true,
      languageAuto: true,
      language: "en-US,en",
      hardwareConcurrency: "16",
      deviceMemory: "8",
      webglMode: "custom",
      webglVendor: "Google Inc. (NVIDIA)",
      webglRenderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)",
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
    form.setValue("browserVersion", "142.0.7444.175")
    form.setValue("userAgent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36")
    form.setValue("hardwareConcurrency", "8")
    form.setValue("webglMode", "custom")
    form.setValue("webglVendor", "Google Inc. (Apple)")
    form.setValue("webglRenderer", "ANGLE (Apple, Apple M2, OpenGL 4.1)")
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

  // 监听内核版本和操作系统的变化，联动更新 User-Agent 和 WebGL 元数据
  React.useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === "browserVersion" || name === "os") {
        const currentVersion = form.getValues("browserVersion");
        const currentOs = form.getValues("os");
        if (currentVersion && currentOs) {
          const majorVersion = currentVersion.split('.')[0];
          const osString = currentOs === "macos" 
            ? "Macintosh; Intel Mac OS X 10_15_7"
            : "Windows NT 10.0; Win64; x64";
            
          form.setValue("userAgent", `Mozilla/5.0 (${osString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${majorVersion}.0.0.0 Safari/537.36`);
          
          if (name === "os") {
            if (currentOs === "macos") {
              form.setValue("webglVendor", "Google Inc. (Apple)");
              form.setValue("webglRenderer", "ANGLE (Apple, Apple M2, OpenGL 4.1)");
            } else {
              form.setValue("webglVendor", "Google Inc. (NVIDIA)");
              form.setValue("webglRenderer", "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)");
            }
          }
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const watchOs = form.watch("os")
  const watchLanguageAuto = form.watch("languageAuto")

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
                        name="groupId"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">所属分组</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "default"}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="选择分组" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">默认分组</SelectItem>
                                {groups.map(g => (
                                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                ))}
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
                            <Select onValueChange={field.onChange} value={field.value || "none"}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="选择平台 (可选)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none"><div className="flex items-center gap-2"><RiGlobalLine className="w-4 h-4 text-muted-foreground" /> 无 / 自定义</div></SelectItem>
                                <SelectItem value="fb"><div className="flex items-center gap-2"><RiFacebookCircleFill className="w-4 h-4 text-blue-600" /> Facebook</div></SelectItem>
                                <SelectItem value="amz"><div className="flex items-center gap-2"><RiAmazonFill className="w-4 h-4 text-orange-500" /> Amazon</div></SelectItem>
                                <SelectItem value="tk"><div className="flex items-center gap-2"><RiTiktokFill className="w-4 h-4 text-black dark:text-white" /> TikTok</div></SelectItem>
                                <SelectItem value="paypal"><div className="flex items-center gap-2"><RiPaypalFill className="w-4 h-4 text-blue-800" /> PayPal</div></SelectItem>
                                <SelectItem value="google"><div className="flex items-center gap-2"><RiGoogleFill className="w-4 h-4 text-red-500" /> Google</div></SelectItem>
                                <SelectItem value="pinterest"><div className="flex items-center gap-2"><RiPinterestFill className="w-4 h-4 text-red-600" /> Pinterest</div></SelectItem>
                                <SelectItem value="x"><div className="flex items-center gap-2"><RiTwitterXFill className="w-4 h-4 text-black dark:text-white" /> X (Twitter)</div></SelectItem>
                                <SelectItem value="shopee"><div className="flex items-center gap-2"><RiStore2Line className="w-4 h-4 text-orange-600" /> Shopee</div></SelectItem>
                                <SelectItem value="lazada"><div className="flex items-center gap-2"><RiStore2Line className="w-4 h-4 text-blue-500" /> Lazada</div></SelectItem>
                                <SelectItem value="etsy"><div className="flex items-center gap-2"><RiStore2Line className="w-4 h-4 text-orange-400" /> Etsy</div></SelectItem>
                                <SelectItem value="ebay"><div className="flex items-center gap-2"><RiStore2Line className="w-4 h-4 text-blue-600" /> eBay</div></SelectItem>
                                <SelectItem value="aliexpress"><div className="flex items-center gap-2"><RiStore2Line className="w-4 h-4 text-red-600" /> AliExpress</div></SelectItem>
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
                            <Select key={devices.length ? "loaded" : "loading"} onValueChange={field.onChange} value={field.value || "none"}>
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
                            <Select onValueChange={(val) => {
                              const defaults: Record<string, string> = {
                                "147": "147.0.7727.102",
                                "146": "146.0.7688.10",
                                "145": "145.0.7454.101",
                                "144": "144.0.7566.25",
                                "143": "143.0.7505.100",
                                "142": "142.0.7444.175"
                              };
                              field.onChange(defaults[val] || val);
                            }} value={field.value ? field.value.split('.')[0] : "142"}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="147">Chrome 147 (最新稳定版)</SelectItem>
                                <SelectItem value="146">Chrome 146</SelectItem>
                                <SelectItem value="145">Chrome 145</SelectItem>
                                <SelectItem value="144">Chrome 144</SelectItem>
                                <SelectItem value="143">Chrome 143</SelectItem>
                                <SelectItem value="142">Chrome 142 (当前内核)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="userAgent"
                      render={({ field }) => {
                        const currentFullVersion = form.watch("browserVersion") || "142.0.7444.175";
                        const currentMajor = currentFullVersion.split('.')[0];
                        
                        const handleRandomizeMinorVersion = () => {
                          if (currentMajor === "142") {
                            const STABLE_142 = [
                              "142.0.7444.177", "142.0.7444.176", "142.0.7444.175",
                              "142.0.7444.164", "142.0.7444.163", "142.0.7444.162",
                              "142.0.7444.136", "142.0.7444.135", "142.0.7444.134",
                              "142.0.7444.61", "142.0.7444.60", "142.0.7444.59"
                            ];
                            const randomVer = STABLE_142[Math.floor(Math.random() * STABLE_142.length)];
                            form.setValue("browserVersion", randomVer);
                          } else {
                            alert("目前仅支持为您编译的 142 内核随机切换小版本");
                          }
                        };

                        return (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center text-neutral-700">
                              User-Agent
                              <span className="ml-2 text-xs text-muted-foreground font-normal">
                                (记录小版本: {currentFullVersion})
                              </span>
                              {currentMajor === "142" && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-5 w-5 ml-1 text-muted-foreground hover:text-foreground"
                                  onClick={handleRandomizeMinorVersion}
                                  title="随机切换内核子版本以增加指纹多样性"
                                >
                                  <RiShuffleLine className="h-3 w-3" />
                                </Button>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                className="resize-none h-20 font-mono text-xs bg-muted text-foreground" 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
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
                    {/* 手动语言选择器，仅在 languageAuto=false 时显示 */}
                    {!watchLanguageAuto && (
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">指定语言</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="选择语言" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en-US,en">英语 (US) — en-US</SelectItem>
                                <SelectItem value="en-GB,en">英语 (UK) — en-GB</SelectItem>
                                <SelectItem value="zh-CN,zh,en-US,en">简体中文 — zh-CN</SelectItem>
                                <SelectItem value="zh-TW,zh,en-US,en">繁体中文 — zh-TW</SelectItem>
                                <SelectItem value="ja,en-US,en">日语 — ja</SelectItem>
                                <SelectItem value="ko,en-US,en">韩语 — ko</SelectItem>
                                <SelectItem value="de-DE,de,en-US,en">德语 — de-DE</SelectItem>
                                <SelectItem value="fr-FR,fr,en-US,en">法语 — fr-FR</SelectItem>
                                <SelectItem value="es-ES,es,en-US,en">西班牙语 — es-ES</SelectItem>
                                <SelectItem value="pt-BR,pt,en-US,en">葡萄牙语 (BR) — pt-BR</SelectItem>
                                <SelectItem value="ru-RU,ru,en-US,en">俄语 — ru-RU</SelectItem>
                                <SelectItem value="ar-SA,ar,en-US,en">阿拉伯语 — ar-SA</SelectItem>
                                <SelectItem value="th-TH,th,en-US,en">泰语 — th-TH</SelectItem>
                                <SelectItem value="vi-VN,vi,en-US,en">越南语 — vi-VN</SelectItem>
                                <SelectItem value="id-ID,id,en-US,en">印尼语 — id-ID</SelectItem>
                                <SelectItem value="ms-MY,ms,en-US,en">马来语 — ms-MY</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">将同时设置 HTTP Accept-Language 请求头和 navigator.languages</FormDescription>
                          </FormItem>
                        )}
                      />
                    )}
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
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="webglMode"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-foreground">WebGL 配置</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "custom"}>
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="custom">自定义 (Custom)</SelectItem>
                                <SelectItem value="disabled">禁用 (Disabled)</SelectItem>
                                <SelectItem value="real">真实 (Real)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      {form.watch("webglMode") === "custom" && (
                        <div className="space-y-2 pt-2">
                          <Label className="flex items-center text-foreground">
                            显卡厂商 & 渲染器 (WebGL Vendor & Renderer)
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 ml-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                const currentOs = form.getValues("os") || "windows";
                                if (currentOs === "windows") {
                                  const WINDOWS_WEBGL = [
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (NVIDIA)", renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, AMD Radeon RX 7900 XTX Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, AMD Radeon RX 7800 XT Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, AMD Radeon RX 6800 XT Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (AMD)", renderer: "ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) UHD Graphics 770 Direct3D11 vs_5_0 ps_5_0, D3D11)" },
                                    { vendor: "Google Inc. (Intel)", renderer: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)" }
                                  ];
                                  const random = WINDOWS_WEBGL[Math.floor(Math.random() * WINDOWS_WEBGL.length)];
                                  form.setValue("webglVendor", random.vendor);
                                  form.setValue("webglRenderer", random.renderer);
                                } else {
                                  const MACOS_WEBGL = [
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M1, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M1 Max, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M2, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M2 Pro, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M2 Max, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M3, OpenGL 4.1)" },
                                    { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M3 Pro, OpenGL 4.1)" }
                                  ];
                                  const random = MACOS_WEBGL[Math.floor(Math.random() * MACOS_WEBGL.length)];
                                  form.setValue("webglVendor", random.vendor);
                                  form.setValue("webglRenderer", random.renderer);
                                }
                              }}
                              title="一键随机生成真实配置"
                            >
                              <RiShuffleLine className="h-3 w-3" />
                            </Button>
                          </Label>
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
                      )}
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
