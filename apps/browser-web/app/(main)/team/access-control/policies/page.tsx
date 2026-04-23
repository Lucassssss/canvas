"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiShieldKeyholeLine, RiMore2Fill, RiDeleteBinLine } from "@remixicon/react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

const policySchema = z.object({
  name: z.string().min(1, "策略名称不能为空"),
  type: z.enum(["whitelist", "blacklist"]),
  targetsText: z.string().min(1, "请至少输入一条网址规则"),
  appliedTo: z.string().min(1, "请选择应用范围"),
})

export default function PoliciesPage() {
  const [policies, setPolicies] = React.useState<any[]>([])
  const [roles, setRoles] = React.useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof policySchema>>({
    resolver: zodResolver(policySchema),
    defaultValues: { name: "", type: "blacklist", targetsText: "", appliedTo: "all" },
  })

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [polRes, roleRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/policies`).then(v => v.json()),
        fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/roles`).then(v => v.json())
      ])
      if (polRes.success) setPolicies(polRes.data)
      if (roleRes.success) setRoles(roleRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const onSubmit = async (values: z.infer<typeof policySchema>) => {
    setIsSubmitting(true)
    try {
      const targetsArray = values.targetsText.split("\n").map(s => s.trim()).filter(Boolean)
      const appliedToArray = values.appliedTo === "all" ? ["all"] : [values.appliedTo]

      const payload = {
        name: values.name,
        type: values.type,
        targets: JSON.stringify(targetsArray),
        appliedTo: JSON.stringify(appliedToArray)
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/policies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setIsDialogOpen(false)
        form.reset()
        fetchData()
      } else {
        alert("创建失败: " + data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Not implemented in backend standard routes yet, but keeping structure for future
  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此策略吗？")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/team/policies/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (err) { console.error(err) }
  }

  return (
    <>
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 text-foreground">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">网页访问策略</h2>
            <p className="text-sm text-muted-foreground">配置成员在系统浏览器中允许或禁止访问的网址规则。</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                      <Label className="text-muted-foreground pt-2">策略名称</Label>
                      <div className="col-span-3 text-left">
                        <FormControl><Input className="border-input shadow-none h-9" placeholder="例如：禁止访问社交媒体" {...field} /></FormControl>
                        <FormMessage className="mt-1 text-xs" />
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                      <Label className="text-muted-foreground pt-2">管控模式</Label>
                      <div className="col-span-3 text-left">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-input bg-background shadow-none h-9">
                              <SelectValue placeholder="选择模式" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="whitelist">白名单 (仅允许访问列表中的网址)</SelectItem>
                            <SelectItem value="blacklist">黑名单 (禁止访问列表中的网址)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="targetsText" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 gap-4 space-y-0 text-right mt-2">
                      <Label className="text-muted-foreground pt-2">网址规则</Label>
                      <div className="col-span-3 text-left">
                        <FormControl>
                          <textarea 
                            className="w-full h-24 p-3 text-sm bg-muted/20 border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="每行输入一个域名，例如：&#10;*.tiktok.com&#10;youtube.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="mt-1 text-xs" />
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="appliedTo" render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                      <Label className="text-muted-foreground pt-2">应用成员</Label>
                      <div className="col-span-3 text-left">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-input bg-background shadow-none h-9">
                              <SelectValue placeholder="选择应用的成员或角色" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">全体成员</SelectItem>
                            {roles.map(r => <SelectItem key={r.id} value={r.id}>所有 [{r.name}] 角色</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )} />

                  <DialogFooter className="pt-2">
                    <Button type="button" onClick={() => setIsDialogOpen(false)} variant="outline" className="border-input shadow-none h-9">取消</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">{isSubmitting ? "..." : "保存策略"}</Button>
                  </DialogFooter>
                </form>
              </Form>
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
                  <TableHead className="font-normal text-muted-foreground">创建时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">加载中...</TableCell></TableRow>
                ) : policies.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">暂无访问策略</TableCell></TableRow>
                ) : policies.map(pol => {
                  let targetsArray = []
                  try { targetsArray = typeof pol.targets === 'string' ? JSON.parse(pol.targets) : pol.targets } catch(e) {}
                  return (
                    <TableRow key={pol.id} className="group hover:bg-muted/50 border-b border-border/60 h-16">
                      <TableCell className="pl-6 text-muted-foreground font-mono text-xs">{pol.id.split('_')[1] || pol.id.substring(0, 4)}</TableCell>
                      <TableCell className="text-foreground text-sm font-medium">{pol.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-normal border-input bg-muted/20 ${pol.type === 'whitelist' ? 'text-green-500' : 'text-destructive'}`}>
                          {pol.type === 'whitelist' ? '白名单' : '黑名单'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {targetsArray.map((target: string) => (
                            <span key={target} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">{target}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{pol.createdAt?.replace('T', ' ').split('.')[0]}</TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                              <RiMore2Fill className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 border-border bg-card">
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(pol.id)}>
                              <RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除
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
    </>
  )
}
