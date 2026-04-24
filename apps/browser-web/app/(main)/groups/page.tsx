"use client"
import * as React from "react"
import { cloudFetch } from "@/lib/api"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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

const formSchema = z.object({
  name: z.string().min(1, { message: "分组名称不能为空" }),
  desc: z.string().optional(),
})

export default function GroupsPage() {
  const [groups, setGroups] = React.useState<any[]>([])
  const [search, setSearch] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  })

  const fetchGroups = React.useCallback(async () => {
    try {
      const res = await cloudFetch(`/api/groups`)
      const data = await res.json()
      if (data.success) {
        setGroups(data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  React.useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await cloudFetch(`/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (data.success) {
        setIsDialogOpen(false)
        form.reset()
        fetchGroups()
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除此分组吗？(关联的环境将被保留在默认分组)")) return
    try {
      const res = await cloudFetch(`/api/groups/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchGroups()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <Button size="sm" onClick={() => setIsDialogOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
            <RiAddLine className="mr-1 h-4 w-4" /> 新建分组
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] border-border bg-card">
              <DialogHeader>
                <DialogTitle>新建环境分组</DialogTitle>
                <DialogDescription>创建分组以便更好地组织和管理浏览器环境。</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0 text-right">
                        <Label className="text-muted-foreground">分组名称</Label>
                        <div className="col-span-3 text-left">
                          <FormControl>
                            <Input className="border-input shadow-none h-9" placeholder="例如：TikTok 运营" {...field} />
                          </FormControl>
                          <FormMessage className="mt-1 text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-start gap-4 space-y-0 text-right mt-2">
                        <Label className="text-muted-foreground pt-2">分组描述</Label>
                        <div className="col-span-3 text-left">
                          <FormControl>
                            <textarea 
                              className="w-full h-20 p-3 text-sm bg-muted/20 border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="选填，记录分组用途"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-2">
                    <Button type="button" onClick={() => setIsDialogOpen(false)} variant="outline" className="border-input shadow-none h-9">取消</Button>
                    <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">{isLoading ? "提交中..." : "确定创建"}</Button>
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
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-input" /></TableHead>
                  <TableHead className="font-normal text-muted-foreground">分组名称</TableHead>
                  <TableHead className="font-normal text-muted-foreground">描述</TableHead>
                  <TableHead className="font-normal text-muted-foreground">创建时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">暂无分组</TableCell></TableRow>
                ) : filteredGroups.map(group => (
                  <TableRow key={group.id} className="group hover:bg-muted/50 border-b border-border/60 h-14">
                    <TableCell className="text-center pl-4"><Checkbox className="border-input" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <RiFolder2Line className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{group.desc || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{group.createdAt.replace('T', ' ').split('.')[0]}</TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                            <RiMore2Fill className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 border-border bg-card">
                          <DropdownMenuItem><RiEditLine className="mr-2 h-4 w-4" /> 编辑</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(group.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10"><RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除</DropdownMenuItem>
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
