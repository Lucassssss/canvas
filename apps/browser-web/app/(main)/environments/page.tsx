"use client"

import { useEffect, useState, useRef } from "react"
import { cloudFetch } from "@/lib/api"
import { toast } from "sonner"
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
  RiCloseCircleLine, RiCheckLine, RiLoader4Line,
  RiFacebookCircleFill, RiGoogleFill, RiPinterestFill, RiTwitterXFill, RiStore2Line, RiGlobalLine, RiAddLine, RiLayoutGridLine
} from "@remixicon/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const GroupSelectCell = ({ value, groupId, groups, onSave }: { value: string; groupId: string; groups: any[]; onSave: (newVal: string) => void }) => {
  const [editing, setEditing] = useState(false);
  
  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Select 
          defaultOpen 
          value={groupId || "default"}
          onValueChange={(val) => {
            onSave(val);
            setEditing(false);
          }}
          onOpenChange={(open) => {
            if (!open) setEditing(false);
          }}
        >
          <SelectTrigger className="h-6 text-sm px-2 py-0 w-28 border-input bg-background shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认分组</SelectItem>
            {groups.map(g => (
              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={() => setEditing(true)}>
      <span className="text-sm text-foreground min-w-4 min-h-4">{value || "-"}</span>
      <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover/edit:opacity-100" />
    </div>
  )
}

export default function EnvironmentsPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingState, setStartingState] = useState<Record<string, 'checking' | 'starting'>>({});

  // Selection and filtering state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroupId, setFilterGroupId] = useState("all");
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    // Fetch groups
    const loadGroups = async () => {
      try {
        const res = await cloudFetch(`/api/groups`);
        const data = await res.json();
        if (data.success) {
          setGroups(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    loadGroups();
  }, []);

  const getPlatformDisplay = (platform: string) => {
    switch (platform) {
      case 'fb': return <><RiFacebookCircleFill className="w-4 h-4 text-blue-600" /> <span>Facebook</span></>;
      case 'amz': return <><RiAmazonFill className="w-4 h-4 text-orange-500" /> <span>Amazon</span></>;
      case 'tk': return <><RiTiktokFill className="w-4 h-4 text-foreground" /> <span>TikTok</span></>;
      case 'paypal': return <><RiPaypalFill className="w-4 h-4 text-blue-800" /> <span>PayPal</span></>;
      case 'google': return <><RiGoogleFill className="w-4 h-4 text-red-500" /> <span>Google</span></>;
      case 'pinterest': return <><RiPinterestFill className="w-4 h-4 text-red-600" /> <span>Pinterest</span></>;
      case 'x': return <><RiTwitterXFill className="w-4 h-4 text-foreground" /> <span>X (Twitter)</span></>;
      case 'shopee': return <><RiStore2Line className="w-4 h-4 text-orange-600" /> <span>Shopee</span></>;
      case 'lazada': return <><RiStore2Line className="w-4 h-4 text-blue-500" /> <span>Lazada</span></>;
      case 'etsy': return <><RiStore2Line className="w-4 h-4 text-orange-400" /> <span>Etsy</span></>;
      case 'ebay': return <><RiStore2Line className="w-4 h-4 text-blue-600" /> <span>eBay</span></>;
      case 'aliexpress': return <><RiStore2Line className="w-4 h-4 text-red-600" /> <span>AliExpress</span></>;
      default: return <><RiGlobalLine className="w-4 h-4 text-muted-foreground" /> <span className="text-muted-foreground">-</span></>;
    }
  }

  const fetchEnvironments = async () => {
    try {
      const res = await cloudFetch(`/api/environments`, { cache: "no-store" });
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
                cloudFetch(`/api/environments/${e.id}/stop`, { method: "POST" })
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
        const res = await cloudFetch(`/api/environments/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) fetchEnvironments();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }, 10);
  }

  const handleStart = async (id: string) => {
    try {
      // 1. 确认代理位置
      setStartingState(prev => ({ ...prev, [id]: 'checking' }));
      await cloudFetch(`/api/environments/${id}/check-proxy`, { method: "POST" });

      // 2. 启动浏览器
      setStartingState(prev => ({ ...prev, [id]: 'starting' }));
      const res = await cloudFetch(`/api/environments/${id}/start`, { method: "POST" });
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
          toast.error("本地守护进程启动环境失败: " + daemonData.error);
        } else {
          toast.success("浏览器环境已启动");
        }
      } else {
        toast.error("云端下发启动配置失败: " + (data.error || "未知错误"));
      }
    } catch (error: any) {
      console.error("Start failed", error);
      toast.error("启动失败: " + (error.message || "无法连接到云端API"));
    } finally {
      setStartingState(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      fetchEnvironments();
    }
  }

  const handleStop = async (id: string) => {
    try {
      // Notify cloud
      await cloudFetch(`/api/environments/${id}/stop`, { method: "POST" });
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
      const res = await cloudFetch(`/api/environments/${id}`, {
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

  const handleStartSelected = async () => {
    if (selectedIds.size === 0) return;
    for (const id of Array.from(selectedIds)) {
      handleStart(id);
    }
  };

  const handleCloseSelected = async () => {
    if (selectedIds.size === 0) return;
    for (const id of Array.from(selectedIds)) {
      handleStop(id);
    }
  };

  const handleArrangeSelected = async () => {
    if (selectedIds.size === 0) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/arrange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          screenWidth: window.screen.availWidth,
          screenHeight: window.screen.availHeight
        })
      });
    } catch (error) {
      console.error("Arrange failed", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个环境吗？`)) return;
    try {
      await Promise.all(Array.from(selectedIds).map(id => 
        cloudFetch(`/api/environments/${id}`, { method: "DELETE" })
      ));
      setSelectedIds(new Set());
      fetchEnvironments();
    } catch (error) {
      console.error("Delete selected failed", error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredProfiles.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  const filteredProfiles = profiles.filter(p => {
    const matchGroup = filterGroupId === "all" || p.groupId === filterGroupId;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-muted-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4 data-vertical:self-center" />
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
          <Select value={filterGroupId} onValueChange={setFilterGroupId}>
            <SelectTrigger className="h-8 w-36 bg-background border-input shadow-none text-muted-foreground">
              <SelectValue placeholder="全部分组" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分组</SelectItem>
              <SelectItem value="default">默认分组</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索名称或ID"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <RiFilter3Line className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => window.location.href = '/create'} className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4 shadow-none font-normal">
            <RiAddLine className="mr-1 h-4 w-4" /> 新建环境
          </Button>
          <Button size="sm" onClick={handleStartSelected} variant="outline" className="h-8 text-foreground px-4 shadow-none font-normal" disabled={selectedIds.size === 0}>
            <RiPlayFill className="mr-1 h-4 w-4" /> 打开所选 ({selectedIds.size})
          </Button>
          <Button size="sm" onClick={handleCloseSelected} variant="outline" className="h-8 text-foreground px-4 shadow-none font-normal" disabled={selectedIds.size === 0}>
            <RiCloseCircleLine className="mr-1 h-4 w-4" /> 关闭所选
          </Button>
          <Button size="sm" onClick={handleArrangeSelected} variant="outline" className="h-8 text-foreground px-4 shadow-none font-normal" disabled={selectedIds.size === 0}>
            <RiLayoutGridLine className="mr-1 h-4 w-4" /> 自动排列
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 px-2 shadow-none" disabled={selectedIds.size === 0}>
                <RiMore2Fill className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDeleteSelected} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除所选
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Data Table Container */}
        <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4">
                    <Checkbox
                      className="border-input"
                      checked={filteredProfiles.length > 0 && selectedIds.size === filteredProfiles.length}
                      onCheckedChange={(c) => handleSelectAll(!!c)}
                    />
                  </TableHead>
                  <TableHead className="w-16 font-normal text-muted-foreground">序号</TableHead>
                  <TableHead className="font-normal text-muted-foreground w-24">编号/ID</TableHead>
                  <TableHead className="font-normal text-muted-foreground">分组</TableHead>
                  <TableHead className="font-normal text-muted-foreground">目标平台</TableHead>
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
                  <TableRow><TableCell colSpan={12} className="text-center py-8 text-muted-foreground">加载中...</TableCell></TableRow>
                ) : filteredProfiles.length === 0 ? (
                  <TableRow><TableCell colSpan={12} className="text-center py-8 text-muted-foreground">无符合条件的环境</TableCell></TableRow>
                ) : filteredProfiles.map((profile) => (
                  <TableRow key={profile.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                    <TableCell className="text-center pl-4">
                      <Checkbox
                        className="border-input"
                        checked={selectedIds.has(profile.id)}
                        onCheckedChange={(c) => toggleSelect(profile.id, !!c)}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{profile.index}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {profile.id}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <GroupSelectCell 
                        value={profile.group} 
                        groupId={profile.groupId}
                        groups={groups}
                        onSave={(val) => handleQuickEdit(profile.id, 'groupId', val)} 
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getPlatformDisplay(profile.platform)}
                      </div>
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
                      {startingState[profile.id] === 'checking' ? (
                        <Badge variant="outline" className="font-normal px-1.5 h-5 text-xs rounded-sm text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-500">
                          <RiLoader4Line className="mr-1 h-3 w-3 animate-spin inline-block" /> IP定位中...
                        </Badge>
                      ) : startingState[profile.id] === 'starting' ? (
                        <Badge variant="outline" className="font-normal px-1.5 h-5 text-xs rounded-sm text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-500">
                          <RiLoader4Line className="mr-1 h-3 w-3 animate-spin inline-block" /> 启动中...
                        </Badge>
                      ) : (
                        <Badge variant="outline" className={`font-normal px-1.5 h-5 text-xs rounded-sm ${profile.status === 'running' ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-500' : 'text-muted-foreground border-border bg-muted/50'}`}>
                          {profile.status === 'running' ? '运行中' : '空闲'}
                        </Badge>
                      )}
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
                          {startingState[profile.id] ? (
                            <Button size="sm" disabled className="h-7 bg-muted text-muted-foreground shadow-none px-3 text-xs font-normal border border-transparent">
                              <RiLoader4Line className="mr-1 h-3 w-3 animate-spin inline-block" /> {startingState[profile.id] === 'checking' ? 'IP定位中' : '启动中'}
                            </Button>
                          ) : profile.status === 'running' ? (
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
