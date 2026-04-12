import { pgTable, text, timestamp, integer, index, uniqueIndex, json, pgEnum, doublePrecision } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const vipLevelEnum = pgEnum('vip_level', ['free', 'pro', 'enterprise'])
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system'])
export const transactionTypeEnum = pgEnum('transaction_type', ['purchase', 'consume', 'refund', 'gift', 'admin', 'signup'])
export const projectModeEnum = pgEnum('project_mode', ['agent', 'chat'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'expired', 'cancelled', 'refunded'])

export const CanvasDataSchema = z.object({
  shapes: z.array(z.unknown()),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number(),
  }),
  selectedIds: z.array(z.string()),
  history: z.array(z.unknown()).optional(),
})

export type CanvasData = z.infer<typeof CanvasDataSchema>

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  phone: text('phone').unique().notNull(),
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  credits: doublePrecision('credits').notNull().default(0),
  creditsUsed: doublePrecision('credits_used').notNull().default(0),
  vipLevel: vipLevelEnum('vip_level').default('free').notNull(),
  vipExpiresAt: timestamp('vip_expires_at', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  phoneIdx: uniqueIndex('idx_users_phone').on(table.phone),
  creditsIdx: index('idx_users_credits').on(table.credits),
}))

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New Conversation'),
  model: text('model').notNull().default('deepseek/deepseek-chat'),
  mode: projectModeEnum('mode').default('agent').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_conversations_user_id').on(table.userId),
  updatedAtIdx: index('idx_conversations_updated_at').on(table.updatedAt),
}))

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: messageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index('idx_messages_conversation_id').on(table.conversationId),
}))

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('Untitled Project'),
  version: text('version').notNull().default('1.0.0'),
  canvasData: json('canvas_data').$type<CanvasData>().notNull(),
  thumbnail: text('thumbnail'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_projects_user_id').on(table.userId),
  updatedAtIdx: index('idx_projects_updated_at').on(table.updatedAt),
}))

export const projectConversations = pgTable('project_conversations', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  projectIdIdx: index('idx_project_conversations_project_id').on(table.projectId),
  conversationIdIdx: index('idx_project_conversations_conversation_id').on(table.conversationId),
  uniqueProjectConversation: uniqueIndex('idx_project_conversation_unique').on(table.projectId, table.conversationId),
}))

export const verificationCodes = pgTable('verification_codes', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  phoneIdx: index('idx_verification_codes_phone').on(table.phone),
}))

export const creditTransactions = pgTable('credit_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  amount: doublePrecision('amount').notNull(),
  balanceBefore: doublePrecision('balance_before').notNull(),
  balanceAfter: doublePrecision('balance_after').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_credit_transactions_user').on(table.userId),
}))

export const usageLogs = pgTable('usage_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  creditsCost: doublePrecision('credits_cost').default(0),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_usage_logs_user').on(table.userId),
}))

export const tokenBlacklist = pgTable('token_blacklist', {
  id: text('id').primaryKey(),
  tokenJti: text('token_jti').unique().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jtiIdx: uniqueIndex('idx_token_blacklist_jti').on(table.tokenJti),
}))

export const rechargePackages = pgTable('recharge_packages', {
  id: text('id').primaryKey(),
  credits: integer('credits').notNull(),
  price: integer('price').notNull(),
  unitPrice: text('unit_price').notNull(),
  savings: integer('savings').default(0),
  popular: integer('popular').default(0),
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active').default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sortOrderIdx: index('idx_recharge_packages_sort').on(table.sortOrder),
  isActiveIdx: index('idx_recharge_packages_active').on(table.isActive),
}))

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNo: text('order_no').unique().notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  credits: integer('credits').notNull(),
  amount: integer('amount').notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  paymentMethod: text('payment_method').default('wechat'),
  prepayId: text('prepay_id'),
  qrCodeUrl: text('qr_code_url'),
  transactionId: text('transaction_id'),
  expireAt: timestamp('expire_at', { withTimezone: true }).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  pollCount: integer('poll_count').default(0).notNull(),
  lastPolledAt: timestamp('last_polled_at', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  orderNoIdx: uniqueIndex('idx_orders_order_no').on(table.orderNo),
  userIdIdx: index('idx_orders_user_id').on(table.userId),
  statusIdx: index('idx_orders_status').on(table.status),
  createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
  expireAtIdx: index('idx_orders_expire_at').on(table.expireAt),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Conversation = typeof conversations.$inferSelect
export type Message = typeof messages.$inferSelect
export type Project = typeof projects.$inferSelect
export type ProjectConversation = typeof projectConversations.$inferSelect
export type VerificationCode = typeof verificationCodes.$inferSelect
export type CreditTransaction = typeof creditTransactions.$inferSelect
export type UsageLog = typeof usageLogs.$inferSelect
export type TokenBlacklistEntry = typeof tokenBlacklist.$inferSelect
export type RechargePackage = typeof rechargePackages.$inferSelect
export type Order = typeof orders.$inferSelect
