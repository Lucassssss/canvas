import { AppSidebar } from "@/components/app-sidebar"
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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiComputerLine, RiGlobalLine, RiShieldKeyholeLine, RiTeamLine } from "@remixicon/react"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">核心资产</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>工作台总览</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-6 bg-muted/20">

          <div>
            <h1 className="text-2xl font-bold tracking-tight">欢迎回来，Admin</h1>
            <p className="text-muted-foreground mt-1">
              这里是您的企业跨境资产大盘。目前共有 <span className="text-primary font-medium">3</span> 个团队成员在线。
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">活跃店铺 / 总店铺</CardTitle>
                <RiShieldKeyholeLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 / 15</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500 font-medium">+2</span> 本周新增
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">运行中指纹环境</CardTitle>
                <RiComputerLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">
                  共创建 28 个独立隔离环境
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">代理可用率</CardTitle>
                <RiGlobalLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">98.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-rose-500 font-medium">2</span> 个代理即将过期
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">今日被风控拦截</CardTitle>
                <RiTeamLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-500">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  底层指纹防护状态极佳
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-card">
              <CardHeader>
                <CardTitle>环境启动活跃度</CardTitle>
                <CardDescription>
                  过去 7 天内各平台环境的拉起次数统计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  [ 活跃度折线图表区 ]
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-card">
              <CardHeader>
                <CardTitle>近期操作日志</CardTitle>
                <CardDescription>
                  团队成员的关键安全动作
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: '张三', action: '启动了环境', target: '美区亚马逊店-01', time: '10 分钟前' },
                    { user: '李四', action: '修改了代理', target: 'TikTok 东南亚-03', time: '1 小时前' },
                    { user: 'Admin', action: '分配了店铺权限给', target: '王五', time: '3 小时前' },
                    { user: '王五', action: '创建了新指纹环境', target: 'PayPal 验证环境', time: '昨天' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">
                          <span className="font-medium text-primary">{log.user}</span> {log.action} <span className="font-medium">{log.target}</span>
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
