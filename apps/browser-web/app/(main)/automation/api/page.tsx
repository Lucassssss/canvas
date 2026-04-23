"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiFileCopyLine, RiKey2Line } from "@remixicon/react"

export default function ApiPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ label: "自动化与 API" }, { label: "API & MCP" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        
        <div className="max-w-4xl w-full space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Local API 密钥</CardTitle>
              <CardDescription>用于在本地调用 4001 端口的守护进程 API，或通过 MCP 协议与大模型进行交互验证。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <RiKey2Line className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                  <Input readOnly value="sk-local-xxxxxxxxxxxxxxxxxxxxxxxx" className="pl-8 bg-muted/20 border-input font-mono text-sm text-muted-foreground" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 border-input"><RiFileCopyLine className="h-4 w-4" /></Button>
                <Button variant="outline" className="border-input">重新生成</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>API 快速调用示例 (Local Daemon)</CardTitle>
              <CardDescription>在本地机器启动任意环境的示例代码。</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted/30 rounded-md overflow-x-auto text-sm text-muted-foreground font-mono border border-border">
{`curl -X POST http://127.0.0.1:4001/api/start \\
  -H "Authorization: Bearer sk-local-xxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"env_12345"}'`}
              </pre>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  )
}
