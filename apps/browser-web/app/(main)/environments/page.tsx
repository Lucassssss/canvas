"use client"

import { useEffect, useState, useRef } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  RiSearchLine, RiFilter3Line, RiMore2Fill, RiPlayFill, RiWindowsFill, RiAppleFill,
  RiEditLine, RiShareForwardLine, RiDeleteBinLine, RiDownload2Line, RiFileTransferLine,
  RiRobot2Line, RiSettings4Line, RiFileCopyLine, RiTiktokFill, RiAmazonFill, RiPaypalFill,
  RiCloseCircleLine, RiCheckLine
} from "@remixicon/react"

const QuickEditCell = ({ value, onSave }: { value: string; onSave: (newVal: string) => void }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSave(val);
              setEditing(false);
            } else if (e.key === 'Escape') {
              setVal(value);
              setEditing(false);
            }
          }}
          onBlur={() => {
            onSave(val);
            setEditing(false);
          }}
          className="h-6 text-sm px-1 py-0 w-24"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={() => { setVal(value || ""); setEditing(true); }}>
      <span className="text-sm text-foreground min-w-4 min-h-4">{value || "-"}</span>
      <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover/edit:opacity-100" />
    </div>
  )
}

export default function EnvironmentsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnvironments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/environments`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data.map((item: any, index: number) => ({
          ...item,
          index: index + 1
        })));
      }
    } catch (error) {
      console.error("Failed to fetch environments:", error);
    } finally {
      setLoading(false);
    }
  }

  const profilesRef = useRef<any[]>([]);
  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  useEffect(() => {
    fetchEnvironments();

    // 状态检测：每 6s 查一次本地 daemon 的实际运行状态
    // 只给本地发请求，避免给云端接口造成压力
    const timer = setInterval(async () => {
      try {
        const daemonRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/status`);
        const daemonData = await daemonRes.json();

        if (daemonData.success) {
          const runningInDaemon = new Set<string>(daemonData.runningEnvs || []);

          // 根据前端当前缓存的列表，找出我们“认为”正在运行的环境
          const runningInCloud = profilesRef.current.filter((e: any) => e.status === "running");

          // 找出前端认为在运行，但本地 daemon 中实际已经不存在的环境（说明被用户手动关闭了）
          const toStop = runningInCloud.filter((e: any) => !runningInDaemon.has(e.id));

          if (toStop.length > 0) {
            await Promise.all(
              toStop.map((e: any) =>
                fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/environments/${e.id}/stop`, { method: "POST" })
              )
            );
            // 同步完停止状态后，拉取一次最新的列表刷新 UI
            fetchEnvironments();
          }
        }
      } catch {
        // daemon 未启动等情况，静默失败
      }
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleDelete = (id: string) => {
    setTimeout(async () => {
      if (!confirm("确定要删除这个环境吗？")) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/environments/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) fetchEnvironments();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }, 10);
  }

  const handleStart = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/environments/${id}/start`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.cli_args) {
        // Forward cli_args to local daemon
        const daemonRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, cli_args: data.data.cli_args })
        });
        const daemonData = await daemonRes.json();
        if (!daemonData.success) {
          console.error("Local daemon start failed", daemonData.error);
        }
      }
      fetchEnvironments();
    } catch (error) {
      console.error("Start failed", error);
    }
  }

  const handleStop = async (id: string) => {
    try {
      // Notify cloud
      await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/environments/${id}/stop`, { method: "POST" });
      // Notify local daemon
      await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchEnvironments();
    } catch (error) {
      console.error("Stop failed", error);
    }
  }

  const handleQuickEdit = async (id: string, field: string, value: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/environments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      const data = await res.json();
      if (data.success) fetchEnvironments();
    } catch (error) {
      console.error("Quick edit failed", error);
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-muted-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-muted-foreground hover:text-foreground">核心业务</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">环境管理</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Scrollable Main Content Area */}
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0">
        {/* Top Filter Bar */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 text-muted-foreground w-32 justify-between border-input">
            全部分组
            <span className="text-xs">▼</span>
          </Button>
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索或新建搜索条件"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <RiFilter3Line className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
            <RiPlayFill className="mr-1 h-4 w-4" /> 打开
          </Button>
        </div>

        {/* Data Table Container */}
        <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-input" /></TableHead>
                  <TableHead className="w-16 font-normal text-muted-foreground">序号</TableHead>
                  <TableHead className="font-normal text-muted-foreground w-24">编号/ID</TableHead>
                  <TableHead className="font-normal text-muted-foreground">分组</TableHead>
                  <TableHead className="font-normal text-muted-foreground">名称</TableHead>
                  <TableHead className="font-normal text-muted-foreground">IP</TableHead>
                  <TableHead className="font-normal text-muted-foreground">最近打开</TableHead>
                  <TableHead className="font-normal text-muted-foreground">状态</TableHead>
                  <TableHead className="font-normal text-muted-foreground">备注</TableHead>
                  <TableHead className="font-normal text-muted-foreground">创建时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground sticky right-0 bg-muted/50 shadow-[-1px_0_0_rgba(0,0,0,0.05)]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">加载中...</TableCell></TableRow>
                ) : profiles.map((profile) => (
                  <TableRow key={profile.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                    <TableCell className="text-center pl-4"><Checkbox className="border-input" /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{profile.index}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {profile.id}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <QuickEditCell value={profile.group} onSave={(val) => handleQuickEdit(profile.id, 'group', val)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {profile.os === 'windows' ? <RiWindowsFill className="h-4 w-4 text-primary" /> : <RiAppleFill className="h-4 w-4 text-foreground" />}
                        <QuickEditCell value={profile.name} onSave={(val) => handleQuickEdit(profile.id, 'name', val)} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-3 bg-primary/10 text-primary text-[9px] flex items-center justify-center font-normal rounded-sm">⇌</span>
                          <span className="text-sm text-foreground">{profile.ip || '-'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{profile.ipLoc || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        {profile.lastOpened ? (
                          <>
                            <span>{profile.lastOpened.split(' ')[0]}</span>
                            <span>{profile.lastOpened.split(' ')[1]}</span>
                          </>
                        ) : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal px-1.5 h-5 text-xs rounded-sm ${profile.status === 'running' ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-500' : 'text-muted-foreground border-border bg-muted/50'}`}>
                        {profile.status === 'running' ? '运行中' : '空闲'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <QuickEditCell value={profile.note} onSave={(val) => handleQuickEdit(profile.id, 'remark', val)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span>{profile.createTime?.split(' ')[0]}</span>
                        <span>{profile.createTime?.split(' ')[1]}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-4 sticky right-0 bg-background group-hover:bg-muted/50 shadow-[-1px_0_0_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end">
                        <ButtonGroup className="shadow-none rounded-md">
                          {profile.status === 'running' ? (
                            <Button size="sm" onClick={() => handleStop(profile.id)} className="h-7 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-none px-3 text-xs font-normal border border-transparent">
                              关闭
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => handleStart(profile.id)} className="h-7 bg-primary hover:bg-primary/90 text-primary-foreground shadow-none px-3 text-xs font-normal border border-transparent">
                              打开
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" className={`h-7 text-white shadow-none px-1 border border-transparent ${profile.status === 'running' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                                <RiMore2Fill className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 text-sm text-foreground font-normal">
                              <DropdownMenuItem className="py-2" onSelect={() => window.location.href = `/create?id=${profile.id}`}><RiEditLine className="mr-2 h-4 w-4" /> 编辑</DropdownMenuItem>
                              <DropdownMenuItem className="py-2 text-destructive focus:text-destructive" onSelect={() => handleDelete(profile.id)}><RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </ButtonGroup>
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
