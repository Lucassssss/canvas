#!/bin/bash

set -e

OS_TYPE=$(uname -s)

if [[ "$OS_TYPE" == "MSYS"* ]] || [[ "$OS_TYPE" == "MINGW"* ]] || [[ "$OS_TYPE" == "CYGWIN"* ]]; then
    IS_WINDOWS=true
    IS_MAC=false
    PATH_SEP="/"
else
    IS_WINDOWS=false
    if [[ "$OS_TYPE" == "Darwin" ]]; then
        IS_MAC=true
    else
        IS_MAC=false
    fi
    PATH_SEP="/"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

CONFIG_FILE="$SCRIPT_DIR/deploy.config.sh"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "错误: 配置文件 $CONFIG_FILE 不存在"
    echo "请复制 deploy.config.example.sh 为 deploy.config.sh 并填写配置"
    exit 1
fi

source "$CONFIG_FILE"

echo "=========================================="
echo "  JOII 自动化部署脚本"
echo "  平台: $([[ "$IS_WINDOWS" == true ]] && echo "Windows (Git Bash)" || echo "Mac/Linux")"
echo "=========================================="
echo ""

show_usage() {
    cat << EOF
用法: ./deploy.sh [命令]

命令:
  full      完整部署 (前端 + 后端 + Nginx 配置)
  frontend  仅部署前端
  backend   仅部署后端
  nginx     仅配置 Nginx
  db        初始化数据库
  status    查看部署状态
  logs      查看后端日志
  restart   重启后端服务
  stop      停止后端服务
  help      显示帮助信息

示例:
  ./deploy.sh full          # 完整部署
  ./deploy.sh frontend       # 仅部署前端
  ./deploy.sh status         # 查看状态

EOF
}

check_dependencies() {
    echo "[1/6] 检查依赖..."

    if ! command -v bun &> /dev/null; then
        echo "错误: 未安装 Bun"
        echo "请访问: https://bun.sh"
        exit 1
    fi

    if ! command -v ssh &> /dev/null; then
        echo "错误: 未安装 SSH"
        if [[ "$IS_WINDOWS" == true ]]; then
            echo "提示: 请安装 Git for Windows，它包含 SSH"
        fi
        exit 1
    fi

    if ! command -v scp &> /dev/null; then
        echo "错误: 未安装 SCP"
        exit 1
    fi

    echo "✓ 依赖检查通过"
    echo ""
}

ssh_cmd() {
    ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST"
}

ssh_exec() {
    ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "$@"
}

scp_upload() {
    scp -o StrictHostKeyChecking=no -P "$SSH_PORT" -r "$@"
}

build_frontend() {
    echo "[2/6] 构建前端..."

    cd "$PROJECT_ROOT"

    if [[ ! -f "apps/web/.env.production" ]]; then
        echo "  警告: apps/web/.env.production 不存在，正在创建..."
        echo "NEXT_PUBLIC_API_URL=$API_BASE_URL" > "apps/web/.env.production"
    fi

    mv apps/web/.env.local apps/web/.env.local.bak 2>/dev/null || true
    bun run build --filter=web
    mv apps/web/.env.local.bak apps/web/.env.local 2>/dev/null || true

    if [[ ! -d "apps/web/out" ]]; then
        echo "错误: 前端构建失败，out 目录不存在"
        exit 1
    fi

    echo "✓ 前端构建完成"
    echo ""
}

upload_frontend() {
    echo "[3/6] 上传前端文件..."

    ssh_exec "mkdir -p $REMOTE_WEB_DIR"

    if [[ "$IS_WINDOWS" == true ]]; then
        cd "$PROJECT_ROOT/apps/web/out"
        for file in *; do
            if [[ -f "$file" ]]; then
                scp_upload "$file" "$SERVER_USER@$SERVER_HOST:$REMOTE_WEB_DIR/"
            elif [[ -d "$file" ]]; then
                scp_upload -r "$file" "$SERVER_USER@$SERVER_HOST:$REMOTE_WEB_DIR/"
            fi
        done
    else
        scp_upload -r "$PROJECT_ROOT/apps/web/out/"* "$SERVER_USER@$SERVER_HOST:$REMOTE_WEB_DIR/"
    fi

    echo "✓ 前端上传完成"
    echo ""
}

upload_backend() {
    echo "[3.5/6] 上传后端代码..."

    ssh_exec "mkdir -p $REMOTE_API_DIR"
    ssh_exec "mkdir -p $REMOTE_API_DIR/certs"

    if [[ "$IS_WINDOWS" == true ]]; then
        cd "$PROJECT_ROOT/apps/api"
        scp_upload src "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/"
        scp_upload package.json tsconfig.json drizzle.config.ts .env.example "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/"
        scp_upload .env.production "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/.env"
        scp_upload certs/* "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/certs/"
    else
        scp_upload -r "$PROJECT_ROOT/apps/api/src" "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/"
        scp_upload "$PROJECT_ROOT/apps/api/package.json" "$PROJECT_ROOT/apps/api/tsconfig.json" "$PROJECT_ROOT/apps/api/drizzle.config.ts" "$PROJECT_ROOT/apps/api/.env.example" "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/"
        scp_upload "$PROJECT_ROOT/apps/api/.env.production" "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/.env"
        scp_upload "$PROJECT_ROOT/apps/api/certs/"* "$SERVER_USER@$SERVER_HOST:$REMOTE_API_DIR/certs/"
    fi

    echo "✓ 后端代码上传完成"
    echo ""
}

deploy_backend() {
    echo "[4/6] 部署后端..."

    ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" bash -c "
        export PATH=\"/root/.bun/bin:\$PATH\"
        set -e

        echo \"  - 检查 PM2...\"
        if ! command -v pm2 &> /dev/null; then
            echo \"    安装 PM2...\"
            npm install -g pm2
            pm2 install pm2-logrotate
            pm2 set pm2-logrotate:max_size 10M
            pm2 set pm2-logrotate:retain 7
        fi

        echo \"  - 重启后端服务...\"
        cd \"$REMOTE_API_DIR\"

        bun install

        pm2 restart joii-api 2>/dev/null || pm2 start bun --name \"joii-api\" -- run --env-file .env src/index.ts

        pm2 save

        echo \"✓ 后端部署完成\"
    "

    echo "✓ 后端部署完成"
    echo ""
}

setup_nginx() {
    echo "[5/6] 配置 Nginx..."

    echo "  注意: Nginx 已通过 nginx-setup.sh 配置，跳过..."

    echo "✓ Nginx 配置完成"
    echo ""
}

init_database() {
    echo "[数据库初始化]"

    if [[ -z "$DB_PASSWORD" ]]; then
        echo "错误: DB_PASSWORD 未设置，请编辑 deploy.config.sh"
        exit 1
    fi

    ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
        set -e

        cd /var/www/joii/api

        echo "  - 创建数据库用户..."
        sudo -u postgres psql -p 1232 -c "CREATE USER joii_user WITH PASSWORD 'fAmYQfseyFv';" 2>/dev/null || \
            sudo -u postgres psql -p 1232 -c "ALTER USER joii_user WITH PASSWORD 'fAmYQfseyFv';"

        echo "  - 创建数据库..."
        sudo -u postgres psql -p 1232 -c "CREATE DATABASE joii_canvas OWNER joii_user;" 2>/dev/null || \
            echo "    数据库已存在"

        echo "  - 授权..."
        sudo -u postgres psql -p 1232 -c "GRANT ALL PRIVILEGES ON DATABASE joii_canvas TO joii_user;"

        echo "  - 运行数据库迁移..."
        bun run db:push

        echo "✓ 数据库初始化完成"
ENDSSH

    echo ""
}

verify_deployment() {
    echo "[6/6] 验证部署..."

    echo ""
    echo "=========================================="
    echo "  部署状态"
    echo "=========================================="

    ssh_exec << 'ENDSSH'
        sleep 2

        API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null || echo "000")
        WEB_ACCESS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")

        echo "  API 服务:   $([ "$API_HEALTH" == "200" ] && echo "✓ 正常" || echo "✗ 异常 (HTTP $API_HEALTH)")"
        echo "  Web 站点:   $([ "$WEB_ACCESS" != "000" ] && echo "✓ 正常 (HTTP $WEB_ACCESS)" || echo "✗ 异常 (HTTP $WEB_ACCESS)")"
        echo ""

        if [ "$API_HEALTH" == "200" ]; then
            echo "  ✓ 部署成功!"
        else
            echo "  ⚠ 部分服务异常，请检查日志"
        fi
ENDSSH

    echo ""
}

show_status() {
    echo "=========================================="
    echo "  部署状态"
    echo "=========================================="

    ssh_exec << 'ENDSSH'
        echo ""
        echo "  PM2 进程状态:"
        pm2 status

        echo ""
        echo "  Nginx 状态:"
        systemctl status nginx --no-pager | head -5

        echo ""
        echo "  磁盘使用:"
        df -h /var/www

        echo ""
        echo "  内存使用:"
        free -h
ENDSSH

    echo ""
}

show_logs() {
    ssh_exec "pm2 logs joii-api --lines 50 --nostream"
}

restart_services() {
    echo "重启后端服务..."

    ssh_exec "pm2 restart joii-api && echo '✓ 服务已重启'"

    echo ""
}

stop_services() {
    echo "停止后端服务..."

    ssh_exec "pm2 stop joii-api && echo '✓ 服务已停止'"

    echo ""
}

case "${1:-full}" in
    full)
        check_dependencies
        build_frontend
        upload_frontend
        upload_backend
        deploy_backend
        setup_nginx
        verify_deployment
        ;;
    frontend)
        check_dependencies
        build_frontend
        upload_frontend
        ;;
    backend)
        check_dependencies
        upload_backend
        deploy_backend
        ;;
    nginx)
        setup_nginx
        ;;
    db)
        init_database
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    restart)
        restart_services
        ;;
    stop)
        stop_services
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
