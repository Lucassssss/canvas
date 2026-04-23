"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RiSearchLine, RiDeleteBinLine, RiRefreshLine } from "@remixicon/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function TrashPage() {
  const [items, setItems] = React.useState([
    { id: "env_19", type: "环境", name: "废弃测试环境 01", deletedAt: "2023-10-10 15:20:00" },
    { id: "dev_99", type: "设备", name: "过期代理 IP", deletedAt: "2023-10-11 09:12:00" },
  ])

  return (
    <>
      <PageHeader breadcrumb={[{ label: "核心业务" }, { label: "回收站" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索已删除内容"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Button size="sm" variant="destructive" className="h-8 shadow-none font-normal">
            <RiDeleteBinLine className="mr-1 h-4 w-4" /> 清空回收站
          </Button>
        </div>

        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-input" /></TableHead>
                  <TableHead className="w-24 font-normal text-muted-foreground">类型</TableHead>
                  <TableHead className="font-normal text-muted-foreground">名称/ID</TableHead>
                  <TableHead className="font-normal text-muted-foreground">删除时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                   <TableRow><TableCell colSpan={5} className="text-center py-16 text-muted-foreground text-sm">回收站为空</TableCell></TableRow>
                ) : items.map(item => (
                  <TableRow key={item.id} className="group hover:bg-muted/50 border-b border-border/60 h-14">
                    <TableCell className="text-center pl-4"><Checkbox className="border-input" /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal px-1.5 h-5 text-xs rounded-sm text-muted-foreground border-border bg-muted/50">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground text-sm font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.deletedAt}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100">
                         <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                           <RiRefreshLine className="mr-1 h-4 w-4" /> 恢复
                         </Button>
                         <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                           <RiDeleteBinLine className="mr-1 h-4 w-4" /> 彻底删除
                         </Button>
                      </div>
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
