@echo off
echo ========================================================
echo Installing Visual Studio dependencies for Chromium...
echo ========================================================

:: 使用 winget 或者 vswhere 找到 VS 2026 installer
set VSINSTALLER="%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vs_installer.exe"

if not exist %VSINSTALLER% (
    echo [ERROR] Visual Studio Installer not found!
    echo Please ensure Visual Studio 2026 (>=17.0.0) is installed.
    pause
    exit /b
)

echo Adding required C++ Desktop, MFC, ATL and Windows 11 SDK (10.0.26100.7705) debugging tools...
echo This might take a while to download and install.

%VSINSTALLER% modify ^
  --installPath "%ProgramFiles%\Microsoft Visual Studio\2026\Community" ^
  --add Microsoft.VisualStudio.Workload.NativeDesktop ^
  --add Microsoft.VisualStudio.Component.VC.ATLMFC ^
  --add Microsoft.VisualStudio.Component.Windows11SDK.26100 ^
  --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 ^
  --includeRecommended ^
  --quiet --norestart

echo ========================================================
echo IMPORTANT: For the Debugging Tools for Windows (essential for Chromium build),
echo You must open Control Panel -^> Programs and Features
echo Find your Windows Software Development Kit (10.0.26100), click "Change"
echo Select "Debugging Tools for Windows" and install it.
echo ========================================================
pause
