"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { RiSearchLine, RiGlobalLine } from "@remixicon/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AccessLogsPage() {
  const logs = [
    { id: "al_1", member: "Zhang San", env: "环境 env_331", url: "seller-sg.tiktok.com", title: "TikTok Shop Seller Center", action: "打开网页", time: "2023-10-25 14:35:10" },
    { id: "al_2", member: "Zhang San", env: "环境 env_331", url: "seller-sg.tiktok.com/order", title: "订单管理 - TikTok Shop", action: "页面跳转", time: "2023-10-25 14:38:22" },
    { id: "al_3", member: "Li Si", env: "环境 env_102", url: "youtube.com", title: "YouTube", action: "拦截访问 (黑名单策略)", time: "2023-10-25 15:01:05" },
  ]

  return (
    <>
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 text-foreground">
        
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索成员姓名或访问网址"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm mt-2">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="pl-6 w-12"><RiGlobalLine className="h-4 w-4 text-muted-foreground" /></TableHead>
                  <TableHead className="font-normal text-muted-foreground">成员</TableHead>
                  <TableHead className="font-normal text-muted-foreground">使用环境</TableHead>
                  <TableHead className="font-normal text-muted-foreground w-[35%]">访问地址 / 标题</TableHead>
                  <TableHead className="font-normal text-muted-foreground">操作类型</TableHead>
                  <TableHead className="font-normal text-muted-foreground text-right pr-6">发生时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                    <TableCell className="pl-6 text-muted-foreground font-mono text-xs">{log.id.split('_')[1]}</TableCell>
                    <TableCell className="text-foreground text-sm font-medium">{log.member}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{log.env}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium text-sm truncate max-w-sm">{log.title}</span>
                        <span className="text-muted-foreground text-xs truncate max-w-sm mt-0.5">{log.url}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <span className={`text-xs ${log.action.includes('拦截') ? 'text-destructive font-medium' : 'text-primary'}`}>{log.action}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm text-right pr-6">{log.time}</TableCell>
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
