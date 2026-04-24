"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RiEyeLine, RiEyeOffLine, RiLoader4Line, RiArrowRightLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/store/useAuthStore"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import logoWithText from "@/images/joii_berry_logo_withtext.svg"

const phoneCodeSchema = z.object({
  phone: z.string().min(11, { message: "请输入有效的手机号" }),
  code: z.string().min(4, { message: "请输入验证码" }),
})

const phonePasswordSchema = z.object({
  phone: z.string().min(11, { message: "请输入有效的手机号" }),
  password: z.string().min(6, { message: "密码不能少于6位" }),
})

const accountPasswordSchema = z.object({
  account: z.string().min(1, { message: "请输入账号" }),
  password: z.string().min(6, { message: "密码不能少于6位" }),
})

const registerSchema = z.object({
  phone: z.string().min(11, { message: "请输入有效的手机号" }),
  code: z.string().min(4, { message: "请输入验证码" }),
  password: z.string().min(6, { message: "密码不能少于6位" }),
  agree: z.boolean().refine((val) => val === true, {
    message: "请阅读并同意服务条款",
  }),
})

function AutofillInput({ items, field, placeholder, className, type = "text" }: any) {
  const [open, setOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  const filteredItems = items.filter((item: string) => item.includes(field.value || ""))

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        className={className}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filteredItems.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-full z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <ul className="py-1 max-h-[200px] overflow-auto">
            {filteredItems.map((item: string, idx: number) => (
              <li
                key={idx}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-4 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(e) => {
                  e.preventDefault()
                  field.onChange(item)
                  setOpen(false)
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function useCountdown() {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    if (count <= 0) return
    const timer = setInterval(() => setCount((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [count])

  const start = React.useCallback((seconds: number = 60) => {
    setCount(seconds)
  }, [])

  return { count, start, isCounting: count > 0 }
}

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [mode, setMode] = React.useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("phone-code")

  const [recentAccounts, setRecentAccounts] = React.useState<string[]>([])
  const [recentPhones, setRecentPhones] = React.useState<string[]>([])

  React.useEffect(() => {
    try {
      setRecentAccounts(JSON.parse(localStorage.getItem("recent_accounts") || "[]"))
      setRecentPhones(JSON.parse(localStorage.getItem("recent_phones") || "[]"))
    } catch (e) { }
  }, [])

  const saveToHistory = (val: string, type: 'phone' | 'account') => {
    if (!val) return
    const key = type === 'phone' ? 'recent_phones' : 'recent_accounts'
    const current = type === 'phone' ? recentPhones : recentAccounts
    const newItems = Array.from(new Set([val, ...current])).slice(0, 5)
    localStorage.setItem(key, JSON.stringify(newItems))
    if (type === 'phone') setRecentPhones(newItems)
    else setRecentAccounts(newItems)
  }

  const { count: codeCount, start: startCodeCountdown, isCounting: isCodeCounting } = useCountdown()

  // Forms
  const phoneCodeForm = useForm<z.infer<typeof phoneCodeSchema>>({
    resolver: zodResolver(phoneCodeSchema),
    defaultValues: { phone: "", code: "" },
  })

  const phonePasswordForm = useForm<z.infer<typeof phonePasswordSchema>>({
    resolver: zodResolver(phonePasswordSchema),
    defaultValues: { phone: "", password: "" },
  })

  const accountPasswordForm = useForm<z.infer<typeof accountPasswordSchema>>({
    resolver: zodResolver(accountPasswordSchema),
    defaultValues: { account: "", password: "" },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phone: "", code: "", password: "", agree: false },
  })

  const getApiUrl = () => process.env.NEXT_PUBLIC_CLOUD_API_URL || 'http://localhost:4005'

  const onSubmit = async (values: any) => {
    setIsLoading(true)

    try {
      if (mode === "register") {
        const res = await fetch(`${getApiUrl()}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: values.phone, code: values.code, password: values.password })
        })
        const data = await res.json()
        if (data.success) {
          saveToHistory(values.phone, 'phone')
          setAuth(data.data.token, data.data.user)
          router.push("/environments")
        } else {
          alert(data.error)
        }
      } else {
        // Login mode
        let type = activeTab;
        const res = await fetch(`${getApiUrl()}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, phone: values.phone, account: values.account, password: values.password, code: values.code })
        })
        const data = await res.json()
        if (data.success) {
          if (values.phone) saveToHistory(values.phone, 'phone')
          if (values.account) saveToHistory(values.account, 'account')
          setAuth(data.data.token, data.data.user)
          router.push("/environments")
        } else {
          alert(data.error)
        }
      }
    } catch (err: any) {
      alert("网络异常，请重试：" + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendCode = async (e: React.MouseEvent) => {
    e.preventDefault()
    // Need current phone field value
    const phone = mode === 'register' ? registerForm.getValues().phone : phoneCodeForm.getValues().phone;
    if (!phone) return alert("请先输入手机号")
    if (!isCodeCounting) {
      startCodeCountdown(60)
      try {
        const res = await fetch(`${getApiUrl()}/api/auth/send-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        })
        const data = await res.json()
        if (data.success) alert("验证码下发成功，请查看模拟短信终端！")
        else alert(data.error)
      } catch (err) {
        alert("发送失败")
      }
    }
  }

  const customTabTrigger = "pb-3 text-base after:!bg-primary after:!inset-x-auto after:!left-1/2 after:!-translate-x-1/2 after:!w-10"

  return (
    <div className="flex min-h-svh w-full bg-background">
      {/* Left Side: Brand Visual */}
      <div className="relative hidden w-[50%] flex-col bg-primary p-12 text-primary-foreground lg:flex justify-between overflow-hidden border-r border-border/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 opacity-90" />

        {/* Decorative shapes */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3 font-bold text-2xl tracking-wider">
          <Image src={logoWithText} alt="浆果浏览器" className="h-7 w-auto brightness-0 invert" />
        </div>

        <div className="relative z-10 mb-12 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">欢迎使用<br />「浆果」浏览器</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-[90%]">
            企业级的高性能多环境浏览器。提供极致的隔离体验与出色的团队协作能力，让跨境运营更安全、更高效。
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-primary-foreground/60">
          <span>© 2026 Joii Berry. All rights reserved.</span>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-[50%] lg:p-12 xl:p-16 bg-background">
        <div className="flex w-full flex-col justify-center space-y-6 sm:w-[380px] [-webkit-app-region:no-drag]">

          {mode === "login" && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col space-y-2 text-left mb-6">
                <h2 className="text-2xl font-bold tracking-tight">登录到浆果</h2>
                <p className="text-sm text-muted-foreground">选择一种方式登录您的账号</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList variant="line" className="flex h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0 mb-6">
                  <TabsTrigger value="phone-code" className={customTabTrigger}>
                    验证码登录
                  </TabsTrigger>
                  <TabsTrigger value="phone-pwd" className={customTabTrigger}>
                    密码登录
                  </TabsTrigger>
                  <TabsTrigger value="account-pwd" className={customTabTrigger}>
                    账号登录
                  </TabsTrigger>
                </TabsList>

                {/* Phone + Code Login */}
                <TabsContent value="phone-code" className="mt-0 min-h-[300px]">
                  <Form {...phoneCodeForm}>
                    <form onSubmit={phoneCodeForm.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={phoneCodeForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AutofillInput items={recentPhones} field={field} placeholder="请输入手机号" className="h-11 px-4 bg-muted/30 border-muted" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={phoneCodeForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input placeholder="验证码" className="h-11 px-4 bg-muted/30 border-muted" {...field} />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-11 w-[120px] shrink-0 border-muted"
                                  onClick={handleSendCode}
                                  disabled={isCodeCounting}
                                >
                                  {isCodeCounting ? `${codeCount}s 后重试` : "获取验证码"}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between h-5 mt-2 mb-4">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          <Checkbox className="rounded-[4px] border-muted-foreground/50" />
                          <span>记住我</span>
                        </label>
                      </div>
                      <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                        {isLoading && <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />}
                        登录 <RiArrowRightLine className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="flex justify-end mt-4">
                        <button type="button" onClick={() => setMode("register")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          没有账号？立即注册
                        </button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                {/* Phone + Password Login */}
                <TabsContent value="phone-pwd" className="mt-0 min-h-[300px]">
                  <Form {...phonePasswordForm}>
                    <form onSubmit={phonePasswordForm.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={phonePasswordForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AutofillInput items={recentPhones} field={field} placeholder="请输入手机号" className="h-11 px-4 bg-muted/30 border-muted" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={phonePasswordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="请输入密码"
                                  className="h-11 px-4 bg-muted/30 border-muted pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between h-5 mt-2 mb-4">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          <Checkbox className="rounded-[4px] border-muted-foreground/50" />
                          <span>记住我</span>
                        </label>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">忘记密码？</a>
                      </div>
                      <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                        {isLoading && <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />}
                        登录 <RiArrowRightLine className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="flex justify-end mt-4">
                        <button type="button" onClick={() => setMode("register")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          没有账号？立即注册
                        </button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                {/* Account + Password Login */}
                <TabsContent value="account-pwd" className="mt-0 min-h-[300px]">
                  <Form {...accountPasswordForm}>
                    <form onSubmit={accountPasswordForm.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={accountPasswordForm.control}
                        name="account"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AutofillInput items={recentAccounts} field={field} placeholder="请输入账号" className="h-11 px-4 bg-muted/30 border-muted" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountPasswordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="请输入密码"
                                  className="h-11 px-4 bg-muted/30 border-muted pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between h-5 mt-2 mb-4">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                          <Checkbox className="rounded-[4px] border-muted-foreground/50" />
                          <span>记住我</span>
                        </label>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">忘记密码？</a>
                      </div>
                      <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                        {isLoading && <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />}
                        登录 <RiArrowRightLine className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="flex justify-end mt-4">
                        <button type="button" onClick={() => setMode("register")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          没有账号？立即注册
                        </button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {mode === "register" && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col space-y-2 text-left mb-6">
                <h2 className="text-2xl font-bold tracking-tight">创建新账号</h2>
                <p className="text-sm text-muted-foreground">输入您的信息以注册浆果浏览器</p>
              </div>

              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="请输入手机号" className="h-11 px-4 bg-muted/30 border-muted" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input placeholder="验证码" className="h-11 px-4 bg-muted/30 border-muted" {...field} />
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 w-[120px] shrink-0 border-muted"
                              onClick={handleSendCode}
                              disabled={isCodeCounting}
                            >
                              {isCodeCounting ? `${codeCount}s 后重试` : "获取验证码"}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="请设置登录密码"
                              className="h-11 px-4 bg-muted/30 border-muted pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="agree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0 mt-4 mb-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-[2px] rounded-[4px] border-muted-foreground/50"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-sm font-normal text-muted-foreground cursor-pointer leading-snug">
                            我已阅读并同意 <a href="#" className="text-primary hover:underline">服务条款</a> 和 <a href="#" className="text-primary hover:underline">隐私政策</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                    {isLoading && <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />}
                    注册并登录 <RiArrowRightLine className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => setMode("login")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      已有账号？返回登录
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
