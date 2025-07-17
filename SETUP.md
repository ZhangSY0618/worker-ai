# Cloudflare Worker AI (Groq) 设置指南

## 🚀 快速开始

### 1. 获取 Groq API 密钥

1. 访问 [Groq Console](https://console.groq.com/)
2. 注册或登录账户
3. 前往 [API Keys](https://console.groq.com/keys) 页面
4. 创建新的 API 密钥
5. 复制 API 密钥 (格式类似: `gsk_...`)

### 2. 配置本地环境

编辑 `.dev.vars` 文件，替换 `your-groq-api-key-here` 为您的实际 API 密钥：

```bash
# 本地开发环境变量
ENVIRONMENT=development

# Groq API 密钥 (需要从 https://console.groq.com/keys 获取)
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 3. 安装依赖和启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. 测试 API

在浏览器访问 `http://localhost:8787` 查看 API 文档，或运行测试脚本：

```bash
# Windows
examples\test-api.bat

# Linux/Mac
examples/test-api.sh
```

## 🌐 部署到 Cloudflare Workers

### 1. 登录 Cloudflare

```bash
npx wrangler login
```

### 2. 设置生产环境密钥

```bash
npx wrangler secret put GROQ_API_KEY
# 输入您的 Groq API 密钥
```

### 3. 部署项目

```bash
npm run deploy
```

## 🔧 配置说明

### 可用的 Groq 模型

- `llama3-8b-8192` - Llama 3 8B (默认，推荐)
- `llama3-70b-8192` - Llama 3 70B (更强大)
- `mixtral-8x7b-32768` - Mixtral 8x7B (更长上下文)
- `gemma-7b-it` - Gemma 7B (Google)

### API 端点

- `POST /api/chat` - 聊天对话
- `POST /api/translate` - 文本翻译
- `POST /api/summarize` - 文本摘要
- `GET /api/models` - 获取模型列表

## 💡 使用技巧

### 1. 聊天对话

```javascript
// 基本用法
{
  "message": "你好，你能帮我做什么？"
}

// 指定模型
{
  "message": "写一个简单的Python程序",
  "model": "llama3-70b-8192"
}
```

### 2. 文本翻译

```javascript
{
  "text": "Hello, how are you?",
  "from": "English",
  "to": "Chinese"
}
```

### 3. 文本摘要

```javascript
{
  "text": "这里是一段很长的文本内容..."
}
```

## 🔒 安全注意事项

1. **API 密钥安全**

   - 永远不要在代码中硬编码 API 密钥
   - 使用环境变量或 Cloudflare Workers 的 secrets

2. **访问控制**

   - 考虑添加身份验证
   - 设置适当的 CORS 策略

3. **使用限制**
   - 监控 API 使用情况
   - 设置适当的超时和重试机制

## 📊 监控和调试

### 查看日志

```bash
# 查看实时日志
npx wrangler tail
```

### 调试模式

在 `.dev.vars` 中添加：

```
DEBUG=true
```

## 🆘 常见问题

### Q: API 密钥错误

A: 确保 `.dev.vars` 文件中的 `GROQ_API_KEY` 是正确的，并且格式为 `gsk_...`

### Q: 部署失败

A: 确保已设置生产环境的 secret：`npx wrangler secret put GROQ_API_KEY`

### Q: 模型响应慢

A: 尝试使用 `llama3-8b-8192` 模型，它比 70B 版本更快

### Q: CORS 错误

A: 项目已配置 CORS，如果仍有问题，检查请求头是否正确

## 📚 更多资源

- [Groq 官方文档](https://console.groq.com/docs)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [项目 GitHub 仓库](https://github.com/your-username/worker-ai)

## 🤝 支持

如果遇到问题，请：

1. 查看本文档的常见问题部分
2. 检查 [Groq 状态页面](https://status.groq.com/)
3. 创建 Issue 或 Pull Request
