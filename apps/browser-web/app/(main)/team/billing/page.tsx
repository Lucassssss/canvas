"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiWallet3Line, RiVipCrownLine } from "@remixicon/react"
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

export default function BillingPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ label: "团队管理" }, { label: "费用中心" }]} />
      <div className="flex flex-1 flex-col p-6 overflow-y-auto gap-5 min-h-0 bg-background text-foreground">
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>当前余额</span>
                <RiWallet3Line className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">¥ 1,250.00</div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground w-full">立即充值</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>余额充值</DialogTitle>
                    <DialogDescription>支持微信、支付宝或对公转账。</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-wrap gap-3">
                       <Button variant="outline" className="flex-1 border-primary text-primary bg-primary/5">¥ 500</Button>
                       <Button variant="outline" className="flex-1 border-input">¥ 1000</Button>
                       <Button variant="outline" className="flex-1 border-input">¥ 5000</Button>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 mt-2">
                      <Label className="text-right text-muted-foreground">自定义</Label>
                      <Input type="number" className="col-span-3 border-input shadow-none h-9" placeholder="输入充值金额" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">去支付</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>我的套餐计划</span>
                <RiVipCrownLine className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-foreground">专业版 (Pro)</div>
              <p className="text-xs text-muted-foreground mt-1">包含 100 个环境配额，5 个协同成员。</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="mt-4 w-full border-input text-foreground">升级套餐</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>升级套餐计划</DialogTitle>
                    <DialogDescription>按需升级以解锁更多浏览器环境与团队成员配额。</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="border border-primary/50 bg-primary/5 p-4 rounded-lg flex justify-between items-center cursor-pointer">
                      <div>
                        <div className="font-bold text-foreground text-lg">企业版 (Enterprise)</div>
                        <div className="text-sm text-muted-foreground mt-1">500 个环境 / 20 个成员</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary text-xl">¥ 3,999<span className="text-sm font-normal text-muted-foreground">/年</span></div>
                      </div>
                    </div>
                    <div className="border border-border p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-muted/30">
                      <div>
                        <div className="font-bold text-foreground text-lg">定制版 (Custom)</div>
                        <div className="text-sm text-muted-foreground mt-1">无限环境 / 无限成员 / 独立部署</div>
                      </div>
                      <div className="text-right">
                        <Button variant="link" className="text-primary px-0">联系销售</Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="border-input shadow-none h-9">取消</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">确认升级</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card flex-1 flex flex-col min-h-[300px] mt-2">
          <CardHeader>
            <CardTitle>账单流水</CardTitle>
            <CardDescription>近期费用的扣除与充值记录。</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-border mt-2">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">暂无本月流水记录</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  )
}
