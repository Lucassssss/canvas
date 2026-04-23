import { spawn } from 'child_process';
import os from 'os';
import killPort from 'kill-port';

const PORT = 4003;
const CHROME_BIN = "d:\\ai\\canvas\\apps\\browser\\chromium142\\src\\out\\Default\\chrome.exe";

// 追踪每个环境的调试端口，用于 CDP 连接
const activeEnvs = new Map<string, { debugPort: number; ws?: WebSocket }>();

// 分配调试端口：从 9300 开始，避免与常用 9222 冲突
let nextDebugPort = 9300;
function allocateDebugPort(): number {
    // 找一个未被占用的端口
    while ([...activeEnvs.values()].some(e => e.debugPort === nextDebugPort)) {
        nextDebugPort++;
        if (nextDebugPort > 9400) nextDebugPort = 9300;
    }
    return nextDebugPort++;
}

/**
 * 通过 CDP WebSocket 监听 Chrome 是否关闭
 * Chrome 启动后需要等待几秒让调试端口就绪
 */
async function startCDPWatcher(id: string, debugPort: number) {
    // 等待 Chrome 启动并开放调试端口（最多重试 10 次，每次 1s）
    let wsUrl: string | null = null;
    for (let i = 0; i < 10; i++) {
        await Bun.sleep(1500);
        try {
            const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`, {
                signal: AbortSignal.timeout(1000)
            });
            if (res.ok) {
                const data: any = await res.json();
                wsUrl = data.webSocketDebuggerUrl;
                break;
            }
        } catch {
            // Chrome 还未就绪，继续等待
        }
    }

    if (!wsUrl) {
        console.warn(`[CDP] 无法连接到环境 ${id} 的调试端口 ${debugPort}，放弃监听`);
        return;
    }

    console.log(`[CDP] 已连接到环境 ${id} 的调试通道 (port=${debugPort})`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        // 将 ws 存入 map，方便 stop 时主动关闭
        const entry = activeEnvs.get(id);
        if (entry) entry.ws = ws;
    };

    ws.onclose = () => {
        const entry = activeEnvs.get(id);
        if (!entry) return; // 已被 /api/stop 主动清理

        // daemon 只负责进程状态管理，不调用任何业务 API
        // 前端通过轮询 /api/status 与 cloud-api 做状态对账
        console.log(`[CDP] 环境 ${id} 浏览器已关闭，已从运行列表移除`);
        activeEnvs.delete(id);
    };

    ws.onerror = () => ws.close();
}

/**
 * 通过 wmic + taskkill 强制杀掉所有匹配该 profile 的 Chrome 进程
 */
async function killChromiumByProfile(profileId: string): Promise<void> {
    if (os.platform() !== 'win32') return;
    try {
        const listProc = Bun.spawn(
            ["wmic", "process", "where", `CommandLine like '%${profileId}%'`, "get", "ProcessId", "/format:list"],
            { stdout: "pipe", stderr: "pipe", windowsHide: true }
        );
        const text = await new Response(listProc.stdout).text();
        await listProc.exited;

        const pids = [...text.matchAll(/ProcessId=(\d+)/g)].map(m => m[1]);
        for (const pid of pids) {
            const k = Bun.spawn(["taskkill", "/F", "/T", "/PID", pid], {
                stdout: "pipe", stderr: "pipe", windowsHide: true
            });
            await k.exited;
            console.log(`[KILL] taskkill PID=${pid} done`);
        }
    } catch (err) {
        console.error("[KILL] error:", err);
    }
}

// 启动前确保端口未被占用（使用成熟的 kill-port 库解决跨平台问题）
try {
    console.log(`[INIT] 正在检测并释放端口 ${PORT}...`);
    await killPort(PORT, 'tcp');
} catch (e) {
    // 忽略错误，可能原本就没有占用
}

const server = Bun.serve({
    port: PORT,
    reusePort: true,
    async fetch(req) {
        const url = new URL(req.url);

        if (req.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            });
        }

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        };

        if (req.method === "GET" && url.pathname === "/api/status") {
            const runningEnvs = Array.from(activeEnvs.keys());
            return new Response(JSON.stringify({ success: true, runningEnvs }), { headers });
        }

        if (req.method === "POST" && url.pathname === "/api/start") {
            try {
                const body = await req.json();
                const { id, cli_args } = body;

                if (!id || !cli_args) {
                    return new Response(JSON.stringify({ success: false, error: '缺少环境 id 或 cli_args 参数' }), { status: 400, headers });
                }

                if (activeEnvs.has(id)) {
                    return new Response(JSON.stringify({ success: false, error: '该环境已经在运行中' }), { status: 400, headers });
                }

                // 先清理残留进程
                await killChromiumByProfile(id);

                const debugPort = allocateDebugPort();

                // 注入 CDP 调试端口参数
                const cmdArgs: string[] = [`--remote-debugging-port=${debugPort}`];
                for (const [key, value] of Object.entries(cli_args)) {
                    if (value === "") cmdArgs.push(`${key}`);
                    else cmdArgs.push(`${key}=${value}`);
                }

                console.log(`[START] 启动环境 ${id}，CDP 端口=${debugPort}`);

                const child = spawn(CHROME_BIN, cmdArgs, {
                    detached: true,
                    stdio: 'ignore',
                    windowsHide: true,
                });
                child.unref();

                // 记录环境
                activeEnvs.set(id, { debugPort });

                // 异步启动 CDP 监听（不阻塞本次响应）
                startCDPWatcher(id, debugPort);

                return new Response(JSON.stringify({ success: true, id, pid: child.pid }), { headers });
            } catch (err: any) {
                console.error("[ERROR] 启动失败:", err);
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        if (req.method === "POST" && url.pathname === "/api/stop") {
            try {
                const body = await req.json();
                const { id } = body;

                if (!id) {
                    return new Response(JSON.stringify({ success: false, error: '缺少环境 id' }), { status: 400, headers });
                }

                console.log(`[STOP] 强制关闭环境 ${id}...`);

                // 1. 先从 map 中移除，防止 CDP onclose 重复触发状态同步
                const entry = activeEnvs.get(id);
                activeEnvs.delete(id);

                // 2. 主动关闭 CDP WebSocket
                if (entry?.ws) {
                    try { entry.ws.close(); } catch {}
                }

                // 3. 强制杀进程（异步，不阻塞响应）
                killChromiumByProfile(id).then(() => {
                    console.log(`[STOP] 环境 ${id} 进程清理完成`);
                }).catch(console.error);

                return new Response(JSON.stringify({ success: true, message: '环境已停止' }), { headers });
            } catch (err: any) {
                console.error("[ERROR] 停止失败:", err);
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        return new Response(JSON.stringify({ success: false, error: "Not Found" }), { status: 404, headers });
    }
});

console.log(`============================================`);
console.log(`🚀 Joii Berry Local Daemon 启动成功`);
console.log(`📡 监听端口: http://localhost:${server.port}`);
console.log(`🔗 无状态调度 + CDP 浏览器状态感知`);
console.log(`============================================`);