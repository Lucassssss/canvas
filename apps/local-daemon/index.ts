import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import killPort from 'kill-port';

const PORT = 4003;
const CHROME_BIN = "e:\\chromium\\c142-5\\chrome.exe";
const RUN_DIR = path.join(process.cwd(), '.run');

// 确保状态目录存在
if (!fs.existsSync(RUN_DIR)) {
    fs.mkdirSync(RUN_DIR, { recursive: true });
}

interface EnvState {
    debugPort: number;
    ws?: WebSocket;
    sessionIds: Set<string>;
    viewport?: { w: number, h: number };
}

// 追踪每个环境的状态 (内存级，辅助通信)
const activeEnvs = new Map<string, EnvState>();

// 同步会话：masterId -> followerIds
const syncSessions = new Map<string, { followers: string[] }>();

// -------------------------
// 状态同步管理模块
// -------------------------

// 保存进程状态锁文件
async function saveEnvState(id: string, pid: number, debugPort: number) {
    const file = path.join(RUN_DIR, `${id}.json`);
    await Bun.write(file, JSON.stringify({ pid, debugPort, time: Date.now() }));
}

// 删除进程状态锁文件
async function removeEnvState(id: string) {
    const file = path.join(RUN_DIR, `${id}.json`);
    if (fs.existsSync(file)) {
        await fs.promises.unlink(file).catch(() => {});
    }
}

// 获取绝对准确的运行列表（毫秒级验证，剔除幽灵状态）
async function getRunningEnvs(): Promise<string[]> {
    const files = await fs.promises.readdir(RUN_DIR).catch(() => []);
    const aliveIds: string[] = [];
    
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const id = file.replace('.json', '');
        const filePath = path.join(RUN_DIR, file);
        
        try {
            const content = await Bun.file(filePath).text();
            const data = JSON.parse(content);
            
            // 零成本保活检测 (0信号)
            let isAlive = true;
            try {
                process.kill(data.pid, 0);
            } catch (e: any) {
                // 如果抛出错误，说明进程不存在
                isAlive = false;
            }
            
            if (isAlive) {
                aliveIds.push(id);
            } else {
                // 清理幽灵状态
                await removeEnvState(id);
                activeEnvs.delete(id);
            }
        } catch (e) {
            // 解析失败等，认为失效
            await removeEnvState(id);
            activeEnvs.delete(id);
        }
    }
    
    return aliveIds;
}

// 重启恢复机制：根据文件系统状态快速挂载 CDP，杜绝 wmic 扫描阻塞
async function restoreRunningEnvs() {
    console.log(`[INIT] 正在通过状态锁文件恢复存活环境...`);
    const files = await fs.promises.readdir(RUN_DIR).catch(() => []);
    
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const id = file.replace('.json', '');
        const filePath = path.join(RUN_DIR, file);
        
        try {
            const content = await Bun.file(filePath).text();
            const data = JSON.parse(content);
            
            let isAlive = true;
            try { process.kill(data.pid, 0); } catch (e) { isAlive = false; }
            
            if (isAlive && !activeEnvs.has(id)) {
                console.log(`[INIT] 恢复运行中的环境: ${id} (端口: ${data.debugPort}, PID: ${data.pid})`);
                activeEnvs.set(id, { debugPort: data.debugPort, sessionIds: new Set() });
                startCDPWatcher(id, data.debugPort);
            } else if (!isAlive) {
                await removeEnvState(id);
            }
        } catch (e) {}
    }
}

// 分配调试端口
let nextDebugPort = 9300;
async function allocateDebugPort(): Promise<number> {
    const files = await fs.promises.readdir(RUN_DIR).catch(() => []);
    const usedPorts = new Set<number>();
    
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        try {
            const content = await Bun.file(path.join(RUN_DIR, file)).text();
            usedPorts.add(JSON.parse(content).debugPort);
        } catch(e) {}
    }
    
    while (usedPorts.has(nextDebugPort)) {
        nextDebugPort++;
        if (nextDebugPort > 9400) nextDebugPort = 9300;
    }
    return nextDebugPort++;
}

// -------------------------
// CDP 与底层通信
// -------------------------

const sendCDP = (ws: WebSocket, method: string, params: any = {}, sessionId?: string): Promise<any> => {
    return new Promise((resolve) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return resolve(null);
        const id = Math.floor(Math.random() * 100000);
        const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data.toString());
            if (data.id === id) {
                ws.removeEventListener('message', listener as EventListener);
                resolve(data.result);
            }
        };
        ws.addEventListener('message', listener as EventListener);
        ws.send(JSON.stringify({ id, method, params, sessionId }));
        setTimeout(() => {
            ws.removeEventListener('message', listener as EventListener);
            resolve(null);
        }, 2000);
    });
};

function fireCDP(ws: WebSocket, method: string, params: any = {}, sessionId?: string) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const msg = { id: Math.floor(Math.random() * 100000), method, params, sessionId };
    ws.send(JSON.stringify(msg));
}

function handleSyncEvent(masterId: string, payload: any) {
    const session = syncSessions.get(masterId);
    if (!session) return;
    
    const masterEntry = activeEnvs.get(masterId);
    if (!masterEntry) return;

    if (payload.viewport) {
        masterEntry.viewport = payload.viewport;
    }

    let syncCount = 0;
    for (const fId of session.followers) {
        const fEntry = activeEnvs.get(fId);
        if (!fEntry?.ws || fEntry.sessionIds.size === 0 || !fEntry.viewport || !masterEntry.viewport) continue;
        
        const scaleX = fEntry.viewport.w / masterEntry.viewport.w;
        const scaleY = fEntry.viewport.h / masterEntry.viewport.h;
        const rx = Math.round(payload.x * scaleX);
        const ry = Math.round(payload.y * scaleY);
        
        for (const sId of fEntry.sessionIds) {
            syncCount++;
            if (payload.type === 'mousemove') {
                fireCDP(fEntry.ws, "Input.dispatchMouseEvent", { type: "mouseMoved", x: rx, y: ry }, sId);
            } else if (payload.type === 'mousedown' || payload.type === 'mouseup') {
                const buttonMap: any = { 0: 'left', 1: 'middle', 2: 'right' };
                fireCDP(fEntry.ws, "Input.dispatchMouseEvent", {
                    type: payload.type === 'mousedown' ? "mousePressed" : "mouseReleased",
                    x: rx, y: ry, button: buttonMap[payload.button] || 'left', clickCount: 1
                }, sId);
            } else if (payload.type === 'wheel') {
                fireCDP(fEntry.ws, "Input.dispatchMouseEvent", {
                    type: "mouseWheel", x: rx, y: ry, deltaX: payload.deltaX, deltaY: payload.deltaY
                }, sId);
            } else if (payload.type === 'keydown' || payload.type === 'keyup') {
                fireCDP(fEntry.ws, "Input.dispatchKeyEvent", {
                    type: payload.type === 'keydown' ? (payload.text ? "keyDown" : "rawKeyDown") : "keyUp",
                    windowsVirtualKeyCode: payload.keyCode, key: payload.key, code: payload.code, text: payload.text
                }, sId);
            }
        }
    }
    
    // 只在关键事件打印分发日志，mousemove 太多了
    if (payload.type !== 'mousemove' && payload.type !== 'wheel') {
        console.log(`[Daemon->Follower] 已将 ${payload.type} 分发给 ${syncCount} 个从控窗口`);
    }
}

function handleSyncNavigation(masterId: string, url: string) {
    const session = syncSessions.get(masterId);
    if (!session) return;
    for (const fId of session.followers) {
        const fEntry = activeEnvs.get(fId);
        if (fEntry?.ws && fEntry.sessionIds.size > 0) {
            for (const sId of fEntry.sessionIds) {
                fireCDP(fEntry.ws, "Page.navigate", { url }, sId);
            }
        }
    }
}

const TRACKING_SCRIPT = `
(function() {
    if (window.__joii_sync_injected) return;
    window.__joii_sync_injected = true;
    let lastMoveTime = 0; let lastScrollTime = 0; const THROTTLE = 16;
    function emit(type, event) {
        if (!window.joiiSync) return;
        const payload = {
            type, x: event.clientX, y: event.clientY, deltaX: event.deltaX, deltaY: event.deltaY,
            button: event.button, buttons: event.buttons, key: event.key, code: event.code, keyCode: event.keyCode,
            text: event.key && event.key.length === 1 ? event.key : undefined,
            viewport: { w: window.innerWidth, h: window.innerHeight }
        };
        window.joiiSync(JSON.stringify(payload));
    }
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMoveTime > THROTTLE) { lastMoveTime = now; emit('mousemove', e); }
    }, true);
    window.addEventListener('mousedown', (e) => emit('mousedown', e), true);
    window.addEventListener('mouseup', (e) => emit('mouseup', e), true);
    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastScrollTime > THROTTLE) { lastScrollTime = now; emit('wheel', e); }
    }, { capture: true, passive: true });
    window.addEventListener('keydown', (e) => emit('keydown', e), true);
    window.addEventListener('keyup', (e) => emit('keyup', e), true);
})();
`;

async function startCDPWatcher(id: string, debugPort: number) {
    let wsUrl: string | null = null;
    for (let i = 0; i < 10; i++) {
        await Bun.sleep(1500);
        try {
            const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`, { signal: AbortSignal.timeout(1000) });
            if (res.ok) {
                const data: any = await res.json();
                wsUrl = data.webSocketDebuggerUrl;
                break;
            }
        } catch { }
    }

    if (!wsUrl) return console.warn(`[CDP] 无法连接到环境 ${id}，可能已退出`);
    
    const ws = new WebSocket(wsUrl);
    ws.onopen = async () => {
        const entry = activeEnvs.get(id);
        if (entry) entry.ws = ws;

        // 让浏览器自动为所有新老 Target (Page/iframe) 进行附加
        await sendCDP(ws, "Target.setAutoAttach", { 
            autoAttach: true, 
            waitForDebuggerOnStart: true, 
            flatten: true 
        });
        
        console.log(`[CDP] 环境 ${id} 已开启全局 Target 自动追踪`);
    };

    ws.addEventListener('message', async (event: MessageEvent) => {
        const data = JSON.parse(event.data.toString());
        
        // 当自动追踪到任何一个新的 Target（如页面跳转、新开标签页、跨域 iframe）时
        if (data.method === "Target.attachedToTarget") {
            const sessionId = data.params.sessionId;
            const targetInfo = data.params.targetInfo;
            
            if (targetInfo.type === 'page') {
                const entry = activeEnvs.get(id);
                if (entry) {
                    entry.sessionIds.add(sessionId);
                }
                
                await sendCDP(ws, "Runtime.enable", {}, sessionId);
                await sendCDP(ws, "Page.enable", {}, sessionId);
                await sendCDP(ws, "Runtime.addBinding", { name: "joiiSync" }, sessionId);
                await sendCDP(ws, "Page.addScriptToEvaluateOnNewDocument", { source: TRACKING_SCRIPT }, sessionId);
                await sendCDP(ws, "Runtime.evaluate", { expression: TRACKING_SCRIPT }, sessionId);
                
                console.log(`[CDP] 环境 ${id} 成功注入脚本到新目标: ${targetInfo.url}`);
                
                if (entry) {
                    const vpRes = await sendCDP(ws, "Runtime.evaluate", { expression: "({ w: window.innerWidth, h: window.innerHeight })", returnByValue: true }, sessionId);
                    if (vpRes?.result?.value) entry.viewport = vpRes.result.value;
                }
            }
            // 所有 target（无论是否是 page）如果被暂停了，都需要恢复执行
            if (data.params.waitingForDebugger) {
                await sendCDP(ws, "Runtime.runIfWaitingForDebugger", {}, sessionId);
            }
        }
        
        // 当 Target 被销毁时清理
        if (data.method === "Target.detachedFromTarget") {
            const sessionId = data.params.sessionId;
            const entry = activeEnvs.get(id);
            if (entry) {
                entry.sessionIds.delete(sessionId);
            }
        }

        if (data.method === "Page.frameNavigated" && data.params?.frame) {
            if (!data.params.frame.parentId && syncSessions.has(id)) { 
                handleSyncNavigation(id, data.params.frame.url);
            }
        }
        if (data.method === "Runtime.bindingCalled" && data.params?.name === "joiiSync") {
            try { 
                const payload = JSON.parse(data.params.payload);
                // 打印关键日志（只打印 master 避免日志刷屏）
                if (syncSessions.has(id)) {
                    console.log(`[CDP->Daemon] 捕获主控(${id})操作: ${payload.type} x:${payload.x || '-'} y:${payload.y || '-'}`);
                }
                handleSyncEvent(id, payload); 
            } catch(e) { }
        }
    });

    ws.onclose = async () => {
        activeEnvs.delete(id);
        await removeEnvState(id); // 退出时同步清理文件状态
        syncSessions.delete(id);
        for (const [mId, session] of syncSessions.entries()) {
            session.followers = session.followers.filter(f => f !== id);
        }
        console.log(`[CDP] 环境 ${id} 连接已断开`);
    };
    ws.onerror = () => ws.close();
}

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
            const k = Bun.spawn(["taskkill", "/F", "/T", "/PID", pid], { stdout: "pipe", stderr: "pipe", windowsHide: true });
            await k.exited;
        }
    } catch (err) { }
}

// -------------------------
// 服务启动
// -------------------------

try { await killPort(PORT, 'tcp'); } catch (e) { }

await restoreRunningEnvs();

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
            // 获取最新绝对存活的环境 ID 列表
            const runningEnvs = await getRunningEnvs();
            return new Response(JSON.stringify({ success: true, runningEnvs }), { headers });
        }

        if (req.method === "POST" && url.pathname === "/api/start") {
            try {
                const { id, cli_args } = await req.json();
                if (!id || !cli_args) return new Response(JSON.stringify({ success: false, error: '缺少参数' }), { status: 400, headers });
                
                // 双重校验：内存 + 文件级锁
                const runningEnvs = await getRunningEnvs();
                if (runningEnvs.includes(id)) {
                    return new Response(JSON.stringify({ success: false, error: '环境已运行' }), { status: 400, headers });
                }

                await killChromiumByProfile(id);
                const debugPort = await allocateDebugPort();
                
                const cmdArgs: string[] = [`--remote-debugging-port=${debugPort}`];
                for (const [key, value] of Object.entries(cli_args)) {
                    if (value === "") cmdArgs.push(`${key}`);
                    else cmdArgs.push(`${key}=${value}`);
                }

                const child = spawn(CHROME_BIN, cmdArgs, {
                    detached: true,
                    stdio: 'ignore',
                    windowsHide: true,
                });
                child.unref();

                // 更新状态 (内存 + 落地文件锁)
                if (child.pid) {
                    await saveEnvState(id, child.pid, debugPort);
                }
                activeEnvs.set(id, { debugPort, sessionIds: new Set() });
                startCDPWatcher(id, debugPort);

                return new Response(JSON.stringify({ success: true, id }), { headers });
            } catch (err: any) {
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        if (req.method === "POST" && url.pathname === "/api/stop") {
            try {
                const { id } = await req.json();
                if (!id) return new Response(JSON.stringify({ success: false, error: '缺少 id' }), { status: 400, headers });

                const entry = activeEnvs.get(id);
                activeEnvs.delete(id);
                await removeEnvState(id); // 删除锁文件
                syncSessions.delete(id);
                if (entry?.ws) { try { entry.ws.close(); } catch { } }

                killChromiumByProfile(id).catch(() => {});
                return new Response(JSON.stringify({ success: true }), { headers });
            } catch (err: any) {
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        if (req.method === "POST" && url.pathname === "/api/sync/start") {
            try {
                const { masterId, followerIds } = await req.json();
                if (!masterId || !followerIds || !Array.isArray(followerIds)) {
                    return new Response(JSON.stringify({ success: false, error: '参数错误' }), { status: 400, headers });
                }
                
                const runningEnvs = await getRunningEnvs();
                if (!runningEnvs.includes(masterId)) {
                    return new Response(JSON.stringify({ success: false, error: '主控环境未运行' }), { status: 400, headers });
                }

                // 强制刷新一次所有参与者的 viewport
                for (const id of [masterId, ...followerIds]) {
                    const entry = activeEnvs.get(id);
                    if (entry?.ws && entry.sessionIds.size > 0) {
                        for (const sId of entry.sessionIds) {
                            const vpRes = await sendCDP(entry.ws, "Runtime.evaluate", { expression: "({ w: window.innerWidth, h: window.innerHeight })", returnByValue: true }, sId);
                            if (vpRes?.result?.value) {
                                entry.viewport = vpRes.result.value;
                            }
                        }
                    }
                }

                syncSessions.set(masterId, { followers: followerIds });
                console.log(`[SYNC] 开始同步: Master=${masterId}, Followers=${followerIds.join(',')}`);

                return new Response(JSON.stringify({ success: true }), { headers });
            } catch (err: any) {
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        if (req.method === "POST" && url.pathname === "/api/sync/stop") {
            try {
                const { masterId } = await req.json();
                syncSessions.delete(masterId);
                console.log(`[SYNC] 停止同步: Master=${masterId}`);
                return new Response(JSON.stringify({ success: true }), { headers });
            } catch (err: any) {
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        if (req.method === "POST" && url.pathname === "/api/arrange") {
            try {
                const { ids, screenWidth = 1920, screenHeight = 1080 } = await req.json();
                const runningEnvs = await getRunningEnvs();
                const runningIds = (ids || []).filter((id: string) => runningEnvs.includes(id));
                const N = runningIds.length;
                if (N === 0) return new Response(JSON.stringify({ success: true }), { headers });

                const cols = Math.ceil(Math.sqrt(N));
                const rows = Math.ceil(N / cols);
                const w = Math.floor(screenWidth / cols);
                const h = Math.floor(screenHeight / rows);

                for (let i = 0; i < N; i++) {
                    const id = runningIds[i];
                    const entry = activeEnvs.get(id);
                    if (!entry?.ws) continue;

                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    const x = col * w;
                    const y = row * h;

                    try {
                        const targets = await sendCDP(entry.ws, "Target.getTargets");
                        const pageTarget = targets?.targetInfos?.find((t: any) => t.type === 'page');
                        if (!pageTarget) continue;

                        const windowInfo = await sendCDP(entry.ws, "Browser.getWindowForTarget", { targetId: pageTarget.targetId });
                        if (windowInfo && windowInfo.windowId) {
                            await sendCDP(entry.ws, "Browser.setWindowBounds", {
                                windowId: windowInfo.windowId,
                                bounds: { left: x, top: y, width: w, height: h, windowState: 'normal' }
                            });
                        }
                    } catch (err) { }
                }

                return new Response(JSON.stringify({ success: true }), { headers });
            } catch (err: any) {
                return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers });
            }
        }

        return new Response(JSON.stringify({ success: false, error: "Not Found" }), { status: 404, headers });
    }
});

console.log(`============================================`);
console.log(`🚀 Joii Berry Local Daemon 启动成功`);
console.log(`📡 监听端口: http://localhost:${server.port}`);
console.log(`🚀 文件级 PID 状态锁挂载: ${RUN_DIR}`);
console.log(`🔗 零阻塞稳定调度 + 精准状态感知`);
console.log(`============================================`);