# Canvas 独立指纹控制 — 技术债文档

## 问题描述

在当前的 `fingerprint-chromium`（Chrome 142）架构中，**Canvas 像素噪音无法脱离 `--fingerprint` 总开关独立工作**。

### 根因

查阅 `patches/extra/fingerprint/012-canvas-get-image-data.patch` 的核心条件：

```cpp
// base_rendering_context_2d.cc
if (read_pixels_successful && command_line->HasSwitch(switches::kFingerprint)) {
    StaticBitmapImage::ShuffleSubchannelColorData(image_data_pixmap.addr(), ...)
}

// image_data_buffer.cc (toDataURL 路径)
if (command_line->HasSwitch(switches::kFingerprint)) {
    StaticBitmapImage::ShuffleSubchannelColorData(pixmap_.writable_addr(), ...)
}
```

**`ShuffleSubchannelColorData`（真像素级噪音）只有在检测到 `--fingerprint` 开关时才会被调用。**

官方文档明确说明：

> `--fingerprint`：指定指纹种子(seed)，**启用后大部分指纹功能生效**（32位整数）

所有 Canvas、Audio、Font、ClientRects 的噪音均通过此总开关统一激活。

---

## 由此引发的架构矛盾

`--fingerprint` 是**全局种子**，一旦传入，将同时影响：
- Canvas 像素噪音
- Audio 波形噪音  
- 字体渲染差异
- ClientRects 偏移
- GPU 元数据生成（139+ 版本自动启用）

**当我们希望 `webglMode=real`（WebGL 完全透出真实物理 GPU）时：**

| 场景 | 问题 |
|------|------|
| 传 `--fingerprint` + `--disable-spoofing=gpu` | `--disable-spoofing=gpu` 只屏蔽显式 `--fingerprint-gpu-vendor/renderer` 注入，无法阻止种子驱动的底层 GPU 随机化 |
| 不传 `--fingerprint` | Canvas/Audio 噪音也同时关闭，所有环境 Canvas 指纹相同，防关联失效 |

**两者无法同时满足**，除非修改 C++ 源码。

---

## 解决方案

### 方案：新增 `--fingerprint-canvas` 独立参数

在 Chromium 源码 patch 中新增一个 Canvas 专属开关，使 Canvas 噪音可独立于 `--fingerprint` 总开关工作。

#### 需要修改的 patch 文件（共约 16 行 C++）

**`000-add-fingerprint-switches.patch`**（新增 switch 常量）
```diff
+// Specify the canvas fingerprint seed (independent of --fingerprint)
+const char kFingerprintCanvas[] = "fingerprint-canvas";
```

**`012-canvas-get-image-data.patch`**（扩展激活条件）
```diff
-if (read_pixels_successful && command_line->HasSwitch(switches::kFingerprint)) {
+if (read_pixels_successful &&
+    (command_line->HasSwitch(switches::kFingerprint) ||
+     command_line->HasSwitch(switches::kFingerprintCanvas))) {
```

在 `ShuffleSubchannelColorData` 内部，扩展 seed 读取：
```diff
-if (command_line->HasSwitch(switches::kFingerprint)) {
-    seed_str = command_line->GetSwitchValueASCII(switches::kFingerprint);
-}
+if (command_line->HasSwitch(switches::kFingerprintCanvas)) {
+    seed_str = command_line->GetSwitchValueASCII(switches::kFingerprintCanvas);
+} else if (command_line->HasSwitch(switches::kFingerprint)) {
+    seed_str = command_line->GetSwitchValueASCII(switches::kFingerprint);
+}
```

**`013-canvas-toDataURL.patch`**（同步扩展 toDataURL 路径）
```diff
-if (readback_type == ReadbackType::kWebExposed &&
-    command_line->HasSwitch(switches::kFingerprint)) {
+if (readback_type == ReadbackType::kWebExposed &&
+    (command_line->HasSwitch(switches::kFingerprint) ||
+     command_line->HasSwitch(switches::kFingerprintCanvas))) {
```

#### 修改后的调用方式

```bash
# WebGL 真实 + Canvas 独立噪音（不再冲突）
--fingerprint-canvas=2135059350   # 仅驱动 Canvas 像素差异
--fingerprint-gpu-vendor=...      # 不传，宿主机 GPU 完全透出

# 全量噪音（保持原有行为）
--fingerprint=2135059350          # Canvas + Audio + Font + GPU 全部启用
```

---

## 编译成本评估

| 环境 | 配置 |
|------|------|
| 构建命令 | `autoninja -C out/Release chrome` |
| `is_component_build` | `false`（全量链接 chrome.exe） |
| `chrome_pgo_phase` | `0`（无 PGO，节省二次编译） |
| `symbol_level` | `0`（无调试符号，节省链接时间） |

| 阶段 | 估计时间 |
|------|---------|
| 增量编译（~20-25 个受影响 TU） | 15–30 分钟 |
| 全量重链 chrome.exe（is_component_build=false 的代价） | 45–120 分钟 |
| **总计** | **1–2.5 小时** |

链接是主要瓶颈。32 核以上机器可压到约 45 分钟，8 核机器约 1.5–2 小时。

---

## 当前临时策略（暂行方案）

在上述 patch 实施之前，使用 `--fingerprint` 全局种子作为统一方案：

- `webglMode=custom`：配合 `--fingerprint` 种子 + `--fingerprint-gpu-vendor/renderer` 显卡字符串，实现 Canvas 和 WebGL 双重隔离。
- `webglMode=real`：**接受 Canvas 与 WebGL 在同一物理机上指纹相同的限制**，主要适用于高对抗平台（Ticketmaster 等）单账号场景。
- 中期建议：对于生产多账号环境，推荐统一使用 `custom` 模式，配合真实显卡池数据。
