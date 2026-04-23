import { pgTable, text, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { randomBytes } from "crypto";

const generateShortId = () => randomBytes(4).toString("hex");

export const devices = pgTable("devices", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  provider: text("provider").default("custom"), // custom, aliyun, etc.
  type: text("type").notNull().default("direct"), // direct, http, https, socks5, ssh
  host: text("host"),
  port: text("port"),
  username: text("username"),
  password: text("password"),
  ip: text("ip"),
  ipLoc: text("ip_loc"), // Format: country/city for quick view
  timezone: text("timezone"), // Asia/Shanghai
  country: text("country"),
  city: text("city"),
  lat: text("lat"),
  lon: text("lon"),
  expireAt: timestamp("expire_at"),
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

export const groups = pgTable("groups", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  name: text("name").notNull(),
  desc: text("desc"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const browserEnvironments = pgTable("browser_environments", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  name: text("name").notNull(),
  groupId: text("group_id").references(() => groups.id, { onDelete: "set null" }),
  groupIdLegacy: text("group").default("default"), // legacy column for existing data if needed, or we just drop it and use group_id
  platform: text("platform").default("none"),
  remark: text("remark"),
  tags: jsonb("tags").default("[]"), // Storing array of strings as JSONB
  
  deviceId: text("device_id").references(() => devices.id, { onDelete: "set null" }),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  
  fingerprint: jsonb("fingerprint"), // JSON storing OS, browser, WebRTC, Canvas noise, etc.
  
  status: text("status").default("idle"), // idle, running, error
  lastOpenedAt: timestamp("last_opened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  name: text("name").notNull(),
  type: text("type").notNull().default("custom"), // system, custom
  permissions: jsonb("permissions").default("{}"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  roleId: text("role_id").references(() => roles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  accessibleGroups: jsonb("accessible_groups").default("[]"), // array of group IDs
  browserLimit: integer("browser_limit").default(0), // 0 means unlimited
  status: text("status").default("active"), // active, disabled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accessPolicies = pgTable("access_policies", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  name: text("name").notNull(),
  type: text("type").notNull().default("blacklist"), // whitelist, blacklist
  targets: jsonb("targets").default("[]"), // URLs array
  appliedTo: jsonb("applied_to").default("[]"), // apply rules array
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accessLogs = pgTable("access_logs", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  memberId: text("member_id").references(() => users.id, { onDelete: "set null" }),
  envId: text("env_id").references(() => browserEnvironments.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  title: text("title"),
  action: text("action").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loginSettings = pgTable("login_settings", {
  id: text("id").primaryKey().$defaultFn(() => "'singleton'"),
  deviceWhitelist: boolean("device_whitelist").default(false),
  officeIpRestricted: boolean("office_ip_restricted").default(false),
  allowedIps: text("allowed_ips"),
  timeRestricted: boolean("time_restricted").default(false),
  allowTimeStart: text("allow_time_start"), // HH:mm
  allowTimeEnd: text("allow_time_end"), // HH:mm
});
