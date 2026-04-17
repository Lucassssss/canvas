# 跨境电商防关联浏览器技术架构与实施指导

## 1. 架构总览
为了满足极限的防风控需求，整体架构坚决摒弃“通过插件或 JS 注入（如 Puppeteer Stealth）”的民科方案（极容易被 iframe 穿透等特征识破）。必须走**“Chromium 源码深度定制”**的重型路线。

全局划分为三个模块：
1. **定制内核 Core (C/C++)**：重度修改的 Chromium。
2. **客户端外壳 Shell (Rust/Tauri 或 Electron)**：负责环境编排、配置代理并拉起内核。
3. **中央云服务 Cloud (Go/Node.js)**：鉴权、配置下发与数据备份。

---

## 2. 浏览器内核设计（高优先级核心）

### 2.1 技术选型与构建
- **基线选择**：选择 Chromium 最新稳定版分支（如 M120+）。可参考 `ungoogled-chromium` 或 `Brave Browser` 的防追踪补丁作为灵感。
- **编译架构**：采用 `gn` + `ninja`。准备专用的高性能编译服务器（建议 32 核 64G 以上，减少单次编译需耗费数小时的问题）。

### 2.2 防护机制魔改策略点 (C++ 源码修改)

**A. Canvas 与 WebGL 指纹替换 (核心)**
- 原理：显卡型号和驱动差别会在绘制同一图形时产生像素级哈希差。
- 实施：修改 `third_party/blink/renderer/modules/canvas/canvas2d/` 及 WebGL 的底层绘制 API。
- 逻辑：通过客户端传递进来的指纹哈希（Seed），通过算法在 `toDataURL` 提取图像像素时，在极低位的通道层增加恒定的极微小噪点。

**B. Client Rects / 硬件布局特征**
- 原理：底层系统字体大小排版的微小差别。
- 实施：修改 Blink 渲染引擎在计算 `getBoundingClientRect()` 的测量补偿值。

**C. WebRTC 与 IP 穿透隔离**
- 原理：WebRTC 的打洞机制会绕开 HTTP 代理直接获取真实网卡信息。
- 实施：修改 `third_party/webrtc`，强制拦截 `RTCPeerConnection` 中关于本地内网 IP（如 192.168.x.x）及直连公网 IP 的收集探测，只允许特定的代理隧道地址通过。

**D. 字库指纹 (Font Fingerprint)**
- 原理：各系统安装的各类设计软件引发的独特字体库。
- 实施：修改底层 Font 枚举器，切断向操作系统索要全部安装字体的机制。仅根据环境所需的“系统模板（Mac/Win）”返回标准的、无特征的系统默认字体清单。

**E. 硬件参数造假 (Device RAM/CPU)**
- 拦截并固化 `navigator.hardwareConcurrency` 与 `navigator.deviceMemory`。

### 2.3 客户端与内核通信层
- 启动 Chromium 实例时，外壳将通过自定义的 **CLI Args** 或特定的配置 JSON 文件写入上述特征参数（Seed）。
- `chrome.exe --custom-gpu-vendor="Apple" --custom-audio-seed="uuid" --proxy-server="socks5://xxx"` 等自定义启动指令扩展。

---

## 3. 客户端外壳架构 (Tauri 推荐)

- **为何推荐 Tauri 而非 Electron**：我们需要极致降低客户端本身的内存占用，因为卖家经常要同屏多开 10～20 个浏览器窗口。Tauri 是基于系统 WebView 的，客户端自身极其轻量，不会占用大量内存。
- **本地数据管理**：利用 SQLite 保存并维护各个 Profile 环境。
- **代理映射管理器**：需要在本地监听不同端口以隧道化分发各 Profile 代理，保障网络高可用。

## 4. 后续执行建议计划
1. **准备期**：租赁云端高配服务器，搭建 Chromium 编译流水线，成功跑通第一次干净源码的构建并打包出不同操作系统的可执行文件。
2. **攻坚期**：在 C++ 层逐步集成上述“伪装策略”，结合 CreepJS (https://abrahamjuliot.github.io/creepjs/) 进行实战拨测，直到评级分达到 100% 信任且未检测出明显篡改痕迹。
3. **联调期**：编写客户端，测试带特征参数唤起子进程。
