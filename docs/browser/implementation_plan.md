# Phase 2: 服务端与数据库实现计划

前端交互已经全部就绪。本阶段我们将为 `cloud-api` (基于 Bun + Express + Drizzle ORM + PostgreSQL) 设计底层的数据结构和配套的 REST API，以支撑刚刚完成的前端交互（RBAC、访问控制、环境分组等）。

## Proposed Changes

### 1. 数据库结构扩展 (`cloud-api/src/db/schema.ts`)
我们将新增 6 张核心数据表，并对环境表进行少量关联改造。

#### [NEW] `roles` (角色权限表)
用于支持 RBAC 体系。
- `id`: 主键
- `name`: 角色名称 (Boss, 主管, 财务等)
- `type`: 角色类型 (`system` 系统内置 / `custom` 自定义)
- `permissions`: JSONB (存储通过权限树勾选的细颗粒度权限)

#### [NEW] `users` (成员表)
用于存储团队成员信息，取代原本纯虚构的数据。
- `id`: 主键
- `roleId`: 外键关联 `roles.id`
- `name`: 真实姓名
- `username`: 登录用户名 (唯一)
- `phone`: 手机号
- `passwordHash`: 密码哈希
- `accessibleGroups`: JSONB (可访问的环境分组 ID 数组)
- `browserLimit`: Integer (可创建环境数量限额，0为不限制)
- `status`: 状态 (`active` / `disabled`)

#### [NEW] `groups` (环境分组表)
将原先 `browser_environments` 中单纯的字符串分组抽象为独立表。
- `id`: 主键
- `name`: 分组名称
- `desc`: 分组描述
- `createdAt`: 创建时间

#### [NEW] `access_policies` (访问策略表)
- `id`: 主键
- `name`: 策略名称
- `type`: `whitelist` / `blacklist`
- `targets`: JSONB (URL 规则数组)
- `appliedTo`: JSONB (适用的对象，如特定 member_id、role_id 或是全员)

#### [NEW] `access_logs` (访问审计日志表)
- `id`: 主键
- `memberId`: 关联 `users.id`
- `envId`: 关联 `browser_environments.id`
- `url`: 访问的 URL
- `title`: 网页标题
- `action`: 操作行为 (如 "页面跳转", "拦截访问" 等)
- `createdAt`: 发生时间

#### [NEW] `login_settings` (登录全局配置表)
- `id`: 单例 ID
- `deviceWhitelist`: boolean
- `officeIpRestricted`: boolean
- `allowedIps`: text (多行IP文本)
- `timeRestricted`: boolean
- `allowTimeStart`: text (如 "09:00")
- `allowTimeEnd`: text (如 "22:00")

### 2. API 路由开发 (`cloud-api/src/routes/`)
我们将新建以下 Express 路由文件：
- #### [NEW] `routes/team.ts`
  提供成员增删改查、角色与权限树获取、以及登录配置、访问策略的管理。
- #### [NEW] `routes/groups.ts`
  提供环境分组的创建、修改、删除和查询列表功能。
- #### [NEW] `routes/logs.ts`
  提供审计日志的分页查询。

### 3. ORM 迁移 (Migrations)
- 使用 `drizzle-kit generate` 和 `bun run db:migrate` 将新的表结构同步到 PostgreSQL 数据库中。

## Verification Plan

### Automated Tests
1. 通过 Postman 或 Curl 直接向 `cloud-api` 接口发送请求，确保各实体的 CRUD 逻辑正常，特别是带有外键关联的逻辑。
2. 检查 `drizzle-kit` 的 SQL 生成，确保字段类型和外键无误。

### Manual Verification
1. 启动 `cloud-api` 和 `browser-web`，打通前后端。
2. 在前端尝试“新建角色”，检查是否能成功写入 `roles` 表并且权限 JSON 结构正确。
3. 在前端尝试“新增成员”，检查是否将密码进行了加密并关联了正确的 `role_id` 与 `accessibleGroups`。
4. 验证其它增删改查表单的数据流转是否通畅。

---
> [!IMPORTANT]
> **User Review Required**
> 此方案确立了团队协作、RBAC 和访问控制的底层数据流。如果此表结构（特别是权限存储为 JSONB 和分组抽取为独立表的设计）符合您的预期，请批准该计划，我将立即开始执行后端代码的编写！
