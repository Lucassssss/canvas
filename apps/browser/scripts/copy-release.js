#!/usr/bin/env node
// copy-release.js — 将 Chromium Release 编译产物复制到分发目录
// 用法: node copy-release.js [目标目录]
//       bun  copy-release.js [目标目录]
// 示例: node copy-release.js E:\chromium\c142

const fs   = require("fs");
const path = require("path");

// ── 路径配置 ──────────────────────────────────────────────
const DEST   = process.argv[2] || "E:\\chromium\\c142";
const SOURCE = path.resolve(__dirname, "..", "chromium142", "src", "out", "Release");

// ── 必须文件（缺一报错） ──────────────────────────────────
const REQUIRED_FILES = [
  // 核心可执行
  "chrome.exe",
  "chrome.dll",
  "chrome_elf.dll",
  "chrome_proxy.exe",

  // SxS Manifest（必须！缺了 chrome.exe 无法启动）
  "142.0.7444.175.manifest",

  // MSVC 运行时（缺了报 side-by-side 错误）
  "msvcp140.dll",
  "msvcp140_atomic_wait.dll",
  "vcruntime140.dll",
  "vcruntime140_1.dll",
  "vccorlib140.dll",

  // 数据文件
  "icudtl.dat",
  "snapshot_blob.bin",
  "v8_context_snapshot.bin",
  "chrome_100_percent.pak",
  "chrome_200_percent.pak",
  "resources.pak",

  // GPU / 渲染
  "libEGL.dll",
  "libGLESv2.dll",
  "d3dcompiler_47.dll",
  "vk_swiftshader.dll",
  "vk_swiftshader_icd.json",
  "vulkan-1.dll",
];

// ── 可选文件（存在则复制，不存在跳过） ───────────────────
const OPTIONAL_FILES = [
  "notification_helper.exe",
  "elevation_service.exe",
  "chrome_pwa_launcher.exe",
  "chrome_wer.dll",
];

// ── 必须复制的目录 ────────────────────────────────────────
const REQUIRED_DIRS = ["locales"];

// ── 颜色工具 ─────────────────────────────────────────────
const c = {
  cyan:  (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red:   (s) => `\x1b[31m${s}\x1b[0m`,
  gray:  (s) => `\x1b[90m${s}\x1b[0m`,
  bold:  (s) => `\x1b[1m${s}\x1b[0m`,
};

function toMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

function getFileSize(p) {
  try { return fs.statSync(p).size; } catch { return 0; }
}

function getDirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? getDirSize(full) : getFileSize(full);
  }
  return total;
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

// ── 主流程 ────────────────────────────────────────────────
console.log();
console.log(c.cyan(c.bold("========================================")));
console.log(c.cyan(c.bold("  Joii Berry Chrome Release Copy Tool")));
console.log(c.cyan(c.bold("========================================")));
console.log(`  Source : ${SOURCE}`);
console.log(`  Dest   : ${DEST}`);
console.log();

if (!fs.existsSync(SOURCE)) {
  console.error(c.red(`[ERROR] 源目录不存在: ${SOURCE}`));
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });

let copied = 0, skipped = 0, errors = 0;

// 必须文件
console.log(c.bold("── 核心文件 ──────────────────────────"));
for (const file of REQUIRED_FILES) {
  const src = path.join(SOURCE, file);
  const dst = path.join(DEST,   file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(c.green(`  [OK] ${file.padEnd(36)} ${toMB(getFileSize(src))}`));
    copied++;
  } else {
    console.log(c.red(`  [ERR] 缺少必须文件: ${file}`));
    errors++;
  }
}

// 可选文件
console.log();
console.log(c.bold("── 可选文件 ──────────────────────────"));
for (const file of OPTIONAL_FILES) {
  const src = path.join(SOURCE, file);
  const dst = path.join(DEST,   file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(c.green(`  [OK] ${file.padEnd(36)} ${toMB(getFileSize(src))}`));
    copied++;
  } else {
    console.log(c.gray(`  [--] 跳过(不存在): ${file}`));
    skipped++;
  }
}

// 目录
console.log();
console.log(c.bold("── 目录 ──────────────────────────────"));
for (const dir of REQUIRED_DIRS) {
  const src = path.join(SOURCE, dir);
  const dst = path.join(DEST,   dir);
  if (fs.existsSync(src)) {
    copyDir(src, dst);
    console.log(c.green(`  [OK] ${(dir + "/").padEnd(36)} ${toMB(getDirSize(src))}`));
    copied++;
  } else {
    console.log(c.red(`  [ERR] 缺少必须目录: ${dir}`));
    errors++;
  }
}

// 报告
const totalMB = toMB(getDirSize(DEST));
console.log();
console.log(c.cyan(c.bold("========================================")));
console.log(c.cyan(c.bold("  完成报告")));
console.log(c.cyan(c.bold("========================================")));
console.log(c.green(`  已复制: ${copied} 项`));
if (skipped > 0) console.log(c.gray(`  已跳过: ${skipped} 项（可选文件）`));
if (errors  > 0) console.log(c.red( `  错误  : ${errors}  项（必须文件缺失！）`));
console.log(c.cyan(`  目标目录总大小: ${totalMB}`));
console.log(c.cyan(`  目标路径: ${DEST}`));
console.log();

if (errors > 0) {
  console.log(c.red("[WARNING] 有必须文件缺失，分发包可能无法正常运行！"));
  process.exit(1);
} else {
  console.log(c.green("[SUCCESS] 分发包就绪，可以打包发布。"));
}
