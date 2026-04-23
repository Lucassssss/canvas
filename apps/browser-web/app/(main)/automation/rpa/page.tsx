"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { RiRobot2Line, RiAddLine } from "@remixicon/react"
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
import { Input } from "@/components/ui/input"

export default function RpaPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ label: "自动化与 API" }, { label: "RPA Plus" }]} />
      <div className="flex flex-1 overflow-hidden bg-background">
        
        {/* Sidebar for RPA Scripts */}
        <div className="w-64 border-r border-border bg-muted/10 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="font-medium text-sm">我的自动化脚本</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary hover:bg-primary/10">
                  <RiAddLine className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] border-border bg-card">
                <DialogHeader>
                  <DialogTitle>新建 RPA 脚本</DialogTitle>
                  <DialogDescription>创建一个空白脚本或从本地导入现有配置。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">脚本名称</Label>
                    <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：自动登录养号" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">所属分组</Label>
                    <Input className="col-span-3 border-input shadow-none h-9" placeholder="默认分组" defaultValue="默认分组" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-input shadow-none h-9">导入配置</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">创建空白脚本</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="px-3 py-2 text-sm text-foreground bg-primary/10 rounded-md font-medium cursor-pointer flex items-center gap-2">
              <RiRobot2Line className="h-4 w-4 text-primary" />
              TikTok 自动养号
            </div>
            <div className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer flex items-center gap-2 mt-1">
              <RiRobot2Line className="h-4 w-4" />
              Amazon 测评爬虫
            </div>
          </div>
        </div>

        {/* Canvas for RPA Editor */}
        <div className="flex-1 flex flex-col">
          <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-card">
            <span className="font-medium text-sm">TikTok 自动养号 (草稿)</span>
            <Button size="sm" className="h-7 px-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">保存并执行</Button>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-muted/5 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="px-6 py-4 bg-card border border-border shadow-sm rounded-lg text-center">
              <p className="text-muted-foreground text-sm">RPA 任务编排画布区域</p>
              <p className="text-xs text-muted-foreground mt-2 opacity-50">Drag and drop nodes to build workflows.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
