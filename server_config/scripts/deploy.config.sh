#!/bin/bash

# ============================================
# 部署配置 - 请复制此文件为 deploy.config.sh
# ============================================
#
# 此配置文件在 Windows (Git Bash) 和 Mac/Linux 上均可运行
#

# 服务器连接信息
SERVER_HOST="101.37.235.131"
SSH_PORT="1231"
SERVER_USER="root"

# 域名配置 (请修改为你的域名)
DOMAIN="joii.cc"
DOMAIN_URL="https://$DOMAIN"

# 远程目录
REMOTE_BASE_DIR="/var/www/joii.cc"
REMOTE_WEB_DIR="$REMOTE_BASE_DIR"
REMOTE_API_DIR="$REMOTE_BASE_DIR/api"

# API 配置
API_PORT="3001"
API_BASE_URL="https://$DOMAIN/api"

# 数据库配置
DB_HOST="localhost"
DB_PORT="1232"
DB_USER="postgres"
DB_NAME="joii_canvas"
DB_PASSWORD="fAmYQfseyFv"

# SSL 证书目录
SSL_CERT_DIR="/root/.acme.sh/$DOMAIN"
