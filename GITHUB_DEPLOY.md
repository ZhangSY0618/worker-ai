# GitHub 部署 Cloudflare Worker 指南

## 🚀 自动部署设置

### 1. 准备 GitHub 仓库

1. 将项目推送到 GitHub 仓库
2. 确保主分支为 `main` 或 `master`

### 2. 配置 GitHub Secrets

在 GitHub 仓库的 **Settings > Secrets and variables > Actions** 中添加以下 secrets：

#### 必需的 Secrets：

```
CLOUDFLARE_API_TOKEN    # Cloudflare API 令牌
CLOUDFLARE_ACCOUNT_ID   # Cloudflare 账户 ID
GROQ_API_KEY           # Groq API 密钥
```

### 3. 获取 Cloudflare 凭证

#### 获取 API Token：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 前往 **My Profile > API Tokens**
3. 创建新的 Token，选择 **Edit Cloudflare Workers** 模板
4. 复制生成的 Token

#### 获取 Account ID：

1. 在 Cloudflare Dashboard 右侧边栏查看 **Account ID**
2. 或运行 `npx wrangler whoami` 获取

### 4. 配置工作流

项目已包含 `.github/workflows/deploy.yml` 文件，会在以下情况自动部署：

- 推送到 `main` 或 `master` 分支
- 创建 Pull Request

### 5. 部署流程

```bash
# 1. 推送代码
git add .
git commit -m "Deploy to Cloudflare Workers"
git push origin main

# 2. GitHub Actions 自动执行：
#    - 安装依赖
#    - 运行测试 (可选)
#    - 部署到 Cloudflare Workers
```

## 📋 部署检查清单

### 代码检查：

- ✅ `wrangler.toml` 配置正确
- ✅ `package.json` 脚本更新
- ✅ GitHub Actions 工作流文件存在
- ✅ 所有依赖项已安装

### 环境配置：

- ✅ GitHub Secrets 已配置
- ✅ Cloudflare API Token 有效
- ✅ Groq API Key 已设置

### 测试步骤：

- ✅ 本地开发环境正常 (`npm run dev`)
- ✅ 代码无语法错误
- ✅ API 端点响应正常

## 🔧 常见问题

### Q: 部署失败，显示 "Authentication error"

A: 检查 `CLOUDFLARE_API_TOKEN` 是否正确，并确保 Token 有足够权限

### Q: 部署成功但访问失败

A: 检查 `GROQ_API_KEY` 是否在 GitHub Secrets 中正确设置

### Q: 工作流不触发

A: 确保推送到 `main` 或 `master` 分支，并检查 `.github/workflows/deploy.yml` 文件路径

## 📊 监控部署

1. **GitHub Actions 日志**：查看部署过程
2. **Cloudflare Dashboard**：监控 Worker 状态
3. **Wrangler 日志**：`npx wrangler tail` 查看实时日志

## 🎯 优化建议

1. **环境分离**：使用不同分支部署到不同环境
2. **测试集成**：添加单元测试和集成测试
3. **版本管理**：使用 Git tags 进行版本发布
4. **监控告警**：配置部署状态通知

## 🚀 部署命令

```bash
# 手动部署 (如果需要)
npm run deploy

# 查看部署状态
npx wrangler deployments list

# 查看实时日志
npx wrangler tail
```
