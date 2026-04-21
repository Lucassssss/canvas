# desktop-base 设计方案文档

## 原则

- **零硬编码**：所有配置（端口、URL、路径、窗口尺寸等）全部来自 `app.config.json`，包括开发模式
- **无业务逻辑**：框架只负责运行环境，不含任何应用特定逻辑
- **渐进式交付**：P0 可独立运行，P1/P2 在其上叠加

---

## 配置文件 `app.config.json`

下游应用放入 `resources/`，electron-builder 通过 `extraResources` 注入，框架启动时读取，开发/生产模式通用。

```json
{
  "appName": "MyApp",
  "appId": "com.myapp.desktop",
  "window": {
    "width": 1280,
    "height": 800,
    "minWidth": 800,
    "minHeight": 600,
    "titleBarStyle": "default"
  },
  "dev": {
    "enabled": true,
    "webUrl": "http://localhost:3000",
    "skipServers": false
  },
  "servers": [
    {
      "id": "api",
      "resource": "api",
      "port": 26318,
      "healthPath": "/health",
      "startupTimeoutMs": 15000,
      "autoStart": true,
      "env": {
        "NODE_ENV": "production"
      }
    }
  ],
  "update": {
    "enabled": true,
    "manifestUrl": "https://cdn.example.com/manifest.json",
    "checkIntervalMs": 3600000
  }
}
```

**开发模式说明：** `dev.enabled=true` 时加载 `dev.webUrl`，`dev.skipServers=true` 可跳过 server 启动（本地自己起），全部由配置控制，代码不判断 `!app.isPackaged`。

---

## 远端 `manifest.json` 格式

```json
{
  "resources": {
    "web": {
      "version": "1.2.3",
      "url": "https://cdn.example.com/web-1.2.3.zip",
      "sha256": "abc...",
      "type": "zip",
      "updateMode": "silent"
    },
    "api": {
      "version": "1.1.0",
      "url": "https://cdn.example.com/api-1.1.0-{platform}-{arch}",
      "sha256": "def...",
      "type": "binary",
      "updateMode": "silent"
    },
    "chromium": {
      "version": "130.0.0",
      "url": "https://cdn.example.com/chromium-{platform}.zip",
      "sha256": "ghi...",
      "type": "zip",
      "updateMode": "manual",
      "label": "Chromium 浏览器"
    }
  }
}
```

`updateMode`：`silent`（静默自动）| `notify`（下载后通知）| `manual`（仅手动触发）

本地 `userData/installed.json` 记录各资源已安装版本。

---

## 目录结构

```
apps/desktop-base/
├── package.json
├── tsconfig.main.json
├── tsconfig.preload.json
├── src/
│   ├── main/
│   │   ├── index.ts              # 启动 orchestration
│   │   ├── config.ts             # 加载 app.config.json + 类型
│   │   ├── window.ts             # BrowserWindow 管理
│   │   ├── protocol.ts           # app:// 自定义协议
│   │   ├── resource-manager.ts   # 资源路径/版本管理
│   │   ├── server-manager.ts     # 多 server 进程管理
│   │   ├── updater.ts            # 更新调度（P1）
│   │   └── ipc-handlers.ts       # IPC 注册
│   └── preload/
│       └── index.ts              # contextBridge
└── resources/
    └── app.config.json           # 配置模板
```

---

## P0：核心壳（可运行）✅

**目标：** 能启动应用、运行 server、加载前端。无更新逻辑。

### 交付内容

| 模块 | 职责 |
|---|---|
| `config.ts` | 读取 `app.config.json`，强类型导出，兼容 packaged/dev 路径 |
| `window.ts` | 从 config 创建 BrowserWindow；dev 模式 loadURL，prod 模式 loadURL('app://...') |
| `protocol.ts` | 注册 `app://` 协议服务 `userData/web/`，SPA fallback 到 index.html |
| `server-manager.ts` | 按 config.servers 启动/停止进程，健康检查，崩溃重启（指数退避） |
| `resource-manager.ts` | 管理资源路径（userData/resources/{id}），首次运行从 resourcesPath 复制初始资源 |
| `ipc-handlers.ts` | `window:minimize/maximize/close`，`server:status`，`server:restart`，`app:versions` |
| `preload/index.ts` | 暴露 `window.desktopBridge.window`，`window.desktopBridge.server` |
| `index.ts` | 启动流程：load config → register protocol → init resources → start servers → create window |

### 启动流程（P0）

```
loadConfig()
  → registerProtocol('app://')
  → registerIpcHandlers()
  → resourceManager.ensureInitialAssets()
  → serverManager.startAll()           ← 跳过 skipServers=true 的
  → await serverManager.waitReady()
  → createWindow()
  → mainWindow.show()
```

### P0 不包含

- 任何更新逻辑
- 下载功能
- updater IPC

---

## P1：更新系统（silent + notify）

**目标：** 实现 `silent` 和 `notify` 两种模式的自动更新。

### 交付内容

| 模块 | 新增能力 |
|---|---|
| `resource-manager.ts` | `downloadResource()`：HTTPS 流式下载 → SHA256 校验 → 存 `userData/updates/` |
| `resource-manager.ts` | `applyResource()`：zip 解压或 binary 替换，macOS xattr+chmod 处理 |
| `updater.ts` | `checkForUpdates()`：fetch 远端 manifest，对比 installed.json |
| `updater.ts` | 按 mode 调度：silent 自动下载+应用，notify 下载后发 IPC 事件 |
| `updater.ts` | `scheduleCheck()`：按 config.update.checkIntervalMs 循环 |
| `ipc-handlers.ts` | `updater:check`，`updater:apply`，推送事件 `updater:update-ready`，`updater:progress`，`updater:applied` |
| `preload/index.ts` | 暴露 `window.desktopBridge.updater`（check/apply/onXxx） |

### 资源应用逻辑

```
web 资源更新：
  解压 zip → userData/updates/web-tmp/
  → atomic rename → userData/web/
  → mainWindow.webContents.reload()

binary 资源更新（server）：
  serverManager.stop(id)
  → 替换 userData/resources/{id}
  → chmod+x + xattr（macOS）
  → serverManager.start(id)
```

---

## P2：高级特性

**目标：** manual 模式、容错、Chromium 管理、生产打包模板。

### 交付内容

| 特性 | 说明 |
|---|---|
| `manual` 更新模式 | IPC `updater:download(id)` 触发下载，`updater:apply(id)` 应用，前端完全控制 |
| 下载断点续传 | 记录已下载字节数，`Range` 请求头续传 |
| 更新回滚 | 应用前备份旧版本到 `userData/backup/{id}`，失败时自动回滚 |
| Chromium 管理 | 作为普通 `type:zip` 资源，路径暴露给前端通过 IPC 获取，供 Puppeteer/Playwright 使用 |
| electron-builder 模板 | 提供标准 `electron-builder.config.js` 模板，下游应用按需填写 appId/productName |
| 日志系统 | electron-log 集成，结构化输出，日志文件路径通过 IPC 暴露 |

---

## IPC 全量接口

| Channel | 方向 | P阶段 |
|---|---|---|
| `window:minimize/maximize/close` | renderer→main | P0 |
| `app:versions` | renderer→main | P0 |
| `server:status` | renderer→main | P0 |
| `server:restart` | renderer→main | P0 |
| `updater:check` | renderer→main | P1 |
| `updater:apply` | renderer→main | P1 |
| `updater:update-ready` | main→renderer | P1 |
| `updater:progress` | main→renderer | P1 |
| `updater:applied` | main→renderer | P1 |
| `updater:download` | renderer→main | P2 |
| `updater:update-available` | main→renderer | P2 |
| `app:log-path` | renderer→main | P2 |
