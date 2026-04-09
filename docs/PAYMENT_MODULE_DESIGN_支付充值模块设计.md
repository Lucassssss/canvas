# Joii 支付充值模块技术设计文档

> 版本：v1.0\
> 创建日期：2026-04-10\
> 维护者：Joii Development Team

***

## 目录

1. [系统概述](#1-系统概述)
2. [架构设计](#2-架构设计)
3. [数据库设计](#3-数据库设计)
4. [API设计](#4-api设计)
5. [前端实现](#5-前端实现)
6. [支付流程](#6-支付流程)
7. [安全考虑](#7-安全考虑)
8. [测试计划](#8-测试计划)
9. [部署指南](#9-部署指南)
10. [开发计划](#10-开发计划)

***

## 1. 系统概述

### 1.1 功能目标

Joii 支付充值模块为用户提供积分购买能力，支持微信支付（Native扫码支付），实现：

- **多档位套餐选择**：50/200/500/1000/2000/5000 积分
- **微信扫码支付**：生成支付二维码，用户扫码付款
- **实时状态更新**：支付成功后即时到账
- **订单管理**：用户可查看充值历史

### 1.2 技术选型

| 层级    | 技术                       | 说明         |
| ----- | ------------------------ | ---------- |
| 前端    | Next.js 16 + React       | 充值UI、状态管理  |
| 后端    | Express + TypeScript     | 支付API、订单管理 |
| 数据库   | PostgreSQL + Drizzle ORM | 订单、交易记录存储  |
| 支付SDK | wechatpay-node-v3        | 微信支付V3 API |
| 状态管理  | Zustand                  | 前端积分状态     |

### 1.3 系统边界

```
┌─────────────────────────────────────────────────────────────┐
│                        Joii 系统                             │
├─────────────────────────────────────────────────────────────┤
│  前端 (Next.js)              后端 (Express)                 │
│  ┌─────────────────┐        ┌─────────────────┐            │
│  │ 充值模态框       │◄──────►│ 支付API         │            │
│  │ 积分状态管理     │        │ 订单管理        │            │
│  │ 订单轮询        │        │ 积分服务        │            │
│  └─────────────────┘        └────────┬────────┘            │
│                                      │                      │
│                             ┌────────▼────────┐            │
│                             │ PostgreSQL      │            │
│                             │ - orders        │            │
│                             │ - transactions  │            │
│                             └─────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                                      │
                             ┌────────▼────────┐
                             │ 微信支付平台     │
                             │ - Native下单    │
                             │ - 支付回调      │
                             └─────────────────┘
```

***

## 2. 架构设计

### 2.1 整体架构

```
┌──────────────────────────────────────────────────────────────────────┐
│                              用户界面层                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ CreditsBadge│  │  UserMenu   │  │ ProfilePage │  │ RechargeModal│ │
│  │  (积分徽章)  │  │  (用户菜单)  │  │ (个人中心)   │  │  (充值弹窗)  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
└─────────┼────────────────┼────────────────┼────────────────┼─────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                              状态管理层                               │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    useCredits (Zustand Store)                    │ │
│  │  - isInsufficientModalOpen  - currentOrder                      │ │
│  │  - openInsufficientModal    - createPaymentOrder                │ │
│  │  - closeInsufficientModal   - pollOrderStatus                   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                              API封装层                                │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    payment-api.ts                                │ │
│  │  - createOrder(credits: number) → Order                         │ │
│  │  - getOrderStatus(orderId: string) → OrderStatus                │ │
│  │  - getUserOrders() → Order[]                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                              后端服务层                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │  Payment Routes │  │ Payment Service │  │ Credits Service │      │
│  │  /api/payments  │  │ - createOrder   │  │ - addCredits    │      │
│  │  /api/callback  │  │ - handleCallback│  │ - getBalance    │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                              数据存储层                               │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                         PostgreSQL                               │ │
│  │  - users (id, credits, ...)                                     │ │
│  │  - orders (id, order_no, status, amount, credits, ...)          │ │
│  │  - credit_transactions (id, user_id, type, amount, ...)         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 模块依赖关系

```
前端模块依赖：
├── useCredits (状态管理)
│   ├── payment-api (API调用)
│   └── useAuth (用户信息)
│
├── CreditsRechargeModal (充值UI)
│   └── useCredits
│
├── CreditsBadge (积分徽章)
│   └── useCredits
│
└── UserMenu (用户菜单)
    └── useCredits

后端模块依赖：
├── routes/payments.ts (支付路由)
│   ├── services/payment (支付服务)
│   ├── services/credits (积分服务)
│   └── middleware/auth (认证中间件)
│
├── services/payment (支付服务)
│   ├── wechatpay-node-v3 (微信SDK)
│   └── db (数据库操作)
│
└── services/credits (积分服务)
    └── db (数据库操作)
```

***

## 3. 数据库设计

### 3.1 现有表结构

#### users 表（已存在）

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0,        -- 当前积分余额
  credits_used INTEGER NOT NULL DEFAULT 0,   -- 累计消耗积分
  vip_level TEXT DEFAULT 'free',
  vip_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_phone ON users(phone);
```

#### credit\_transactions 表（已存在）

```sql
CREATE TABLE credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,                        -- purchase | consume | refund | gift | admin | signup
  amount INTEGER NOT NULL,                   -- 变动数量（正数增加，负数减少）
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  details JSONB,                             -- 扩展信息
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at);
```

### 3.2 新增表结构

#### orders 表（新建）

```sql
CREATE TYPE order_status AS ENUM (
  'pending',    -- 待支付
  'paid',       -- 已支付
  'expired',    -- 已过期
  'cancelled',  -- 已取消
  'refunded'    -- 已退款
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_no TEXT UNIQUE NOT NULL,             -- 商户订单号（唯一）
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- 订单内容
  credits INTEGER NOT NULL,                  -- 购买积分数
  amount INTEGER NOT NULL,                   -- 支付金额（单位：分）
  
  -- 支付信息
  status order_status NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'wechat',      -- wechat | alipay
  
  -- 微信支付相关
  prepay_id TEXT,                            -- 预支付交易会话标识
  qr_code_url TEXT,                          -- 支付二维码链接
  transaction_id TEXT,                       -- 微信支付订单号
  
  -- 时间信息
  expire_at TIMESTAMP NOT NULL,              -- 订单过期时间
  paid_at TIMESTAMP,                         -- 支付完成时间
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE UNIQUE INDEX idx_orders_order_no ON orders(order_no);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_expire_at ON orders(expire_at);
```

### 3.3 Drizzle Schema 定义

```typescript
// apps/api/src/db/schema.ts

import { pgTable, text, integer, timestamp, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { users } from './schema'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'expired',
  'cancelled',
  'refunded',
])

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNo: text('order_no').unique().notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  
  credits: integer('credits').notNull(),
  amount: integer('amount').notNull(),
  
  status: orderStatusEnum('status').default('pending').notNull(),
  paymentMethod: text('payment_method').default('wechat'),
  
  prepayId: text('prepay_id'),
  qrCodeUrl: text('qr_code_url'),
  transactionId: text('transaction_id'),
  
  expireAt: timestamp('expire_at').notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orderNoIdx: uniqueIndex('idx_orders_order_no').on(table.orderNo),
  userIdIdx: index('idx_orders_user_id').on(table.userId),
  statusIdx: index('idx_orders_status').on(table.status),
  createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
  expireAtIdx: index('idx_orders_expire_at').on(table.expireAt),
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
```

### 3.4 数据迁移

```bash
# 生成迁移文件
cd apps/api
bunx drizzle-kit generate

# 执行迁移
bunx drizzle-kit migrate
```

***

## 4. API设计

### 4.1 API 概览

| 方法   | 路径                       | 说明       | 认证 |
| ---- | ------------------------ | -------- | -- |
| POST | /api/payments/create     | 创建支付订单   | ✓  |
| GET  | /api/payments/order/:id  | 查询订单状态   | ✓  |
| GET  | /api/payments/orders     | 获取用户订单列表 | ✓  |
| POST | /api/payments/callback   | 微信支付回调   | ✗  |
| POST | /api/payments/cancel/:id | 取消订单     | ✓  |

### 4.2 API 详细设计

#### 4.2.1 创建支付订单

**请求**

```http
POST /api/payments/create
Content-Type: application/json
Cookie: session_token=xxx

{
  "credits": 500
}
```

**响应（成功）**

```json
{
  "success": true,
  "data": {
    "orderId": "ord_abc123",
    "orderNo": "20260410123456789",
    "credits": 500,
    "amount": 4000,
    "qrCodeUrl": "weixin://wxpay/bizpayurl?pr=xxx",
    "expireAt": "2026-04-10T12:34:56.789Z"
  }
}
```

**响应（失败）**

```json
{
  "success": false,
  "error": "无效的积分套餐"
}
```

#### 4.2.2 查询订单状态

**请求**

```http
GET /api/payments/order/ord_abc123
Cookie: session_token=xxx
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "ord_abc123",
    "orderNo": "20260410123456789",
    "credits": 500,
    "amount": 4000,
    "status": "paid",
    "paidAt": "2026-04-10T12:30:00.000Z",
    "createdAt": "2026-04-10T12:00:00.000Z"
  }
}
```

#### 4.2.3 获取用户订单列表

**请求**

```http
GET /api/payments/orders?page=1&limit=10
Cookie: session_token=xxx
```

**响应**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_abc123",
        "orderNo": "20260410123456789",
        "credits": 500,
        "amount": 4000,
        "status": "paid",
        "paidAt": "2026-04-10T12:30:00.000Z",
        "createdAt": "2026-04-10T12:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10
  }
}
```

#### 4.2.4 微信支付回调

**请求**

```http
POST /api/payments/callback
Content-Type: application/json
X-WXPay-Signature: xxx
X-WXPay-Timestamp: xxx
X-WXPay-Nonce: xxx
X-WXPay-Serial: xxx

{
  "id": "ev_abc123",
  "create_time": "2026-04-10T12:30:00+08:00",
  "resource_type": "encrypt-resource",
  "event_type": "TRANSACTION.SUCCESS",
  "resource": {
    "algorithm": "AEAD_AES_256_GCM",
    "ciphertext": "xxx",
    "nonce": "xxx",
    "associated_data": "transaction"
  }
}
```

**响应**

```json
{
  "code": "SUCCESS",
  "message": "成功"
}
```

### 4.3 路由实现

```typescript
// apps/api/src/routes/payments.ts

import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import {
  createPaymentOrder,
  getOrderStatus,
  getUserOrders,
  handlePaymentCallback,
  cancelOrder,
} from '../services/payment'

const router = Router()

router.post('/create', authMiddleware, createPaymentOrder)
router.get('/order/:id', authMiddleware, getOrderStatus)
router.get('/orders', authMiddleware, getUserOrders)
router.post('/callback', handlePaymentCallback)
router.post('/cancel/:id', authMiddleware, cancelOrder)

export default router
```

***

## 5. 前端实现

### 5.1 文件结构

```
apps/web/src/
├── lib/api/
│   └── payment-api.ts           # 支付API封装
│
├── features/credits/
│   ├── useCredits.ts            # 积分状态管理（更新）
│   ├── CreditsInsufficientModal.tsx  # 充值模态框（更新）
│   ├── CreditsConsumeModal.tsx  # 消耗确认弹窗
│   └── index.ts
│
└── components/
    ├── CreditsBadge.tsx         # 积分徽章
    └── UserMenu.tsx             # 用户菜单
```

### 5.2 支付API封装

```typescript
// apps/web/src/lib/api/payment-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface Order {
  id: string
  orderNo: string
  credits: number
  amount: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled' | 'refunded'
  qrCodeUrl?: string
  expireAt: string
  paidAt?: string
  createdAt: string
}

export interface CreateOrderResponse {
  success: boolean
  data?: {
    orderId: string
    orderNo: string
    credits: number
    amount: number
    qrCodeUrl: string
    expireAt: string
  }
  error?: string
}

export async function createOrder(credits: number): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/api/payments/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credits }),
  })
  return res.json()
}

export async function getOrderStatus(orderId: string): Promise<{ success: boolean; data?: Order; error?: string }> {
  const res = await fetch(`${API_BASE}/api/payments/order/${orderId}`, {
    credentials: 'include',
  })
  return res.json()
}

export async function getUserOrders(page = 1, limit = 10): Promise<{
  success: boolean
  data?: { orders: Order[]; total: number; page: number; limit: number }
  error?: string
}> {
  const res = await fetch(`${API_BASE}/api/payments/orders?page=${page}&limit=${limit}`, {
    credentials: 'include',
  })
  return res.json()
}
```

### 5.3 状态管理更新

```typescript
// apps/web/src/features/credits/useCredits.ts

import { create } from 'zustand'
import { createOrder, getOrderStatus, type Order } from '@/lib/api/payment-api'

interface CreditsState {
  // 现有状态
  isConsuming: boolean
  isModalOpen: boolean
  isInsufficientModalOpen: boolean
  pendingConsume: ConsumeCreditsParams | null
  lastConsumeResult: ConsumeResult | null
  
  // 新增支付状态
  currentOrder: Order | null
  isPaying: boolean
  paymentError: string | null
  
  // 现有方法
  openConsumeModal: (params: ConsumeCreditsParams) => void
  closeConsumeModal: () => void
  openInsufficientModal: () => void
  closeInsufficientModal: () => void
  consumeCredits: () => Promise<ConsumeResult>
  
  // 新增支付方法
  createPaymentOrder: (credits: number) => Promise<{ success: boolean; qrCodeUrl?: string; error?: string }>
  pollOrderStatus: (orderId: string) => Promise<void>
  resetPayment: () => void
}

export const useCredits = create<CreditsState>((set, get) => ({
  // 现有状态...
  isConsuming: false,
  isModalOpen: false,
  isInsufficientModalOpen: false,
  pendingConsume: null,
  lastConsumeResult: null,
  
  // 新增状态
  currentOrder: null,
  isPaying: false,
  paymentError: null,
  
  // 现有方法...
  openConsumeModal: (params) => set({ isModalOpen: true, pendingConsume: params }),
  closeConsumeModal: () => set({ isModalOpen: false, pendingConsume: null }),
  openInsufficientModal: () => set({ isInsufficientModalOpen: true }),
  closeInsufficientModal: () => set({ isInsufficientModalOpen: false, currentOrder: null, paymentError: null }),
  
  // 新增方法
  createPaymentOrder: async (credits: number) => {
    set({ isPaying: true, paymentError: null })
    
    try {
      const result = await createOrder(credits)
      
      if (result.success && result.data) {
        set({
          currentOrder: {
            id: result.data.orderId,
            orderNo: result.data.orderNo,
            credits: result.data.credits,
            amount: result.data.amount,
            status: 'pending',
            qrCodeUrl: result.data.qrCodeUrl,
            expireAt: result.data.expireAt,
            createdAt: new Date().toISOString(),
          },
        })
        
        // 开始轮询
        get().pollOrderStatus(result.data.orderId)
        
        return { success: true, qrCodeUrl: result.data.qrCodeUrl }
      }
      
      set({ isPaying: false, paymentError: result.error || '创建订单失败' })
      return { success: false, error: result.error }
    } catch (error) {
      set({ isPaying: false, paymentError: '网络错误，请稍后重试' })
      return { success: false, error: '网络错误' }
    }
  },
  
  pollOrderStatus: async (orderId: string) => {
    const maxPolls = 120 // 最多轮询2分钟（每秒一次）
    let polls = 0
    
    const poll = async () => {
      if (polls >= maxPolls) {
        set({ isPaying: false, paymentError: '支付超时，请重新尝试' })
        return
      }
      
      polls++
      
      try {
        const result = await getOrderStatus(orderId)
        
        if (result.success && result.data) {
          set({ currentOrder: result.data })
          
          if (result.data.status === 'paid') {
            // 支付成功
            set({ isPaying: false })
            // 刷新用户信息（积分）
            // 可以在这里触发全局刷新
            return
          }
          
          if (result.data.status === 'expired' || result.data.status === 'cancelled') {
            set({ isPaying: false, paymentError: '订单已过期或取消' })
            return
          }
        }
        
        // 继续轮询
        setTimeout(poll, 1000)
      } catch (error) {
        // 网络错误，继续轮询
        setTimeout(poll, 1000)
      }
    }
    
    poll()
  },
  
  resetPayment: () => {
    set({
      currentOrder: null,
      isPaying: false,
      paymentError: null,
    })
  },
  
  // consumeCredits 实现...
  consumeCredits: async () => {
    // 现有实现...
  },
}))
```

### 5.4 充值模态框更新

```typescript
// apps/web/src/features/credits/CreditsInsufficientModal.tsx

// 关键更新部分：

// 1. 用户选择套餐后，点击支付区域触发创建订单
const handlePayment = async () => {
  const result = await createPaymentOrder(selectedOption)
  if (!result.success) {
    // 显示错误提示
  }
  // 成功后二维码会自动显示（通过 currentOrder.qrCodeUrl）
}

// 2. 显示真实二维码
{currentOrder?.qrCodeUrl ? (
  <img src={currentOrder.qrCodeUrl} alt="支付二维码" className="w-32 h-32" />
) : (
  <div className="w-32 h-32 bg-neutral-50 rounded-lg flex items-center justify-center">
    <QrCode className="w-10 h-10 text-neutral-300" />
  </div>
)}

// 3. 支付状态显示
{isPaying && (
  <div className="text-center">
    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
    <p className="text-xs text-neutral-500">等待支付中...</p>
  </div>
)}

// 4. 支付成功/失败处理
{currentOrder?.status === 'paid' && (
  <div className="text-center text-emerald-600">
    <Check className="w-5 h-5 mx-auto mb-2" />
    <p className="text-xs">支付成功！</p>
  </div>
)}
```

***

## 6. 支付流程

### 6.1 正常支付流程

```
用户                    前端                     后端                    微信支付
 │                       │                        │                        │
 │  1. 点击充值          │                        │                        │
 ├──────────────────────►│                        │                        │
 │                       │                        │                        │
 │                       │  2. 创建订单请求        │                        │
 │                       ├───────────────────────►│                        │
 │                       │                        │                        │
 │                       │                        │  3. Native下单         │
 │                       │                        ├───────────────────────►│
 │                       │                        │                        │
 │                       │                        │  4. 返回二维码URL      │
 │                       │                        │◄───────────────────────┤
 │                       │                        │                        │
 │                       │  5. 返回订单信息        │                        │
 │                       │◄───────────────────────┤                        │
 │                       │                        │                        │
 │  6. 显示二维码        │                        │                        │
 │◄──────────────────────┤                        │                        │
 │                       │                        │                        │
 │  7. 扫码支付          │                        │                        │
 ├────────────────────────────────────────────────────────────────────────►│
 │                       │                        │                        │
 │                       │                        │  8. 支付成功回调       │
 │                       │                        │◄───────────────────────┤
 │                       │                        │                        │
 │                       │                        │  9. 更新订单+增加积分  │
 │                       │                        ├──────┐                 │
 │                       │                        │      │                 │
 │                       │                        │◄─────┘                 │
 │                       │                        │                        │
 │                       │  10. 轮询检测到支付成功 │                        │
 │                       │◄───────────────────────┤                        │
 │                       │                        │                        │
 │  11. 显示支付成功     │                        │                        │
 │◄──────────────────────┤                        │                        │
 │                       │                        │                        │
```

### 6.2 异常流程处理

#### 6.2.1 支付超时

```
用户                    前端                     后端
 │                       │                        │
 │                       │  轮询超过2分钟          │
 │                       ├──────┐                 │
 │                       │      │                 │
 │                       │◄─────┘                 │
 │                       │                        │
 │  显示"支付超时"       │                        │
 │◄──────────────────────┤                        │
 │                       │                        │
 │  [重新支付] 按钮      │                        │
 ├──────────────────────►│                        │
```

#### 6.2.2 用户取消支付

```
用户                    前端                     后端
 │                       │                        │
 │  关闭充值弹窗         │                        │
 ├──────────────────────►│                        │
 │                       │                        │
 │                       │  停止轮询              │
 │                       ├──────┐                 │
 │                       │      │                 │
 │                       │◄─────┘                 │
 │                       │                        │
 │                       │  后台订单自动过期      │
 │                       │  (5分钟后)             │
```

#### 6.2.3 网络错误

```
用户                    前端                     后端
 │                       │                        │
 │                       │  API请求失败           │
 │                       ├──────┐                 │
 │                       │      │                 │
 │                       │◄─────┘                 │
 │                       │                        │
 │  显示"网络错误"       │                        │
 │◄──────────────────────┤                        │
 │                       │                        │
 │  [重试] 按钮          │                        │
 ├──────────────────────►│                        │
```

***

## 7. 安全考虑

### 7.1 支付安全

| 安全措施  | 说明              |
| ----- | --------------- |
| HTTPS | 所有API必须使用HTTPS  |
| 签名验证  | 微信回调必须验证签名      |
| 幂等处理  | 回调接口支持幂等，防止重复处理 |
| 金额校验  | 后端校验金额与套餐匹配     |
| 订单归属  | 查询订单时验证用户归属     |

### 7.2 回调安全实现

```typescript
// apps/api/src/services/payment/callback.ts

import { verifySignature } from 'wechatpay-node-v3'

export async function handlePaymentCallback(req: Request, res: Response) {
  // 1. 验证签名
  const signature = req.headers['x-wxpay-signature']
  const timestamp = req.headers['x-wxpay-timestamp']
  const nonce = req.headers['x-wxpay-nonce']
  const serial = req.headers['x-wxpay-serial']
  
  const isValid = verifySignature({
    signature,
    timestamp,
    nonce,
    serial,
    body: JSON.stringify(req.body),
  })
  
  if (!isValid) {
    return res.status(401).json({ code: 'FAIL', message: '签名验证失败' })
  }
  
  // 2. 解密通知内容
  const decrypted = decryptResource(req.body.resource)
  
  // 3. 幂等检查
  const existingOrder = await getOrderByTransactionId(decrypted.transaction_id)
  if (existingOrder) {
    return res.json({ code: 'SUCCESS', message: '已处理' })
  }
  
  // 4. 更新订单状态
  await updateOrderStatus(decrypted.out_trade_no, {
    status: 'paid',
    transactionId: decrypted.transaction_id,
    paidAt: new Date(),
  })
  
  // 5. 增加用户积分
  await addCredits(decrypted.attach.userId, decrypted.total_amount / 100)
  
  // 6. 返回成功
  res.json({ code: 'SUCCESS', message: '成功' })
}
```

### 7.3 前端安全

```typescript
// 防止XSS：二维码URL必须来自可信源
if (currentOrder?.qrCodeUrl?.startsWith('weixin://')) {
  // 安全的微信支付链接
}

// 防止CSRF：使用Cookie认证
credentials: 'include'
```

***

## 8. 测试计划

### 8.1 单元测试

```typescript
// apps/api/src/services/payment/__tests__/payment.test.ts

describe('Payment Service', () => {
  describe('createOrder', () => {
    it('should create order with valid credits', async () => {
      const result = await createOrder('user_123', 500)
      expect(result.success).toBe(true)
      expect(result.data.credits).toBe(500)
    })
    
    it('should reject invalid credits', async () => {
      const result = await createOrder('user_123', 999)
      expect(result.success).toBe(false)
    })
  })
  
  describe('handleCallback', () => {
    it('should verify signature', async () => {
      // 测试签名验证
    })
    
    it('should be idempotent', async () => {
      // 测试幂等性
    })
  })
})
```

### 8.2 集成测试

```typescript
// apps/api/src/routes/__tests__/payments.test.ts

describe('Payment Routes', () => {
  it('POST /api/payments/create should create order', async () => {
    const res = await request(app)
      .post('/api/payments/create')
      .set('Cookie', 'session_token=xxx')
      .send({ credits: 500 })
    
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
  
  it('GET /api/payments/order/:id should return order', async () => {
    const res = await request(app)
      .get('/api/payments/order/ord_123')
      .set('Cookie', 'session_token=xxx')
    
    expect(res.status).toBe(200)
  })
})
```

### 8.3 E2E测试

```typescript
// apps/web/e2e/payment.spec.ts

describe('Payment Flow', () => {
  it('should complete payment flow', async () => {
    // 1. 打开充值弹窗
    await page.click('[data-testid="credits-badge"]')
    
    // 2. 选择套餐
    await page.click('[data-testid="package-500"]')
    
    // 3. 验证二维码显示
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible()
    
    // 4. 模拟支付成功（测试环境）
    // ...
    
    // 5. 验证积分更新
    await expect(page.locator('[data-testid="credits-value"]')).toHaveText('500')
  })
})
```

### 8.4 测试环境配置

```env
# 测试环境微信支付（沙箱）
WECHAT_SANDBOX=true
WECHAT_APPID=wx_test_appid
WECHAT_MCH_ID=test_mchid
```

***

## 9. 部署指南

### 9.1 环境变量配置

```env
# apps/api/.env

# 数据库
DATABASE_URL=postgresql://user:pass@host:5432/joii

# 微信支付 v3
WECHAT_APPID="your_appid"
WECHAT_MCH_ID="your_mch_id"
WECHAT_PRIVATE_KEY_PATH="certs/apiclient_key.pem"
WECHAT_PUBLIC_KEY_PATH="certs/apiclient_cert.pem"
WECHAT_API_V3_KEY="your_api_v3_key"
WECHAT_SERIAL_NO="your_serial_no"
WECHAT_NOTIFY_URL="https://your-domain.com/api/payments/callback"
BASE_URL="https://your-domain.com"

# 前端
NEXT_PUBLIC_API_URL=https://api.joii.cc
```

### 9.2 证书部署

证书文件已存在于 `apps/api/certs/` 目录：

```
apps/api/certs/
├── apiclient_key.pem     # 商户私钥
├── apiclient_cert.pem    # 商户证书
└── apiclient_cert.p12    # 商户证书（PKCS12格式）
```

**权限设置：**
```bash
# 设置私钥权限（仅所有者可读）
chmod 600 apps/api/certs/apiclient_key.pem
```

### 9.3 数据库迁移

```bash
# 生产环境迁移
cd apps/api
bunx drizzle-kit migrate
```

### 9.4 服务部署

```bash
# 构建后端
cd apps/api
bun run build

# 启动服务
bun run start

# 或使用 PM2
pm2 start .bin/server.js --name joii-api
```

### 9.5 回调URL配置

在微信支付商户平台配置：

- 支付回调URL：`https://api.joii.cc/api/payments/callback`
- 确保域名已备案
- 确保HTTPS证书有效

***

## 10. 开发计划

### 10.1 Phase 1: 后端基础设施（2-3天）

| 任务        | 文件                        | 预估时间 |
| --------- | ------------------------- | ---- |
| 安装微信支付SDK | package.json              | 0.5h |
| 数据库模型设计   | db/schema.ts              | 2h   |
| 数据库迁移     | -                         | 0.5h |
| 支付服务实现    | services/payment/index.ts | 4h   |
| 支付路由实现    | routes/payments.ts        | 2h   |
| 环境变量配置    | .env                      | 0.5h |
| 单元测试      | __tests__/\*.test.ts      | 2h   |

### 10.2 Phase 2: 前端支付集成（1-2天）

| 任务      | 文件                             | 预估时间 |
| ------- | ------------------------------ | ---- |
| 支付API封装 | lib/api/payment-api.ts         | 1h   |
| 状态管理更新  | features/credits/useCredits.ts | 2h   |
| 充值模态框更新 | CreditsInsufficientModal.tsx   | 3h   |
| 支付状态UI  | -                              | 2h   |
| 错误处理UI  | -                              | 1h   |

### 10.3 Phase 3: 完善体验（1天）

| 任务     | 文件                  | 预估时间 |
| ------ | ------------------- | ---- |
| 支付成功反馈 | -                   | 1h   |
| 支付失败处理 | -                   | 1h   |
| 订单记录页面 | app/orders/page.tsx | 3h   |
| 积分动画效果 | -                   | 1h   |

### 10.4 Phase 4: 测试与上线（1-2天）

| 任务    | 预估时间 |
| ----- | ---- |
| 集成测试  | 2h   |
| E2E测试 | 2h   |
| 沙箱测试  | 2h   |
| 生产部署  | 2h   |
| 监控配置  | 1h   |

### 10.5 里程碑

| 里程碑      | 目标日期  | 交付物     |
| -------- | ----- | ------- |
| M1: 后端完成 | Day 3 | 支付API可用 |
| M2: 前端完成 | Day 5 | 支付流程可用  |
| M3: 测试完成 | Day 7 | 测试通过    |
| M4: 上线   | Day 8 | 生产环境运行  |

***

## 附录

### A. 套餐配置

套餐配置采用**数据库存储 + API动态获取**方案，支持灵活调整：

#### A.1 数据库表设计

```sql
CREATE TABLE recharge_packages (
  id TEXT PRIMARY KEY,
  credits INTEGER NOT NULL,              -- 积分数量
  price INTEGER NOT NULL,                -- 价格（元）
  unit_price DECIMAL(6,4) NOT NULL,      -- 单价（元/积分）
  savings INTEGER DEFAULT 0,             -- 节省百分比
  popular BOOLEAN DEFAULT FALSE,         -- 是否推荐
  sort_order INTEGER DEFAULT 0,          -- 排序
  is_active BOOLEAN DEFAULT TRUE,        -- 是否启用
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 初始数据
INSERT INTO recharge_packages (id, credits, price, unit_price, savings, popular, sort_order) VALUES
  ('pkg_50',   50,   5,   0.1000, 0,  false, 1),
  ('pkg_200',  200,  18,  0.0900, 10, false, 2),
  ('pkg_500',  500,  40,  0.0800, 20, true,  3),
  ('pkg_1000', 1000, 70,  0.0700, 30, false, 4),
  ('pkg_2000', 2000, 120, 0.0600, 40, false, 5),
  ('pkg_5000', 5000, 250, 0.0500, 50, false, 6);
```

#### A.2 Drizzle Schema

```typescript
// apps/api/src/db/schema.ts

export const rechargePackages = pgTable('recharge_packages', {
  id: text('id').primaryKey(),
  credits: integer('credits').notNull(),
  price: integer('price').notNull(),
  unitPrice: numeric('unit_price', { precision: 6, scale: 4 }).notNull(),
  savings: integer('savings').default(0),
  popular: boolean('popular').default(false),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  sortOrderIdx: index('idx_recharge_packages_sort').on(table.sortOrder),
  isActiveIdx: index('idx_recharge_packages_active').on(table.isActive),
}))

export type RechargePackage = typeof rechargePackages.$inferSelect
```

#### A.3 API接口

**获取套餐列表：**
```http
GET /api/payments/packages

Response:
{
  "success": true,
  "data": [
    { "id": "pkg_50", "credits": 50, "price": 5, "unitPrice": 0.1, "savings": 0, "popular": false },
    { "id": "pkg_200", "credits": 200, "price": 18, "unitPrice": 0.09, "savings": 10, "popular": false },
    { "id": "pkg_500", "credits": 500, "price": 40, "unitPrice": 0.08, "savings": 20, "popular": true },
    ...
  ]
}
```

#### A.4 前端使用

```typescript
// apps/web/src/lib/api/payment-api.ts

export async function getRechargePackages(): Promise<RechargePackage[]> {
  const res = await fetch(`${API_BASE}/api/payments/packages`)
  const result = await res.json()
  return result.data || []
}

// 在组件中使用
const [packages, setPackages] = useState<RechargePackage[]>([])

useEffect(() => {
  getRechargePackages().then(setPackages)
}, [])
```

#### A.5 管理后台（可选）

后续可开发管理后台，支持：
- 新增/编辑/删除套餐
- 调整排序
- 启用/禁用套餐
- 设置推荐标签

### B. 错误码定义

| 错误码          | 说明       |
| ------------ | -------- |
| PAYMENT\_001 | 无效的积分套餐  |
| PAYMENT\_002 | 订单不存在    |
| PAYMENT\_003 | 订单已过期    |
| PAYMENT\_004 | 订单已支付    |
| PAYMENT\_005 | 微信支付下单失败 |
| PAYMENT\_006 | 签名验证失败   |

### C. 监控指标

| 指标      | 说明            | 告警阈值  |
| ------- | ------------- | ----- |
| 支付成功率   | 支付成功/总订单      | < 90% |
| 回调延迟    | 回调到达时间 - 支付时间 | > 30s |
| 订单创建失败率 | 创建失败/总请求      | > 5%  |
| 积分到账延迟  | 回调处理时间        | > 5s  |

***

**文档版本历史**

| 版本   | 日期         | 变更内容 |
| ---- | ---------- | ---- |
| v1.0 | 2026-04-10 | 初始版本 |

