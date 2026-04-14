#!/bin/bash

# 百度主动推送脚本
# 使用方法: ./baidu-push.sh

SITE="https://joii.cc"
TOKEN="zNG9GI5n0UaxaMHL"
URLS=$(curl -s "$SITE/sitemap.xml" | grep -o "<loc>.*</loc>" | sed 's/<loc>//g' | sed 's/<\/loc>//g')

if [ -z "$URLS" ]; then
    echo "❌ 获取 sitemap 失败或该文件中没有 URL"
    exit 1
fi

echo "获取到以下 URL："
echo "$URLS"
echo ""

echo "正在推送到百度..."
RESPONSE=$(curl -s -H 'Content-Type:text/plain' --data-binary "$URLS" "http://data.zz.baidu.com/urls?site=$SITE&token=$TOKEN")

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
