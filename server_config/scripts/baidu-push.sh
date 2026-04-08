#!/bin/bash

# 百度主动推送脚本
# 使用方法: ./baidu-push.sh

SITE="https://joii.cc"
TOKEN="zNG9GI5n0UaxaMHL"
URLS_FILE="$(dirname "$0")/baidu-push-urls.txt"

echo "=== 百度链接主动推送 ==="
echo "网站: $SITE"
echo ""

if [ ! -f "$URLS_FILE" ]; then
    echo "错误: 找不到文件 $URLS_FILE"
    exit 1
fi

echo "推送的URL列表:"
cat "$URLS_FILE"
echo ""

echo "正在推送..."
RESPONSE=$(curl -H 'Content-Type:text/plain' --data-binary @"$URLS_FILE" "http://data.zz.baidu.com/urls?site=$SITE&token=$TOKEN")

echo "百度返回结果:"
echo "$RESPONSE"
echo ""

# 解析结果
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[0-9]*' | grep -o '[0-9]*')
REMAIN=$(echo "$RESPONSE" | grep -o '"remain":[0-9]*' | grep -o '[0-9]*')

if [ -n "$SUCCESS" ] && [ "$SUCCESS" -gt 0 ]; then
    echo "✅ 成功推送 $SUCCESS 条URL"
    echo "📊 今日剩余可推送数量: $REMAIN"
else
    echo "⚠️ 推送可能失败，请检查返回信息"
fi
