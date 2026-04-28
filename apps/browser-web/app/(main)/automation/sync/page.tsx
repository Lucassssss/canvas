"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RiLayout4Line, RiPlayFill, RiStopCircleLine, RiRefreshLine } from "@remixicon/react"
import { cloudFetch } from "@/lib/api"
import { toast } from "sonner"

interface Env {
  id: string
  name: string
  platform: string
}

export default function SyncPage() {
  const [syncing, setSyncing] = React.useState(false)
  const [environments, setEnvironments] = React.useState<Env[]>([])
  const [runningIds, setRunningIds] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  const [masterId, setMasterId] = React.useState<string>("")
  const [followerIds, setFollowerIds] = React.useState<string[]>([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [envsRes, statusRes] = await Promise.all([
        cloudFetch("/api/environments"),
        fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/status`).catch(() => null)
      ])
      
      if (envsRes.ok) {
        const data = await envsRes.json()
        if (data.success) {
          setEnvironments(Array.isArray(data.data) ? data.data : (data.data?.items || []))
        }
      }

      if (statusRes && statusRes.ok) {
        const data = await statusRes.json()
        if (data.success) {
          setRunningIds(data.runningEnvs || [])
        }
      } else {
        setRunningIds([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
    // 轮询状态
    const timer = setInterval(() => {
      if (!syncing) {
        fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/status`)
          .then(res => res.json())
          .then(data => {
             if(data.success) setRunningIds(data.runningEnvs || [])
          })
          .catch(() => {})
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [syncing])

  const runningEnvs = environments.filter(e => runningIds.includes(e.id))

  const handleStartSync = async () => {
    if (!masterId) return toast.error("请选择主控环境")
    if (followerIds.length === 0) return toast.error("请选择至少一个被控环境")
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/sync/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterId, followerIds })
      })
      const data = await res.json()
      if (data.success) {
        setSyncing(true)
        toast.success("同步已启动")
      } else {
        toast.error(data.error || "启动失败")
      }
    } catch(e: any) {
      toast.error("网络异常: " + e.message)
    }
  }

  const handleStopSync = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DAEMON_URL}/api/sync/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterId })
      })
      const data = await res.json()
      if (data.success) {
        setSyncing(false)
        toast.success("同步已停止")
      } else {
        toast.error(data.error || "停止失败")
      }
    } catch(e: any) {
      toast.error("网络异常: " + e.message)
    }
  }

  const toggleFollower = (id: string) => {
    setFollowerIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
  }

  const selectAllFollowers = () => {
    const available = runningEnvs.map(e => e.id).filter(id => id !== masterId)
    setFollowerIds(available)
  }

  return (
    <>
      <PageHeader breadcrumb={[{ label: "自动化与 API" }, { label: "窗口同步" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        
        <div className="max-w-4xl w-full mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">多窗口同步操作</h1>
              <p className="text-muted-foreground mt-1">主窗口的鼠标键盘操作将实时无延迟同步到所有选定的从窗口中。</p>
            </div>
            <Button variant="outline" onClick={loadData} disabled={loading || syncing}>
              <RiRefreshLine className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 刷新运行列表
            </Button>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>同步控制台</CardTitle>
              <CardDescription>选择一个主控环境和多个被控环境启动同步。请确保所有目标环境已启动。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {runningEnvs.length < 2 ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg bg-muted/20">
                  <RiLayout4Line className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-sm mb-2">当前运行的环境数量不足 ({runningEnvs.length})。</p>
                  <p className="text-muted-foreground text-sm">窗口同步需要至少2个运行中的环境（1个主控 + 至少1个被控）。</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Master Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">主控环境 (在此窗口中操作)</label>
                    <Select value={masterId} onValueChange={(val) => {
                        setMasterId(val)
                        setFollowerIds(prev => prev.filter(id => id !== val)) // remove master from followers
                      }} 
                      disabled={syncing}
                    >
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="请选择主控环境" />
                      </SelectTrigger>
                      <SelectContent>
                        {runningEnvs.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.name} ({e.platform})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Followers Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">被控环境 (镜像执行操作的窗口)</label>
                      <Button variant="ghost" size="sm" onClick={selectAllFollowers} disabled={syncing || !masterId}>全选其他环境</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-md bg-muted/10 max-h-[300px] overflow-y-auto">
                      {runningEnvs.filter(e => e.id !== masterId).length === 0 && (
                        <div className="col-span-full text-sm text-muted-foreground py-4 text-center">无可选被控环境</div>
                      )}
                      {runningEnvs.filter(e => e.id !== masterId).map(e => (
                        <label key={e.id} className={`flex items-center space-x-3 space-y-0 p-3 rounded-md border cursor-pointer hover:bg-accent/50 ${followerIds.includes(e.id) ? 'bg-accent border-primary' : ''}`}>
                          <Checkbox 
                            checked={followerIds.includes(e.id)} 
                            onCheckedChange={() => toggleFollower(e.id)} 
                            disabled={syncing}
                          />
                          <div className="font-normal truncate select-none text-sm">
                            {e.name}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 pt-4 border-t">
                <Button 
                  size="lg" 
                  className="w-48 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={syncing || !masterId || followerIds.length === 0}
                  onClick={handleStartSync}
                >
                  <RiPlayFill className="mr-2 h-5 w-5" /> 开始同步
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive"
                  className="w-48"
                  disabled={!syncing}
                  onClick={handleStopSync}
                >
                  <RiStopCircleLine className="mr-2 h-5 w-5" /> 停止同步
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  )
}
