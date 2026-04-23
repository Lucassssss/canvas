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
                <BreadcrumbPage className="text-neutral-900">设备管理</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-[#f6f9fc]">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <RiSearchLine className="absolute left-2.5 top-2 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="搜索设备 ID 或 IP"
              className="pl-8 h-8 text-sm bg-white border-neutral-200 shadow-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
          <Button size="sm" onClick={() => router.push("/devices/create")} className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4 shadow-none font-normal">
            <RiAddLine className="mr-1 h-4 w-4" /> 添加设备
          </Button>
        </div>

        <div className="flex-1 flex flex-col border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-sm">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-neutral-50/80 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-100">
                <TableRow className="hover:bg-transparent border-0 h-12">
                  <TableHead className="w-12 text-center pl-4"><Checkbox className="border-neutral-300" /></TableHead>
                  <TableHead className="w-24 font-normal text-neutral-400">ID</TableHead>
                  <TableHead className="font-normal text-neutral-400">提供商</TableHead>
                  <TableHead className="font-normal text-neutral-400">协议</TableHead>
                  <TableHead className="font-normal text-neutral-400">主机 / IP</TableHead>
                  <TableHead className="font-normal text-neutral-400">归属地</TableHead>
                  <TableHead className="font-normal text-neutral-400 text-center">关联环境</TableHead>
                  <TableHead className="font-normal text-neutral-400">过期时间</TableHead>
                  <TableHead className="text-right font-normal pr-6 text-neutral-400">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow><TableCell colSpan={9} className="text-center py-8 text-neutral-500">加载中...</TableCell></TableRow>
                ) : devices.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-16 text-neutral-400 text-sm">暂无设备，请点击右上角添加。</TableCell></TableRow>
                ) : devices.map((dev) => (
                  <TableRow key={dev.id} className="group hover:bg-[#f6f9fc] border-b border-neutral-100/60 h-14">
                    <TableCell className="text-center pl-4"><Checkbox className="border-neutral-300" /></TableCell>
                    <TableCell className="text-neutral-500 text-xs font-mono">{dev.id}</TableCell>
                    <TableCell className="text-neutral-600 text-sm capitalize">{dev.provider}</TableCell>
                    <TableCell className="text-neutral-600 text-sm uppercase">{dev.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="text-neutral-800">{dev.host ? `${dev.host}:${dev.port}` : '-'}</span>
                        <span className="text-xs text-neutral-400">{dev.ip || '未解析'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                        {dev.ipLoc ? (
                          <>
                            <RiMapPinLine className="h-3.5 w-3.5 text-neutral-400" />
                            {dev.ipLoc}
                          </>
                        ) : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {dev.associatedCount} 个环境
                      </span>
                    </TableCell>
                    <TableCell className="text-neutral-500 text-sm">
                      {dev.expireAt ? new Date(dev.expireAt).toLocaleDateString() : '永久'}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => handleQuickTest(dev)} disabled={testingId === dev.id} variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" title="快捷测试连通性">
                          {testingId === dev.id ? <span className="animate-spin text-xs">...</span> : <RiWifiLine className="h-4 w-4" />}
                        </Button>
                        <Button onClick={() => router.push(`/devices/create?id=${dev.id}`)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="编辑设备">
                          <RiEditLine className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(dev.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" title="删除设备">
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
