# JOII 部署指南 (跨平台版)

> 此脚本支持 **Windows (Git Bash)** 和 **Mac/Linux** 双平台运行

## 目录结构

```
server_config/
├── scripts/
│   ├── deploy.sh                  # 本地部署脚本 (跨平台)
│   ├── deploy.config.sh           # 本地部署配置
│   ├── deploy.config.example.sh   # 配置模板
│   ├── server-deploy.sh          # 服务器端部署脚本
│   └── DEPLOYMENT_README.md       # 本文档
└── docs/
    ├── SERVER_INFO.md             # 服务器信息
    └── NGINX_CONFIG_GUIDE.md      # Nginx 配置指南
```

## 前置要求

### Windows
1. 安装 [Git for Windows](https://gitforwindows.org/) (包含 Git Bash、Bash、SSH、SCP)
2. 在 Git Bash 中运行脚本

### Mac
1. Homebrew 安装 bun: `brew install bun`
2. SSH/SCP 通常已预装

## 快速开始

### 1. 配置部署参数

在 **Git Bash** (Windows) 或 **Terminal** (Mac) 中：

```bash
cd server_config/scripts
cp deploy.config.example.sh deploy.config.sh
```

编辑 `deploy.config.sh`，填写：
- `DOMAIN="your-domain.com"` - 你的域名
- `DB_PASSWORD="your_secure_password"` - 数据库密码

### 2. 上传服务器端脚本

```bash
# 在 Windows Git Bash 或 Mac Terminal 中执行
scp -P 1231 deploy.config.sh server-deploy.sh root@101.37.235.131:/root/
```

### 3. 服务器端初始化

```bash
# SSH 连接到服务器
ssh -p 1231 root@101.37.235.131

# 在服务器上执行
cd /root
nano deploy.config.sh          # 编辑配置
chmod +x server-deploy.sh
./server-deploy.sh all         # 执行完整初始化
```

### 4. 填写 API Keys

```bash
# 在服务器上编辑
nano /var/www/joii/api/.env
```

### 5. 申请 SSL 证书

确保域名已解析到服务器 IP，然后：

```bash
# 在服务器上执行
~/.acme.sh/acme.sh --issue -d your-domain.com -d www.your-domain.com -w /var/www/joii/web
```

### 6. 本地部署

回到本地机器 (Git Bash 或 Terminal)：

```bash
cd server_config/scripts
chmod +x deploy.sh
./deploy.sh full
```

## 常用命令

### 本地部署脚本

| 命令 | 说明 |
|------|------|
| `./deploy.sh full` | 完整部署 |
| `./deploy.sh frontend` | 仅部署前端 |
| `./deploy.sh backend` | 仅部署后端 |
| `./deploy.sh db` | 初始化数据库 |
| `./deploy.sh status` | 查看状态 |
| `./deploy.sh logs` | 查看后端日志 |
| `./deploy.sh restart` | 重启后端服务 |

### 服务器端脚本

```bash
./server-deploy.sh init      # 初始化环境
./server-deploy.sh setup-api # 配置 API
./server-deploy.sh status    # 查看状态
./server-deploy.sh restart   # 重启服务
```

## 跨平台说明

### Windows (Git Bash)
- 使用 Git Bash 作为默认终端
- 路径使用 Unix 风格 (`/d/projects/...`)
- SSH/SCP 通过 Git for Windows 提供

### Mac/Linux
- 使用默认 Terminal
- 直接运行 bash 脚本

### 兼容性检查

脚本会自动检测操作系统：

```bash
$ ./deploy.sh
==========================================
  JOII 自动化部署脚本
  平台: Windows (Git Bash)    # 或 Mac/Linux
==========================================
```

## 环境变量说明

### API 环境变量 (apps/api/.env)

| 变量 | 说明 | 必填 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | ✓ |
| `JWT_SECRET` | JWT 签名密钥 | ✓ |
| `BASE_URL` | API 基础 URL | ✓ |
| `FRONTEND_URL` | 前端 URL (用于 CORS) | ✓ |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | ✓ |
| `OPENROUTER_API_KEY` | OpenRouter API Key | ○ |
| `MINIMAX_API_KEY` | Minimax API Key | ○ |

### 前端环境变量 (apps/web/.env.production)

| 变量 | 说明 | 必填 |
|------|------|------|
| `NEXT_PUBLIC_API_URL` | API 服务地址 | ✓ |

## 故障排查

### API 连接失败

```bash
# 检查 PM2 状态
ssh -p 1231 root@101.37.235.131 "pm2 status"

# 查看日志
ssh -p 1231 root@101.37.235.131 "pm2 logs joii-api"

# 重启服务
ssh -p 1231 root@101.37.235.131 "pm2 restart joii-api"
```

### 数据库连接失败

```bash
ssh -p 1231 root@101.37.235.131
psql -U joii -p 1232 -h localhost -d joii_db
```

### SSL 证书问题

```bash
# 查看证书
~/.acme.sh/acme.sh --list

# 续期证书
~/.acme.sh/acme.sh --renew -d your-domain.com
```

### Windows 上找不到命令

确保在 **Git Bash** 中运行，而非 PowerShell 或 CMD：

```bash
# 正确
./deploy.sh full

# 错误 (PowerShell)
.\deploy.sh
```
