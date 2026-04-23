import { db } from "../db/index.js";
import { devices, browserEnvironments } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

export class DeviceService {
  static async getDevice(id: string) {
    const results = await db.select().from(devices).where(eq(devices.id, id));
    return results[0] || null;
  }

  static async listDevices() {
    const results = await db
      .select({
        device: devices,
        associatedCount: sql`count(${browserEnvironments.id})`.mapWith(Number)
      })
      .from(devices)
      .leftJoin(browserEnvironments, eq(devices.id, browserEnvironments.deviceId))
      .groupBy(devices.id);

    return results.map(r => ({
      ...r.device,
      associatedCount: r.associatedCount
    }));
  }

  static async createDevice(data: any) {
    const [device] = await db.insert(devices).values({
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

  static async updateDevice(id: string, data: any) {
    const [device] = await db.update(devices).set({
      ...data,
      expireAt: data.expireAt ? new Date(data.expireAt) : undefined,
      updatedAt: new Date()
    }).where(eq(devices.id, id)).returning();
    return device;
  }

  static async deleteDevice(id: string) {
    await db.delete(devices).where(eq(devices.id, id));
    return true;
  }

  static async testDeviceConnection(data: any) {
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
          lat: d.lat,
          lon: d.lon,
        })
      },
      {
        url: "https://api.ip.sb/geoip",
        parser: (d: any) => ({
          query: d.ip,
          country: d.country_code || d.country,
          city: d.city,
          timezone: d.timezone,
          lat: d.latitude,
          lon: d.longitude,
        })
      },
      {
        url: "https://ipwhois.app/json/",
        parser: (d: any) => ({
          query: d.ip,
          country: d.country_code || d.country,
          city: d.city,
          timezone: d.timezone,
          lat: d.latitude,
          lon: d.longitude,
        })
      }
    ];

    let agent: any;
    if (data.type !== "direct") {
      let auth = "";
      if (data.username && data.password) {
        auth = `${encodeURIComponent(data.username)}:${encodeURIComponent(data.password)}@`;
      }
      const proxyUrl = `${data.type}://${auth}${data.host}:${data.port}`;
      if (data.type.startsWith("socks")) {
        agent = new SocksProxyAgent(proxyUrl);
      } else {
        agent = new HttpsProxyAgent(proxyUrl);
      }
    }

    const fetchOptions: any = {
      timeout: 10000
    };
    if (agent) {
      fetchOptions.agent = agent;
    }

    const errors: string[] = [];

    for (const api of ipApis) {
      try {
        const res = await fetch(api.url, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        
        const parsed = api.parser(result);
        if (parsed && parsed.query) {
          return {
            status: "success",
            ...parsed
          };
        }
      } catch (err: any) {
        errors.push(`[${api.url}] failed: ${err.message}`);
        console.error(`[DeviceService] Test via ${api.url} failed:`, err.message);
      }
    }

    throw new Error(`所有测试接口均请求失败: \n${errors.join("\n")}`);
  }
}
