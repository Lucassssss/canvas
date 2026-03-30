# 服务器软件配置信息

> 生成时间: 2026-03-30
> 服务器IP: 101.37.235.131
> 操作系统: Ubuntu 24.04.4 LTS

---

## 软件版本汇总

| 软件 | 版本 | 状态 |
|------|------|------|
| Nginx | 1.24.0 | ✅ 运行中 |
| acme.sh | v3.1.3 | ✅ 已安装 |
| Bun | 1.3.11 | ✅ 已安装 |
| Node.js | v24.13.0 (LTS) | ✅ 已安装 |
| NPM | 11.6.2 | ✅ 已安装 |
| pnpm | 10.33.0 | ✅ 已安装 |
| PostgreSQL | 18.3 | ✅ 运行中 |
| Docker | 29.3.1 | ✅ 运行中 |
| Docker Compose | v5.1.1 | ✅ 已安装 |
| Fail2ban | 1.0.2 | ✅ 运行中 |

---

## 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| SSH | **1231** | SSH连接端口 |
| HTTP | 80 | Web服务 |
| HTTPS | 443 | SSL服务 |
| PostgreSQL | **1232** | 数据库端口 |

---

## 重要路径

### Nginx
- 配置文件: /etc/nginx/nginx.conf
- 安全头配置: /etc/nginx/snippets/security-headers.conf
- 站点配置: /etc/nginx/sites-available/
- 日志目录: /var/log/nginx/
- Web根目录: /var/www/html/

### acme.sh
- 安装目录: /root/.acme.sh/
- 证书目录: /root/.acme.sh/

### Bun
- 安装目录: /root/.bun/
- 可执行文件: /root/.bun/bin/bun

### Node.js
- Node路径: /usr/bin/node
- NPM路径: /usr/bin/npm
- pnpm路径: /usr/bin/pnpm
- 全局包目录: /usr/lib/node_modules/

### PostgreSQL
- 数据目录: /var/lib/postgresql/18/main/
- 配置目录: /etc/postgresql/18/main/
- 端口: **1232**
- 超级用户: postgres

### Docker
- 数据目录: /var/lib/docker/
- 配置文件: /etc/docker/daemon.json

### Fail2ban
- 主配置: /etc/fail2ban/jail.local
- 日志: /var/log/fail2ban.log

---

## SSH 连接

```bash
ssh -p 1231 root@101.37.235.131
```

---

## 安全配置

### SSH 安全设置
- 端口: 1231
- 防断开: ClientAliveInterval 60
- 最大连接数: 10
- 配置: /etc/ssh/sshd_config

### Fail2ban 防护
- SSH防护: 3次失败封禁1小时
- Nginx防护: 已启用
- 配置文件: /etc/fail2ban/jail.local

### 系统优化
- Swap: 2GB 已启用
- 内核参数: 已优化 (/etc/sysctl.conf)

### Nginx 安全
- 版本隐藏: 已启用
- 安全头: 已配置
- 配置: /etc/nginx/snippets/security-headers.conf

### 防火墙 (UFW)
- SSH: 允许 1231
- HTTP: 允许 80
- HTTPS: 允许 443
- PostgreSQL: 允许 1232

---

## 常用服务命令

```bash
# SSH
ssh -p 1231 root@101.37.235.131

# Nginx
systemctl start/stop/restart/reload nginx
nginx -t  # 测试配置

# PostgreSQL
systemctl start/stop/restart postgresql
su - postgres  # 切换用户
psql -U postgres -p 1232  # 连接数据库

# Docker
systemctl start/stop/restart docker
docker ps  # 查看容器
docker compose up -d  # 启动服务

# Fail2ban
fail2ban-client status  # 查看防护状态
fail2ban-client unban --all  # 解封所有IP

# acme.sh
~/.acme.sh/acme.sh --list  # 查看证书
~/.acme.sh/acme.sh --issue -d example.com -w /var/www/html  # 申请证书

# 系统
free -h  # 内存
df -h    # 磁盘
ss -tlnp # 端口
```

---

## PostgreSQL 快速配置

```sql
-- 修改postgres密码
ALTER USER postgres WITH PASSWORD 'your_password';

-- 创建新用户和数据库
CREATE USER myuser WITH PASSWORD 'your_password';
CREATE DATABASE mydb OWNER myuser;
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

连接时指定端口:
```bash
psql -U postgres -p 1232
```

---

## Docker 镜像加速

已配置阿里云镜像源

---

## 快速检查命令

```bash
# 检查所有服务状态
systemctl status nginx postgresql docker fail2ban

# 检查端口占用
ss -tlnp

# 检查Swap
free -h

# 检查Fail2ban状态
fail2ban-client status
```

---

*文档由服务器初始化脚本自动生成*
