# Nginx 配置指南

> 本文档包含：域名配置、SSL 自动续签、Gzip 压缩

---

## ⚡ 一键脚本（推荐）

使用 `nginx-setup.sh` 脚本，一行命令完成所有配置。

### 上传到服务器

```bash
scp -P 1231 d:\ai\canvas\nginx-setup.sh root@101.37.235.131:~/
```

### SSH 连接

```bash
ssh -p 1231 root@101.37.235.131
chmod +x nginx-setup.sh
```

### 运行

```bash
# 静态网站
./nginx-setup.sh example.com static

# Node.js 应用 (端口3000)
./nginx-setup.sh api.example.com node 3000

# 反向代理
./nginx-setup.sh app.example.com proxy 8080
```

脚本会自动完成：
- ✅ 申请 Let's Encrypt SSL 证书
- ✅ 配置 HTTPS + HTTP/2
- ✅ 启用 Gzip 压缩
- ✅ 配置安全响应头
- ✅ SSL 自动续签
- ✅ WebSocket 支持

---

## 目录

1. [快速开始](#1-快速开始)
2. [SSL 证书申请](#2-ssl-证书申请)
3. [Nginx 站点配置](#3-nginx-站点配置)
4. [示例配置](#4-示例配置)
5. [acme.sh 自动续签](#5-acmesh-自动续签)
6. [常用命令](#6-常用命令)

---

## 1. 快速开始

### 目录结构

```
/etc/nginx/
├── nginx.conf              # 主配置文件
├── conf.d/                 # 额外配置目录
│   └── default.conf
├── sites-available/        # 可用站点配置
│   └── example.com.conf
├── sites-enabled/          # 已启用站点配置 (软链接)
│   └── example.com.conf -> ../sites-available/example.com.conf
└── snippets/               # 配置片段
    ├── ssl-params.conf
    └── security-headers.conf
```

### 前置条件

- 域名已解析到服务器 IP
- 防火墙开放 80 和 443 端口

```bash
# 检查防火墙
ufw status

# 如需开放端口
ufw allow 80/tcp
ufw allow 443/tcp
```

---

## 2. SSL 证书申请

### 2.1 HTTP 验证方式 (推荐)

```bash
# 申请证书
~/.acme.sh/acme.sh --issue -d example.com -d www.example.com \
  -w /var/www/html

# 或申请泛域名证书
~/.acme.sh/acme.sh --issue -d example.com -d '*.example.com' \
  --dns dns_ali
```

### 2.2 DNS 验证方式 (阿里云)

```bash
# 设置阿里云 API 密钥
export Ali_Key="your_ali_key"
export Ali_Secret="your_ali_secret"

# 申请泛域名证书
~/.acme.sh/acme.sh --issue -d example.com -d '*.example.com' \
  --dns dns_ali
```

### 2.3 查看已申请的证书

```bash
~/.acme.sh/acme.sh --list
```

---

## 3. Nginx 站点配置

### 3.1 创建配置目录

```bash
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled
mkdir -p /var/www/html
```

### 3.2 创建 SSL 配置片段

```bash
cat > /etc/nginx/snippets/ssl-params.conf << 'EOF'
# SSL 设置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# SSL 证书
ssl_certificate /root/.acme.sh/example.com/fullchain.cer;
ssl_certificate_key /root/.acme.sh/example.com/example.com.key;
EOF
```

### 3.3 创建 Gzip 配置片段

```bash
cat > /etc/nginx/snippets/gzip.conf << 'EOF'
# Gzip 压缩
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
           application/json application/javascript application/xml+rss
           application/rss+xml font/truetype font/opentype
           application/vnd.ms-fontobject image/svg+xml;
gzip_min_length 1000;
gzip_disable "msie6";
EOF
```

### 3.4 创建站点配置

> 参考下方 [4. 示例配置](#4-示例配置)

### 3.5 启用站点

```bash
# 创建软链接
ln -s /etc/nginx/sites-available/example.com.conf \
      /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

### 3.6 禁用站点

```bash
rm /etc/nginx/sites-enabled/example.com.conf
systemctl reload nginx
```

---

## 4. 示例配置

### 4.1 HTTP 重定向到 HTTPS

```nginx
# /etc/nginx/sites-available/example.com.conf
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # 重定向到 HTTPS
    return 301 https://$host$request_uri;
}
```

### 4.2 完整的 HTTPS 配置

```nginx
# /etc/nginx/sites-available/example.com.conf

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS 站点
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # 根目录
    root /var/www/example.com;
    index index.html index.htm;

    # 日志
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    # SSL 证书
    include snippets/ssl-params.conf;

    # 安全头
    include snippets/security-headers.conf;

    # Gzip 压缩
    include snippets/gzip.conf;

    # 默认行为
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理 (可选)
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

### 4.3 Node.js 应用反向代理

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.example.com;

    # Node.js 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持 (如需)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 4.4 静态网站配置

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com;

    root /var/www/example.com;
    index index.html;

    # SSL
    include snippets/ssl-params.conf;
    include snippets/gzip.conf;

    # SPA 支持 (Vue/React)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 5. acme.sh 自动续签

### 5.1 安装证书到 Nginx

```bash
~/.acme.sh/acme.sh --install-cert -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.crt \
  --reloadcmd "systemctl reload nginx"
```

### 5.2 自动续签配置

acme.sh 默认会自动续签，但需要确保 Nginx 能正确加载新证书。

编辑 `/etc/fail2ban/jail.local` 确保 nginx 监狱已启用:

```ini
[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true
```

### 5.3 手动续签测试

```bash
# 测试续签
~/.acme.sh/acme.sh --renew -d example.com --force

# 查看证书信息
~/.acme.sh/acme.sh --info -d example.com
```

### 5.4 DNS API 自动续签 (阿里云)

创建 `/root/.acme.sh/dnsapi/dns_ali.sh` 或设置环境变量:

```bash
# 在 /root/.bashrc 中添加
echo 'export Ali_Key="your_ali_key"' >> /root/.bashrc
echo 'export Ali_Secret="your_ali_secret"' >> /root/.bashrc
source /root/.bashrc
```

---

## 6. 常用命令

```bash
# 测试配置
nginx -t

# 重载配置
systemctl reload nginx

# 重启服务
systemctl restart nginx

# 查看站点配置
ls -la /etc/nginx/sites-enabled/

# 查看 SSL 证书过期时间
openssl x509 -in /etc/nginx/ssl/example.com.crt -noout -dates

# 手动测试 HTTPS 连接
openssl s_client -connect example.com:443 -servername example.com

# 查看证书详情
openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -text

# 检查 SSL 评分 (在线工具)
# https://www.ssllabs.com/ssltest/
```

---

## 7. 故障排查

### 7.1 常见问题

| 问题 | 解决方法 |
|------|----------|
| 证书申请失败 | 检查域名解析、防火墙、webroot 路径 |
| 证书不匹配 | 确保 server_name 与证书域名一致 |
| 混合内容 | 检查网页内资源 URL 全部使用 HTTPS |
| HSTS 错误 | HSTS 设置后无法回退，需谨慎配置 |

### 7.2 日志位置

```bash
# Nginx 错误日志
tail -f /var/log/nginx/error.log

# Nginx 访问日志
tail -f /var/log/nginx/access.log

# acme.sh 日志
tail -f /root/.acme.sh/acme.sh.log
```

---

## 8. 安全建议

1. **定期更新 Nginx**: `apt update && apt upgrade nginx`
2. **使用 TLS 1.3**: 确保 `ssl_protocols` 包含 TLSv1.3
3. **启用 HSTS**: 启用后需谨慎，确保全站 HTTPS
4. **禁用不安全的密码套件**: 使用推荐的密码套件
5. **启用 OCSP Stapling**: 提升 HTTPS 性能

```nginx
# 在 ssl-params.conf 中添加
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

---

## 9. 完整流程示例

```bash
# 1. 申请证书
~/.acme.sh/acme.sh --issue -d example.com -w /var/www/html

# 2. 创建配置目录
mkdir -p /etc/nginx/snippets
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled
mkdir -p /var/www/html

# 3. 创建 SSL 配置片段
cat > /etc/nginx/snippets/ssl-params.conf << 'EOF'
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
ssl_certificate /root/.acme.sh/example.com/fullchain.cer;
ssl_certificate_key /root/.acme.sh/example.com/example.com.key;
EOF

# 4. 创建 Gzip 配置
cat > /etc/nginx/snippets/gzip.conf << 'EOF'
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
EOF

# 5. 创建安全头配置
cat > /etc/nginx/snippets/security-headers.conf << 'EOF'
server_tokens off;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
EOF

# 6. 安装证书到 Nginx 目录
mkdir -p /etc/nginx/ssl
~/.acme.sh/acme.sh --install-cert -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.crt \
  --reloadcmd "systemctl reload nginx"

# 7. 修改 ssl-params.conf 使用 Nginx ssl 目录
sed -i 's|/root/.acme.sh/example.com/|/etc/nginx/ssl/|g' /etc/nginx/snippets/ssl-params.conf

# 8. 创建站点配置 (使用下方配置模板)
# ... 创建 /etc/nginx/sites-available/example.com.conf ...

# 9. 启用站点
ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/

# 10. 测试并重载
nginx -t && systemctl reload nginx
```

---

*文档生成时间: 2026-03-30*
