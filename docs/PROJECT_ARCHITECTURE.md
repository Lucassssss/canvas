# Joii 项目架构文档

> 最后更新: 2026-05-06

## 目录

- [1. 项目概览](#1-项目概览)
- [2. 技术栈](#2-技术栈)
- [3. 仓库结构](#3-仓库结构)
- [4. apps/api — 主后端服务](#4-appsapi--主后端服务)
- [5. apps/web — 主前端应用](#5-appsweb--主前端应用)
- [6. apps/electron — 桌面端 (Joii)](#6-appselectron--桌面端-joii)
- [7. apps/desktop-base — 通用 Electron 框架](#7-appsdesktop-base--通用-electron-框架)
- [8. apps/browser — 反检测浏览器内核](#8-appsbrowser--反检测浏览器内核)
- [9. apps/browser-web — 浏览器管理后台](#9-appsbrowser-web--浏览器管理后台)
- [10. apps/cloud-api — 浏览器产品云端 API](#10-appscloud-api--浏览器产品云端-api)
- [11. apps/local-daemon — 本地浏览器守护进程](#11-appslocal-daemon--本地浏览器守护进程)
- [12. packages/canvas-sdk — 画布 SDK](#12-packagescanvas-sdk--画布-sdk)
- [13. 数据库设计](#13-数据库设计)
- [14. 核心架构模式](#14-核心架构模式)
- [15. 部署架构](#15-部署架构)

---

## 1. 项目概览

**项目名称**: Joii
**域名**: https://joii.cc
**定位**: AI 驱动的无限画布设计平台，面向电商领域

Joii 包含两条产品线:

1. **Joii Canvas** — AI 无限画布设计工具，支持 AI 图像生成（虚拟试衣、批量生成、4K 输出）、AI 聊天助手（带工具调用）
2. **Joii Berry** — 反检测浏览器产品，面向跨境电商运营，支持指纹伪装、RPA 自动化、团队协作

---

## 2. 技术栈

| 层级 | 技术 |
|---|---|
| 前端框架 | Next.js 16, React 19 |
| UI 组件 | Tailwind CSS 4, shadcn/ui (Radix UI) |
| 状态管理 | Zustand 5 |
| 后端运行时 | Bun 1.3.10 |
| 后端框架 | Express.js |
| 数据库 ORM | Drizzle ORM + PostgreSQL |
| LLM SDK | Vercel AI SDK 6 |
| 桌面端 | Electron 33 |
| 构建编排 | Turborepo 2.8 |
| TypeScript | 6.0 (strict mode) |
| 包管理器 | Bun (非 npm/yarn) |

---

## 3. 仓库结构

```
canvas/
├── apps/
│   ├── api/              # 主后端 API (Express + Bun, 端口 3001)
│   ├── web/              # 主前端 (Next.js 16, 画布编辑器 + 聊天)
│   ├── electron/         # 桌面端 (打包 web + api, Electron 33)
│   ├── browser/          # 反检测浏览器产品 (Chromium 定制)
│   ├── browser-web/      # 浏览器管理后台 (Next.js 16)
│   ├── cloud-api/        # 浏览器产品云端 API (Express + Bun, 端口 4005)
│   ├── desktop-base/     # 通用 Electron 框架 (热更新)
│   └── local-daemon/     # 本地浏览器守护进程 (Bun.serve, 端口 4003)
├── packages/
│   └── canvas-sdk/       # 共享画布 SDK (Editor, Store, 基元, React 绑定)
├── workers/
│   └── openrouter-proxy/ # Cloudflare Worker 代理
├── docs/                 # 设计文档、PRD、架构文档
├── scripts/              # 构建/打包脚本
└── server_config/        # Nginx, fail2ban, 部署脚本
```

---

## 4. apps/api — 主后端服务

### 4.1 概述

Express.js 服务，运行在 Bun 上，端口 3001。提供 LLM 流式聊天、图像生成、用户认证、支付、项目持久化等功能。

### 4.2 路由结构

#### 公开端点（无需认证）

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/send-code` | 发送短信验证码 |
| POST | `/api/auth/verify-code` | 验证码登录（设置 JWT Cookie） |
| POST | `/api/pay/wechat/notify` | 微信支付回调 |
| GET | `/api/models` | 获取可用图像生成模型列表 |
| GET | `/api/credits/pricing` | 获取所有模型定价 |
| GET | `/health` | 健康检查 |

#### 认证端点（需要 JWT）

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/chat` | SSE 流式 LLM 聊天（Agent 模式，带工具） |
| POST | `/api/image/generate` | AI 图像生成（检查积分） |
| POST | `/api/upload` | 上传 base64 文件到 S3 |
| POST | `/api/upload/url` | 从 URL 上传到 S3 |
| POST | `/api/upload/signed-url` | 获取 S3 预签名上传 URL |
| GET | `/conversations` | 获取用户对话列表 |
| POST | `/conversations` | 创建对话 |
| PUT | `/conversations/:id` | 更新对话 |
| DELETE | `/conversations/:id` | 删除对话 |
| GET/DELETE | `/conversations/:id/messages` | 获取/清除消息 |

#### 子路由挂载

| 前缀 | 路由文件 | 认证 |
|---|---|---|
| `/api/auth` | `routes/auth.ts` | 混合 |
| `/api/projects` | `routes/projects.ts` | 必需 |
| `/api/users` | `routes/users.ts` | 必需 |
| `/api/credits` | `routes/credits.ts` | 必需 |
| `/api/payments` | `routes/payments.ts` | 混合 |
| `/api/leads` | `routes/leads.ts` | 无 |

### 4.3 服务层

| 服务 | 文件 | 职责 |
|---|---|---|
| LLM 服务 | `services/llm.ts` | 核心聊天编排，SSE 流式输出 |
| Agent 服务 | `services/agent.ts` | ToolLoopAgent 单例缓存 |
| Model 服务 | `services/model.ts` | LLM 模型工厂（DeepSeek, MiniMax, OpenRouter） |
| 对话服务 | `services/conversation.ts` | 对话/消息 CRUD，自动生成标题 |
| 项目服务 | `services/project.ts` | 项目 CRUD，画布数据持久化 |
| 认证服务 | `services/auth/` | 用户创建、SMS 登录、SSO 登录、JWT 管理 |
| 积分服务 | `services/credits/` | 积分消费、查询、定价引擎 |
| 短信服务 | `services/sms/` | 阿里云 SMS 验证码发送/验证 |
| 支付服务 | `services/payment/` | 微信支付 v3 集成 |
| S3 服务 | `services/s3.ts` | Bitiful S3 文件上传/删除 |
| 图像生成服务 | `services/image/generation/` | 多提供商图像生成编排 |

### 4.4 工具定义

AI 聊天可用的工具集:

| 工具 | 说明 |
|---|---|
| `canvasGenerateImage` | 画布图像生成（检查积分、调用提供商） |
| `bash` | 沙盒化 bash 命令执行 |
| `createCodeArtifact` | 创建代码制品 |
| `createDocumentArtifact` | 创建文档制品 |
| `createDataArtifact` | 创建数据制品 |
| `createTableArtifact` | 创建表格制品 |
| `calculatorTool` | 数学计算器 |
| `getCurrentTimeTool` | 获取当前时间 |
| `weatherTool` | 天气查询（模拟数据） |

### 4.5 认证系统

- **JWT Token**: 7 天有效期，包含 `{ userId, phone, jti }`
- **Refresh Token**: 30 天有效期
- **Cookie**: `auth_token` (httpOnly, secure, sameSite: none)
- **Token 黑名单**: 登出时将 JTI 加入 `token_blacklist` 表
- **SSO**: 外部系统生成签名 JWT，`/api/auth/sso-login` 验证并签发标准 Cookie

### 4.6 图像生成提供商

| 提供商 | 注册 ID | 状态 |
|---|---|---|
| OpenRouter (Gemini) | `openrouter-gemini` | 启用（主力） |
| 火山引擎 Seedream 5.0 Lite | `volcengine-seedream-5-0-lite` | 启用 |
| 火山引擎 Seedream 4.5 | `volcengine-seedream-4-5` | 启用 |
| APIMart | `apimart-gemini` | 禁用 |
| 本地 Gemini | `local-gemini` | 禁用 |

### 4.7 环境变量

关键环境变量:

```bash
# 服务
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=...
SSO_SECRET=...

# LLM
DEEPSEEK_API_KEY=...
MINIMAX_API_KEY=...
OPENROUTER_API_KEY=...

# 图像生成
ARK_API_KEY=...          # 火山引擎
DEFAULT_IMAGE_PROVIDER_ID=openrouter-gemini

# 存储 (Bitiful S3)
BITIFUL_ACCESS_KEY_ID=...
BITIFUL_S3_BUCKET=...

# 短信 (阿里云)
ALIYUN_ACCESS_KEY_ID=...

# 微信支付
WECHAT_APPID=...
WECHAT_MCH_ID=...
```

---

## 5. apps/web — 主前端应用

### 5.1 概述

Next.js 16 静态导出应用，使用 React 19、Tailwind CSS 4、Zustand 5、shadcn/ui。包含无限画布编辑器和 AI 聊天界面。

### 5.2 页面路由

| 路径 | 组件 | 说明 |
|---|---|---|
| `/` | `LandingPageCN` | 中文落地页 |
| `/login` | `LoginForm` | 登录页（手机 + 短信验证码） |
| `/dashboard` | `DashboardPage` | 用户仪表盘（聊天、最近项目、灵感库） |
| `/canvas` | `Canvas` | 无限画布编辑器（核心功能） |
| `/projects` | `ProjectsPage` | 项目列表 |
| `/profile` | `ProfilePage` | 用户资料 |
| `/orders` | `OrdersPage` | 订单/充值历史 |
| `/news` | `NewsPage` | 新闻/博客（fumadocs MDX） |
| `/browser` | `BrowserLandingPage` | 浏览器产品落地页 |
| `/help` | `HelpPage` | 帮助/FAQ |

### 5.3 Zustand Store

#### Canvas Store (`useCanvasStore`)

画布核心状态管理，持久化到 localStorage。

**状态**:
- `shapes: ShapeProps[]` — 所有画布元素
- `selectedIds: string[]` — 当前选中的形状 ID
- `viewport: ViewportState` — `{ x, y, zoom }`
- `activeTool: ToolType` — 当前工具（select/hand/pen/eraser/arrow/text/note/image/shape/clothing/ai-combination/detail-image）
- `history: HistoryEntry[]`, `historyIndex: number` — 撤销/重做栈（最大 50）
- `projectId`, `projectName`, `isDirty`, `lastSavedAt` — 项目持久化状态

**核心动作**:
- 形状 CRUD: `addShape`, `updateShape`, `batchUpdateShapes`, `deleteShape`
- 选择: `setSelectedIds`, `addToSelection`, `clearSelection`
- 视口: `setViewport`, `zoomIn`, `zoomOut`, `zoomToFit`
- 历史: `undo`, `redo`, `saveHistory`
- 剪贴板: `copySelectedShapes`, `pasteShapes`
- Z 序: `bringToFront`, `sendToBack`
- 分组: `groupShapes`, `ungroupShapes`
- 项目: `loadProject`, `saveToServer`, `scheduleAutoSave`（2 秒防抖）

#### Chat Store (`useChatStore`)

聊天状态管理，不持久化。

**核心动作**:
- `sendMessage` — 创建用户消息 → 创建空助手消息 → SSE 流式传输
- 处理事件: `conversation_created`, `reasoning`, `text`, `tool_call`, `tool_result`, `tool_error`
- 拦截画布工具调用，通过 `canvasToolExecutor` 直接操作 canvas store

#### Project Store (`useProjectStore`)

项目列表管理。

#### Auth Store (`useAuth`)

认证状态管理，支持手机 + 短信验证码登录。

#### Models Store (`useModelsStore`)

AI 模型配置，从 `/api/models` 获取。

#### Credits Store (`useCredits`)

积分消费和支付流程，支持微信/支付宝。

### 5.4 形状系统

支持 13 种形状类型:

| 类型 | 说明 |
|---|---|
| `rect` | 矩形 |
| `circle` | 圆形 |
| `text` | 文本 |
| `note` | 便签 |
| `image` | 图片 |
| `arrow` | 箭头 |
| `draw` | 手绘 |
| `clothing` | 服装（电商专用） |
| `ai-combination` | AI 组合 |
| `image-slot` | 图片槽位 |
| `custom-combination` | 自定义组合 |
| `detail-image` | 详情图 |
| `group` | 分组 |

### 5.5 核心架构模式

1. **静态导出 + 客户端认证**: 使用 `output: 'export'`，纯客户端认证，`AuthGuard` 组件守卫路由
2. **Cookie 认证**: 所有 API 调用使用 `credentials: 'include'`
3. **双重持久化**: Zustand persist (localStorage) + 后端服务器，2 秒防抖自动保存
4. **SSE 流式聊天**: 异步生成器模式，`canvasToolExecutor` 拦截工具调用
5. **性能优化**: 重组件使用 `next/dynamic` 动态导入，`requestAnimationFrame` 批处理

### 5.6 API 客户端

`ApiClient` 类（`src/lib/api/client.ts`）:
- 拦截器模式（请求/响应/错误）
- 自动附加 `credentials: 'include'`
- 401 错误时派发 `auth:unauthorized` 自定义事件
- 基础 URL 来自 `NEXT_PUBLIC_API_URL`，默认 `http://localhost:3001`

---

## 6. apps/electron — 桌面端 (Joii)

### 6.1 概述

Electron 33 桌面应用，打包 `apps/web/out`（静态导出）和 `apps/api/.bin/server`（编译后的 Bun 二进制）。

### 6.2 架构

- **主进程**: 单文件 `src/main/main.ts`，硬编码端口 26318
- **预加载脚本**: 暴露 `window.electronAPI`（platform, isPackaged, onNavigate, minimize, maximize, close）
- **开发模式**: 加载 `http://localhost:3000`
- **生产模式**: 加载 `web/index.html`，启动 API 子进程
- **构建目标**: macOS (DMG), Windows (NSIS + portable), Linux (AppImage + deb)

### 6.3 关键限制

- 无 OTA 更新
- 无资源管理器
- 单一服务硬编码
- 无健康检查

---

## 7. apps/desktop-base — 通用 Electron 框架

### 7.1 概述

`apps/electron` 的继任者，通用、配置驱动的 Electron 框架，支持热更新。

### 7.2 核心模块

| 模块 | 文件 | 职责 |
|---|---|---|
| 配置 | `config.ts` | 从 `app.config.json` 加载类型安全配置 |
| 窗口 | `window.ts` | 无边框窗口，支持自定义标题栏 |
| 协议 | `protocol.ts` | `app://` 自定义协议，SPA 回退 |
| 资源管理器 | `resource-manager.ts` | userData 目录管理，Web OTA 原子更新 |
| 服务管理器 | `server-manager.ts` | 多服务进程管理，指数退避重启，健康检查 |
| IPC 处理器 | `ipc-handlers.ts` | 窗口控制、服务状态、版本查询、更新通知 |

### 7.3 OTA 更新流程

1. 获取 manifest（带缓存破坏参数）
2. 版本比对 `installed.json`
3. 下载 zip 到 `updates/` 目录
4. 使用系统 `tar` 解压到 `web_tmp`
5. 原子交换: `web` → `web_old`, `web_tmp` → `web`
6. 清理 `web_old` 和 zip
7. 更新 `installed.json`

### 7.4 与 apps/electron 的对比

| 方面 | apps/electron | apps/desktop-base |
|---|---|---|
| 架构 | 单体单文件 | 模块化，配置驱动 |
| 配置 | 硬编码 | `app.config.json` 类型安全 |
| 窗口 | 固定边框，`loadFile()` | 无边框，`app://` 协议 |
| 服务管理 | 单一二进制，固定端口 | 多服务，健康检查，指数退避 |
| OTA | 无 | Web OTA 原子更新 |
| 资源管理 | 静态打包 | 动态 userData，版本跟踪 |
| IPC | 最小存根 | 完整套件 |
| 可复用性 | 单一应用 | 通用框架 |

---

## 8. apps/browser — 反检测浏览器内核

### 8.1 产品定位

**Joii Berry Browser** — 反检测浏览器，面向跨境电商卖家、海外社交媒体营销者、联盟营销者。对标 AdsPower、Dolphin{anty}、GoLogin。

### 8.2 功能模块

| 模块 | 优先级 | 功能 |
|---|---|---|
| 指纹管理器 | P0 | OS 伪装、Canvas/WebGL/AudioContext 噪声注入、硬件伪造、UA 绑定 |
| 代理与地理定位 | P0/P1 | 多协议代理、时区/语言自动解析、WebRTC 防泄漏、GPS 伪装 |
| 运营与团队 | P0/P1 | Cookie 导入导出、免密分享、RBAC 权限、跨设备云同步 |
| 自动化与 RPA | P1/P2/P3 | 扩展管理、Local API、可视化 RPA、群控同步 |

### 8.3 技术架构（三层）

1. **自定义 Chromium 内核 (C/C++)**: Canvas 指纹噪声注入、ClientRects 补偿、WebRTC 拦截、字体隔离、硬件并发数拦截
2. **客户端 Shell (Rust/Tauri)**: 超低内存占用，SQLite 配置管理
3. **云服务 (Go/Node.js)**: 认证、配置分发、数据备份

### 8.4 指纹配置示例

```json
{
  "name": "Win11_Chrome_147_RTX4070",
  "fingerprint_seed": 2847561093,
  "platform": "Windows",
  "brand": "Google Chrome",
  "brandVersion": "147.0.7727.107",
  "hardwareConcurrency": 16,
  "gpuVendor": "NVIDIA Corporation",
  "gpuRenderer": "NVIDIA GeForce RTX 4070",
  "language": "en-US",
  "timezone": "America/Los_Angeles"
}
```

---

## 9. apps/browser-web — 浏览器管理后台

### 9.1 概述

Next.js 16 管理后台，设计为运行在 Tauri 桌面壳内。

### 9.2 页面结构

| 页面 | 路径 | 功能 |
|---|---|---|
| 仪表盘 | `/dashboard` | 统计卡片、活动图表、操作日志 |
| 环境管理 | `/environments` | CRUD 表格、批量操作、浏览器内核自动下载 |
| 创建/编辑 | `/create` | 三段式表单（基本/设备/高级指纹） |
| 分组管理 | `/groups` | 环境分组 CRUD |
| 设备管理 | `/devices` | 代理设备管理 |
| 自动化 | `/automation/sync` | 窗口同步（群控） |
| RPA | `/automation/rpa` | 可视化 RPA 编辑器 |
| 团队管理 | `/team/*` | 成员、角色、计费、访问控制、日志 |
| 设置 | `/settings` | 偏好、安全、存储、关于 |
| 回收站 | `/trash` | 软删除恢复 |

### 9.3 环境启动流程

1. 用户创建环境 → `POST /api/environments` (cloud-api) → 存储指纹 JSONB
2. 点击"打开" → `POST /api/environments/:id/check-proxy` (查询 IP 地理位置)
3. `POST /api/environments/:id/start` (生成 CLI 参数，更新状态为 running)
4. 转发到 local-daemon `POST /api/start` → 启动 Chromium
5. 每 6 秒轮询 local-daemon `GET /api/status` 对比云端状态

---

## 10. apps/cloud-api — 浏览器产品云端 API

### 10.1 概述

Express.js 服务，端口 4005。提供浏览器环境管理、设备管理、团队管理、RPA 脚本管理。

### 10.2 路由结构

| 路由前缀 | 端点 |
|---|---|
| `/api/auth` | send-code, register, login, me, sso-ticket |
| `/api/environments` | CRUD, check-proxy, start, stop |
| `/api/devices` | CRUD, test |
| `/api/groups` | CRUD |
| `/api/team` | members, roles, policies, login-settings |
| `/api/logs` | 列表 |
| `/api/rpa` | CRUD |

### 10.3 数据库表

11 张表，全部以 `teamId` 实现多租户:

| 表 | 说明 |
|---|---|
| `teams` | 团队（多租户根实体） |
| `devices` | 代理设备 |
| `accounts` | 平台账号凭证 |
| `groups` | 环境分组 |
| `browser_environments` | 浏览器环境（核心实体，关联设备/账号/分组/指纹） |
| `roles` | RBAC 角色（system/custom） |
| `users` | 团队成员 |
| `access_policies` | 访问策略（黑名单） |
| `access_logs` | 审计日志 |
| `login_settings` | 登录安全设置（单例） |
| `rpa_scripts` | RPA 脚本（React Flow 图） |

### 10.4 环境启动编排

`startEnvironment` 方法:
1. 解析时区（自动从设备或手动）
2. 解析经纬度（自动从设备或手动）
3. 解析语言（自动通过 28 国 COUNTRY_LANG_MAP 或手动）
4. 从环境 ID 哈希生成 32 位指纹种子
5. 构建完整 CLI 参数映射（指纹、反检测、稳定性、凭证隔离、WebRTC 保护、DNS 防泄漏、代理注入、WebGL 控制、Canvas/Audio 噪声）

---

## 11. apps/local-daemon — 本地浏览器守护进程

### 11.1 概述

Bun.js HTTP 服务，端口 4003。作为 Web 管理后台和实际 Chromium 进程之间的桥梁。

### 11.2 文件系统布局

```
APP_DATA_DIR/
├── browser/          # 版本化 Chromium 二进制
├── run/              # JSON 锁文件（pid, debugPort, time）
├── profile/          # 每环境用户数据目录
└── download-cache/   # 临时 zip 存储
```

### 11.3 API 端点

| 端点 | 方法 | 说明 |
|---|---|---|
| `/health` | GET | 健康检查 |
| `/api/browser/status` | GET | 检查浏览器是否已安装 |
| `/api/browser/install` | POST | 下载并解压 Chromium |
| `/api/browser/progress` | GET | 下载/解压进度 |
| `/api/status` | GET | 获取运行中的环境列表 |
| `/api/start` | POST | 启动 Chromium（分配调试端口 9300-9400） |
| `/api/stop` | POST | 停止 Chromium |
| `/api/sync/start` | POST | 启动群控同步 |
| `/api/sync/stop` | POST | 停止群控同步 |
| `/api/arrange` | POST | 自动平铺浏览器窗口 |

### 11.4 CDP 集成

- 通过 WebSocket 连接到 Chromium 的远程调试端口
- 启用 `Target.setAutoAttach` 自动跟踪所有页面
- 注入 `TRACKING_SCRIPT`（~475 行）捕获用户操作
- 双通道通信: `Runtime.addBinding("joiiSync")` + `console.debug`

### 11.5 群控同步引擎

`TRACKING_SCRIPT` 实现语义操作录制:
- 点击事件（智能选择器解析: data-testid > data-id > name > placeholder > href > id > CSS 路径）
- 输入变化（800ms 防抖）
- 滚动事件（200ms 节流）
- 键盘事件（特殊 Enter 处理刷新待处理输入）

翻译为 `agent-browser` CLI 命令:
- `click` → `agent-browser --cdp <port> click "<selector>"`
- `fill` → `agent-browser --cdp <port> fill "<selector>" "<value>"`
- `press` → `agent-browser --cdp <port> press "<key>"`
- `scroll` → `agent-browser --cdp <port> scroll <direction> <amount>`

---

## 12. packages/canvas-sdk — 画布 SDK

### 12.1 概述

2D 画布编辑器 SDK，基于 Zustand 的状态存储、撤销/重做历史、形状注册表、基元数学类型、DOM 工具和 React 绑定。

### 12.2 核心类

#### Editor

中央门面，组合四个内部协作者: Store, HistoryManager, EventEmitter, ShapeRegistry。

**方法分组**:
- **生命周期**: `mount()`, `unmount()`
- **形状 CRUD**: `createShape()`, `updateShape()`, `deleteShape()`, `getShape()`, `getShapes()`
- **选择**: `select()`, `deselect()`, `getSelectedShapes()`
- **视口**: `getViewport()`, `setViewport()`, `zoomIn()`, `zoomOut()`, `zoomToFit()`
- **历史**: `undo()`, `redo()`, `canUndo()`, `canRedo()`, `saveHistory()`
- **坐标转换**: `screenToCanvas()`, `canvasToScreen()`
- **序列化**: `exportToJSON()`, `importFromJSON()`
- **事件**: `on()`, `once()`, `off()`

#### Store

Zustand 包装器，管理三个状态切片: `shapes`, `selectedIds`, `viewport`。

**批处理机制**: `batchDepth > 0` 时跟踪变更切片，`batchDepth` 归零时刷新通知。

#### HistoryManager

经典线性撤销/重做栈。
- 最大 50 条记录
- 深克隆快照（`JSON.parse(JSON.stringify(...))`）
- 撤销时截断重做分支

### 12.3 基元类型

| 类型 | 说明 |
|---|---|
| `Vec` | 2D 向量（不可变风格），支持加减乘除、点积、叉积、旋转、插值 |
| `Box` | 轴对齐边界框，支持包含测试、交集、并集、扩展 |
| `Matrix` | 2x3 仿射变换矩阵，支持平移、缩放、旋转、求逆、CSS 输出 |

### 12.4 形状系统

**IShapeUtil 接口**:
- `type: string` — 唯一类型标识
- `defaultProps` — 默认属性
- `render(shape, context)` — 返回 React 元素
- `hitTest?(shape, point)` — 点击测试
- `getBounds?(shape)` — 返回边界 Box
- `onRotate?`, `onResize?` — 变换回调

**内置形状**: Rectangle, Ellipse, Text, Image, Group

### 12.5 React 绑定

- `Canvas` 组件 — 容器，内置滚轮缩放、点击选择、键盘快捷键
- `EditorProvider` / `useEditorContext` — Context 提供者
- Hooks: `useEditor`, `useShape`, `useShapes`, `useSelection`, `useViewport`

---

## 13. 数据库设计

### 13.1 主 API 数据库 (apps/api)

11 张表:

| 表 | 说明 | 关键关联 |
|---|---|---|
| `users` | 用户 | - |
| `conversations` | 对话 | FK → users |
| `messages` | 消息 | FK → conversations |
| `projects` | 项目 | FK → users |
| `project_conversations` | 项目-对话关联 | FK → projects, conversations |
| `verification_codes` | 验证码 | - |
| `credit_transactions` | 积分交易 | FK → users |
| `usage_logs` | 使用日志 | FK → users |
| `token_blacklist` | Token 黑名单 | - |
| `recharge_packages` | 充值套餐 | - |
| `orders` | 订单 | FK → users |

**关系**:
- users 1:N conversations (级联删除)
- users 1:N projects (级联删除)
- conversations 1:N messages (级联删除)
- projects N:M conversations via project_conversations (级联删除)

### 13.2 Cloud API 数据库 (apps/cloud-api)

11 张表，全部以 `teamId` 实现多租户:

| 表 | 说明 |
|---|---|
| `teams` | 团队 |
| `devices` | 代理设备 |
| `accounts` | 平台账号 |
| `groups` | 环境分组 |
| `browser_environments` | 浏览器环境 |
| `roles` | RBAC 角色 |
| `users` | 团队成员 |
| `access_policies` | 访问策略 |
| `access_logs` | 审计日志 |
| `login_settings` | 登录安全设置 |
| `rpa_scripts` | RPA 脚本 |

---

## 14. 核心架构模式

### 14.1 Canvas Tool Interception（画布工具拦截）

这是项目最核心的架构模式:

1. 后端注册画布工具（如 `canvasAddShape`），但 `execute()` 返回成功而不执行副作用
2. 前端 `useChatStore` 拦截 SSE `tool_call` 事件
3. 前端直接在 `useCanvasStore` 上执行操作

**优势**: AI 上下文保持在后端，避免画布变更的网络往返。

### 14.2 SSE 流式传输

聊天使用 Server-Sent Events:
- 异步生成器模式 (`streamChat`)
- 事件类型: `reasoning`, `text`, `tool_call`, `tool_result`, `tool_error`, `artifact`, `conversation_created`, `done`
- 前端通过 `canvasToolExecutor` 实时拦截工具调用

### 14.3 双重持久化

画布状态同时持久化到:
1. Zustand persist middleware (localStorage) — 即时备份
2. 后端服务器 — 2 秒防抖自动保存

### 14.4 多租户

浏览器产品使用 `teamId` 外键实现多租户，注册时自动创建团队和三个系统角色（Boss/Manager/Employee）。

### 14.5 RBAC 权限系统

- 角色: system 类型（自动创建）和 custom 类型
- 权限: JSONB 存储，Boss 角色 `{all: true}`
- 成员: `accessibleGroups`（可访问的环境组）、`browserLimit`（并发浏览器限制）

---

## 15. 部署架构

### 15.1 服务器配置

- Nginx 反向代理
- fail2ban 入侵防护
- sysctl 内核参数调优
- 部署脚本在 `server_config/scripts/`

### 15.2 构建命令

```bash
# 开发
bun run dev              # 启动所有应用 (Turbo)
bun run dev:desktop      # 仅启动 Electron

# 构建
bun run build            # 构建所有应用
bun run build:desktop    # 仅构建 Electron

# 数据库
cd apps/api && bun run db:generate  # 生成 Drizzle 迁移
cd apps/api && bun run db:migrate   # 执行迁移
cd apps/api && bun run db:push      # 推送 schema 到 DB
cd apps/api && bun run db:studio    # 打开 Drizzle Studio UI
```

### 15.3 桌面端打包

```bash
cd apps/electron && bun run dist        # 打包所有平台
cd apps/electron && bun run dist:mac    # 仅 macOS
cd apps/electron && bun run dist:win    # 仅 Windows
cd apps/electron && bun run dist:linux  # 仅 Linux
```

---

## 附录: 积分系统

| 参数 | 值 |
|---|---|
| 汇率 | 1 CNY = 100 积分 |
| 目标利润率 | 2x |
| 注册赠送 | 1000 积分 |
| 默认操作成本 | 100 积分 |

**充值套餐**:
| 积分 | 价格 (CNY) |
|---|---|
| 5,000 | 50 |
| 15,000 | 128 |
| 50,000 | 399 |
| 100,000 | 699 |
| 200,000 | 1,299 |
| 300,000 | 1,799 |
