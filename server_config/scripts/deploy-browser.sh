#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/deploy.browser.config.sh"

show_usage() {
    cat << EOF
用法: ./deploy-browser.sh [命令]

命令:
  api         部署 cloud-api 到服务器
  api:start   启动 cloud-api (PM2)
  api:stop    停止 cloud-api (PM2)
  api:restart 重启 cloud-api
  api:logs    查看 cloud-api 日志
  api:env     创建/更新 cloud-api .env 文件
  ssl         申请 browser-api SSL 证书
  nginx       配置 Nginx 反向代理
  all         执行完整部署 (env + api + nginx + ssl)
  status      查看服务状态

示例:
  ./deploy-browser.sh api:env     # 创建环境变量
  ./deploy-browser.sh api         # 上传 cloud-api 代码
  ./deploy-browser.sh ssl         # 申请 SSL
  ./deploy-browser.sh all         # 完整部署

EOF
}

check_local_project() {
    if [ ! -d "apps/cloud-api" ]; then
        echo "错误: 未找到 apps/cloud-api 目录"
        exit 1
    fi
    echo "✓ 本地项目检查通过"
}

upload_api() {
    echo "[1/4] 上传 cloud-api 代码..."

    mkdir -p "$BROWSER_API_DIR"

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "rm -rf $BROWSER_API_DIR/*"

    scp -P "$SSH_PORT" -r \
        apps/cloud-api/src \
        apps/cloud-api/package.json \
        apps/cloud-api/tsconfig.json \
        apps/cloud-api/drizzle.config.ts \
        apps/cloud-api/.env.production \
        "$SERVER_USER@$SERVER_HOST:$BROWSER_API_DIR/"

    echo "✓ cloud-api 上传完成"
    echo ""
}

install_api_deps() {
    echo "[2/4] 安装依赖..."

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        export PATH=/root/.bun/bin:$PATH
        cd "$BROWSER_API_DIR"
        /root/.bun/bin/bun install
ENDSSH

    echo "✓ 依赖安装完成"
    echo ""
}

create_api_env() {
    echo "[3/4] 创建 .env 文件..."

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        if [ -f "$BROWSER_API_DIR/.env.production" ]; then
            cp "$BROWSER_API_DIR/.env.production" "$BROWSER_API_DIR/.env"
            echo "✓ 已从 .env.production 创建 .env"
        fi
ENDSSH

    echo "✓ .env 创建完成"
    echo ""
}

start_api_service() {
    echo "[4/4] 启动/重启 cloud-api 服务..."

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        export PATH=/root/.bun/bin:$PATH
        cd "$BROWSER_API_DIR"

        pm2 delete browser-api 2>/dev/null || true
        pm2 start /root/.bun/bin/bun --name "browser-api" -- run start
        pm2 save
ENDSSH

    echo "✓ cloud-api 服务启动完成"
    echo ""
}

apply_ssl_cert() {
    echo "申请 SSL 证书..."

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        ~/.acme.sh/acme.sh --issue \
            -d browser-api.joii.cc \
            -w /var/www/browser-api.joii.cc \
            --nginx /etc/nginx/nginx.conf
ENDSSH

    echo "✓ SSL 证书申请完成"
    echo ""
}

setup_nginx_api() {
    echo "配置 Nginx (browser-api)..."

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        cat > /etc/nginx/sites-available/browser-api.joii.cc.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name browser-api.joii.cc;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name browser-api.joii.cc;
    access_log /var/log/nginx/browser-api.joii.cc.access.log;
    error_log /var/log/nginx/browser-api.joii.cc.error.log;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    ssl_certificate /root/.acme.sh/browser-api.joii.cc_ecc/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/browser-api.joii.cc_ecc/browser-api.joii.cc.key;

    location / {
        proxy_pass http://127.0.0.1:4005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

        ln -sf /etc/nginx/sites-available/browser-api.joii.cc.conf /etc/nginx/sites-enabled/
        nginx -t && pkill -HUP nginx
ENDSSH

    echo "✓ Nginx 配置完成"
    echo ""
}

show_status() {
    echo "=========================================="
    echo "  Browser 服务状态"
    echo "=========================================="
    echo ""

    ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        echo "PM2 进程:"
        pm2 status browser-api

        echo ""
        echo "API 健康检查:"
        curl -s https://browser-api.joii.cc/health || echo "API 未响应"

        echo ""
        echo "SSL 证书:"
        ls -la /root/.acme.sh/browser-api.joii.cc/ 2>/dev/null || echo "证书未申请"
ENDSSH

    echo ""
}

case "${1:-help}" in
    api)
        check_local_project
        upload_api
        install_api_deps
        start_api_service
        ;;
    api:start)
        ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "pm2 start browser-api"
        ;;
    api:stop)
        ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "pm2 stop browser-api"
        ;;
    api:restart)
        ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "pm2 restart browser-api"
        ;;
    api:logs)
        ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "pm2 logs browser-api"
        ;;
    api:env)
        create_api_env
        ;;
    ssl)
        apply_ssl_cert
        ;;
    nginx)
        setup_nginx_api
        ;;
    all)
        check_local_project
        create_api_env
        upload_api
        install_api_deps
        start_api_service
        setup_nginx_api
        echo ""
        echo "=========================================="
        echo "  部署完成!"
        echo "=========================================="
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo "错误: 未知命令 '$1'"
        echo ""
        show_usage
        exit 1
        ;;
esac
