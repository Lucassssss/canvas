"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiLayout4Line, RiPlayFill, RiStopCircleLine } from "@remixicon/react"

export default function SyncPage() {
  const [syncing, setSyncing] = React.useState(false)

  return (
    <>
      <PageHeader breadcrumb={[{ label: "自动化与 API" }, { label: "窗口同步" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        
        <div className="max-w-4xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">多窗口同步操作</h1>
            <p className="text-muted-foreground mt-1">主窗口的鼠标键盘操作将实时无延迟同步到所有选定的从窗口中。</p>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>同步控制台</CardTitle>
              <CardDescription>选择一个主控环境和多个被控环境启动同步。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg bg-muted/20">
                <RiLayout4Line className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm mb-6">暂未选择任何环境。请在环境列表中勾选环境，或点击下方选择。</p>
                <Button variant="outline" className="h-8 border-input">选择环境进行同步</Button>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="w-48 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={syncing}
                  onClick={() => setSyncing(true)}
                >
                  <RiPlayFill className="mr-2 h-5 w-5" /> 开始同步
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive"
                  className="w-48"
                  disabled={!syncing}
                  onClick={() => setSyncing(false)}
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
