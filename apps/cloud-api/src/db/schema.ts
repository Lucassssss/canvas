import { pgTable, text, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { randomBytes } from "crypto";
import { createId } from '@paralleldrive/cuid2';

const generateShortId = () => randomBytes(4).toString("hex");
const generateTeamId = () => "team_" + createId().substring(0, 10);

export const teams = pgTable("teams", {
  id: text("id").primaryKey().$defaultFn(generateTeamId),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const devices = pgTable("devices", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  provider: text("provider").default("custom"),
  type: text("type").notNull().default("direct"),
  host: text("host"),
  port: text("port"),
  username: text("username"),
  password: text("password"),
  ip: text("ip"),
  ipLoc: text("ip_loc"),
  timezone: text("timezone"),
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
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  platform: text("platform"),
  username: text("username"),
  password: text("password"),
  cookie: text("cookie"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  desc: text("desc"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const browserEnvironments = pgTable("browser_environments", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  groupId: text("group_id").references(() => groups.id, { onDelete: "set null" }),
  platform: text("platform").default("none"),
  remark: text("remark"),
  tags: jsonb("tags").default("[]"),
  deviceId: text("device_id").references(() => devices.id, { onDelete: "set null" }),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  fingerprint: jsonb("fingerprint"),
  status: text("status").default("idle"),
  lastOpenedAt: timestamp("last_opened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull().default("custom"), // system, custom
  permissions: jsonb("permissions").default("{}"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  roleId: text("role_id").references(() => roles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  accessibleGroups: jsonb("accessible_groups").default("[]"),
  browserLimit: integer("browser_limit").default(0),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accessPolicies = pgTable("access_policies", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull().default("blacklist"),
  targets: jsonb("targets").default("[]"),
  appliedTo: jsonb("applied_to").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accessLogs = pgTable("access_logs", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  memberId: text("member_id").references(() => users.id, { onDelete: "set null" }),
  envId: text("env_id").references(() => browserEnvironments.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  title: text("title"),
  action: text("action").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loginSettings = pgTable("login_settings", {
  id: text("id").primaryKey().$defaultFn(() => "'singleton'"),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  deviceWhitelist: boolean("device_whitelist").default(false),
  officeIpRestricted: boolean("office_ip_restricted").default(false),
  allowedIps: text("allowed_ips"),
  timeRestricted: boolean("time_restricted").default(false),
  allowTimeStart: text("allow_time_start"),
  allowTimeEnd: text("allow_time_end"),
});

export const rpaScripts = pgTable("rpa_scripts", {
  id: text("id").primaryKey().$defaultFn(generateShortId),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  groupId: text("group_id").references(() => groups.id, { onDelete: "set null" }),
  nodes: jsonb("nodes").default("[]"),
  edges: jsonb("edges").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
