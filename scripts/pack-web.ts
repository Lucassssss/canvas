/**
 * pack-web.ts
 *
 * 将 browser-web 的 Next.js 静态导出目录打包成 web-<version>.zip，
 * 并生成对应的 manifest.json。
 *
 * 用法:
 *   bun run scripts/pack-web.ts [outputDir]
 *
 * 默认输出目录: dist/web-release/
 */

import { $ } from 'bun'
import path from 'path'
import fs from 'fs'

const ROOT = path.resolve(import.meta.dir, '..')
const BROWSER_WEB_OUT = path.join(ROOT, 'apps', 'browser-web', 'out') // next export 输出目录
const OUTPUT_DIR = path.resolve(process.argv[2] || path.join(ROOT, 'dist', 'web-release'))

// 读取 browser-web 的版本号
const pkgPath = path.join(ROOT, 'apps', 'browser-web', 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
const version: string = pkg.version

if (!version) {
  console.error('❌ 无法读取 browser-web/package.json 中的 version 字段')
  process.exit(1)
}

if (!fs.existsSync(BROWSER_WEB_OUT)) {
  console.error(`❌ 找不到 Next.js 导出目录: ${BROWSER_WEB_OUT}`)
  console.error('请先运行: cd apps/browser-web && bun run build && bun run export')
  process.exit(1)
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const zipName = `web-${version}.zip`
const zipPath = path.join(OUTPUT_DIR, zipName)

console.log('=============================================')
console.log(`📦 打包 Web 资源 v${version}`)
console.log('=============================================')
console.log(`📁 源目录: ${BROWSER_WEB_OUT}`)
console.log(`🎯 输出:   ${zipPath}`)

// 删除旧包
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath)
  console.log(`🗑  已删除旧包: ${zipName}`)
}

// 使用 Windows 内置 tar 打包（-a 自动根据 .zip 后缀选择 zip 格式）
// 切换到 out/ 目录下执行，解压后直接是扁平文件，无顶层目录
await $`tar -a -c -f ${zipPath} *`.cwd(BROWSER_WEB_OUT)

const stat = fs.statSync(zipPath)
const mb = (stat.size / 1024 / 1024).toFixed(2)
console.log(`\n✅ 压缩完成，大小: ${mb} MB`)

// 生成 manifest.json（CDN_BASE 可通过环境变量覆盖）
const CDN_BASE = process.env.CDN_BASE ?? 'https://d-assets-cn.joii.cc/a1-joii-browser/web'
const manifest = {
  web: {
    version,
    url: `${CDN_BASE}/${zipName}`,
  },
}

const manifestPath = path.join(OUTPUT_DIR, 'manifest.json')
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log(`📋 manifest.json 已生成:`)
console.log(JSON.stringify(manifest, null, 2))
console.log()
console.log('上传提示:')
console.log(`  1. 上传 ${zipName}   → ${manifest.web.url}`)
console.log(`  2. 上传 manifest.json → ${CDN_BASE}/manifest.json`)
