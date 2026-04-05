# Joii 账户系统设计文档

## 文档信息

| 项目       | 内容                |
| -------- | ----------------- |
| **产品名称** | Joii - 无限画布智能设计平台 |
| **版本**   | v1.1.0            |
| **状态**   | 实施中               |
| **文档日期** | 2026-04-05        |

***

## 1. 功能概述与阶段规划

### 1.1 核心功能

- 手机号 + 验证码登录/注册
- 用户信息管理
- 积分余额管理
- 积分消费与记录

### 1.2 MVP 阶段规划

| 阶段           | 范围                     | 状态  |
| ------------ | ---------------------- | --- |
| **MVP (当前)** | 积分制：登录注册 + 积分余额 + 积分消费 | 待实施 |
| **P1 (后续)**  | 套餐购买 + 支付集成            | 规划中 |

### 1.3 技术选型

| 层级   | 技术选型                   | 说明      |
| ---- | ---------------------- | ------- |
| 后端   | Bun + Express + SQLite | 复用现有技术栈 |
| 短信服务 | 阿里云短信服务                | 已配置环境变量 |
| 认证   | JWT Token              | 用户认证    |
| 前端   | Next.js + shadcn/ui    | 复用现有技术栈 |

***

## 2. UI/UX 设计

### 2.1 登录注册页面

**路由**：`/login`

**核心元素**：

| 元素      | 类型       | 说明           |
| ------- | -------- | ------------ |
| 手机号输入框  | Input    | 国际区号选择 (+86) |
| 发送验证码按钮 | Button   | 带 60 秒倒计时    |
| 验证码输入框  | Input    | 6 位数字        |
| 登录按钮    | Button   | 提交验证         |
| 用户协议勾选  | Checkbox | 必选           |
| 返回首页链接  | Link     | -            |

**验证码规则**：

- 6 位数字
- 有效期 5 分钟
- 单个手机号每分钟最多发送 3 次

### 2.2 Header 用户信息

**未登录状态**：

```
┌──────────────────────────────────────────────────┐
│  [Logo]                    [语言] [登录/注册]    │
└──────────────────────────────────────────────────┘
```

**已登录状态**：

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                    [⚡ 1016] [👤] [退出]          │
└──────────────────────────────────────────────────────────┘
```

**用户头像 Dropdown**：

```
┌───────────────────┐
│  👤 个人中心        │
│  ⚡ 我的积分: 1016  │
│  ────────────────  │
│  🚪 退出登录       │
└───────────────────┘
```

### 2.3 个人中心页面

**路由**：`/profile`

**核心元素**：

| 区域   | 内容        | 说明             |
| ---- | --------- | -------------- |
| 用户信息 | 头像、昵称、手机号 | 昵称可编辑          |
| 积分余额 | 当前积分数量    | 显示总积分          |
| 积分明细 | 收支记录列表    | 含时间、类型、金额、余额   |
| 消费日志 | 操作记录列表    | 含时间、功能、规格、消耗积分 |

**积分明细字段**：时间、类型（收入/支出）、数量、余额、说明

**消费日志字段**：时间、功能名称、图片规格/视频时长、消耗积分数

### 2.4 积分消费提示

**生成前提示**：

```
┌─────────────────────────────────────┐
│  ⚡ 即将消耗 1 积分                   │
│                                     │
│  图片生成将消耗 1 积分，当前余额 1016  │
│                                     │
│  [取消]           [确认生成]         │
└─────────────────────────────────────┘
```

**积分不足提示**：

```
┌─────────────────────────────────────┐
│  ⚠️ 积分不足                          │
│                                     │
│  当前余额: 0 积分                     │
│  图片生成需要: 1 积分                  │
│                                     │
│  [取消]           [升级套餐]          │
└─────────────────────────────────────┘
```

### 2.5 前端组件清单

| 组件             | 路径                               | 说明       |
| -------------- | -------------------------------- | -------- |
| `LoginModal`   | `features/auth/LoginModal.tsx`   | 登录注册弹窗   |
| `AuthProvider` | `features/auth/AuthProvider.tsx` | 认证状态管理   |
| `useAuth`      | `features/auth/useAuth.ts`       | 认证 Hook  |
| `CreditsBadge` | `components/CreditsBadge.tsx`    | 积分显示徽章   |
| `UserMenu`     | `components/UserMenu.tsx`        | 用户头像下拉菜单 |

***

## 3. 环境变量配置

### 3.1 已配置变量

在 `apps/api/.env` 中已配置以下变量：

```bash
# 阿里云短信服务
SMS_PROVIDER="aliyun"
ALIYUN_ACCESS_KEY_ID="your_access_key_id"
ALIYUN_ACCESS_KEY_SECRET="your_secret_access_key"
ALIYUN_SIGN_NAME="your_sign_name"
ALIYUN_TEMPLATE_CODE="your_template_code"

# 微信支付 (P1 阶段使用)
WECHAT_APPID="your_appid"
WECHAT_MCH_ID="your_mch_id"
WECHAT_PRIVATE_KEY_PATH="your_private_key_path"
WECHAT_PUBLIC_KEY_PATH="your_public_key_path"
WECHAT_API_V3_KEY="your_api_v3_key"
WECHAT_SERIAL_NO="your_serial_no"
WECHAT_NOTIFY_URL="your_notify_url"

# NextAuth (JWT 密钥)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="your_nextauth_url"

# 基础配置
BASE_URL="your_base_url"
```

### 3.2 需要配置变量

| 变量名               | 说明           | 配置位置        |
| ----------------- | ------------ | ----------- |
| `JWT_SECRET`      | JWT 签名密钥     | 待添加到 `.env` |
| `SMS_CODE_LENGTH` | 验证码长度 (默认 6) | 可选配置        |

***

## 4. 数据库设计

### 4.1 用户表 (users)

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  vip_level TEXT DEFAULT 'free' CHECK (vip_level IN ('free', 'pro', 'enterprise')),
  vip_expires_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);
```

### 4.2 验证码表 (verification\_codes)

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

### 4.3 积分记录表 (credit\_transactions)

```sql
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'consume', 'refund', 'gift', 'admin', 'signup')),
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4.4 消费记录表 (usage\_logs)

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

### 4.5 索引

```sql
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON usage_logs(user_id);
```

### 4.6 P1 阶段表 (套餐 + 支付)

```sql
-- 套餐表 (packages) - P1
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

-- 支付记录表 (payments) - P1
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'cny',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

***

## 5. API 设计

### 5.1 认证相关 (MVP)

| Method | Path                  | 描述       | 优先级 |
| ------ | --------------------- | -------- | --- |
| POST   | /api/auth/send-code   | 发送验证码    | P0  |
| POST   | /api/auth/verify-code | 验证登录     | P0  |
| POST   | /api/auth/logout      | 登出       | P0  |
| GET    | /api/auth/me          | 获取当前用户   | P0  |
| POST   | /api/auth/refresh     | 刷新 Token | P1  |

### 5.2 用户相关 (MVP)

| Method | Path               | 描述     | 优先级 |
| ------ | ------------------ | ------ | --- |
| GET    | /api/users/profile | 获取用户资料 | P0  |
| PUT    | /api/users/profile | 更新用户资料 | P0  |

### 5.3 积分相关 (MVP)

| Method | Path                    | 描述     | 优先级 |
| ------ | ----------------------- | ------ | --- |
| GET    | /api/users/credits      | 获取积分余额 | P0  |
| GET    | /api/users/transactions | 获取积分记录 | P0  |
| POST   | /api/credits/consume    | 消费积分   | P0  |

### 5.4 套餐相关 (P1)

| Method | Path              | 描述     | 优先级 |
| ------ | ----------------- | ------ | --- |
| GET    | /api/packages     | 获取套餐列表 | P1  |
| GET    | /api/packages/:id | 获取套餐详情 | P1  |

### 5.5 支付相关 (P1)

| Method | Path                      | 描述     | 优先级 |
| ------ | ------------------------- | ------ | --- |
| POST   | /api/payments/create      | 创建支付订单 | P1  |
| GET    | /api/payments/:id         | 查询支付状态 | P1  |
| POST   | /api/payments/:id/confirm | 确认支付   | P1  |
| POST   | /api/payments/webhook     | 支付回调   | P1  |

***

## 6. 类型定义

### 6.1 用户相关

```typescript
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

interface UserProfile {
  id: string
  phone: string
  nickname?: string
  avatarUrl?: string
}
```

### 6.2 认证相关

```typescript
interface SendCodeRequest {
  phone: string
}

interface SendCodeResponse {
  success: boolean
  message: string
}

interface VerifyCodeRequest {
  phone: string
  code: string
}

interface VerifyCodeResponse {
  success: boolean
  token?: string
  refreshToken?: string
  user?: User
  error?: string
}

interface AuthTokens {
  token: string
  refreshToken: string
  expiresIn: number // seconds
}
```

### 6.3 积分相关

```typescript
interface CreditsInfo {
  balance: number
  used: number
}

interface CreditTransaction {
  id: string
  userId: string
  type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin' | 'signup'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description?: string
  createdAt: number
}

interface ConsumeCreditsRequest {
  amount: number
  description: string
  action: string
  details?: Record<string, any>
}

interface ConsumeCreditsResponse {
  success: boolean
  balanceBefore: number
  balanceAfter: number
  transactionId?: string
  error?: string
}
```

### 6.4 验证码

```typescript
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

## 7. 积分规则

### 7.1 初始积分

- 新用户注册赠送 **100 积分**

### 7.2 消费规则

| 功能    | 积分消耗     |
| ----- | -------- |
| 图片生成  | 1 积分/张   |
| 视频生成  | 5 积分/个   |
| AI 对话 | 0.1 积分/次 |
| 试衣功能  | 2 积分/次   |

### 7.3 VIP 权益 (P1)

| 等级         | 权益              |
| ---------- | --------------- |
| Free       | 基础功能，每日 10 次生成  |
| Pro        | 优先生成，每日 100 次生成 |
| Enterprise | 无限生成、API 优先访问   |

***

## 8. 安全措施

### 8.1 输入安全

| 措施       | 说明                          |
| -------- | --------------------------- |
| 手机号格式校验  | 必须为中国大陆手机号格式 (1\[3-9]\d{9}) |
| 验证码格式校验  | 必须为 6 位数字                   |
| SQL 注入防护 | 使用参数化查询                     |
| XSS 防护   | 输出转义，禁止 HTML 渲染用户输入         |
| 请求体大小限制  | 防止恶意大请求攻击                   |

### 8.2 验证码安全

| 措施      | 说明                 |
| ------- | ------------------ |
| 验证码位数   | 6 位数字              |
| 有效期     | 5 分钟               |
| 发送频率限制  | 单个手机号每分钟最多 3 次     |
| 验证失效    | 验证成功后立即失效          |
| 错误次数限制  | 单个验证码错误 5 次后强制失效   |
| IP 频率限制 | 单个 IP 每分钟最多 10 次请求 |

### 8.3 认证 Token 安全

| 措施            | 说明               |
| ------------- | ---------------- |
| JWT 有效期       | Access Token 7 天 |
| Refresh Token | 有效期 30 天，只能使用一次  |
| Token 黑名单     | 登出时加入黑名单         |
| Token 窃取检测    | 敏感操作需重新验证        |
| HTTPS 强制      | 生产环境强制 HTTPS     |

### 8.4 业务安全

| 措施      | 说明          |
| ------- | ----------- |
| 积分扣减原子性 | 事务保证积分扣减一致性 |
| 幂等性     | 重复提交返回相同结果  |
| 积分不足拦截  | 余额不足直接拒绝消费  |
| 积分消费确认  | 大额消费需二次确认   |
| 管理员操作审计 | 管理员操作用日志记录  |

### 8.5 支付安全 (P1)

| 措施     | 说明               |
| ------ | ---------------- |
| 支付金额校验 | 服务端校验金额必须为正整数(分) |
| 最小金额限制 | 支付金额最小 10 元      |
| 回调验签   | 微信支付回调必须验签       |
| 幂等支付   | 同一订单号重复支付返回原结果   |
| 超时处理   | 30 分钟未支付自动关闭订单   |

### 8.6 速率限制

| 接口                      | 限制                     |
| ----------------------- | ---------------------- |
| `/api/auth/send-code`   | 3 次/分钟/手机号, 10 次/分钟/IP |
| `/api/auth/verify-code` | 5 次/5分钟/手机号            |
| `/api/credits/consume`  | 60 次/分钟/用户             |
| 通用 API                  | 100 次/分钟/IP            |

***

## 9. 实施计划

### 9.1 MVP 阶段

| 阶段         | 任务       | 优先级    | 预计时间    | 状态     |
| ---------- | -------- | ------ | ------- | ------ |
| 1          | 数据库表创建   | P0     | 0.5 天   | 待实施    |
| 2          | 验证码服务集成  | P0     | 1 天     | 待实施    |
| 3          | 用户认证 API | P0     | 1 天     | 待实施    |
| 4          | 积分系统     | P0     | 1 天     | 待实施    |
| 5          | 前端登录 UI  | P0     | 1 天     | 已完成    |
| 6          | 前端个人中心   | P0     | 0.5 天   | 已完成    |
| **MVP 总计** | <br />   | <br /> | **5 天** | <br /> |

### 9.2 P1 阶段

| 阶段        | 任务       | 优先级    | 预计时间    |
| --------- | -------- | ------ | ------- |
| 7         | 套餐管理 API | P1     | 1 天     |
| 8         | 支付集成     | P1     | 2 天     |
| 9         | VIP 权益   | P1     | 1 天     |
| **P1 总计** | <br />   | <br /> | **4 天** |

***

## 10. 文件结构

### 10.1 后端结构

```
apps/api/src/
├── routes/
│   ├── index.ts           # 路由汇总
│   ├── auth.ts             # 认证相关路由 (MVP)
│   ├── users.ts            # 用户相关路由 (MVP)
│   ├── credits.ts          # 积分相关路由 (MVP)
│   └── payments.ts         # 支付相关路由 (P1)
├── services/
│   ├── auth.ts             # 认证服务
│   ├── sms.ts              # 短信服务
│   ├── credits.ts          # 积分服务
│   └── database.ts         # 数据库服务 (扩展)
├── middleware/
│   └── auth.ts             # JWT 认证中间件
├── types/
│   └── auth.ts             # 认证相关类型
└── index.ts                # 服务入口
```

### 10.2 前端结构

```
apps/web/src/
├── app/
│   ├── login/
│   │   └── page.tsx        # 登录页面
│   └── profile/
│       └── page.tsx        # 个人中心页面
├── features/
│   └── auth/
│       ├── AuthProvider.tsx # 认证上下文
│       └── useAuth.ts       # 认证 Hook
├── components/
│   ├── CreditsBadge.tsx    # 积分徽章
│   └── UserMenu.tsx        # 用户菜单
└── lib/
    └── api/
        └── auth-api.ts     # 认证 API 客户端
```

***

**文档版本历史**

| 版本     | 日期         | 修改人       | 修改内容                        |
| ------ | ---------- | --------- | --------------------------- |
| v1.2.0 | 2026-04-05 | AI Agent  | 更新实施进度，完成前端登录UI与个人中心模块      |
| v1.1.0 | 2026-04-05 | Joii Team | UI部分前置，环境变量已配置说明，MVP与P1阶段分离 |
| v1.0.0 | 2026-03-29 | Joii Team | 初始版本                        |

