import { $, file } from 'bun';
import path from 'path';
import fs from 'fs';

const sourceDir = process.argv[2] || "e:\\chromium\\c142-5";
const outPath = path.resolve(process.argv[3] || "chrome.zip");

if (!fs.existsSync(sourceDir)) {
    console.error(`❌ 错误: 找不到源目录 ${sourceDir}`);
    console.error(`请传入正确的内核目录，例如: bun run scripts/pack-browser.ts "C:\\path\\to\\chromium"`);
    process.exit(1);
}

// 确保目标路径的上一级存在
const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

console.log(`=============================================`);
console.log(`📦 正在打包浏览器内核...`);
console.log(`=============================================`);
console.log(`📁 源目录: ${sourceDir}`);
console.log(`🎯 输出文件: ${outPath}`);

try {
    // 如果已经存在同名文件，先删除
    if (fs.existsSync(outPath)) {
        fs.unlinkSync(outPath);
    }

    // Windows 10+ 均内置了 tar 命令，-a 自动根据后缀选择压缩格式 (zip)
    // 切换到源目录下执行，这样压出来的包解压时没有顶层同名目录，直接是零散文件。
    // 这与我们在 local-daemon 中的 tar -xf x.zip -C browser 逻辑完美匹配！
    await $`tar -a -c -f ${outPath} *`.cwd(sourceDir);

    const stat = fs.statSync(outPath);
    const mb = (stat.size / (1024 * 1024)).toFixed(2);

    console.log(`\n✅ 打包完成!`);
    console.log(`📏 文件大小: ${mb} MB`);
    console.log(`上传提示: 请将 ${outPath} 上传至您的 S3 或 CDN。`);
    console.log(`上传后配置的下载链接示例: https://cdn.joii.cc/chrome/c142/chrome.zip`);
    
} catch (error) {
    console.error(`\n❌ 打包失败:`, error);
}
