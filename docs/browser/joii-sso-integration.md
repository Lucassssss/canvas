# Joii 工作台嵌入与单点登录 (SSO) 集成方案

## 1. 背景与目标
为了在 `browser-web` 仪表盘系统内部提供“素材中心”服务，我们需要将线上的 `joii.cc` 应用以 Iframe 的形式嵌入，同时保证用户在 `browser-web` 体系下能够**免密、无感知地静默登录**到 `joii.cc` 的体系中。

由于 `browser-web` 和 `joii.cc` 各自有完全独立的前后端服务与数据库（零系统级耦合要求），且面临现代浏览器极其严格的 Iframe 跨域安全限制，我们设计了一套**基于 Shared Secret 和短效 Ticket 结合的前端流转方案**。

---

## 2. 核心架构与 SSO 流程

整个 SSO 登录的流转不依赖两个后端直接进行网络通信，完全通过客户端进行接力传导：

1. **签发通行证 (Ticket 生成)**
   - **触发**：用户在 `browser-web` 点击进入“素材中心”。
   - **行为**：前端 `browser-web` 隐式请求其专属后端 `cloud-api` 的 `/api/auth/sso-ticket` 接口。
   - **处理**：`cloud-api` 提取当前用户绑定的手机号，使用双方约定的强密钥 `SSO_SECRET` 生成一个有效期仅 1 分钟的 JWT Token。
2. **挂载通行证 (Iframe 渲染)**
   - **行为**：`browser-web` 拿到 Ticket 后，将其拼接到 iframe 的 src 中（如 `https://joii.cc/dashboard?sso_token=xxxx`）并开始渲染。
3. **前端拦截与换票 (Token 消费)**
   - **触发**：`joii.cc` 在 iframe 内加载，其全局容器 `AuthProvider` 在初始化时拦截到 URL 中的 `sso_token` 参数。
   - **行为**：前端向自身后端 `api.joii.cc` 发起 `POST /api/auth/sso-login` 请求进行静默登录。
4. **校验与授权 (Session 下发)**
   - **处理**：Joii 后端 (`apps/api`) 同样利用 `SSO_SECRET` 对 Token 进行验签，解析出手机号后执行登录/注册业务逻辑。
   - **响应**：通过 Header 下发认证 Cookie（设置为 `SameSite=none; Secure` 兼容 Iframe 第三方上下文）。
5. **无缝入场 (状态刷新与痕迹销毁)**
   - **行为**：前端拿到响应后，使用 H5 History API 隐去 URL 中的 `sso_token`，随后触发 `fetchUser()` 更新 React 全局登录状态，加载 Spinner 消失，无缝展示工作台内容。

---

## 3. 各工程文件变更清单

### 3.1 环境变量 (全局基石)
- **文件**: `apps/cloud-api/.env` & `apps/api/.env.production`
- **新增**: `SSO_SECRET="joii_sso_shared_secret_2026"`

### 3.2 签发中心 (apps/cloud-api)
- **文件**: `src/routes/auth.ts`
- **变更**: 增加 `GET /api/auth/sso-ticket` 接口，负责签发带手机号的短效 JWT。

### 3.3 验证中心 (apps/api)
- **文件**: `src/routes/auth.ts` & `src/services/auth/index.ts`
- **变更**: 增加 `POST /api/auth/sso-login` 公开接口及 `loginWithSSO` 业务逻辑，负责解密并执行自动注册/登录流程。
- **文件**: `src/middleware/auth.ts`
- **核心变更**: 在 `setAuthCookies` 和 `clearAuthCookies` 中，强制开启 `sameSite: 'none'` 和 `secure: true`。**这是 Iframe 跨域写入 Cookie 成功的先决条件。**

### 3.4 消费客户端 (apps/web)
- **文件**: `src/features/auth/AuthProvider.tsx`
- **变更**: 在初始化阶段（`hasFetched`）通过 `URLSearchParams` 提取 `sso_token`，并发起 `authApi.ssoLogin()` 换取状态。
- **文件**: `src/lib/api/auth-api.ts`
- **变更**: 封装 `ssoLogin` 方法。必须走 `apiClient` 而不是原生 `fetch`，以确保请求发往 `https://api.joii.cc` 后端，而非被静态 Nginx 拦截报 `405 Method Not Allowed` 错误。

### 3.5 承载容器 (apps/browser-web)
- **文件**: `app/(main)/apps/page.tsx`
- **优化**: 
  - iframe 路径修改为直接导向 `https://joii.cc/dashboard`。
  - **高级性能缓存机制**: 为避免每次切换菜单导致 iframe 闪烁，利用 `localStorage` 缓存 SSO 状态（有效期 12 小时）。
  - **防串号设计**: 缓存 Key 绑定了当前用户 `auth_token` 的最后 15 位(`joii_sso_time_xxxx`)，在 `browser-web` 发生账号切换时，缓存秒级失效，强制重新走 SSO 发票流程。

---

## 4. 排坑记录与注意事项

1. **环境配置语法断层坑**：
   - 使用 `echo >> .env` 追加环境变量时，若原文件最后一行无换行符，会导致诸如 `DATABASE_URL` 与 `SSO_SECRET` 字符串连体，引发诸如 `database "joii"SSO_SECRET=..." does not exist` 的 500 级系统内部错误。
2. **静态前端反代坑 (405 报错)**：
   - `joii.cc` 的前端使用 Next.js 的静态 Export 模式运行，Nginx 仅作为纯静态服务器，没有针对 `/api/` 的反代 location（只配在 `api.joii.cc` 上）。
   - 在前端发起 API 请求时，必须使用带有 `NEXT_PUBLIC_API_URL` 绝对路径前缀的 `apiClient` 库，而不能用原生的相对路径 `fetch('/api/...')`，否则会引发 `405 Method Not Allowed` 报错。
3. **第三方 Cookie 屏蔽坑 (401 报错)**：
   - 处于第三方不同域 Iframe 中的应用接收 `Set-Cookie` 时，浏览器默认拒绝。后端的 Cookie 配置必须包含 `SameSite=none` 且运行在 HTTPS (`Secure`) 下，否则随后发起的需鉴权接口（如 `/api/auth/me`）将由于丢失 Token 返回 `401 未授权访问`。
4. **工作台拦截闪烁规避**：
   - 依托于前端 React 状态管理中 `useAuth()` 的初始状态为 `isLoading: true`，在处理 SSO Token 的全异步过程中，页面由 `AuthGuard` 守卫展示 Loading 动画。只有当 Token 消化完毕且拉取到 User 树时，`isLoading` 才会转 false，完美规避了“被拦截回登录页然后再跳回来”的尴尬视觉跳跃。
