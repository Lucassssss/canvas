# Joii 账户系统设计文档

## 文档信息

| 项目       | 内容                |
| -------- | ----------------- |
| **产品名称** | Joii - 无限画布智能设计平台 |
| **版本**   | v1.0.0            |
| **状态**   | 设计阶段              |
| **文档日期** | 2026-03-29        |

***

## 1. 功能概述

### 1.1 核心功能

- 手机号 + 验证码登录/注册
- 用户信息管理
- 积分余额管理
- 套餐购买与消费

### 1.2 技术选型

| 层级   | 技术选型                   | 说明      |
| ---- | ---------------------- | ------- |
| 后端   | Bun + Express + SQLite | 复用现有技术栈 |
| 綈息服务 | 皦信通短信服务                | 阿里云短信   |
| 缓存   | Redis (可选)             | 验证码缓存   |

\| 安全 | JWT Token | 用户认证 |

***

## 2. 数据库设计

### 221 用户表 (users)

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  vip_level TEXT DEFAULT 'free' CHECK (vip_level IN ('free', 'pro', 'enterprise'),
  vip_expires_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);

```

### 2.2 套餐表 (packages)

```sql
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  features TEXT,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);
```

### 2.3 积分记录表 (credit\_transactions)

```sql
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'consume', 'refund', 'gift', 'admin')),
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  package_id TEXT,
  payment_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);
```

### 2.4 支付记录表 (payments)

```sql
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'cny',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded'),
  payment_method TEXT,
  transaction_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.5 验证码表 (verification\_codes)

```sql
CREATE TABLE IF NOT EXISTS verification_codes (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);
```

### 2.6 消费记录表 (usage\_logs)

```sql
CREATE TABLE IF NOT EXISTS usage_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  credits_cost INTEGER DEFAULT 0,
  details TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.7 索引

```sql
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON usage_logs(user_id);
```

***

## 3. API 设计

### 3.1 认证相关

| Method | Path                  | 描述       |
| ------ | --------------------- | -------- |
| POST   | /api/auth/send-code   | 发送验证码    |
| POST   | /api/auth/verify-code | 验证登录     |
| POST   | /api/auth/logout      | 登出登录     |
| GET    | /api/auth/me          | 获取当前用户   |
| POST   | /api/auth/refresh     | 刷新 Token |

### 3.2 用户相关

| Method | Path                    | 描述     |
| ------ | ----------------------- | ------ |
| GET    | /api/users/profile      | 获取用户资料 |
| PUT    | /api/users/profile      | 更新用户资料 |
| GET    | /api/users/credits      | 获取积分余额 |
| GET    | /api/users/transactions | 获取积分记录 |

### 3.3 套餐相关

| Method | Path              | 描述     |
| ------ | ----------------- | ------ |
| GET    | /api/packages     | 获取套餐列表 |
| GET    | /api/packages/:id | 获取套餐详情 |

### 3.4 支付相关

| Method | Path                      | 描述     |
| ------ | ------------------------- | ------ |
| POST   | /api/payments/create      | 创建支付订单 |
| GET    | /api/payments/:id         | 查询支付状态 |
| POST   | /api/payments/:id/confirm | 确认支付   |
| POST   | /api/payments/webhook     | 支付回调   |

### 3.5 积分消费

| Method | Path                 | 描述   |
| ------ | -------------------- | ---- |
| POST   | /api/credits/consume | 消费积分 |
| GET    | /api/credits/balance | 查询余额 |

***

## 4. 类型定义

```typescript
// 用户
interface User {
  id: string
  phone: string
  nickname?: string
  avatarUrl?: string
  credits: number
  creditsUsed: number
  vipLevel: 'free' | 'pro' | 'enterprise'
  vipExpiresAt?: number
  createdAt: number
  updatedAt: number
}

// 套餐
interface Package {
  id: string
  name: string
  description: string
  price: number
  credits: number
  features: string
  isPopular: boolean
  sortOrder: number
}

// 积分交易
interface CreditTransaction {
  id: string
  userId: string
  type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description?: string
  packageId?: string
  paymentId?: string
  createdAt: number
}

// 支付
interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod?: string
  transactionId?: string
  createdAt: number
  updatedAt?: number
}

// 验证码
interface VerificationCode {
  id: string
  phone: string
  code: string
  expiresAt: number
  usedAt?: number
  createdAt: number
}
```

***

## 5. 积分规则

### 5.1 初始积分

- 新用户注册赠送 100 积分

### 5.2 消费规则

| 功能    | 积分消耗     |
| ----- | -------- |
| 图片生成  | 1 积分/张   |
| 视频生成  | 5 积分/个   |
| AI 对话 | 0.1 积分/次 |
| 试衣功能  | 2 积分/次   |

### 5.3 VIP 权益

| 等级         | 权益               |
| ---------- | ---------------- |
| Free       | 基础功能， 每日 10 次生成  |
| Pro        | 优先生成、 每日 100 次生成 |
| Enterprise | 无限生成、 API 优先访问   |

***

## 6. 安全考虑

### 6.1 验证码安全

- 验证码 6 位数字
- 有效期 5 分钟
- 单个手机号每分钟最多发送 3 次
- 验证成功后立即失效

### 6.2 Token 安全

- JWT 有效期 7 天
- Refresh Token 有效期 30 天
- 支持 Token 黑名单

### 6.3 支付安全

- 支持微信支付、支付宝
- 支付金额最小 10 元
- 支付回调验签验证

***

## 7. 实施计划

| 阶段     | 任务       | 预计时间      |
| ------ | -------- | --------- |
| 1      | 数据库表创建   | 0.5 天     |
| 2      | 验证码服务集成  | 1 天       |
| 3      | 用户认证 API | 1 天       |
| 4      | 积分系统     | 1 天       |
| 5      | 支付集成     | 2 天       |
| 6      | 前端适配     | 1 天       |
| **总计** | <br />   | **6.5 天** |

***

**文档版本历史**

| 版本     | 日期         | 修改人       | 修改内容 |
| ------ | ---------- | --------- | ---- |
| v1.0.0 | 2026-03-29 | Joii Team | 初始版本 |

