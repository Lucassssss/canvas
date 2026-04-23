"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RiSearchLine, RiAddLine, RiFolder2Line, RiMore2Fill, RiEditLine, RiDeleteBinLine } from "@remixicon/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
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

export default function GroupsPage() {
  const [groups, setGroups] = React.useState([
    { id: "grp_1", name: "TikTok 东南亚小店", desc: "用于东南亚五国的 TikTok Shop 环境", count: 12, createdAt: "2023-10-01 12:00:00" },
    { id: "grp_2", name: "Amazon 北美", desc: "亚马逊北美站测评", count: 8, createdAt: "2023-10-02 14:30:00" },
    { id: "grp_3", name: "独立站 PayPal", desc: "PayPal 养号及支付验证环境", count: 3, createdAt: "2023-10-05 09:15:00" },
  ])

  return (
    <>
      <PageHeader breadcrumb={[{ label: "核心业务" }, { label: "分组管理" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索分组名称"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
                <RiAddLine className="mr-1 h-4 w-4" /> 新建分组
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border bg-card">
              <DialogHeader>
                <DialogTitle>新建环境分组</DialogTitle>
                <DialogDescription>创建分组以便更好地组织和管理浏览器环境。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-muted-foreground">分组名称</Label>
                  <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：TikTok 运营" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4 mt-2">
                  <Label className="text-right text-muted-foreground pt-2">分组描述</Label>
                  <textarea 
                    className="col-span-3 h-20 p-3 text-sm bg-muted/20 border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="选填，记录分组用途"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">确定创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-input" /></TableHead>
                  <TableHead className="font-normal text-muted-foreground">分组名称</TableHead>
                  <TableHead className="font-normal text-muted-foreground">描述</TableHead>
                  <TableHead className="font-normal text-muted-foreground">关联环境数</TableHead>
                  <TableHead className="font-normal text-muted-foreground">创建时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map(group => (
                  <TableRow key={group.id} className="group hover:bg-muted/50 border-b border-border/60 h-14">
                    <TableCell className="text-center pl-4"><Checkbox className="border-input" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <RiFolder2Line className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{group.desc}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {group.count}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{group.createdAt}</TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                            <RiMore2Fill className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem><RiEditLine className="mr-2 h-4 w-4" /> 编辑</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive"><RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
