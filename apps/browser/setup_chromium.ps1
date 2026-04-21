#!/usr/bin/env powershell
# =============================================================================
# AntiDetect Browser - Chromium 自动化构建脚本
# 适用系统：Windows Server 2022 / Windows 11
# 机器配置：推荐 64 vCPU / 256G RAM（阿里云 ecs.g9i.16xlarge）
# 使用方法：以管理员权限在 PowerShell 中执行
#   .\setup_chromium.ps1
#   .\setup_chromium.ps1 -Mode patch -PatchFile ".\antidetect_v1.patch"
# =============================================================================

param(
    [string]$Mode = "full",          # full=完整构建, patch=打补丁并增量编译, hooks=只跑hooks
    [string]$Version = "147.0.7727.107",  # Chromium 版本号
    [string]$WorkDir = "C:\chrome",  # 工作目录（建议数据盘）
    [string]$PatchFile = "",          # 补丁文件路径（Mode=patch 时使用）
    [int]$Jobs = 0                    # 编译并发数，0=自动（高配服务器不限制）
)

$ErrorActionPreference = "Stop"
$DepotToolsDir = "$WorkDir\depot_tools"
$SrcDir = "$WorkDir\src"
$GitCacheDir = "$WorkDir\git_cache"
$OutDir = "$SrcDir\out\Default"

# =============================================================================
# 工具函数
# =============================================================================
function Log-Info($msg)    { Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Log-Success($msg) { Write-Host "[OK]    $msg" -ForegroundColor Green }
function Log-Warn($msg)    { Write-Host "[WARN]  $msg" -ForegroundColor Yellow }
function Log-Error($msg)   { Write-Host "[ERROR] $msg" -ForegroundColor Red }

function Run-Cmd($cmd, $workdir = $null) {
    Log-Info "执行: $cmd"
    if ($workdir) {
        cmd.exe /c "cd /d `"$workdir`" && $cmd"
    } else {
        cmd.exe /c $cmd
    }
    if ($LASTEXITCODE -ne 0) {
        throw "命令执行失败，退出码: $LASTEXITCODE`n命令: $cmd"
    }
}

# =============================================================================
# Step 0: 配置环境变量（当前会话临时生效）
# =============================================================================
function Setup-Env {
    Log-Info "配置编译环境变量..."

    # 确保 Git 在 depot_tools 之前（关键！避免 git.bat 冲突导致 WinError 2）
    $gitCmd = "C:\Program Files\Git\cmd"
    $env:PATH = "$gitCmd;$DepotToolsDir;$env:PATH"

    $env:DEPOT_TOOLS_WIN_TOOLCHAIN = "0"
    $env:GIT_CACHE_PATH = $GitCacheDir
    $env:PYTHONUTF8 = "1"
    # 注意：新机器首次运行不设置 DEPOT_TOOLS_UPDATE=0
    # 等 gclient sync 完成后再考虑设置

    # VS 2026 路径（根据实际安装路径调整）
    $vsPath = "C:\Program Files\Microsoft Visual Studio\18\Community"
    if (Test-Path $vsPath) {
        $env:vs2026_install = $vsPath
        Log-Success "VS 2026 已找到: $vsPath"
    } else {
        Log-Warn "未找到 VS 2026，请确认已安装"
    }

    Log-Success "环境变量配置完成"
}

# =============================================================================
# Step 1: 安装前置软件（Git）
# =============================================================================
function Install-Prerequisites {
    Log-Info "检查前置软件..."

    # 检查 Git
    try {
        $gitVer = (git --version 2>&1)
        Log-Success "Git 已安装: $gitVer"
    } catch {
        Log-Info "安装 Git..."
        Run-Cmd "winget install --id Git.Git -e --source winget --silent"
        # 重新加载 PATH
        $env:PATH += ";C:\Program Files\Git\cmd"
        Log-Success "Git 安装完成"
    }
}

# =============================================================================
# Step 2: 拉取 depot_tools
# =============================================================================
function Setup-DepotTools {
    if (Test-Path "$DepotToolsDir\.git") {
        Log-Success "depot_tools 已存在，跳过克隆"
    } else {
        Log-Info "拉取 depot_tools..."
        New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null
        Run-Cmd "git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git `"$DepotToolsDir`""
        Log-Success "depot_tools 拉取完成"
    }

    # 创建 git_cache 目录
    New-Item -ItemType Directory -Force -Path $GitCacheDir | Out-Null
}

# =============================================================================
# Step 3: 拉取 Chromium 源码（指定版本）
# =============================================================================
function Clone-ChromiumSrc {
    if (Test-Path "$SrcDir\.git") {
        Log-Success "src 目录已存在，跳过克隆"
        return
    }

    Log-Info "克隆 Chromium 源码，版本: $Version（这需要一些时间，云端带宽快约 5~15 分钟）..."
    New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null

    Run-Cmd "git clone -b $Version --depth 1 https://chromium.googlesource.com/chromium/src.git `"$SrcDir`""
    Log-Success "Chromium 源码克隆完成"
}

# =============================================================================
# Step 4: 配置 .gclient 并同步 third_party 依赖
# =============================================================================
function Sync-Dependencies {
    $gclientFile = "$WorkDir\.gclient"

    if (-not (Test-Path $gclientFile)) {
        Log-Info "生成 .gclient 配置文件..."
        Run-Cmd "gclient config --unmanaged https://chromium.googlesource.com/chromium/src.git" $WorkDir
    }

    Log-Info "同步所有 third_party 依赖（约下载 5~10G，请耐心等待）..."
    Run-Cmd "gclient sync --no-history --with_branch_heads --with_tags" $WorkDir
    Log-Success "依赖同步完成"
}

# =============================================================================
# Step 5: 生成编译配置文件 args.gn
# =============================================================================
function Write-ArgsGn {
    New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

    $argsContent = @"
# AntiDetect Browser Build Configuration
# 高配服务器（256G+）使用 is_component_build = false
# 低配本地机（32G）使用 is_component_build = true
is_component_build = false
is_debug = false
symbol_level = 0
blink_symbol_level = 0
v8_symbol_level = 0
target_cpu = "x64"
dcheck_always_on = true

# ==========================================
# Ungoogled Chromium Flags (Anti-Telemetry)
# ==========================================
google_api_key = ""
google_default_client_id = ""
google_default_client_secret = ""
use_official_google_api_keys = false
enable_reporting = false
disable_fieldtrial_testing_config = true
enable_mdns = false
enable_service_discovery = false
enable_hangout_services_extension = false
"@

    $argsContent | Out-File -FilePath "$OutDir\args.gn" -Encoding ASCII
    Log-Success "args.gn 写入完成"

    Log-Info "执行 gn gen 生成 Ninja 构建文件..."
    Run-Cmd "gn gen out\Default" $SrcDir
    Log-Success "gn gen 完成"
}

# =============================================================================
# Step 6: 执行编译
# =============================================================================
function Build-Chrome {
    $jobsArg = if ($Jobs -gt 0) { "-j $Jobs" } else { "" }
    Log-Info "开始编译 Chrome...（高配服务器约 30~45 分钟）"
    Run-Cmd "autoninja -C out\Default chrome $jobsArg" $SrcDir
    Log-Success "编译完成！输出: $OutDir\chrome.exe"
}

# =============================================================================
# Step 7: 应用补丁并增量编译
# =============================================================================
function Apply-Patch {
    if (-not $PatchFile -or -not (Test-Path $PatchFile)) {
        Log-Error "补丁文件不存在: $PatchFile"
        exit 1
    }

    $absPath = (Resolve-Path $PatchFile).Path
    Log-Info "应用补丁: $absPath"
    Run-Cmd "git apply `"$absPath`"" $SrcDir
    Log-Success "补丁应用成功"

    Log-Info "开始增量编译（只重编改动文件，约几十秒）..."
    $jobsArg = if ($Jobs -gt 0) { "-j $Jobs" } else { "" }
    Run-Cmd "autoninja -C out\Default chrome $jobsArg" $SrcDir
    Log-Success "增量编译完成！"
}

# =============================================================================
# 主程序入口
# =============================================================================
function Main {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Magenta
    Write-Host "  AntiDetect Browser - Chromium 构建工具" -ForegroundColor Magenta
    Write-Host "  Mode: $Mode | Version: $Version"       -ForegroundColor Magenta
    Write-Host "  WorkDir: $WorkDir"                     -ForegroundColor Magenta
    Write-Host "=========================================" -ForegroundColor Magenta
    Write-Host ""

    # 所有模式都需要配置环境
    Setup-Env

    switch ($Mode) {
        "full" {
            # 完整构建流程（新服务器首次使用）
            Install-Prerequisites
            Setup-DepotTools
            Clone-ChromiumSrc
            Sync-Dependencies
            Write-ArgsGn
            Build-Chrome
        }
        "patch" {
            # 打补丁并增量编译（日常开发用）
            Setup-Env
            Apply-Patch
        }
        "hooks" {
            # 只跑 hooks（gn.exe 丢失时用）
            Setup-DepotTools
            Run-Cmd "gclient runhooks" $WorkDir
            Log-Success "Hooks 执行完成"
        }
        "build" {
            # 只重新编译（源码已就绪时用）
            Write-ArgsGn
            Build-Chrome
        }
        default {
            Log-Error "未知模式: $Mode，可选值：full / patch / hooks / build"
            exit 1
        }
    }

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "  全部完成！" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
}

Main
