"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import { RiSearchLine, RiFileList3Line } from "@remixicon/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LogsPage() {
  const [logs, setLogs] = React.useState([
    { id: "log_1", user: "Admin Boss", action: "启动环境", target: "环境 env_331 (TikTok 东南亚小店)", time: "2023-10-25 14:32:11" },
    { id: "log_2", user: "Zhang San", action: "修改代理", target: "环境 env_102 (Amazon 北美)", time: "2023-10-25 10:15:00" },
    { id: "log_3", user: "Li Si", action: "创建环境", target: "环境 env_405 (PayPal 独立站)", time: "2023-10-24 18:20:45" },
    { id: "log_4", user: "Admin Boss", action: "删除设备", target: "设备 dev_88 (Aliyun SGP)", time: "2023-10-24 09:05:12" },
  ])

  return (
    <>
      <PageHeader breadcrumb={[{ label: "团队管理" }, { label: "操作日志" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索操作对象或行为"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="pl-6 w-12"><RiFileList3Line className="h-4 w-4 text-muted-foreground" /></TableHead>
                  <TableHead className="font-normal text-muted-foreground">操作人</TableHead>
                  <TableHead className="font-normal text-muted-foreground">动作</TableHead>
                  <TableHead className="font-normal text-muted-foreground">目标对象</TableHead>
                  <TableHead className="font-normal text-muted-foreground text-right pr-6">发生时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id} className="group hover:bg-muted/50 border-b border-border/60 h-14">
                    <TableCell className="pl-6 text-muted-foreground font-mono text-xs">{log.id.split('_')[1]}</TableCell>
                    <TableCell className="text-foreground text-sm font-medium">{log.user}</TableCell>
                    <TableCell>
                      <span className="text-primary text-sm">{log.action}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{log.target}</TableCell>
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
