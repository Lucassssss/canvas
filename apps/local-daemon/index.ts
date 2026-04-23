import express from 'express';
import cors from 'cors';
import { spawn, ChildProcess } from 'child_process';
import os from 'os';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4001;

// 固化指向我们编译的定制 Chromium 的路径
// 后续上生产环境时，这个路径可以根据 process.env.CHROME_BIN 或打包相对路径动态获取
const CHROME_BIN = "d:\\ai\\canvas\\apps\\browser\\chromium142\\src\\out\\Default\\chrome.exe";

// 内存中维护的进程状态树，键为环境ID，值为子进程对象
// 由于这是一个“无状态守护进程”，一旦守护进程重启，这里会清空，这在桌面端是预期行为
const activeProcesses = new Map<string, ChildProcess>();

// 健康检查与状态获取
app.get('/api/status', (req, res) => {
    const runningEnvs = Array.from(activeProcesses.keys());
    res.json({ success: true, runningEnvs });
});

// 核心接口：接收由指纹JSON转换来的 cli_args，并组装拉起浏览器
app.post('/api/start', (req, res) => {
    const { id, cli_args } = req.body;
    
    if (!id || !cli_args) {
        return res.status(400).json({ success: false, error: '缺少环境 id 或 cli_args 参数' });
    }

    if (activeProcesses.has(id)) {
        return res.status(400).json({ success: false, error: '该环境已经在运行中' });
    }

    try {
        const cmdArgs: string[] = [];
        for (const [key, value] of Object.entries(cli_args)) {
            if (value === "") {
                cmdArgs.push(`${key}`);
            } else {
                cmdArgs.push(`${key}=${value}`);
            }
        }

        console.log(`[START] 正在启动环境 ${id}...`);
        
        // detached: true 允许父进程退出后浏览器依然独立运行
        const child = spawn(CHROME_BIN, cmdArgs, {
            detached: true,
            stdio: 'ignore'
        });

        // 取消引用，让 API 进程不再等待该子进程的生命周期结束
        child.unref();

        activeProcesses.set(id, child);

        // 监听退出事件并清理内存状态
        child.on('exit', () => {
            console.log(`[EXIT] 环境 ${id} 已关闭.`);
            activeProcesses.delete(id);
        });

        res.json({ success: true, id, pid: child.pid });
    } catch (err: any) {
        console.error("[ERROR] 启动失败:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 核心接口：强制结束某环境的浏览器进程
app.post('/api/stop', (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ success: false, error: '缺少环境 id' });
    }

    const child = activeProcesses.get(id);
    if (!child) {
        return res.status(404).json({ success: false, error: '该环境未在运行，或进程已结束' });
    }

    console.log(`[STOP] 正在强制关闭环境 ${id}...`);
    try {
        if (child.pid && os.platform() === 'win32') {
             // Windows 下由于多进程架构，直接杀父进程可能无法杀掉所有 renderer 进程
             // 所以使用 taskkill 杀掉进程树
             spawn("taskkill", ["/pid", child.pid.toString(), "/f", "/t"]);
        } else {
             child.kill('SIGKILL');
        }
        
        activeProcesses.delete(id);
        res.json({ success: true, message: '环境已停止' });
    } catch (err: any) {
        console.error("[ERROR] 停止失败:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`============================================`);
    console.log(`🚀 Joii Berry Local Daemon 启动成功`);
    console.log(`📡 监听端口: http://localhost:${PORT}`);
    console.log(`🔗 采用无状态 (Stateless) 纯内存调度模式`);
    console.log(`============================================`);
});