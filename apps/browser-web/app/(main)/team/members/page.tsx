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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const roleSchema = z.object({
  name: z.string().min(1, "角色名称不能为空"),
})

const memberSchema = z.object({
  name: z.string().min(1, "真实姓名不能为空"),
  username: z.string().min(3, "用户名至少3个字符"),
  phone: z.string().optional(),
  password: z.string().min(6, "初始密码至少6位"),
  roleId: z.string().min(1, "请选择角色"),
  groupId: z.string().optional(),
  browserLimit: z.number().min(0).default(0),
})

export default function MembersPage() {
  const [activeRole, setActiveRole] = React.useState("all")
  
  const [roles, setRoles] = React.useState<any[]>([])
  const [members, setMembers] = React.useState<any[]>([])
  const [groups, setGroups] = React.useState<any[]>([])
  
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false)
  const [isMemberDialogOpen, setIsMemberDialogOpen] = React.useState(false)
  
  const [selectedPerms, setSelectedPerms] = React.useState<string[]>([])
  const [memberSearch, setMemberSearch] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const roleForm = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "" },
  })

  const memberForm = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: "", username: "", phone: "", password: "", roleId: "", groupId: "all", browserLimit: 0 },
  })

  const fetchData = React.useCallback(async () => {
    try {
      const [rRes, mRes, gRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/roles`).then(v => v.json()),
        fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/members`).then(v => v.json()),
        fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/groups`).then(v => v.json()),
      ])
      if (rRes.success) setRoles(rRes.data)
      if (mRes.success) setMembers(mRes.data)
      if (gRes.success) setGroups(gRes.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const onRoleSubmit = async (values: z.infer<typeof roleSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, permissions: JSON.stringify(selectedPerms) })
      })
      const data = await res.json()
      if (data.success) {
        setIsRoleDialogOpen(false)
        roleForm.reset()
        setSelectedPerms([])
        fetchData()
      } else alert(data.error)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onMemberSubmit = async (values: z.infer<typeof memberSchema>) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        accessibleGroups: JSON.stringify(values.groupId === "all" ? [] : [values.groupId])
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setIsMemberDialogOpen(false)
        memberForm.reset()
        fetchData()
      } else alert(data.error)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm("确认删除此成员？")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/members/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (err) { console.error(err) }
  }

  const handleDeleteRole = async (id: string) => {
    if (!confirm("确认删除此角色？")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/roles/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (err) { console.error(err) }
  }

  const togglePerm = (id: string) => {
    setSelectedPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const filteredMembers = members.filter(m => {
    const matchRole = activeRole === "all" || m.roleId === activeRole
    const matchSearch = m.name.includes(memberSearch) || m.username.includes(memberSearch)
    return matchRole && matchSearch
  })

  // Perm maps for UI
  const permList = [
    { title: "环境管理", id: "p_env", items: [{ i: "p_env_1", n: "查看列表" }, { i: "p_env_2", n: "创建环境" }, { i: "p_env_3", n: "编辑环境" }, { i: "p_env_4", n: "删除环境" }] },
    { title: "应用与分组", id: "p_app", items: [{ i: "p_app_1", n: "分组管理" }, { i: "p_app_2", n: "应用中心" }] },
    { title: "团队管理", id: "p_team", items: [{ i: "p_team_1", n: "成员配置" }, { i: "p_team_2", n: "访问控制" }, { i: "p_team_3", n: "操作日志" }] },
  ]

  return (
    <>
      <PageHeader breadcrumb={[{ label: "团队管理" }, { label: "成员管理" }]} />
      <div className="flex flex-1 overflow-hidden bg-background border-t border-border">
        
        {/* Left Side: Role List */}
        <div className="w-64 border-r border-border bg-muted/10 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">角色列表</span>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
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
                <Form {...roleForm}>
                  <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={roleForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                          <Label className="text-muted-foreground w-full text-right">角色名称</Label>
                          <div className="col-span-3 text-left">
                             <FormControl>
                               <Input className="border-input shadow-none h-9" placeholder="例如：财务专员" {...field} />
                             </FormControl>
                             <FormMessage className="mt-1 text-xs" />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex flex-col gap-3">
                      <Label className="text-foreground font-medium mb-1">权限配置</Label>
                      <div className="border border-border rounded-md divide-y divide-border text-sm">
                        {permList.map(group => (
                          <div key={group.id} className="flex flex-col sm:flex-row p-3 gap-3">
                            <div className="w-28 font-medium flex items-center gap-2">
                              <Label className="cursor-pointer">{group.title}</Label>
                            </div>
                            <div className="flex-1 flex flex-wrap gap-4 items-center">
                              {group.items.map(item => (
                                <div key={item.i} className="flex items-center gap-1.5">
                                  <Checkbox id={item.i} checked={selectedPerms.includes(item.i)} onCheckedChange={() => togglePerm(item.i)} />
                                  <Label htmlFor={item.i} className="text-muted-foreground cursor-pointer font-normal">{item.n}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter className="pt-2">
                      <Button type="button" onClick={() => setIsRoleDialogOpen(false)} variant="outline" className="border-input shadow-none h-9">取消</Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">{isSubmitting ? "..." : "保存角色"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
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
                     <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }} className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"><RiDeleteBinLine className="h-3.5 w-3.5" /></Button>
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
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            
            <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
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
                <Form {...memberForm}>
                  <form onSubmit={memberForm.handleSubmit(onMemberSubmit)} className="space-y-4 py-4">
                    <FormField control={memberForm.control} name="roleId" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">所属角色</Label>
                        <div className="col-span-3 text-left">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-input bg-background shadow-none h-9">
                                <SelectValue placeholder="选择角色" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="mt-1 text-xs" />
                        </div>
                      </FormItem>
                    )} />
                    
                    <FormField control={memberForm.control} name="name" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">真实姓名</Label>
                        <div className="col-span-3 text-left">
                          <FormControl><Input className="border-input shadow-none h-9" placeholder="例如：李四" {...field} /></FormControl>
                          <FormMessage className="mt-1 text-xs" />
                        </div>
                      </FormItem>
                    )} />

                    <FormField control={memberForm.control} name="username" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">登录用户名</Label>
                        <div className="col-span-3 text-left">
                          <FormControl><Input className="border-input shadow-none h-9" placeholder="例如：lisi888" {...field} /></FormControl>
                          <FormMessage className="mt-1 text-xs" />
                        </div>
                      </FormItem>
                    )} />

                    <FormField control={memberForm.control} name="phone" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">手机号码</Label>
                        <div className="col-span-3 text-left">
                          <FormControl><Input className="border-input shadow-none h-9" placeholder="用于找回密码" {...field} /></FormControl>
                        </div>
                      </FormItem>
                    )} />

                    <FormField control={memberForm.control} name="password" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">初始密码</Label>
                        <div className="col-span-3 text-left">
                          <FormControl><Input type="password" className="border-input shadow-none h-9" placeholder="设置初始登录密码" {...field} /></FormControl>
                          <FormMessage className="mt-1 text-xs" />
                        </div>
                      </FormItem>
                    )} />

                    <div className="h-px bg-border my-2"></div>

                    <FormField control={memberForm.control} name="groupId" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">环境分组</Label>
                        <div className="col-span-3 text-left">
                          <Select onValueChange={field.onChange} defaultValue={field.value || "all"}>
                            <FormControl>
                              <SelectTrigger className="border-input bg-background shadow-none h-9">
                                <SelectValue placeholder="选择可操作的环境分组" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">全部环境</SelectItem>
                              {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormItem>
                    )} />

                    <FormField control={memberForm.control} name="browserLimit" render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">浏览器限额</Label>
                        <div className="col-span-3 text-left flex items-center gap-2">
                          <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="border-input shadow-none h-9 w-24" /></FormControl>
                          <span className="text-sm text-muted-foreground">个 (填 0 表示不限制)</span>
                        </div>
                      </FormItem>
                    )} />

                    <DialogFooter className="pt-2">
                      <Button type="button" onClick={() => setIsMemberDialogOpen(false)} variant="outline" className="border-input shadow-none h-9">取消</Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">{isSubmitting ? "..." : "确认新增"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
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
                  {filteredMembers.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">暂无成员</TableCell></TableRow>
                  ) : filteredMembers.map(member => {
                    const roleName = roles.find(r => r.id === member.roleId)?.name || "未知"
                    return (
                      <TableRow key={member.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                        <TableCell className="pl-6">
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium text-sm">{member.name}</span>
                            <span className="text-muted-foreground text-xs">@{member.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal border-input text-foreground bg-muted/20">
                            {roleName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs flex items-center gap-1.5 ${member.status === 'active' ? 'text-green-500' : 'text-amber-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            {member.status === 'active' ? '正常访问' : '已禁用'}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{member.createdAt?.replace('T', ' ').split('.')[0]}</TableCell>
                        <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                                <RiMore2Fill className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 border-border bg-card">
                              <DropdownMenuItem><RiEditLine className="mr-2 h-4 w-4" /> 编辑信息</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMember(member.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <RiDeleteBinLine className="mr-2 h-4 w-4" /> 移除成员
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
