
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  RiSearchLine,
  RiFilter3Line,
  RiMore2Fill,
  RiPlayFill,
  RiWindowsFill,
  RiAppleFill,
  RiEditLine,
  RiShareForwardLine,
  RiDeleteBinLine,
  RiDownload2Line,
  RiFileTransferLine,
  RiRobot2Line,
  RiSettings4Line,
  RiFileCopyLine,
  RiTiktokFill,
  RiAmazonFill,
  RiPaypalFill,
  RiCloseCircleLine
} from "@remixicon/react"

const UNIFIED_PROFILES = [
  {
    index: 1,
    id: "k1bljtx2",
    group: "未分组",
    name: "",
    os: "windows",
    ip: "141.11.130.85",
    ipLoc: "JP - 114",
    lastOpened: "04-22 23:35:23",
    platform: "tiktok",
    tags: ["测试"],
    note: "-",
    createTime: "04-17 23:15:45",
  },
  {
    index: 2,
    id: "m9zpqw1",
    group: "北美组",
    name: "Amazon 主力",
    os: "macos",
    ip: "45.12.33.19",
    ipLoc: "US - NY",
    lastOpened: "04-22 09:30:10",
    platform: "amazon",
    tags: ["高权重"],
    note: "不要改密码",
    createTime: "04-10 10:20:00",
  }
]

export default function EnvironmentsPage() {
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

          {/* Top Filter Bar (No container borders/shadows) */}
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
            <div className="flex items-center gap-2 ml-4">
              <Checkbox id="opened" className="border-neutral-300" />
              <label htmlFor="opened" className="text-sm text-blue-600 cursor-pointer">已打开 (0)</label>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white px-4 shadow-none font-normal">
              <RiPlayFill className="mr-1 h-4 w-4" /> 打开
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 font-normal">
              <RiRobot2Line className="mr-1 h-4 w-4" /> RPA Plus
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 shadow-none font-normal">
              启动同步
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 font-normal">
              <RiCloseCircleLine className="mr-1 h-4 w-4" /> 关闭
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 font-normal">
              <RiDownload2Line className="mr-1 h-4 w-4" /> 导出
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 font-normal">
              <RiFileTransferLine className="mr-1 h-4 w-4" /> 移动
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 font-normal">
              分享
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 px-2 font-normal">
              <RiDeleteBinLine className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-neutral-600 bg-white border-neutral-200 shadow-none hover:bg-neutral-50 px-2 font-normal">
              <RiMore2Fill className="h-4 w-4" />
            </Button>
          </div>

          {/* Data Table Container (No borders, no shadows) */}
          <div className="flex-1 flex flex-col border rounded-xl overflow-hidden">
            <div className="overflow-auto flex-1">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-neutral-50/80 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-100">
                  <TableRow className="hover:bg-transparent border-0 h-12">
                    <TableHead className="w-12 text-center pl-4"><Checkbox className="border-neutral-300" /></TableHead>
                    <TableHead className="w-16 font-normal text-neutral-400">序号 <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 opacity-50"><path d="M5 1L9 5H1L5 1Z" /><path d="M5 11L1 7H9L5 11Z" /></svg></TableHead>
                    <TableHead className="font-normal text-neutral-400">编号/ID <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 opacity-50"><path d="M5 1L9 5H1L5 1Z" /><path d="M5 11L1 7H9L5 11Z" /></svg></TableHead>
                    <TableHead className="font-normal text-neutral-400">分组</TableHead>
                    <TableHead className="font-normal text-neutral-400">名称 <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 opacity-50"><path d="M5 1L9 5H1L5 1Z" /><path d="M5 11L1 7H9L5 11Z" /></svg></TableHead>
                    <TableHead className="font-normal min-w-[180px]">IP</TableHead>
                    <TableHead className="font-normal text-neutral-400">最近打开 <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 opacity-50"><path d="M5 1L9 5H1L5 1Z" /><path d="M5 11L1 7H9L5 11Z" /></svg></TableHead>
                    <TableHead className="font-normal text-neutral-400">账号平台</TableHead>
                    <TableHead className="font-normal text-neutral-400">标签</TableHead>
                    <TableHead className="font-normal text-neutral-400">备注 <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 opacity-50"><path d="M5 1L9 5H1L5 1Z" /><path d="M5 11L1 7H9L5 11Z" /></svg></TableHead>
                    <TableHead className="font-normal text-neutral-400">创建时间 <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-0.5 opacity-50"><path d="M5 1L9 5H1L5 1Z" /><path d="M5 11L1 7H9L5 11Z" /></svg></TableHead>
                    <TableHead className="text-right font-normal pr-6 text-neutral-400 sticky right-0 bg-neutral-50/80 shadow-[-1px_0_0_rgba(0,0,0,0.05)]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {UNIFIED_PROFILES.map((profile) => (
                    <TableRow key={profile.id} className="group hover:bg-[#f6f9fc] border-b border-neutral-100/60 h-16">
                      <TableCell className="text-center pl-4"><Checkbox className="border-neutral-300" /></TableCell>
                      <TableCell className="text-neutral-600 text-sm">{profile.index} <RiEditLine className="inline h-3.5 w-3.5 text-blue-500 ml-1 opacity-0 group-hover:opacity-100 cursor-pointer" /></TableCell>
                      <TableCell className="text-neutral-500 text-xs">
                        {profile.id}
                      </TableCell>
                      <TableCell className="text-neutral-600 text-sm">
                        {profile.group}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {profile.os === 'windows' ? <RiWindowsFill className="h-4 w-4 text-blue-500" /> : <RiAppleFill className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />}
                          <span className="text-sm text-neutral-700">{profile.name}</span>
                          <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-3 bg-blue-100 text-blue-600 text-[9px] flex items-center justify-center font-normal rounded-sm">⇌</span>
                            <span className="text-sm text-neutral-800">{profile.ip}</span>
                            <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
                          </div>
                          <span className="text-xs text-neutral-400">{profile.ipLoc}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-neutral-400">
                          <span>{profile.lastOpened.split(' ')[0]}</span>
                          <span>{profile.lastOpened.split(' ')[1]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {profile.platform === 'tiktok' && <RiTiktokFill className="h-4 w-4 text-neutral-800" />}
                          {profile.platform === 'amazon' && <RiAmazonFill className="h-4 w-4 text-amber-600" />}
                          <span className="text-sm text-neutral-700">{profile.platform === 'tiktok' ? '-' : ''}</span>
                          <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {profile.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-normal px-1.5 h-5 text-xs rounded-sm">
                              {tag}
                            </Badge>
                          ))}
                          <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-neutral-600">{profile.note}</span>
                          <RiEditLine className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-neutral-400">
                          <span>{profile.createTime.split(' ')[0]}</span>
                          <span>{profile.createTime.split(' ')[1]}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right pr-4 sticky right-0 bg-white group-hover:bg-[#f6f9fc] shadow-[-1px_0_0_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-end gap-0">
                          <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-white shadow-none rounded-r-none px-3 text-xs font-normal border-r border-blue-500/50">
                            打开
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-white shadow-none rounded-l-none px-1 border-l-0">
                                <RiMore2Fill className="h-4 w-4 text-white/80" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 text-sm text-neutral-700 font-normal">
                              <DropdownMenuItem className="py-2"><RiEditLine className="mr-2 h-4 w-4" /> 编辑</DropdownMenuItem>
                              <DropdownMenuItem className="py-2"><RiFileCopyLine className="mr-2 h-4 w-4" /> 复制</DropdownMenuItem>
                              <DropdownMenuItem className="py-2 text-red-600 focus:text-red-600"><RiDeleteBinLine className="mr-2 h-4 w-4" /> 删除</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="py-2">缓存数据</DropdownMenuItem>
                              <DropdownMenuItem className="py-2">Cookie机器人</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="py-2">修改代理</DropdownMenuItem>
                              <DropdownMenuItem className="py-2">修改账号</DropdownMenuItem>
                              <DropdownMenuItem className="py-2">修改指纹</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
