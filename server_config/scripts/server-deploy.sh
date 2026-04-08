#!/bin/bash

set -e

REMOTE_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$REMOTE_SCRIPT_DIR/deploy.config.sh"

echo "=========================================="
echo "  JOII 服务器端部署脚本"
echo "=========================================="
echo ""

show_usage() {
    cat << EOF
用法: ./server-deploy.sh [命令]

命令:
  init        初始化服务器环境
  setup-api   配置并启动 API 服务
  setup-nginx 配置 Nginx
  ssl         申请 SSL 证书
  all         执行完整初始化
  restart     重启所有服务
  status      查看服务状态

示例:
  ./server-deploy.sh init          # 初始化环境
  ./server-deploy.sh ssl            # 申请 SSL
  ./server-deploy.sh all            # 完整初始化

EOF
}

check_server() {
    echo "[1/5] 检查服务器环境..."

    if ! command -v nginx &> /dev/null; then
        echo "错误: Nginx 未安装"
        exit 1
    fi

    if ! command -v bun &> /dev/null; then
        echo "错误: Bun 未安装"
        exit 1
    fi

    if ! command -v psql &> /dev/null; then
        echo "错误: PostgreSQL 未安装"
        exit 1
    fi

    echo "✓ 服务器环境检查通过"
    echo ""
}

init_directories() {
    echo "[2/5] 初始化目录..."

    mkdir -p "$REMOTE_BASE_DIR"
    mkdir -p "$REMOTE_WEB_DIR"
    mkdir -p "$REMOTE_API_DIR"

    chown -R root:root "$REMOTE_BASE_DIR"
    chmod -R 755 "$REMOTE_BASE_DIR"

    echo "✓ 目录初始化完成"
    echo ""
}

setup_api_env() {
    echo "[3/5] 配置 API 环境变量..."

    cat > "$REMOTE_API_DIR/.env" << 'EOF'
# 数据库
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME

# JWT
JWT_SECRET=your-super-secure-jwt-secret-change-this

# API 基础URL
BASE_URL=https://DOMAIN
FRONTEND_URL=https://DOMAIN

# API 端口
PORT=3001

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_BASE_URL=https://openrouter.ai/api/v1

# Minimax
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_API_BASE_URL=https://api.minimaxi.com/anthropic/v1
DEFAULT_MODEL=minimax/MiniMax-M2.7

# 图片服务
DEFAULT_IMAGE_PROVIDER_ID=openrouter-gemini

# S3 存储 (Bitiful)
BITIFUL_ENDPOINT=https://s3.bitiful.net
BITIFUL_REGION=cn-east-1
BITIFUL_ACCESS_KEY_ID=your_key
BITIFUL_SECRET_ACCESS_KEY=your_secret
BITIFUL_S3_BUCKET=your_bucket
BITIFUL_CDN_URL=https://your-cdn-url.com

# 短信服务 (阿里云)
SMS_PROVIDER=aliyun
ALIYUN_ACCESS_KEY_ID=your_key
ALIYUN_ACCESS_KEY_SECRET=your_secret
ALIYUN_SIGN_NAME=your_sign_name
ALIYUN_TEMPLATE_CODE=your_template_code

# JWT Secret
JWT_SECRET=change-this-to-a-secure-secret
EOF

    sed -i "s/DB_USER/$DB_USER/g; s/DB_PASSWORD/$DB_PASSWORD/g; s/DB_HOST/$DB_HOST/g; s/DB_PORT/$DB_PORT/g; s/DB_NAME/$DB_NAME/g; s/DOMAIN/$DOMAIN/g" "$REMOTE_API_DIR/.env"

    echo "✓ API 环境变量配置完成"
    echo ""
}

install_pm2() {
    echo "安装 PM2..."

    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
        pm2 install pm2-logrotate
        pm2 set pm2-logrotate:max_size 10M
        pm2 set pm2-logrotate:retain 7
    fi

    echo "✓ PM2 安装完成"
    echo ""
}

start_api_service() {
    echo "启动 API 服务..."

    cd "$REMOTE_API_DIR"

    bun install

    pm2 delete joii-api 2>/dev/null || true
    pm2 start bun --name "joii-api" -- run start

    pm2 save
    pm2 startup

    echo "✓ API 服务启动完成"
    echo ""
}

restart_all() {
    echo "重启所有服务..."

    pm2 restart joii-api
    systemctl reload nginx

    echo "✓ 服务重启完成"
    echo ""
}

show_status() {
    echo "=========================================="
    echo "  服务状态"
    echo "=========================================="
    echo ""

    echo "PM2 进程:"
    pm2 status

    echo ""
    echo "Nginx 状态:"
    systemctl status nginx --no-pager | head -5

    echo ""
    echo "API 健康检查:"
    curl -s "$DOMAIN/api/health" || echo "API 未响应"

    echo ""
    echo "磁盘使用:"
    df -h /var/www

    echo ""
    echo "内存使用:"
    free -h

    echo ""
}

case "${1:-help}" in
    init)
        check_server
        init_directories
        install_pm2
        ;;
    setup-api)
        setup_api_env
        start_api_service
        ;;
    setup-nginx)
        setup_nginx_config
        ;;
    ssl)
        apply_ssl_cert
        ;;
    all)
        check_server
        init_directories
        setup_api_env
        install_pm2
        start_api_service
        echo ""
        echo "=========================================="
        echo "  初始化完成!"
        echo "=========================================="
        echo ""
        echo "下一步:"
        echo "1. 编辑 $REMOTE_API_DIR/.env 填写 API Keys"
        echo "2. 运行 ./server-deploy.sh ssl 申请 SSL 证书"
        echo "3. 运行 ./server-deploy.sh setup-nginx 配置 Nginx"
        echo ""
        ;;
    restart)
        restart_all
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
