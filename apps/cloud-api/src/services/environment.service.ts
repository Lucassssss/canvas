import { db } from "../db/index.js";
import { browserEnvironments, devices, accounts } from "../db/schema.js";
import { eq, desc, asc, sql } from "drizzle-orm";

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
  static async listEnvironments() {
    // 这里使用 Drizzle 的 leftJoin 来一次性拉取相关信息
    const results = await db
      .select({
        environment: browserEnvironments,
        device: devices,
        account: accounts,
      })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .leftJoin(accounts, eq(browserEnvironments.accountId, accounts.id));

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
  static async getEnvironment(id: string) {
    const results = await db
      .select({
        env: browserEnvironments,
        device: devices,
        account: accounts
      })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .leftJoin(accounts, eq(browserEnvironments.accountId, accounts.id))
      .where(eq(browserEnvironments.id, id));

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
  static async deleteEnvironment(id: string) {
    return await db.transaction(async (tx) => {
      const [env] = await tx.select().from(browserEnvironments).where(eq(browserEnvironments.id, id));
      if (!env) return false;

      // 先删除环境记录
      await tx.delete(browserEnvironments).where(eq(browserEnvironments.id, id));

      return true;
    });
  }

  /**
   * 编辑环境 (全量或部分更新)
   */
  static async updateEnvironment(id: string, data: any) {
    return await db.transaction(async (tx) => {
      const [env] = await tx.select().from(browserEnvironments).where(eq(browserEnvironments.id, id));
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
   * 启动浏览器环境
   */
  static async startEnvironment(id: string) {
    const envs = await db.select({ env: browserEnvironments, device: devices })
      .from(browserEnvironments)
      .leftJoin(devices, eq(browserEnvironments.deviceId, devices.id))
      .where(eq(browserEnvironments.id, id));

    if (!envs.length) throw new Error("Environment not found");
    const { env, device } = envs[0];

    const fp: any = env.fingerprint || {};

    const cliArgs: Record<string, string> = {
      // ── 用户数据目录 ──────────────────────────────────────
      "--user-data-dir": `D:\\ai\\canvas\\apps\\local-daemon\\profiles\\${id}`,

      // ── 指纹参数 ──────────────────────────────────────────
      "--fingerprint-platform": fp.os || "windows",
      "--fingerprint-brand": fp.browser || "chrome",
      "--fingerprint-brand-version": fp.browserVersion || "147",
      "--user-agent": fp.userAgent || "",
      "--fingerprint-hardware-concurrency": fp.hardwareConcurrency || "16",
      "--fingerprint-gpu-vendor": fp.webglVendor || "",
      "--fingerprint-gpu-renderer": fp.webglRenderer || "",

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
  static async stopEnvironment(id: string) {
    // 更新状态
    await db.update(browserEnvironments).set({ status: "idle" }).where(eq(browserEnvironments.id, id));
    
    return { success: true, message: "Environment stopped successfully" };
  }
}
