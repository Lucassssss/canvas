"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  RiSearchLine,
  RiAddLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiMapPinLine,
  RiEditLine,
  RiWifiLine,
} from "@remixicon/react"
import { useRouter } from "next/navigation"

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [testingId, setTestingId] = React.useState<string | null>(null)

  const fetchDevices = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices`)
      const data = await res.json()
      if (data.success) {
        setDevices(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除此设备吗？")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchDevices()
    } catch (err) {
      console.error(err)
    }
  }

  const handleQuickTest = async (device: any) => {
    setTestingId(device.id)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: device.type, host: device.host, port: device.port, username: device.username, password: device.password })
      })
      const data = await res.json()
      if (data.success) {
        // Update device in DB
        const testRes = data.data;
        const updatePayload = {
          ip: testRes.query || "",
          ipLoc: `${testRes.country}/${testRes.city}`,
          timezone: testRes.timezone || "",
          country: testRes.country || "",
          city: testRes.city || "",
          lat: testRes.lat?.toString() || "",
          lon: testRes.lon?.toString() || ""
        }
        await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/api/devices/${device.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload)
        });
        alert(`测试成功！最新 IP: ${updatePayload.ip}`);
        fetchDevices();
      } else {
        alert("测试失败：" + data.error)
      }
    } catch (err) {
      alert("测试异常：" + err)
    } finally {
      setTestingId(null)
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
                <BreadcrumbPage className="text-foreground">设备管理</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索设备 ID 或 IP"
              className="pl-8 h-8 text-sm bg-background border-input shadow-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Button size="sm" onClick={() => router.push("/devices/create")} className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-none font-normal">
            <RiAddLine className="mr-1 h-4 w-4" /> 添加设备
          </Button>
        </div>

        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-input" /></TableHead>
                  <TableHead className="w-24 font-normal text-muted-foreground">ID</TableHead>
                  <TableHead className="font-normal text-muted-foreground">提供商</TableHead>
                  <TableHead className="font-normal text-muted-foreground">协议</TableHead>
                  <TableHead className="font-normal text-muted-foreground">主机 / IP</TableHead>
                  <TableHead className="font-normal text-muted-foreground">归属地</TableHead>
                  <TableHead className="font-normal text-muted-foreground text-center">关联环境</TableHead>
                  <TableHead className="font-normal text-muted-foreground">过期时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">加载中...</TableCell></TableRow>
                ) : devices.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-16 text-muted-foreground text-sm">暂无设备，请点击右上角添加。</TableCell></TableRow>
                ) : devices.map((dev) => (
                  <TableRow key={dev.id} className="group hover:bg-muted/50 border-b border-border/60 h-14">
                    <TableCell className="text-center pl-4"><Checkbox className="border-input" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">{dev.id}</TableCell>
                    <TableCell className="text-foreground text-sm capitalize">{dev.provider}</TableCell>
                    <TableCell className="text-foreground text-sm uppercase">{dev.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="text-foreground">{dev.host ? `${dev.host}:${dev.port}` : '-'}</span>
                        <span className="text-xs text-muted-foreground">{dev.ip || '未解析'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        {dev.ipLoc ? (
                          <>
                            <RiMapPinLine className="h-3.5 w-3.5 text-muted-foreground" />
                            {dev.ipLoc}
                          </>
                        ) : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {dev.associatedCount} 个环境
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {dev.expireAt ? new Date(dev.expireAt).toLocaleDateString() : '永久'}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => handleQuickTest(dev)} disabled={testingId === dev.id} variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20" title="快捷测试连通性">
                          {testingId === dev.id ? <span className="animate-spin text-xs">...</span> : <RiWifiLine className="h-4 w-4" />}
                        </Button>
                        <Button onClick={() => router.push(`/devices/create?id=${dev.id}`)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary hover:text-primary/90 hover:bg-primary/10" title="编辑设备">
                          <RiEditLine className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(dev.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10" title="删除设备">
                          <RiDeleteBinLine className="h-4 w-4" />
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
