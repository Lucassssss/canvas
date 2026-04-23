# Joii Berry 跨境浏览器项目 - 架构与进度说明文档

## 1. 系统整体架构 (C/S 架构设计)

本项目采用标准的“云端大脑 + 本地执行”的 Client-Server 架构，严格分离了数据控制权与本地物理机器的执行权。整个系统由以下四个核心工程组成：

### 1.1 `cloud-api` (云端控制中心 / 远程后端)
- **部署位置**：远程云服务器（如 AWS, 阿里云等）。
- **技术栈**：Node/Bun + Express + PostgreSQL + Drizzle ORM。
- **职责**：
  - 系统的“大脑”，负责维护全局状态和核心数据。
  - 管理所有环境配置、指纹信息、代理 IP 池和账号密码。
  - 对外提供标准化的 RESTful API 供客户端请求。
  - **注意**：绝对不直接操控终端用户的电脑进程。

### 1.2 `desktop-base` (桌面客户端外壳)
- **部署位置**：终端用户的个人电脑（Windows/macOS）。
- **技术栈**：Electron。
- **职责**：
  - 作为底层容器，将前端 UI 和本地执行守护进程包裹在一起，最终打包为可执行文件（`.exe` / `.dmg`）分发给用户。
  - 提供跨平台的原生系统级能力（如窗口管理、托盘、自动更新等）。

### 1.3 `browser-web` (前端 UI 界面)
- **部署位置**：终端用户的个人电脑（作为静态资源内嵌于 `desktop-base` 中）。
- **技术栈**：Next.js (Static Export / SPA 模式) + React + Tailwind CSS + shadcn/ui。
- **职责**：
  - 用户的可视化交互界面。
  - 向上级（云端 `cloud-api`）请求和修改环境配置、用户数据等。
  - 向下级（本地 `local-daemon`）发送最终的执行指令（如拉起浏览器）。

### 1.4 `local-daemon` (本地无状态执行进程)
- **部署位置**：终端用户的个人电脑（随 `desktop-base` 启动并在后台静默运行）。
- **技术栈**：Node/Bun + Child Process。
- **职责**：
  - “执行者的手”，一个轻量级的纯本地无状态守护进程（监听 `localhost:4001` 或走 Electron IPC 通信）。
  - 接收来自 `browser-web` 传递过来的组装好的启动参数 (`cli_args`)。
  - 使用 `spawn` 唤起和管理本机的物理 `chrome.exe`（定制版 Chromium）进程，分配隔离的 `--user-data-dir` 实现彻底的物理防关联。

---

## 2. 核心数据流转：浏览器启动链路 (Start Environment)

为贯彻分布式架构设计，启动环境的数据流必须符合以下链路：

1. **用户操作**：用户在本地客户端 (`browser-web`) 点击特定环境的“打开”按钮。
2. **请求组装**：`browser-web` 发起 HTTP 请求调用远程 `cloud-api` 的启动前置接口。
3. **云端响应**：`cloud-api` 在数据库标记状态为“启动中”，并抓取该环境的代理、指纹配置，生成浏览器底层所需要的完整指令参数组 (`cli_args`字典)，**响应并下发**给前端。
4. **前端转发**：`browser-web` 接收到云端下发的 `cli_args`，接着对本地机器的 `local-daemon` 发送 `http://localhost:4001/api/start` 请求，并将参数投喂给它。
5. **本地拉起**：本地 `local-daemon` 收到后，执行命令（包含独立的数据缓存目录），浏览器成功在用户桌面上弹起。

---

## 3. 当前开发进度

### ✅ 已完成功能
- **数据库与云端基座 (`cloud-api`)**：
  - 已完成 PostgreSQL + Drizzle ORM 的搭建，设计了涵盖环境、指纹、代理、账号的表结构。
  - 完成了云端增、删、改、查的后端逻辑。
  - **重要重构**：统一了 `ApiResponse` 标准响应体，确保了 API 规范性。
  
- **前端交互 (`browser-web`)**：
  - 实现了新建环境与快捷编辑的表单联动，处理了复杂表单的生命周期。
  - **技术攻关**：成功剥离 Next.js 服务端渲染 (SSR) 特性带来的 Hydration 冲突，将参数读取改为纯客户端路由 (`window.location.search`)，确保后续能完美降级为纯静态 HTML 供 Electron 嵌入。
  
- **本地控制 (`local-daemon`)**：
  - 核心脚本已完成，支持接收参数、进程唤起（`spawn`）并剥离父子进程 (`unref`)，支持强制关闭残留进程。

### 🚨 待修复 / 待推进工作 (Next Steps)
1. **重构云端的拉起逻辑**：移除 `cloud-api` 中直接调用 `http://localhost:4001` 的逻辑，将其改为仅组装和返回 `cli_args` 参数。
2. **补全前端的二次中转逻辑**：在 `browser-web` 拿到云端响应后，通过前端 Ajax/Fetch 把数据打入本地的 `4001` 守护进程中。
3. **Electron 工程整合 (`desktop-base`)**：将静态输出的前端产物和本地 API 脚本整合成统一的 Electron 生命周期管理（确保客户端关闭时，杀掉所有相关的幽灵进程）。

---

## 4. 本地客户端数据与缓存目录规范 (Local Data & Storage Structure)

为了确保打包后的 Electron 应用能够正确执行，并保证后期云端同步（上传/拉取 Profile 数据）顺利进行，客户端必须严格规范底层数据的存储路径。

基于 `desktop-base` 的设计，Electron 客户端的本地数据统一存储在操作系统提供的标准应用数据目录下，由 `app.getPath('userData')` 动态获取：
- **Windows**: `%APPDATA%\<ProductName>\` (通常为 `%APPDATA%\JoiiBerry\`)
- **macOS**: `~/Library/Application Support/<ProductName>/`
- **Linux**: `~/.config/<ProductName>/`

### 4.1 目录结构标准 (UserData 目录)

通过查阅 `ResourceManager` 和 `ServerManager` 源码，明确以下目录结构：

```text
JoiiBerry (userDataPath)/
├── web/                     # 前端 UI 静态资源解压目录 (browser-web 编译产物)
│   └── index.html           # 客户端主界面入口点
├── resources/               # 本地可执行文件与资源 (Server Binary)
│   ├── local-daemon.js      # 本地守护进程执行脚本 (打包后的 browser-api)
│   └── ...                  # 其他资源文件
├── updates/                 # OTA 热更新包临时下载与解压目录
├── installed.json           # 记录当前已安装资源版本的文件
├── logs/                    # 各种日志 (由 electron-log 管理)
│   ├── main.log             # Electron 主进程日志
│   └── ...                  # local-daemon 输出的独立日志也可以重定向至此
├── profiles/                # 浏览器环境隔离数据（核心资产区，由 local-daemon 创建）
│   ├── <environment_id_A>/  # 以环境 ID 命名的隔离目录 (传入为 --user-data-dir)
│   │   ├── Default/         # Chromium 核心数据区 (Cookies, Local Storage, IndexedDB, 书签等)
│   │   ├── sync_meta.json   # 记录该环境上次同步版本、时间戳、文件 Hash
│   │   └── cache/           # 浏览器运行缓存 (可安全丢弃)
│   ├── <environment_id_B>/  
│   └── ...
└── temp/                    # 临时文件目录 (扩展使用)
```

### 4.2 各类信息获取与调用方法标准

1. **配置信息获取 (Config)**
   - Electron 主进程启动时，会从打包目录的 `resources/app.config.json` 加载全局配置，其中定义了需要启动的本地服务器（如 `local-daemon`）及其端口、环境变量。
2. **下载与解压执行 (Updates & Web Assets)**
   - `ResourceManager` 在启动时会将内置的 `web/` 和 `resources/` 复制到用户数据目录 (`userDataPath`)，确保这些资源能在无权限拦截的目录下执行，并且后续可通过下载更新包替换该目录内容实现“热更新”。
3. **本地环境与服务调用 (Process Execution)**
   - `ServerManager` 负责根据配置从 `resources/` 目录下启动 `local-daemon` 守护进程。
   - 守护进程的环境变量中会注入 `APP_DATA_DIR`（等同于 `userDataPath`），确保守护进程能正确找到根目录，并在其下创建 `profiles/`。
4. **日志处理 (Logging)**
   - Electron 主进程使用 `electron-log` 库，日志统一输出到 `logs/main.log`。
   - `ServerManager` 会监听 `local-daemon` 的 `stdout` 和 `stderr`，并将输出统一桥接到主进程日志，方便集中排查错误。

### 4.3 云端同步 (Cloud Sync) 策略设计

为满足协作中同一个 `environment_id` 能在不同电脑上还原真实环境状态，制定以下规范：

1. **核心数据分离上传**：同步时仅打包 `APP_DATA_DIR/profiles/<environment_id>/Default/` 下的关键数据文件夹（如 `Cookies`、`Local Extension Settings`、`IndexedDB` 等）。
2. **过滤冗余缓存**：为避免占用极大带宽，上传云端时**强制排除**各种临时缓存文件，如 `Cache/`、`Code Cache/`、`GPUCache/`、`Service Worker/CacheStorage/`。
3. **版本比对机制**：借助同目录下的 `sync_meta.json` 记录本地文件的最后更新时间。启动浏览器前，先校验本地版本和云端版本；如果云端版本更新，则触发下载拉取；关闭浏览器后，计算本地增量并触发后台异步上传。
4. **加密与压缩**：在本地压缩并使用环境级别的 AES 秘钥加密后，再经由 `cloud-api` 传输至云存储（如 AWS S3 / MinIO），以保证用户浏览器隐私数据的绝对安全。
