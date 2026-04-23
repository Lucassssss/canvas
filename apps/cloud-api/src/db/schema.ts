import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { randomBytes } from "crypto";

const generateShortId = () => randomBytes(4).toString("hex");

export const proxies = pgTable("proxies", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  type: text("type").notNull().default("direct"), // direct, http, https, socks5, ssh
  host: text("host"),
  port: text("port"),
  username: text("username"),
  password: text("password"),
  ip: text("ip"),
  ipLoc: text("ip_loc"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  platform: text("platform"), // fb, amz, tk, etc.
  username: text("username"),
  password: text("password"),
  cookie: text("cookie"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const browserEnvironments = pgTable("browser_environments", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  name: text("name").notNull(),
  group: text("group").default("default"),
  platform: text("platform").default("none"),
  remark: text("remark"),
  tags: jsonb("tags").default("[]"), // Storing array of strings as JSONB
  
  proxyId: text("proxy_id").references(() => proxies.id, { onDelete: "set null" }),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  
  fingerprint: jsonb("fingerprint"), // JSON storing OS, browser, WebRTC, Canvas noise, etc.
  
  status: text("status").default("idle"), // idle, running, error
  lastOpenedAt: timestamp("last_opened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
