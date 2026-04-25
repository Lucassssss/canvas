import { db } from "../db/index.js";
import { devices, browserEnvironments } from "../db/schema.js";
import { eq, sql, and } from "drizzle-orm";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

export class DeviceService {
  static async getDevice(id: string, teamId: string) {
    const results = await db.select().from(devices).where(and(eq(devices.id, id), eq(devices.teamId, teamId)));
    return results[0] || null;
  }

  static async listDevices(teamId: string) {
    const results = await db
      .select({
        device: devices,
        associatedCount: sql`count(${browserEnvironments.id})`.mapWith(Number)
      })
      .from(devices)
      .leftJoin(browserEnvironments, eq(devices.id, browserEnvironments.deviceId))
      .where(eq(devices.teamId, teamId))
      .groupBy(devices.id);

    return results.map(r => ({
      ...r.device,
      associatedCount: r.associatedCount
    }));
  }

  static async createDevice(data: any) {
    const [device] = await db.insert(devices).values({
      teamId: data.teamId,
      provider: data.provider || "custom",
      type: data.type || "direct",
      host: data.host,
      port: data.port,
      username: data.username,
      password: data.password,
      ip: data.ip,
      ipLoc: data.ipLoc,
      timezone: data.timezone,
      country: data.country,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      expireAt: data.expireAt ? new Date(data.expireAt) : null,
      status: "active"
    }).returning();
    return device;
  }

  static async updateDevice(id: string, teamId: string, data: any) {
    const [device] = await db.update(devices).set({
      ...data,
      expireAt: data.expireAt ? new Date(data.expireAt) : undefined,
      updatedAt: new Date()
    }).where(and(eq(devices.id, id), eq(devices.teamId, teamId))).returning();
    return device;
  }

  static async deleteDevice(id: string, teamId: string) {
    await db.delete(devices).where(and(eq(devices.id, id), eq(devices.teamId, teamId)));
    return true;
  }

  /**
   * 通过代理查询当前 IP 的地理/时区信息（共用逻辑）
   * 返回 { query, country, city, timezone, lat, lon } 或 null
   */
  static async lookupIp(device: { type: string; host?: string | null; port?: string | null; username?: string | null; password?: string | null }): Promise<{ query: string; country: string; city: string; timezone: string; lat: string; lon: string } | null> {
    const ipApis = [
      {
        url: "https://ipinfo.io/json",
        parser: (d: any) => ({
          query: d.ip,
          country: d.country,
          city: d.city,
          timezone: d.timezone,
          lat: d.loc ? d.loc.split(',')[0] : "",
          lon: d.loc ? d.loc.split(',')[1] : "",
        })
      },
      {
        url: "http://ip-api.com/json",
        parser: (d: any) => ({
          query: d.query,
          country: d.countryCode || d.country,
          city: d.city,
          timezone: d.timezone,
          lat: String(d.lat ?? ""),
          lon: String(d.lon ?? ""),
        })
      },
      {
        url: "https://api.ip.sb/geoip",
        parser: (d: any) => ({
          query: d.ip,
          country: d.country_code || d.country,
          city: d.city,
          timezone: d.timezone,
          lat: String(d.latitude ?? ""),
          lon: String(d.longitude ?? ""),
        })
      },
      {
        url: "https://ipwhois.app/json/",
        parser: (d: any) => ({
          query: d.ip,
          country: d.country_code || d.country,
          city: d.city,
          timezone: d.timezone,
          lat: String(d.latitude ?? ""),
          lon: String(d.longitude ?? ""),
        })
      }
    ];

    let agent: any;
    if (device.type !== "direct") {
      let auth = "";
      if (device.username && device.password) {
        auth = `${encodeURIComponent(device.username)}:${encodeURIComponent(device.password)}@`;
      }
      const proxyUrl = `${device.type}://${auth}${device.host}:${device.port}`;
      if (device.type.startsWith("socks")) {
        agent = new SocksProxyAgent(proxyUrl);
      } else {
        agent = new HttpsProxyAgent(proxyUrl);
      }
    }

    const fetchOptions: any = { timeout: 5000 };
    if (agent) fetchOptions.agent = agent;

    for (const api of ipApis) {
      try {
        const res = await fetch(api.url, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        const parsed = api.parser(result);
        if (parsed && parsed.query) return parsed;
      } catch (err: any) {
        console.warn(`[DeviceService.lookupIp] ${api.url} failed: ${err.message}`);
      }
    }
    return null;
  }

  static async testDeviceConnection(data: any) {
    const result = await DeviceService.lookupIp(data);
    if (result) return { status: "success", ...result };
    throw new Error(`所有 IP 查询接口均请求失败，请检查代理配置`);
  }
}
