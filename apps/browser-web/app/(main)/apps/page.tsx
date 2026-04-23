"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RiSearchLine, RiApps2Line, RiDownloadCloud2Line, RiUploadCloud2Line } from "@remixicon/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AppsPage() {
  const [apps, setApps] = React.useState([
    { id: "ext_1", name: "Meta Pixel Helper", category: "Extension", installed: true, desc: "Troubleshoot Meta pixels." },
    { id: "ext_2", name: "Google Tag Assistant", category: "Extension", installed: false, desc: "Verify Google tracking tags." },
    { id: "ext_3", name: "TikTok Pixel Helper", category: "Extension", installed: true, desc: "Verify TikTok pixel events." },
    { id: "int_1", name: "Luminati Proxy", category: "Integration", installed: false, desc: "Seamless proxy integration." },
  ])

  return (
    <>
      <PageHeader breadcrumb={[{ label: "核心业务" }, { label: "应用中心" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索扩展插件或集成应用"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
                <RiUploadCloud2Line className="mr-1 h-4 w-4" /> 上传私有应用
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border bg-card">
              <DialogHeader>
                <DialogTitle>上传私有应用 / 插件</DialogTitle>
                <DialogDescription>上传自定义的 Chrome 扩展程序 (.zip) 或内部插件。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">应用名称</Label>
                  <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：内部打单插件" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 mt-2">
                  <Label className="text-right text-muted-foreground">扩展包</Label>
                  <div className="col-span-3 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center h-32 bg-muted/10 cursor-pointer hover:bg-muted/30">
                     <RiUploadCloud2Line className="h-6 w-6 text-muted-foreground mb-2" />
                     <span className="text-sm text-muted-foreground">点击或拖拽 .zip 文件至此</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">确认上传</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map(app => (
            <Card key={app.id} className="bg-card flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground border border-border">
                    <RiApps2Line className="w-5 h-5" />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border">{app.category}</span>
                </div>
                <CardTitle className="text-base mt-3">{app.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">{app.desc}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                {app.installed ? (
                  <Button variant="outline" size="sm" className="w-full h-8 text-muted-foreground border-input">
                    已安装
                  </Button>
                ) : (
                  <Button size="sm" className="w-full h-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <RiDownloadCloud2Line className="mr-1.5 h-4 w-4" /> 安装应用
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
