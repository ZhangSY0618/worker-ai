# Cloudflare Worker AI 项目 (Groq 版本)

这是一个基于 Cloudflare Workers 的 AI 服务项目，使用 Groq 的超快速推理引擎，提供多种 AI 功能包括聊天对话、文本翻译和文本摘要。

## 🚀 功能特性

- **💬 AI 聊天对话** - 使用 Groq 的多种模型 (Llama 3, Mixtral, Gemma)
- **🌍 文本翻译** - 基于 AI 的智能翻译服务
- **📝 文本摘要** - 智能文本摘要生成
- **⚡ 超快速推理** - 基于 Groq 的硬件加速推理
- **🌐 边缘计算** - 基于 Cloudflare Workers 的全球边缘部署
- **🔒 CORS 支持** - 支持跨域请求
- **📊 Token 统计** - 详细的使用情况统计

## 📦 项目结构

```
worker-ai/
├── src/
│   └── index.ts          # 主入口文件
├── package.json          # 项目配置
├── wrangler.toml         # Cloudflare Worker 配置
├── .gitignore           # Git忽略文件
└── README.md           # 项目说明
```

## 🛠️ 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Groq API 密钥

1. 访问 [Groq Console](https://console.groq.com/keys) 获取 API 密钥
2. 编辑 `.dev.vars` 文件，设置你的 API 密钥：

```
GROQ_API_KEY=your-groq-api-key-here
```

### 3. 登录 Cloudflare

```bash
npx wrangler login
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 📚 API 使用说明

### 聊天对话

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "你好，你能帮我做什么？",
  "model": "llama3-8b-8192"
}
```

### 文本翻译

```bash
POST /api/translate
Content-Type: application/json

{
  "text": "Hello World",
  "from": "English",
  "to": "Chinese"
}
```

### 文本摘要

```bash
POST /api/summarize
Content-Type: application/json

{
  "text": "这里是需要摘要的长文本内容..."
}
```

### 获取模型列表

```bash
GET /api/models
```

## 🚀 部署

### 部署到 Cloudflare Workers

```bash
npm run deploy
```

### 环境配置

在 `wrangler.toml` 中配置不同的环境：

- `development` - 开发环境
- `production` - 生产环境

## 🔧 配置说明

### AI 模型配置

项目使用以下 Groq AI 模型：

- **llama3-8b-8192**: Llama 3 8B - 高质量的对话和文本生成模型 (默认)
- **llama3-70b-8192**: Llama 3 70B - 更强大的对话和文本生成模型
- **mixtral-8x7b-32768**: Mixtral 8x7B - 高效的混合专家模型
- **gemma-7b-it**: Gemma 7B - Google 的开源对话模型

### 环境变量

在 `.dev.vars` 文件中设置本地开发环境变量：

```
ENVIRONMENT=development
GROQ_API_KEY=your-groq-api-key-here
```

### 部署环境变量

部署到 Cloudflare Workers 时，需要设置以下环境变量：

```bash
# 设置 Groq API 密钥
npx wrangler secret put GROQ_API_KEY
```

## 🧪 测试

访问部署后的 Worker 地址，可以看到 API 文档页面，包含所有可用的端点和使用示例。

## 📝 注意事项

1. 需要在 [Groq Console](https://console.groq.com/keys) 获取 API 密钥
2. Groq 提供免费的 API 配额，超出后需要付费
3. 请遵循 Cloudflare Workers 的使用限制
4. 确保 API 密钥安全，不要在代码中硬编码

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
