#!/bin/bash

# Cloudflare Worker AI API 测试脚本 (Groq 版本)
# 使用前请先启动开发服务器: npm run dev

BASE_URL="http://localhost:8787"

echo "🤖 Cloudflare Worker AI API 测试 (Groq 版本)"
echo "=============================================="

# 测试模型列表
echo "📋 测试模型列表..."
curl -X GET "$BASE_URL/api/models" | jq .

echo -e "\n"

# 测试聊天API
echo "📱 测试聊天API..."
curl -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，你能帮我做什么？", "model": "llama3-8b-8192"}' \
  | jq .

echo -e "\n"

# 测试翻译API
echo "🌍 测试翻译API..."
curl -X POST "$BASE_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World", "from": "English", "to": "Chinese"}' \
  | jq .

echo -e "\n"

# 测试摘要API
echo "📝 测试摘要API..."
curl -X POST "$BASE_URL/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{"text": "这是一个非常长的文本内容，需要进行摘要处理。人工智能技术正在快速发展，特别是在自然语言处理领域。Groq 提供了强大的硬件加速推理能力，让我们能够实现超快速的AI推理。Cloudflare Workers 提供了强大的边缘计算能力，让我们能够在全球范围内部署AI服务。"}' \
  | jq .

echo -e "\n✅ 测试完成！"
echo "💡 提示：确保已在 .dev.vars 文件中配置了 GROQ_API_KEY" 