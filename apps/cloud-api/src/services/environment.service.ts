import { db } from "../db/index.js";
import { browserEnvironments, devices, accounts } from "../db/schema.js";
import { eq, desc, asc, sql, and } from "drizzle-orm";
import { DeviceService } from "./device.service.js";

export class EnvironmentService {
  /**
   * 创建新的浏览器环境
   * 包含关联的账号和代理信息
   */
  static async createEnvironment(data: any) {
    return await db.transaction(async (tx) => {
      let deviceId = data.deviceId || null;
      let accountId = null;

      // 2. 如果有账号信息，创建独立账号记录
      if (data.username || data.password || data.cookie) {
        const [account] = await tx.insert(accounts).values({
          teamId: data.teamId,
          platform: data.platform !== "none" ? data.platform : null,
          username: data.username,
          password: data.password,
          cookie: data.cookie,
        }).returning({ id: accounts.id });
        accountId = account.id;
      }

      // 3. 构建指纹 JSON
      const fingerprint = {
        os: data.os,
        browser: data.browser,
        browserVersion: data.browserVersion,
        userAgent: data.userAgent,
        timezoneAuto: data.timezoneAuto,
        webrtcReplace: data.webrtcReplace,
        geolocationAuto: data.geolocationAuto,
        languageAuto: data.languageAuto,
        hardwareConcurrency: data.hardwareConcurrency,
        deviceMemory: data.deviceMemory,
        webglVendor: data.webglVendor,
        webglRenderer: data.webglRenderer,
        canvasNoise: data.canvasNoise,
        audioNoise: data.audioNoise,
      };

      // 4. 创建浏览器环境记录并关联
      const [env] = await tx.insert(browserEnvironments).values({
        teamId: data.teamId,
        name: data.name,
        group: data.group || "default",
        platform: data.platform || "none",
        remark: data.remark,
        tags: [], // 默认空标签
        deviceId: deviceId,
        accountId,
        fingerprint,
      }).returning();

      return env;
    });
  }

  /**
   * 获取环境列表 (关联代理和账号)
   */
  static async listEnvironments(teamId: string) {
    // 这里使用 Drizzle 的 leftJoin 来一次性拉取相关信息
    const results = await db
      .select({
        environment: browserEnvironments,
        device: devices,
        account: accounts,
      })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .leftJoin(accounts, eq(browserEnvironments.accountId, accounts.id))
      .where(eq(browserEnvironments.teamId, teamId));

    // 格式化为前端所需结构
    return results.map((row) => {
      const env = row.environment;
      const device = row.device;
      // account = row.account

      // 映射到前端 UNIFIED_PROFILES 类似结构
      return {
        id: env.id,
        group: env.group,
        name: env.name,
        os: (env.fingerprint as any)?.os || "windows",
        ip: device?.ip || "-",
        ipLoc: device?.ipLoc || "-",
        lastOpened: env.lastOpenedAt ? env.lastOpenedAt.toISOString().replace('T', ' ').substring(0, 19) : null,
        platform: env.platform,
        tags: env.tags || [],
        note: env.remark || "-",
        status: env.status || "idle",
        createTime: env.createdAt.toISOString().replace('T', ' ').substring(0, 19),
      };
    });
  }

  /**
   * 获取单个环境完整详情
   */
  static async getEnvironment(id: string, teamId: string) {
    const results = await db
      .select({
        env: browserEnvironments,
        device: devices,
        account: accounts
      })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .leftJoin(accounts, eq(browserEnvironments.accountId, accounts.id))
      .where(and(eq(browserEnvironments.id, id), eq(browserEnvironments.teamId, teamId)));

    if (!results.length) return null;
    const { env, device, account } = results[0];
    const fp = (env.fingerprint as any) || {};

    return {
      id: env.id,
      name: env.name,
      group: env.group,
      platform: env.platform,
      remark: env.remark,
      username: account?.username || "",
      password: account?.password || "",
      cookie: account?.cookie || "",
      deviceId: env.deviceId || "",
      proxyType: device?.type || "direct",
      proxyHost: device?.host || "",
      proxyPort: device?.port || "",
      proxyUser: device?.username || "",
      proxyPass: device?.password || "",
      os: fp.os || "windows",
      browser: fp.browser || "chrome",
      browserVersion: fp.browserVersion || "147",
      userAgent: fp.userAgent || "",
      timezoneAuto: fp.timezoneAuto ?? true,
      webrtcReplace: fp.webrtcReplace ?? true,
      geolocationAuto: fp.geolocationAuto ?? true,
      languageAuto: fp.languageAuto ?? true,
      hardwareConcurrency: fp.hardwareConcurrency || "16",
      deviceMemory: fp.deviceMemory || "8",
      webglVendor: fp.webglVendor || "NVIDIA Corporation",
      webglRenderer: fp.webglRenderer || "NVIDIA GeForce RTX 4070",
      canvasNoise: fp.canvasNoise || "noise",
      audioNoise: fp.audioNoise || "noise",
    };
  }

  /**
   * 删除环境
   */
  static async deleteEnvironment(id: string, teamId: string) {
    return await db.transaction(async (tx) => {
      const [env] = await tx.select().from(browserEnvironments).where(and(eq(browserEnvironments.id, id), eq(browserEnvironments.teamId, teamId)));
      if (!env) return false;

      // 先删除环境记录
      await tx.delete(browserEnvironments).where(eq(browserEnvironments.id, id));

      return true;
    });
  }

  /**
   * 编辑环境 (全量或部分更新)
   */
  static async updateEnvironment(id: string, teamId: string, data: any) {
    return await db.transaction(async (tx) => {
      const [env] = await tx.select().from(browserEnvironments).where(and(eq(browserEnvironments.id, id), eq(browserEnvironments.teamId, teamId)));
      if (!env) throw new Error("Environment not found");

      // 1. Update basic environment fields
      const updateData: any = { updatedAt: new Date() };
      if (data.name !== undefined) updateData.name = data.name;
      if (data.remark !== undefined) updateData.remark = data.remark;
      if (data.group !== undefined) updateData.group = data.group;
      if (data.platform !== undefined) updateData.platform = data.platform;
      if (data.deviceId !== undefined) updateData.deviceId = data.deviceId;

      // 2. Update Fingerprint
      if (data.os || data.browser || data.hardwareConcurrency) {
        // If fingerprint data is provided, merge it
        const currentFp = (env.fingerprint as any) || {};
        updateData.fingerprint = {
          ...currentFp,
          os: data.os ?? currentFp.os,
          browser: data.browser ?? currentFp.browser,
          browserVersion: data.browserVersion ?? currentFp.browserVersion,
          userAgent: data.userAgent ?? currentFp.userAgent,
          timezoneAuto: data.timezoneAuto ?? currentFp.timezoneAuto,
          webrtcReplace: data.webrtcReplace ?? currentFp.webrtcReplace,
          geolocationAuto: data.geolocationAuto ?? currentFp.geolocationAuto,
          languageAuto: data.languageAuto ?? currentFp.languageAuto,
          hardwareConcurrency: data.hardwareConcurrency ?? currentFp.hardwareConcurrency,
          deviceMemory: data.deviceMemory ?? currentFp.deviceMemory,
          webglVendor: data.webglVendor ?? currentFp.webglVendor,
          webglRenderer: data.webglRenderer ?? currentFp.webglRenderer,
          canvasNoise: data.canvasNoise ?? currentFp.canvasNoise,
          audioNoise: data.audioNoise ?? currentFp.audioNoise,
        };
      }

      await tx.update(browserEnvironments).set(updateData).where(eq(browserEnvironments.id, id));

      // 3. Update Device
      if (data.proxyType) {
        if (env.deviceId) {
          await tx.update(devices).set({
            type: data.proxyType,
            host: data.proxyHost,
            port: data.proxyPort,
            username: data.proxyUser,
            password: data.proxyPass,
            updatedAt: new Date()
          }).where(eq(devices.id, env.deviceId));
        } else {
          const [device] = await tx.insert(devices).values({
            teamId,
            type: data.proxyType,
            host: data.proxyHost,
            port: data.proxyPort,
            username: data.proxyUser,
            password: data.proxyPass,
          }).returning({ id: devices.id });
          await tx.update(browserEnvironments).set({ deviceId: device.id }).where(eq(browserEnvironments.id, id));
        }
      }

      // 4. Update Account
      if (data.username || data.password || data.cookie) {
        if (env.accountId) {
          await tx.update(accounts).set({
            platform: data.platform !== "none" ? data.platform : null,
            username: data.username,
            password: data.password,
            cookie: data.cookie,
            updatedAt: new Date()
          }).where(eq(accounts.id, env.accountId));
        } else {
          const [account] = await tx.insert(accounts).values({
            teamId,
            platform: data.platform !== "none" ? data.platform : null,
            username: data.username,
            password: data.password,
            cookie: data.cookie,
          }).returning({ id: accounts.id });
          await tx.update(browserEnvironments).set({ accountId: account.id }).where(eq(browserEnvironments.id, id));
        }
      }

      return true;
    });
  }

  /**
   * 启动前查询代理 IP，并更新设备信息
   */
  static async checkProxyIp(id: string, teamId: string) {
    const envs = await db.select({ env: browserEnvironments, device: devices })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .where(and(eq(browserEnvironments.id, id), eq(browserEnvironments.teamId, teamId)));

    if (!envs.length) throw new Error("Environment not found");
    const { device } = envs[0];

    let liveGeo = null;
    if (device && device.type !== "direct") {
      try {
        const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
        liveGeo = await Promise.race([DeviceService.lookupIp(device), timeout]);
        if (liveGeo) {
          console.log(`[checkProxyIp] ${id} 实时 IP 查询结果:`, liveGeo);
          // 更新设备的地理位置信息
          await db.update(devices)
            .set({
              country: liveGeo.country,
              city: liveGeo.city,
              timezone: liveGeo.timezone,
              lat: liveGeo.lat,
              lon: liveGeo.lon,
              updatedAt: new Date()
            })
            .where(eq(devices.id, device.id));
        } else {
          console.warn(`[checkProxyIp] ${id} 实时 IP 查询超时 (>8s)`);
        }
      } catch (e) {
        console.warn(`[checkProxyIp] ${id} 实时 IP 查询失败:`, e);
      }
    }
    return { success: true, liveGeo };
  }

  /**
   * 启动浏览器环境
   */
  static async startEnvironment(id: string, teamId: string) {

    const envs = await db.select({ env: browserEnvironments, device: devices })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .where(and(eq(browserEnvironments.id, id), eq(browserEnvironments.teamId, teamId)));

    if (!envs.length) throw new Error("Environment not found");
    const { env, device } = envs[0];

    const fp: any = env.fingerprint || {};

    // 决议最终使用的地理信息：存储的设备信息 > fp 显式配置
    // 注意：device.timezone 等数据已由前置的 check-proxy 接口更新
    const resolvedTimezone = (fp.timezoneAuto
      ? device?.timezone
      : fp.timezone) || null;

    const resolvedLat = (fp.geolocationAuto
      ? device?.lat
      : fp.lat) || null;

    const resolvedLon = (fp.geolocationAuto
      ? device?.lon
      : fp.lon) || null;

    // 语言解析：auto 时根据国家代码映射到浏览器语言序列
    // 移除所有 q-value，Chromium 的 HTTP 引擎会自动基于顺序生成 q-value，
    // 在启动参数中带 q-value 会导致 navigator.languages 解析出奇怪的值。
    const COUNTRY_LANG_MAP: Record<string, string> = {
      US: "en-US,en",
      GB: "en-GB,en",
      AU: "en-AU,en",
      CA: "en-CA,en",
      JP: "ja,en-US,en",
      KR: "ko,en-US,en",
      CN: "zh-CN,zh,en-US,en",
      TW: "zh-TW,zh,en-US,en",
      HK: "zh-HK,zh,en-US,en",
      DE: "de-DE,de,en-US,en",
      FR: "fr-FR,fr,en-US,en",
      ES: "es-ES,es,en-US,en",
      IT: "it-IT,it,en-US,en",
      PT: "pt-PT,pt,en-US,en",
      BR: "pt-BR,pt,en-US,en",
      RU: "ru-RU,ru,en-US,en",
      IN: "en-IN,en",
      ID: "id-ID,id,en-US,en",
      TH: "th-TH,th,en-US,en",
      VN: "vi-VN,vi,en-US,en",
      MY: "ms-MY,ms,en-US,en",
      PH: "en-PH,en",
      SG: "en-US,en", // 新加坡代理通常使用标准的 US 英语结构
      TR: "tr-TR,tr,en-US,en",
      SA: "ar-SA,ar,en-US,en",
      AE: "ar-AE,ar,en-US,en",
      MX: "es-MX,es,en-US,en",
    };
    const resolvedCountry = device?.country || null;
    const autoLang = resolvedCountry ? (COUNTRY_LANG_MAP[resolvedCountry.toUpperCase()] || "en-US,en") : "en-US,en";
    const resolvedLang = (fp.languageAuto ? autoLang : fp.language) || "en-US,en";

    const cliArgs: Record<string, string> = {
      // ── 用户数据目录 ──────────────────────────────────────
      "--user-data-dir": `D:\\ai\\canvas\\apps\\local-daemon\\profiles\\${id}`,

      // ── 指纹参数 ──────────────────────────────────────────
      // ⚠️ 注意：browserVersion 必须与实际 Chromium 二进制版本一致，
      //    伪造高版本会被 Sec-CH-UA / CDP 协议版本特征检测出来。
      "--fingerprint-platform": fp.os || "windows",
      "--fingerprint-brand": fp.browser || "chrome",
      "--fingerprint-brand-version": fp.browserVersion || "130",
      "--user-agent": fp.userAgent || "",
      "--fingerprint-hardware-concurrency": fp.hardwareConcurrency || "16",

      // ── 稳定性 & UI 静默（已测试）────────────────────────
      "--no-first-run": "",
      "--no-default-browser-check": "",
      "--disable-extensions": "",
      "--disable-translate": "",
      "--password-store": "basic",

      // ── 后台网络 & 同步（已测试）─────────────────────────
      "--disable-background-networking": "",
      "--disable-sync": "",
      "--dns-prefetch-disable": "",
      "--disable-features": "DnsOverHttps,DnsHttpsSvcb,MediaRouter",

      // ── WebRTC 防泄漏（已测试）───────────────────────────
      "--disable-non-proxied-udp": "",
      "--force-webrtc-ip-handling-policy": "disable_non_proxied_udp",
    };

    // ── 时区注入 ──────────────────────────────────────────────────────────────
    if (resolvedTimezone) {
      cliArgs["--timezone"] = resolvedTimezone;
    }

    // ── 语言注入 ──────────────────────────────────────────────────────────────
    // 必须设置 --lang（Chrome UI 语言，直接影响 Intl.DateTimeFormat().resolvedOptions().locale）
    // 以及 --accept-lang (影响 HTTP 请求头和 navigator.languages)
    // 确保主语言标签一致，可以避免 Chromium 的乱码合并 bug
    const langPrimary = resolvedLang.split(',')[0].trim();
    cliArgs["--lang"] = langPrimary;
    cliArgs["--accept-lang"] = resolvedLang;

    // ── GPU 指纹：仅当平台与 GPU 品牌匹配时注入，避免矛盾特征被检测 ───────────
    // Apple GPU (Metal) 只在 macOS 上真实存在；在 Windows 注入会造成 WebGL 参数矛盾
    if (fp.webglVendor && fp.webglRenderer) {
      const isAppleGpu = fp.webglVendor.toLowerCase().includes("apple");
      const isMacOs = (fp.os || "").toLowerCase() === "macos";
      // 只有非 Apple GPU 或平台确实是 macos 时才注入
      if (!isAppleGpu || isMacOs) {
        cliArgs["--fingerprint-gpu-vendor"] = fp.webglVendor;
        cliArgs["--fingerprint-gpu-renderer"] = fp.webglRenderer;
      }
      // 否则跳过，让 Chromium 使用宿主机真实 GPU 信息
    }

    if (device && device.type !== "direct") {
      cliArgs["--proxy-server"] = `${device.type}://${device.host}:${device.port}`;
      // DNS 防泄漏：阻断本地 DNS，排除代理服务器本身（已测试，bad_flags 警告已从源码移除）
      cliArgs["--host-resolver-rules"] = `MAP * ~NOTFOUND, EXCLUDE ${device.host}`;
    }

    // 更新状态
    await db.update(browserEnvironments).set({ status: "running", lastOpenedAt: new Date() }).where(eq(browserEnvironments.id, id));

    return { success: true, id, cli_args: cliArgs };
  }

  /**
   * 停止浏览器环境
   */
  static async stopEnvironment(id: string, teamId: string) {
    // 更新状态
    await db.update(browserEnvironments).set({ status: "idle" }).where(and(eq(browserEnvironments.id, id), eq(browserEnvironments.teamId, teamId)));

    return { success: true, message: "Environment stopped successfully" };
  }
}
