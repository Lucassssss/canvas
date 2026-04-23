"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RiSearchLine, RiAddLine, RiSettings4Line, RiMore2Fill, RiDeleteBinLine, RiEditLine } from "@remixicon/react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export default function MembersPage() {
  const [activeRole, setActiveRole] = React.useState("all")
  
  const roles = [
    { id: "r_1", name: "Boss", type: "system" },
    { id: "r_2", name: "主管", type: "custom" },
    { id: "r_3", name: "成员", type: "custom" },
  ]

  const members = [
    { id: "u_1", name: "Admin Boss", username: "admin", role: "Boss", status: "Active", joinedAt: "2023-01-01" },
    { id: "u_2", name: "Zhang San", username: "zhangsan", role: "主管", status: "Active", joinedAt: "2023-05-15" },
    { id: "u_3", name: "Li Si", username: "lisi", role: "成员", status: "Active", joinedAt: "2023-10-20" },
  ]

  return (
    <>
      <PageHeader breadcrumb={[{ label: "团队管理" }, { label: "成员管理" }]} />
      <div className="flex flex-1 overflow-hidden bg-background">
        
        {/* Left Side: Role List */}
        <div className="w-64 border-r border-border bg-muted/10 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">角色列表</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary hover:bg-primary/10">
                  <RiAddLine className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] border-border bg-card">
                <DialogHeader>
                  <DialogTitle>新增角色</DialogTitle>
                  <DialogDescription>创建新的自定义角色并分配权限。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">角色名称</Label>
                    <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：财务专员" />
                  </div>
                  
                  <div className="h-px bg-border my-2"></div>
                  
                  <div className="flex flex-col gap-3">
                    <Label className="text-foreground font-medium mb-1">权限配置</Label>
                    
                    {/* Permission Tree */}
                    <div className="border border-border rounded-md divide-y divide-border text-sm">
                      {/* Env Group */}
                      <div className="flex flex-col sm:flex-row p-3 gap-3">
                        <div className="w-28 font-medium flex items-center gap-2">
                          <Checkbox id="p_env" />
                          <Label htmlFor="p_env" className="cursor-pointer">环境管理</Label>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1.5"><Checkbox id="p_env_1" /><Label htmlFor="p_env_1" className="text-muted-foreground cursor-pointer font-normal">查看列表</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_env_2" /><Label htmlFor="p_env_2" className="text-muted-foreground cursor-pointer font-normal">创建环境</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_env_3" /><Label htmlFor="p_env_3" className="text-muted-foreground cursor-pointer font-normal">编辑环境</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_env_4" /><Label htmlFor="p_env_4" className="text-muted-foreground cursor-pointer font-normal">删除环境</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_env_5" /><Label htmlFor="p_env_5" className="text-muted-foreground cursor-pointer font-normal">转移授权</Label></div>
                        </div>
                      </div>

                      {/* Apps Group */}
                      <div className="flex flex-col sm:flex-row p-3 gap-3">
                        <div className="w-28 font-medium flex items-center gap-2">
                          <Checkbox id="p_app" />
                          <Label htmlFor="p_app" className="cursor-pointer">应用与分组</Label>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1.5"><Checkbox id="p_app_1" /><Label htmlFor="p_app_1" className="text-muted-foreground cursor-pointer font-normal">分组管理</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_app_2" /><Label htmlFor="p_app_2" className="text-muted-foreground cursor-pointer font-normal">应用中心</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_app_3" /><Label htmlFor="p_app_3" className="text-muted-foreground cursor-pointer font-normal">回收站</Label></div>
                        </div>
                      </div>

                      {/* Automation Group */}
                      <div className="flex flex-col sm:flex-row p-3 gap-3">
                        <div className="w-28 font-medium flex items-center gap-2">
                          <Checkbox id="p_auto" />
                          <Label htmlFor="p_auto" className="cursor-pointer">自动化</Label>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1.5"><Checkbox id="p_auto_1" /><Label htmlFor="p_auto_1" className="text-muted-foreground cursor-pointer font-normal">使用窗口同步</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_auto_2" /><Label htmlFor="p_auto_2" className="text-muted-foreground cursor-pointer font-normal">RPA 运行</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_auto_3" /><Label htmlFor="p_auto_3" className="text-muted-foreground cursor-pointer font-normal">RPA 脚本编辑</Label></div>
                        </div>
                      </div>

                      {/* Team Group */}
                      <div className="flex flex-col sm:flex-row p-3 gap-3">
                        <div className="w-28 font-medium flex items-center gap-2">
                          <Checkbox id="p_team" />
                          <Label htmlFor="p_team" className="cursor-pointer">团队管理</Label>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1.5"><Checkbox id="p_team_1" /><Label htmlFor="p_team_1" className="text-muted-foreground cursor-pointer font-normal">成员配置</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_team_2" /><Label htmlFor="p_team_2" className="text-muted-foreground cursor-pointer font-normal">访问控制</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_team_3" /><Label htmlFor="p_team_3" className="text-muted-foreground cursor-pointer font-normal">操作日志查看</Label></div>
                          <div className="flex items-center gap-1.5"><Checkbox id="p_team_4" /><Label htmlFor="p_team_4" className="text-muted-foreground cursor-pointer font-normal">费用与账单</Label></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">保存角色</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div 
              className={`px-3 py-2 text-sm rounded-md font-medium cursor-pointer flex items-center justify-between group ${activeRole === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
              onClick={() => setActiveRole('all')}
            >
              <span>全部成员</span>
            </div>
            
            <div className="h-4"></div>
            <div className="px-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">系统角色</div>
            {roles.map(role => (
              <div 
                key={role.id}
                className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center justify-between group ${activeRole === role.id ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted/50'}`}
                onClick={() => setActiveRole(role.id)}
              >
                <span>{role.name}</span>
                {role.type === "custom" && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                     <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-primary"><RiSettings4Line className="h-3.5 w-3.5" /></Button>
                     <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"><RiDeleteBinLine className="h-3.5 w-3.5" /></Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Members List */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md w-full">
              <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索成员姓名或用户名"
                className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
                  <RiAddLine className="mr-1 h-4 w-4" /> 新增成员
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-border bg-card">
                <DialogHeader>
                  <DialogTitle>新增团队成员</DialogTitle>
                  <DialogDescription>通过账号密码的形式直接为成员开通访问权限。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">所属角色</Label>
                    <Select defaultValue="r_3">
                      <SelectTrigger className="col-span-3 border-input bg-background shadow-none h-9">
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="r_2">主管</SelectItem>
                        <SelectItem value="r_3">成员</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">真实姓名</Label>
                    <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：李四" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">登录用户名</Label>
                    <Input className="col-span-3 border-input shadow-none h-9" placeholder="例如：lisi888" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">手机号码</Label>
                    <Input className="col-span-3 border-input shadow-none h-9" placeholder="用于找回密码" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">初始密码</Label>
                    <Input type="password" className="col-span-3 border-input shadow-none h-9" placeholder="设置初始登录密码" />
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">环境分组</Label>
                    <Select>
                      <SelectTrigger className="col-span-3 border-input bg-background shadow-none h-9">
                        <SelectValue placeholder="选择可操作的环境分组" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g_1">全部环境</SelectItem>
                        <SelectItem value="g_2">TikTok 东南亚小店</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">浏览器限额</Label>
                    <div className="col-span-3 flex items-center gap-2">
                       <Input type="number" defaultValue={50} className="border-input shadow-none h-9 w-24" />
                       <span className="text-sm text-muted-foreground">个 (填 0 表示不限制)</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">确认新增</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>

          <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            <div className="overflow-auto flex-1">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                  <TableRow className="hover:bg-transparent border-0 h-12">
                    <TableHead className="pl-6 font-normal text-muted-foreground">成员信息</TableHead>
                    <TableHead className="font-normal text-muted-foreground">系统角色</TableHead>
                    <TableHead className="font-normal text-muted-foreground">状态</TableHead>
                    <TableHead className="font-normal text-muted-foreground">加入时间</TableHead>
                    <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map(member => (
                    <TableRow key={member.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium text-sm">{member.name}</span>
                          <span className="text-muted-foreground text-xs">@{member.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal border-input text-foreground bg-muted/20">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs flex items-center gap-1.5 ${member.status === 'Active' ? 'text-green-500' : 'text-amber-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          {member.status === 'Active' ? '正常访问' : '已禁用'}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{member.joinedAt}</TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                              <RiMore2Fill className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 border-border bg-card">
                            <DropdownMenuItem><RiEditLine className="mr-2 h-4 w-4" /> 编辑信息</DropdownMenuItem>
                            {member.role !== "Boss" && (
                              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><RiDeleteBinLine className="mr-2 h-4 w-4" /> 移除成员</DropdownMenuItem>
                            )}
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

      </div>
    </>
  )
}
