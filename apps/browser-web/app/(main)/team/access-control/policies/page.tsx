"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiShieldKeyholeLine, RiMore2Fill } from "@remixicon/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PoliciesPage() {
  const policies = [
    { id: "pol_1", name: "跨境电商通用策略", type: "白名单", targets: ["*.tiktok.com", "*.amazon.com", "*.paypal.com"], memberCount: 5, status: "启用" },
    { id: "pol_2", name: "禁止娱乐网站", type: "黑名单", targets: ["youtube.com", "netflix.com"], memberCount: 12, status: "启用" },
  ]

  return (
    <>
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 text-foreground">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">网页访问策略</h2>
            <p className="text-sm text-muted-foreground">配置成员在系统浏览器中允许或禁止访问的网址规则。</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
                <RiAddLine className="mr-1 h-4 w-4" /> 新建策略
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-border bg-card">
              <DialogHeader>
                <DialogTitle>新建访问策略</DialogTitle>
                <DialogDescription>创建网页访问黑白名单策略，可应用于指定的团队成员。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">策略名称</Label>
                  <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：禁止访问社交媒体" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">管控模式</Label>
                  <Select defaultValue="blacklist">
                    <SelectTrigger className="col-span-3 border-input bg-background shadow-none h-9">
                      <SelectValue placeholder="选择模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whitelist">白名单 (仅允许访问列表中的网址)</SelectItem>
                      <SelectItem value="blacklist">黑名单 (禁止访问列表中的网址)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right text-muted-foreground mt-2">网址规则</Label>
                  <div className="col-span-3">
                    <textarea 
                      className="w-full h-24 p-3 text-sm bg-muted/20 border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="每行输入一个域名，例如：&#10;*.tiktok.com&#10;youtube.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">应用成员</Label>
                  <Select>
                    <SelectTrigger className="col-span-3 border-input bg-background shadow-none h-9">
                      <SelectValue placeholder="选择应用的成员或角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全体成员</SelectItem>
                      <SelectItem value="r_3">所有 [成员] 角色</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">保存策略</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm mt-2">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="pl-6 w-12"><RiShieldKeyholeLine className="h-4 w-4 text-muted-foreground" /></TableHead>
                  <TableHead className="font-normal text-muted-foreground">策略名称</TableHead>
                  <TableHead className="font-normal text-muted-foreground">管控模式</TableHead>
                  <TableHead className="font-normal text-muted-foreground w-[40%]">网址规则</TableHead>
                  <TableHead className="font-normal text-muted-foreground">应用成员数</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map(pol => (
                  <TableRow key={pol.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                    <TableCell className="pl-6 text-muted-foreground font-mono text-xs">{pol.id.split('_')[1]}</TableCell>
                    <TableCell className="text-foreground text-sm font-medium">{pol.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal border-input bg-muted/20 ${pol.type === '白名单' ? 'text-green-500' : 'text-destructive'}`}>
                        {pol.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {pol.targets.map(target => (
                          <span key={target} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">{target}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{pol.memberCount} 人</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <RiMore2Fill className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </>
  )
}
