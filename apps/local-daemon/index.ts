import { spawn, exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
import os from 'os';
import fs from 'fs';
import path from 'path';
import killPort from 'kill-port';

const PORT = 4003;
const CHROME_BIN = "e:\\chromium\\c142-5\\chrome.exe";
const RUN_DIR = path.join(process.cwd(), '.run');
const AGENT_BROWSER_BIN = os.platform() === 'win32' 
    ? path.join(process.cwd(), 'node_modules', '.bin', 'agent-browser.exe')
    : path.join(process.cwd(), 'node_modules', '.bin', 'agent-browser');

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

// 命令队列缓冲 (RPA 级排队)
interface SyncCommand {
    type: 'click' | 'fill' | 'press' | 'scroll' | 'mousemove';
    selector?: string;
    value?: string;
    key?: string;
    direction?: 'down' | 'up';
    amount?: number;
    x?: number;
    y?: number;
}
const commandQueues = new Map<string, SyncCommand[]>();
const isProcessing = new Set<string>();

async function processQueue(followerId: string) {
    if (isProcessing.has(followerId)) return;
    isProcessing.add(followerId);
    
    const followerEntry = activeEnvs.get(followerId);
    if (!followerEntry) {
        isProcessing.delete(followerId);
        return;
    }
    
    const queue = commandQueues.get(followerId);
    if (!queue) {
        isProcessing.delete(followerId);
        return;
    }
    
    while (queue.length > 0) {
        const cmd = queue.shift();
        if (!cmd) continue;
        
        let cliCommand = "";
        
        // 按照用户约定的规范语义拼接 agent-browser CLI 指令
        if (cmd.type === 'click' && cmd.selector) {
            cliCommand = `"${AGENT_BROWSER_BIN}" --cdp ${followerEntry.debugPort} click "${cmd.selector}"`;
        } else if (cmd.type === 'fill' && cmd.selector) {
            const escaped = (cmd.value || '').replace(/"/g, '\\"');
            cliCommand = `"${AGENT_BROWSER_BIN}" --cdp ${followerEntry.debugPort} fill "${cmd.selector}" "${escaped}"`;
        } else if (cmd.type === 'press' && cmd.key) {
            cliCommand = `"${AGENT_BROWSER_BIN}" --cdp ${followerEntry.debugPort} press "${cmd.key}"`;
        } else if (cmd.type === 'scroll') {
            cliCommand = `"${AGENT_BROWSER_BIN}" --cdp ${followerEntry.debugPort} scroll ${cmd.direction} ${cmd.amount}`;
        }
        
        if (cliCommand) {
            console.log(`\n=================================================`);
            console.log(`[QUEUE_EXEC] 从控(${followerId}) 即将执行:`);
            console.log(`> ${cliCommand}`);
            const startTime = Date.now();
            try {
                // 增加 15 秒超时机制，防止单个命令卡死整个队列 (并自动杀掉僵尸进程)
                await execAsync(cliCommand, { timeout: 15000 });
                console.log(`[QUEUE_EXEC] 从控(${followerId}) 执行成功，耗时 ${Date.now() - startTime}ms`);
            } catch (err: any) {
                console.error(`[QUEUE_ERROR] 从控(${followerId}) 执行失败: ${err.message}`);
            }
            console.log(`=================================================\n`);
        }
    }
    
    isProcessing.delete(followerId);
}

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
        }, 3000);
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

    let syncCount = 0;
    for (const fId of session.followers) {
        const fEntry = activeEnvs.get(fId);
        if (!fEntry?.ws) continue;
        
        if (!commandQueues.has(fId)) {
            commandQueues.set(fId, []);
        }
        const queue = commandQueues.get(fId)!;
        
        // 翻译前端收集到的事件
        if (payload.type === 'click') {
            queue.push({ type: 'click', selector: payload.selector });
        } else if (payload.type === 'fill') {
            queue.push({ type: 'fill', selector: payload.selector, value: payload.value });
        } else if (payload.type === 'keydown' && payload.key) {
            // 过滤无意义的修饰键
            if (['Shift', 'Control', 'Alt', 'Meta'].includes(payload.key)) continue;
            queue.push({ type: 'press', key: payload.key });
        } else if (payload.type === 'wheel') {
            queue.push({ type: 'scroll', direction: payload.deltaY > 0 ? 'down' : 'up', amount: Math.abs(payload.deltaY) });
        }
        
        syncCount++;
        // 异步触发队列消费，不阻塞当前主线程
        processQueue(fId).catch(() => {});
    }
    
    if (payload.type !== 'mousemove' && payload.type !== 'wheel') {
        console.log(`[Daemon->Queue] 已将 ${payload.type} (Selector: ${payload.selector}) 指令推入 ${syncCount} 个从控队列`);
    }
}

const lastNavUrls = new Map<string, string>();

function handleSyncNavigation(masterId: string, url: string) {
    if (url.startsWith('chrome://') || url.startsWith('edge://') || url === 'about:blank') return;
    
    // 防重复跳转 (针对单页应用或 hash 变化引发的乱跳)
    const lastUrl = lastNavUrls.get(masterId);
    if (lastUrl === url) return;
    lastNavUrls.set(masterId, url);

    const session = syncSessions.get(masterId);
    if (!session) return;
    for (const fId of session.followers) {
        const fEntry = activeEnvs.get(fId);
        if (fEntry?.ws) {
            if (!commandQueues.has(fId)) commandQueues.set(fId, []);
            const cliCommand = `"${AGENT_BROWSER_BIN}" --cdp ${fEntry.debugPort} open "${url}"`;
            console.log(`[QUEUE] 添加跳转指令: ${cliCommand}`);
            commandQueues.get(fId)!.push({ type: 'fill', selector: 'IGNORE_ME', value: 'PLACEHOLDER_FOR_SYNC' }); // 维持队列状态标志
            execAsync(cliCommand).catch(e => console.error(`[QUEUE ERROR] 跳转失败: ${e.message}`));
        }
    }
}

const TRACKING_SCRIPT = `
(function() {
    if (window.__joii_sync_injected) return;
    window.__joii_sync_injected = true;
    
    // 强制打印，不带颜色以防被过滤
    console.log("[JoiiSync] 核心语义录制引擎已成功注入 - " + location.href);
    
    const originalDebug = console.debug;
    
    // 采用双通道发送：如果 binding 丢失，则通过隐秘的 console.debug 通道触发 Runtime.consoleAPICalled
    function sendSyncEvent(payload) {
        payload.__joii_sync_payload = true;
        const msg = JSON.stringify(payload);
        if (typeof window.joiiSync === 'function') {
            window.joiiSync(msg);
        } else {
            originalDebug.call(console, msg);
        }
    }

    // 向上寻找最近的可点击容器，避免点到 svg/span 导致 Playwright 执行失败
    function getClickableTarget(el) {
        let current = el;
        while (current && current !== document.body && current.nodeType === 1) {
            const tag = current.tagName.toLowerCase();
            if (['a', 'button', 'input', 'select', 'textarea'].includes(tag) || 
                current.getAttribute('role') === 'button' || 
                current.getAttribute('role') === 'link' ||
                current.hasAttribute('tabindex')) {
                return current;
            }
            current = current.parentNode;
        }
        return el;
    }

    // 标准 CSS Selector 计算器 (强化语义定位，防元素偏移)
    function getSelector(el) {
        if (!el || el.nodeType !== 1) return '';
        if (el.tagName.toLowerCase() === 'html') return 'html';
        if (el.tagName.toLowerCase() === 'body') return 'body';

        // 优先级 1: 具有唯一意义的业务属性
        const uniqueAttrs = ['data-testid', 'data-cy', 'data-id', 'name', 'placeholder'];
        for (const attr of uniqueAttrs) {
            if (el.hasAttribute(attr)) {
                const val = el.getAttribute(attr);
                if (val) return \`\${el.tagName.toLowerCase()}[\${attr}="\${CSS.escape(val)}"]\`;
            }
        }
        
        // 优先级 2: 具有明确指向性的链接
        if (el.tagName.toLowerCase() === 'a' && el.hasAttribute('href')) {
            const href = el.getAttribute('href');
            if (href && href.startsWith('/')) return \`a[href="\${CSS.escape(href)}"]\`;
        }

        // 优先级 3: 规整的 ID
        if (el.id && !/^[0-9]/.test(el.id)) return '#' + CSS.escape(el.id);

        let path = [];
        while (el && el.nodeType === 1) {
            let selector = el.nodeName.toLowerCase();
            if (el.id && !/^[0-9]/.test(el.id)) {
                selector = '#' + CSS.escape(el.id);
                path.unshift(selector);
                break;
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() === selector) nth++;
                }
                
                // 加入 class 辅助定位
                let classStr = '';
                if (el.className && typeof el.className === 'string') {
                    const classes = el.className.split(/\\s+/).filter(c => c && !c.includes(':') && !c.match(/^[0-9]/));
                    if (classes.length > 0) classStr = '.' + CSS.escape(classes[0]);
                }

                if (nth !== 1) {
                    selector += classStr + ':nth-of-type(' + nth + ')';
                } else {
                    selector += classStr;
                }
            }
            path.unshift(selector);
            el = el.parentNode;
            if (el && el.nodeName && el.nodeName.toLowerCase() === 'body') {
                path.unshift('body');
                break;
            }
        }
        return path.join(' > ');
    }

    let lastScrollTime = 0;
    let fillTimeout = null;

    window.addEventListener('click', (e) => {
        const target = getClickableTarget(e.target);
        const selector = getSelector(target);
        if (selector) {
            console.log("[JoiiSync] 🚀 捕获 Click 事件:", selector);
            sendSyncEvent({ type: 'click', selector });
        }
    }, true);

    // 采用 input 防抖，解决 change 事件必须要失去焦点才触发的问题
    window.addEventListener('input', (e) => {
        const target = e.target;
        if (!target || !['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
        const selector = getSelector(target);
        if (selector) {
            clearTimeout(fillTimeout);
            fillTimeout = setTimeout(() => {
                console.log("[JoiiSync] 📝 捕获 Input 防抖事件:", selector, target.value);
                sendSyncEvent({ type: 'fill', selector, value: target.value });
            }, 800);
        }
    }, true);

    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastScrollTime > 200) { 
            lastScrollTime = now; 
            sendSyncEvent({ type: 'scroll', direction: e.deltaY > 0 ? 'down' : 'up', amount: Math.abs(e.deltaY) }); 
        }
    }, { capture: true, passive: true });

    window.addEventListener('keydown', (e) => {
        // 忽略纯修饰键
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
        
        const isInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
        if (isInput) {
            if (e.key === 'Enter') {
                // 如果按下回车，立即强制 flush 当前的输入框值，防止 fill 滞后于按键！
                clearTimeout(fillTimeout);
                const selector = getSelector(e.target);
                if (selector) {
                    sendSyncEvent({ type: 'fill', selector, value: e.target.value });
                    setTimeout(() => {
                        console.log("[JoiiSync] ⌨️ 捕获 Keydown (Enter):", e.key);
                        sendSyncEvent({ type: 'keydown', key: e.key });
                    }, 100);
                }
                return;
            }
            if (e.key !== 'Escape') return;
        }
        
        console.log("[JoiiSync] ⌨️ 捕获 Keydown 事件:", e.key);
        sendSyncEvent({ type: 'keydown', key: e.key });
    }, true);
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
            
            // 必须包含 iframe，否则无法拦截网页内部嵌套广告或组件的点击
            if (targetInfo.type === 'page' || targetInfo.type === 'iframe') {
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
        
        // 暴力重注机制 1：无论何时创建新的 JS 上下文（新页面、新 iframe），都强制打入引擎
        if (data.method === "Runtime.executionContextCreated") {
            const sessionId = data.sessionId;
            if (sessionId) {
                // 忽略注入错误
                fireCDP(ws, "Runtime.addBinding", { name: "joiiSync" }, sessionId);
                fireCDP(ws, "Runtime.evaluate", { expression: TRACKING_SCRIPT }, sessionId);
            }
        }

        // 暴力重注机制 2：页面导航完成后，强制打入引擎
        if (data.method === "Page.frameNavigated" && data.params?.frame) {
            const sessionId = data.sessionId;
            if (sessionId) {
                fireCDP(ws, "Runtime.addBinding", { name: "joiiSync" }, sessionId);
                fireCDP(ws, "Runtime.evaluate", { expression: TRACKING_SCRIPT }, sessionId);
            }
            if (!data.params.frame.parentId && syncSessions.has(id)) { 
                handleSyncNavigation(id, data.params.frame.url);
            }
        }

        // 双通道拦截：1. 标准 Binding
        if (data.method === "Runtime.bindingCalled" && data.params?.name === "joiiSync") {
            try { 
                const payload = JSON.parse(data.params.payload);
                if (syncSessions.has(id)) {
                    if (payload.type !== 'mousemove' && payload.type !== 'wheel') {
                        console.log(`\n[CDP->Daemon] === (Binding 通道) ========================`);
                        console.log(`[CDP->Daemon] 主控(${id}) 动作: ${payload.type}`);
                        console.log(`[CDP->Daemon] 目标: ${payload.selector}`);
                        if (payload.value !== undefined) console.log(`[CDP->Daemon] 值: ${payload.value}`);
                        console.log(`[CDP->Daemon] =======================================`);
                    }
                }
                handleSyncEvent(id, payload); 
            } catch(e) { 
                console.error("[CDP->Daemon] 解析 Payload 失败", e);
            }
        }
        
        // 双通道拦截：2. console.debug 隐秘通道 (防御 binding 丢失)
        if (data.method === "Runtime.consoleAPICalled" && data.params?.type === "debug") {
            const args = data.params.args;
            if (args && args.length > 0 && args[0].type === "string") {
                const text = args[0].value;
                if (text.includes('__joii_sync_payload')) {
                    try {
                        const payload = JSON.parse(text);
                        if (syncSessions.has(id)) {
                            if (payload.type !== 'mousemove' && payload.type !== 'wheel') {
                                console.log(`\n[CDP->Daemon] === (Console 通道) ======================`);
                                console.log(`[CDP->Daemon] 主控(${id}) 动作: ${payload.type}`);
                                console.log(`[CDP->Daemon] 目标: ${payload.selector}`);
                                if (payload.value !== undefined) console.log(`[CDP->Daemon] 值: ${payload.value}`);
                                console.log(`[CDP->Daemon] =======================================`);
                            }
                        }
                        handleSyncEvent(id, payload);
                    } catch(e) {}
                }
            }
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