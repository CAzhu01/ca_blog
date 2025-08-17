# 部署配置检查清单

## 🚀 部署前必须配置的项目

### 1. GitHub OAuth App 设置

在 GitHub > Settings > Developer settings > OAuth Apps 中：

- **Application name**: 您的应用名称
- **Homepage URL**: `https://your-domain.com`
- **Authorization callback URL**: `https://your-domain.com/auth/callback`

### 2. Supabase 项目设置

在 Supabase Dashboard > Authentication > Settings 中：

- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: 添加 `https://your-domain.com/auth/callback`

在 Supabase Dashboard > Authentication > Providers > GitHub 中：

- 启用 GitHub 提供商
- 输入 GitHub OAuth App 的 Client ID 和 Client Secret
- 确保勾选了 "Enable sign-ups"

### 3. 环境变量配置

在您的部署平台（Vercel/Netlify/等）中设置：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 4. 域名配置

确保您的域名正确指向部署平台，并且 SSL 证书已配置。

### 5. 测试流程

1. 访问 `https://your-domain.com/login`
2. 点击 "使用 GitHub 登录"
3. 应该重定向到 GitHub 授权页面
4. 授权后应该返回到 `https://your-domain.com/auth/callback`
5. 最终重定向到 `https://your-domain.com/dashboard`

### 6. 常见问题排查

- 如果重定向失败，检查 `/auth-debug` 页面的错误信息
- 确保所有 URL 使用 HTTPS（生产环境）
- 检查浏览器控制台的网络请求和错误日志

## 🔧 开发环境 vs 生产环境差异

### 开发环境

- 回调 URL: `http://localhost:3000/auth/callback`
- GitHub OAuth 需要单独的开发应用配置

### 生产环境

- 回调 URL: `https://your-domain.com/auth/callback`
- 使用生产域名的 GitHub OAuth 配置
