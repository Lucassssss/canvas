# 浆果浏览器 (Joii Browser) - 研发交接文档

**日期**：2026年4月29日
**项目名称**：浆果浏览器 (Joii Browser)
**核心架构**：Electron 主壳 (`desktop-base`) + Next.js 前端 (`browser-web`) + Bun 本地守护进程 (`local-daemon`) + 云端 API (`cloud-api`) + 定制版 Chromium 内核

---

## 1. 当前架构与核心机制

为了彻底解决硬编码路径、依赖混乱以及旧进程锁死的问题，项目底层的目录结构和进程生命周期刚刚经历了一次深度的重构。目前应用处于非常干净且高度“可动态化”的架构状态。

### 1.1 全局唯一数据目录中心
整个桌面的所有产生数据、二进制模块、配置和浏览器实体，已全部收口至统一的用户目录：
**根目录**：`%APPDATA%\jbrowser\jdata`

| 目录/文件 | 用途说明 |
| :--- | :--- |
| `log/main.log` | Electron 主进程与守护进程混合输出的业务日志，排错首选 |
| `bin/jbrowser-server.exe` | 本地守护进程本体 (Local Daemon)，由 Electron 启动 |
| `web/` | 前端静态页面目录。Electron 会拦截 `app://web` 协议直接访问该目录。**OTA更新机制的基础** |
| `run/` | 运行状态锁、PID 锁文件夹，防止多开或意外的僵尸残留 |
| `browser/{version}/` | 按内核版本隔离的定制 Chromium 引擎存放处（如 `c142/chrome.exe`） |
| `profile/{id}/` | 实际挂载给 Chromium 的用户指纹隔离数据目录 (User Data Dir) |
| `download-cache/` | 内核/OTA更新下载时的缓存目录，解压后会自动清理 |

### 1.2 进程生命周期与防卡死机制
1. **清理清场**：`desktop-base` (Electron 主进程) 启动的第一时间，会主动通过 `taskkill` 杀掉所有残留的 `jbrowser-server.exe` 僵尸进程。
2. **资源提取**：Electron 检查并把打包在内部的 `web/` 与 `resources/` (重命名为 bin) 同步释放到 `%APPDATA%\jbrowser\jdata\` 中（采用强制覆盖策略保证二进制最新）。
3. **协议拦截**：Electron 注册 `app://` 协议，把界面的网络请求物理路由到 `jdata/web` 下。
4. **进程拉起**：启动 `jbrowser-server.exe`，监听 `4003` 端口，等待前端调用。

### 1.3 内核动态下载与版本隔离
目前完全摒弃了在 `cloud-api` 硬编码启动目录的方案。
- 前端 (`browser-web`) 在调用检测、安装、启动接口时，显式携带 `version=c142` 参数。
- 本地守护进程 (`local-daemon`) 负责下载 ZIP，缓存到 `download-cache`，并解压到 `browser/c142/`。
- 启动环境时，`local-daemon` 自动将 `--user-data-dir=%APPDATA%\jbrowser\jdata\profile\{id}` 动态注入给 Chrome 启动参数。

---

## 2. 下一步开发计划 (Next Steps)

下接手的同事可以无缝在目前已打通的底层架构上，开展以下三个核心维度的业务模块开发：

### 模块一：静态前端的动态热更新 (UI OTA)
> **依赖机制**：因为 `app://` 协议已经完全指向了用户可读写的 `%APPDATA%\jbrowser\jdata\web` 目录。
- **任务**：在本地守护进程中新增一个 `/api/update/web` 的端点。
- **流程**：该端点拉取云端最新的前端 ZIP 包 -> 下载到 `download-cache` -> 解压覆盖 `jdata\web` 内的现有文件 -> 通知前端执行一次 `window.location.reload()`。即可实现无缝秒更 UI。

### 模块二：底层守护进程的热更新 (Daemon OTA)
> **依赖机制**：主进程的 `taskkill` 和 `resource-manager.ts` 的强制覆盖机制已就绪。
- **任务**：处理 `jbrowser-server.exe` 本身的更新。
- **流程**：当发现守护进程新版本时，下载新的 `.exe` 到特定更新目录（如 `jdata/updates`）。提示用户重启应用。应用重启时 Electron 的主进程检查到有新版本，将其覆盖到 `jdata/bin/` 后再正常走启动流程。

### 模块三：群控自动化协议与 Cloud API 联调
- **当前状态**：云端的代理查询 (`check-proxy`) 和 参数拼装 (`start`) 已联通，本地可以成功提取环境 ID 并唤起隔离版的浏览器。
- **任务**：
  1. 完善基于 WebSocket / CDP 协议的多窗口同步操作 (Sync) 和 RPA 宏回放。
  2. 实现本地环境变量（书签、扩展程序、Cookie 等）与 Cloud API 数据库的定时静默双向同步。
  3. 完善用户界面的数据大盘对接。

---

## 3. 注意事项
1. **调试日志**：本地开发如遇桌面端启动无响应，请第一时间检查 `%APPDATA%\jbrowser\jdata\log\main.log`。
2. **强制清理**：如果在开发守护进程时导致端口占用，可以通过运行 `taskkill /F /IM jbrowser-server.exe /T` 来暴力释放锁。
3. **环境参数校验**：如对浏览器指纹（UserAgent/WebGL 等）的生成逻辑有修改，请前往 `cloud-api` 的 `environment.service.ts` 内统一处理，本地 `local-daemon` 仅作为忠实的参数透传和执行者。
