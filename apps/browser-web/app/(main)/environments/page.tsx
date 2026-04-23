"use client"

import { useEffect, useState } from "react"
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
      <span className="text-sm text-neutral-700 min-w-4 min-h-4">{value || "-"}</span>
      <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover/edit:opacity-100" />
    </div>
  )
}

export default function EnvironmentsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnvironments = async () => {
    try {
      const res = await fetch("http://localhost:4005/api/environments", { cache: "no-store" });
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

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const handleDelete = (id: string) => {
    setTimeout(async () => {
      if (!confirm("确定要删除这个环境吗？")) return;
      try {
        const res = await fetch(`http://localhost:4005/api/environments/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) fetchEnvironments();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }, 10);
  }

  const handleStart = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4005/api/environments/${id}/start`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.cli_args) {
        // Forward cli_args to local daemon
        const daemonRes = await fetch("http://localhost:4001/api/start", {
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
      await fetch(`http://localhost:4005/api/environments/${id}/stop`, { method: "POST" });
      // Notify local daemon
      await fetch("http://localhost:4001/api/stop", {
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
      const res = await fetch(`http://localhost:4005/api/environments/${id}`, {
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
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-neutral-100 bg-white px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-neutral-500" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-neutral-500 hover:text-neutral-900">核心业务</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-neutral-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-neutral-900">环境管理</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Scrollable Main Content Area */}
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0">
        {/* Top Filter Bar */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 text-neutral-600 w-32 justify-between border-neutral-200">
            全部分组
            <span className="text-xs">▼</span>
          </Button>
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="搜索或新建搜索条件"
              className="pl-8 h-8 text-sm bg-white border-neutral-200 shadow-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
            <RiFilter3Line className="absolute right-2.5 top-2 h-4 w-4 text-neutral-400" />
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4 shadow-none font-normal">
            <RiPlayFill className="mr-1 h-4 w-4" /> 打开
          </Button>
        </div>

        {/* Data Table Container */}
        <div className="flex-1 flex flex-col border rounded-xl overflow-hidden">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-neutral-50/80 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-100">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-neutral-300" /></TableHead>
                  <TableHead className="w-16 font-normal text-neutral-400">序号</TableHead>
                  <TableHead className="font-normal text-neutral-400 w-24">编号/ID</TableHead>
                  <TableHead className="font-normal text-neutral-400">分组</TableHead>
                  <TableHead className="font-normal text-neutral-400">名称</TableHead>
                  <TableHead className="font-normal text-neutral-400">IP</TableHead>
                  <TableHead className="font-normal text-neutral-400">最近打开</TableHead>
                  <TableHead className="font-normal text-neutral-400">状态</TableHead>
                  <TableHead className="font-normal text-neutral-400">备注</TableHead>
                  <TableHead className="font-normal text-neutral-400">创建时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-neutral-400 sticky right-0 bg-neutral-50/80 shadow-[-1px_0_0_rgba(0,0,0,0.05)]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow><TableCell colSpan={11} className="text-center py-8 text-neutral-500">加载中...</TableCell></TableRow>
                ) : profiles.map((profile) => (
                  <TableRow key={profile.id} className="group hover:bg-[#f6f9fc] border-b border-neutral-100/60 h-16">
                    <TableCell className="text-center pl-4"><Checkbox className="border-neutral-300" /></TableCell>
                    <TableCell className="text-neutral-600 text-sm">{profile.index}</TableCell>
                    <TableCell className="text-neutral-500 text-xs font-mono">
                      {profile.id}
                    </TableCell>
                    <TableCell className="text-neutral-600 text-sm">
                      <QuickEditCell value={profile.group} onSave={(val) => handleQuickEdit(profile.id, 'group', val)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {profile.os === 'windows' ? <RiWindowsFill className="h-4 w-4 text-blue-500" /> : <RiAppleFill className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />}
                        <QuickEditCell value={profile.name} onSave={(val) => handleQuickEdit(profile.id, 'name', val)} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-3 bg-blue-100 text-blue-600 text-[9px] flex items-center justify-center font-normal rounded-sm">⇌</span>
                          <span className="text-sm text-neutral-800">{profile.ip || '-'}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{profile.ipLoc || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-neutral-400">
                        {profile.lastOpened ? (
                          <>
                            <span>{profile.lastOpened.split(' ')[0]}</span>
                            <span>{profile.lastOpened.split(' ')[1]}</span>
                          </>
                        ) : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal px-1.5 h-5 text-xs rounded-sm ${profile.status === 'running' ? 'text-green-600 border-green-200 bg-green-50' : 'text-neutral-600 border-neutral-200 bg-neutral-50'}`}>
                        {profile.status === 'running' ? '运行中' : '空闲'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <QuickEditCell value={profile.note} onSave={(val) => handleQuickEdit(profile.id, 'remark', val)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-neutral-400">
                        <span>{profile.createTime?.split(' ')[0]}</span>
                        <span>{profile.createTime?.split(' ')[1]}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-4 sticky right-0 bg-white group-hover:bg-[#f6f9fc] shadow-[-1px_0_0_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end">
                        <ButtonGroup className="shadow-none rounded-md">
                          {profile.status === 'running' ? (
                            <Button size="sm" onClick={() => handleStop(profile.id)} className="h-7 bg-red-600 hover:bg-red-700 text-white shadow-none px-3 text-xs font-normal border border-red-700/50">
                              关闭
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => handleStart(profile.id)} className="h-7 bg-blue-600 hover:bg-blue-700 text-white shadow-none px-3 text-xs font-normal border border-blue-700/50">
                              打开
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" className={`h-7 text-white shadow-none px-1 border ${profile.status === 'running' ? 'bg-red-600 hover:bg-red-700 border-red-700/50' : 'bg-blue-600 hover:bg-blue-700 border-blue-700/50'}`}>
                                <RiMore2Fill className="h-4 w-4 text-white/80" />
                              </Button>
                            </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 text-sm text-neutral-700 font-normal">
                                  <DropdownMenuItem className="py-2" onSelect={() => window.location.href = `/create?id=${profile.id}`}><RiEditLine className="mr-2 h-4 w-4" /> 编辑</DropdownMenuItem>
                                  <DropdownMenuItem className="py-2 text-red-600 focus:text-red-600" onSelect={() => handleDelete(profile.id)}><RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除</DropdownMenuItem>
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
