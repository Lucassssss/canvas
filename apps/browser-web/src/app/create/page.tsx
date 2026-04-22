"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function CreateProfilePage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8 text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">新建浏览器环境</h1>
              <p className="text-neutral-500 text-sm">完全解耦的底层指纹与网络配置</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">取消</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="mr-2 h-4 w-4" /> 保存配置
            </Button>
          </div>
        </div>

        {/* Main Form Area with Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <Tabs defaultValue="basic" className="w-full flex flex-col md:flex-row h-full min-h-[600px]">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-48 bg-neutral-50/50 border-r border-neutral-100 p-4">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2 items-start w-full">
                <TabsTrigger value="basic" className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  基础设置
                </TabsTrigger>
                <TabsTrigger value="proxy" className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  代理信息
                </TabsTrigger>
                <TabsTrigger value="platform" className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  账号平台
                </TabsTrigger>
                <TabsTrigger value="fingerprint" className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  指纹配置
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-8">
              
              {/* Basic Settings */}
              <TabsContent value="basic" className="m-0 space-y-8 animate-in fade-in-50">
                <div className="space-y-4 max-w-2xl">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-base font-semibold">名称</Label>
                    <Input id="name" placeholder="例如：美区亚马逊店铺-01" className="bg-neutral-50" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label className="font-semibold">浏览器内核</Label>
                      <Select defaultValue="joii-chrome">
                        <SelectTrigger>
                          <SelectValue placeholder="选择内核" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="joii-chrome">Joii Chromium (推荐)</SelectItem>
                          <SelectItem value="joii-firefox">Joii Firefox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-semibold">操作系统环境</Label>
                      <Select defaultValue="windows">
                        <SelectTrigger>
                          <SelectValue placeholder="选择OS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="windows">Windows 10/11</SelectItem>
                          <SelectItem value="macos">macOS</SelectItem>
                          <SelectItem value="linux">Linux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2 pt-4">
                    <Label className="font-semibold flex justify-between">
                      预加载 Cookie
                      <span className="text-xs text-neutral-400 font-normal">支持 JSON, Netscape 格式</span>
                    </Label>
                    <textarea 
                      className="min-h-[120px] w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950" 
                      placeholder="将购买账号自带的 Cookie 粘贴于此，启动前将自动注入底层数据库..."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Proxy Settings */}
              <TabsContent value="proxy" className="m-0 space-y-8 animate-in fade-in-50">
                <div className="space-y-6 max-w-2xl">
                  <div className="grid gap-2">
                    <Label className="text-base font-semibold">代理协议</Label>
                    <Select defaultValue="socks5">
                      <SelectTrigger>
                        <SelectValue placeholder="选择代理类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">无代理 (本地直连)</SelectItem>
                        <SelectItem value="socks5">Socks5</SelectItem>
                        <SelectItem value="http">HTTP/HTTPS</SelectItem>
                        <SelectItem value="ssh">SSH 隧道</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-[3fr_1fr] gap-4">
                    <div className="grid gap-2">
                      <Label>主机 (Host/IP)</Label>
                      <Input placeholder="127.0.0.1" />
                    </div>
                    <div className="grid gap-2">
                      <Label>端口 (Port)</Label>
                      <Input placeholder="7897" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>代理账号 (选填)</Label>
                      <Input placeholder="Username" />
                    </div>
                    <div className="grid gap-2">
                      <Label>代理密码 (选填)</Label>
                      <Input type="password" placeholder="Password" />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="text-sm text-blue-800">
                      填写完毕后，请务必进行连通性测试以确保出口 IP 纯净。
                    </div>
                    <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100">
                      检查网络连通性
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Fingerprint Config */}
              <TabsContent value="fingerprint" className="m-0 space-y-8 animate-in fade-in-50">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="font-semibold border-b pb-2">基础特征</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>时区、语言、地理位置</Label>
                        <p className="text-xs text-neutral-500">根据配置的代理出口 IP 智能解析</p>
                      </div>
                      <Select defaultValue="auto_ip">
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto_ip">基于 IP</SelectItem>
                          <SelectItem value="custom">手动定义</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>WebRTC 行为</Label>
                        <p className="text-xs text-neutral-500">防真实内网 IP 泄漏</p>
                      </div>
                      <Select defaultValue="proxy">
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proxy">替换模式</SelectItem>
                          <SelectItem value="disable">禁用 (易被识破)</SelectItem>
                          <SelectItem value="real">真实本地</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>屏幕分辨率</Label>
                      </div>
                      <Select defaultValue="random_common">
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="random_common">常见随机</SelectItem>
                          <SelectItem value="1920x1080">1920x1080</SelectItem>
                          <SelectItem value="1366x768">1366x768</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-semibold border-b pb-2">硬件追踪干扰 (Hardware Noise)</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label>Canvas 图像哈希扰乱</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>AudioContext 音频波形</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>WebGL 图像元数据</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>ClientRects 边框抗锯齿偏移</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="pt-4 space-y-3">
                      <Label className="font-medium">特定硬件欺骗策略</Label>
                      <div className="grid gap-2">
                        <Select defaultValue="nvidia">
                          <SelectTrigger>
                            <SelectValue placeholder="WebGL 厂商" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nvidia">Google Inc. (NVIDIA)</SelectItem>
                            <SelectItem value="amd">Google Inc. (AMD)</SelectItem>
                            <SelectItem value="intel">Google Inc. (Intel)</SelectItem>
                            <SelectItem value="apple">Apple Inc.</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="rtx4070">
                          <SelectTrigger>
                            <SelectValue placeholder="WebGL 渲染器" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rtx4070">ANGLE (NVIDIA, NVIDIA GeForce RTX 4070)</SelectItem>
                            <SelectItem value="gtx1050">ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti)</SelectItem>
                            <SelectItem value="m2">Apple M2</SelectItem>
                            <SelectItem value="intel620">Intel(R) UHD Graphics 620</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                  </div>
                </div>
              </TabsContent>

              {/* Platform Tagging Placeholder */}
              <TabsContent value="platform" className="m-0 space-y-8 animate-in fade-in-50">
                <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border-2 border-dashed rounded-lg border-neutral-200">
                  <p>此环境主要用于运营哪个平台？</p>
                  <p className="text-sm mt-2">（绑定后可自动获取该平台的登录URL及专用指纹容忍度策略）</p>
                  <Button variant="outline" className="mt-4">选择平台 (Amazon, TikTok, PayPal...)</Button>
                </div>
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
