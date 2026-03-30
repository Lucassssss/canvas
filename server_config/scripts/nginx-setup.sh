#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

[[ $EUID -ne 0 ]] && log_error "请使用 root 权限运行此脚本"

[[ $# -lt 2 ]] && {
    echo "用法: $0 <域名> <类型> [端口]"
    echo "类型: static | node | proxy"
    exit 1
}

DOMAIN=$1
TYPE=$2
PORT=${3:-80}
EMAIL="hi@${DOMAIN}"
WEBROOT="/var/www/${DOMAIN}"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}.conf"
SSL_DIR="/etc/nginx/ssl/${DOMAIN}"
SNIPPETS_DIR="/etc/nginx/snippets"

echo ""
echo "============================================"
echo "       Nginx 自动配置脚本"
echo "============================================"
echo "域名:   ${DOMAIN}"
echo "邮箱:   ${EMAIL}"
echo "类型:   ${TYPE}"
[[ "$TYPE" != "static" ]] && echo "端口:   ${PORT}"
echo "============================================"
echo ""

# 1. 创建目录
log_info "创建目录..."
mkdir -p "${WEBROOT}" "${SSL_DIR}" "$(dirname ${NGINX_CONF})" "${SNIPPETS_DIR}"

# 2. Gzip 配置
log_info "创建 Gzip 配置..."
cat > "${SNIPPETS_DIR}/gzip.conf" << 'EOF'
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 1000;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss image/svg+xml font/opentype;
EOF

# 3. 先创建 HTTP 站点配置 (用于 Let's Encrypt 验证)
log_info "创建临时 HTTP 配置..."
cat > "${NGINX_CONF}.http" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${WEBROOT};
    index index.html;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
}
EOF

# 4. 启用临时站点
log_info "启用站点..."
rm -f "${NGINX_ENABLED}"
ln -s "${NGINX_CONF}.http" "${NGINX_ENABLED}"

# 5. 测试并重载 Nginx
log_info "测试 Nginx 配置..."
nginx -t || log_error "Nginx 配置测试失败"

log_info "重载 Nginx..."
systemctl reload nginx

# 6. 安装 acme.sh
log_info "安装 acme.sh..."
if [[ ! -f "/root/.acme.sh/acme.sh" ]]; then
    curl -sL https://get.acme.sh | sh -s email=${EMAIL}
    source /root/.bashrc
fi

# 设置 Let's Encrypt
/root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

# 7. 申请 SSL 证书
log_info "申请 SSL 证书..."
cd /root/.acme.sh
./acme.sh --issue -d ${DOMAIN} -d www.${DOMAIN} -w /var/www/html --keylength 2048 --server letsencrypt --force

# 8. SSL 配置
log_info "创建 SSL 配置..."
cat > "${SNIPPETS_DIR}/ssl-${DOMAIN}.conf" << EOF
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
ssl_certificate ${SSL_DIR}/fullchain.cer;
ssl_certificate_key ${SSL_DIR}/key.pem;
EOF

# 9. 创建完整 Nginx 配置
log_info "生成完整 Nginx 配置..."

if [[ "$TYPE" == "static" ]]; then
    cat > "${NGINX_CONF}" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${WEBROOT};
    index index.html;
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
    include ${SNIPPETS_DIR}/ssl-${DOMAIN}.conf;
    include ${SNIPPETS_DIR}/gzip.conf;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public";
    }
    
    location ~ /\. {
        deny all;
    }
}
EOF
else
    cat > "${NGINX_CONF}" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
    include ${SNIPPETS_DIR}/ssl-${DOMAIN}.conf;
    include ${SNIPPETS_DIR}/gzip.conf;
    
    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
fi

# 10. 安装证书
log_info "安装证书..."
./acme.sh --install-cert -d ${DOMAIN} -d www.${DOMAIN} \
    --key-file ${SSL_DIR}/key.pem \
    --fullchain-file ${SSL_DIR}/fullchain.cer \
    --reloadcmd "systemctl reload nginx"

# 11. 启用完整配置
log_info "启用完整配置..."
rm -f "${NGINX_ENABLED}"
ln -s "${NGINX_CONF}" "${NGINX_ENABLED}"

# 12. 测试并重载
log_info "测试 Nginx 配置..."
nginx -t || log_error "Nginx 配置测试失败"

log_info "重载 Nginx..."
systemctl reload nginx

# 13. 完成
echo ""
echo "============================================"
echo "       ✅ 配置完成!"
echo "============================================"
echo ""
echo "📍 网站地址:"
echo "   HTTP:  http://${DOMAIN}"
echo "   HTTPS: https://${DOMAIN}"
echo ""
echo "📂 配置信息:"
echo "   Nginx配置: ${NGINX_CONF}"
echo "   SSL证书:   ${SSL_DIR}"
echo "   网站目录:   ${WEBROOT}"
echo ""
echo "🔒 SSL 证书:"
openssl x509 -in ${SSL_DIR}/fullchain.cer -noout -dates 2>/dev/null | sed 's/^/   /'
echo ""
echo "============================================"
