# 手动下载 Chromium 源码指南 (国内环境)

既然您打算亲自处理庞大的 Chromium 源码下载过程，这里为您提供一条最稳妥的路径。强烈建议您在空间充足的 **D 盘** 进行。

## 第一步：补全 Visual Studio 构建组件
我已经帮您写好了一个自动补充安装关联组件的脚本。请您**右键以管理员身份运行**这个脚本：
[`install_vs_deps.bat`](file:///d:/ai/canvas/apps/browser/install_vs_deps.bat)
> *注：请注意脚本运行完毕后的打印提示，您可能需要去"控制面板"里手动勾选 `Debugging Tools for Windows` (因为命令行无法静默安装该调试工具)。*

## 第二步：配置代理并克隆官方 depot_tools

既然您会使用代理，请**首先**将全局终端网络连通（假设您的本地代理端口为 7890）：
```cmd
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

1. 在 `D:\chromium_build` 目录下，直接克隆 **Chromium 官方**的工具链：
   ```cmd
   cd /d D:\chromium_build
   git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
   ```
2. **非常重要**：将 `D:\chromium_build\depot_tools` 添加到系统的环境变量 `PATH` 的 **最前面**。
3. 打开一个**全新的终端**（确保 PATH 已经生效，再次挂载上面的 `HTTP_PROXY`，且确认关闭 conda），配置以下底层的脱机编译变量：
   ```cmd
   set DEPOT_TOOLS_WIN_TOOLCHAIN=0
   set DEPOT_TOOLS_UPDATE=0
   set vs2026_install=C:\Program Files\Microsoft Visual Studio\2026\Community
   ```

## 第三步：同步源码 (最耗时的步骤)

确保处于 `D:\chromium_build` 下，并且终端已经挂载了上一步配置的代理变量后：
```cmd
# 1. 建立空目录
mkdir chromium && cd chromium

# 2. 如果您希望极速下载，不需要历史 commit 记录：
fetch --no-history chromium

# 3. 如果上面的过程因为网络断开报错中止，使用以下命令不断重试，直到成功：
gclient sync --with_branch_heads --no-history
```

当 `gclient sync` 最终跑完并提示 `Running hooks: 100% ... done.` 时，说明环境彻底就绪。

## 第四步：初步编译测试
等您把几十 GB 的代码下载完整后，我们可以先试水编译一把原版，确保没问题后再去改 C++ 底层。
```cmd
cd src
gn gen out/Default
autoninja -C out/Default chrome
```

祝您顺畅！等代码完完整整躺在您的硬盘上并且能够通过初次编译时，请通知我，我们将进入真正的 `Phase 1: 内核魔改实现`，去 `third_party/blink` 中对抗 Canvas 和 WebGL 的指纹检测。
