# Vercel 部署配置指南

## 🚀 在 Vercel 中设置环境变量

### 1. 登录 Vercel Dashboard

访问 https://vercel.com/dashboard

### 2. 选择您的项目

找到并点击您的 blog-system 项目

### 3. 进入设置页面

点击 "Settings" 标签

### 4. 配置环境变量

在 "Environment Variables" 部分添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL = https://dmdeoauqcrsmyjbcfpby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZGVvYXVxY3JzbXlqYmNmcGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzg1NjIsImV4cCI6MjA3MDkxNDU2Mn0.0ptGWCZ2kVb1bLoxHeg81U16kcFRUbc-0vT7EA9gXws
NEXT_PUBLIC_SITE_URL = https://your-app-name.vercel.app
```

**重要**：将 `your-app-name.vercel.app` 替换为您的实际 Vercel 域名！

### 5. 应用到所有环境

确保选择：

- ✅ Production
- ✅ Preview
- ✅ Development

## 🔧 GitHub OAuth 配置

### 1. 更新 GitHub OAuth App

在 GitHub > Settings > Developer settings > OAuth Apps 中：

**Homepage URL**: `https://your-app-name.vercel.app`
**Authorization callback URL**: `https://your-app-name.vercel.app/auth/callback`

### 2. 更新 Supabase 配置

在 Supabase Dashboard > Authentication > Settings 中：

**Site URL**: `https://your-app-name.vercel.app`
**Redirect URLs**: 添加 `https://your-app-name.vercel.app/auth/callback`

## 🧪 测试步骤

1. 重新部署您的 Vercel 应用
2. 访问 `https://your-app-name.vercel.app/login`
3. 点击 "使用 GitHub 登录"
4. 应该重定向到 GitHub 授权页面
5. 授权后应该返回到您的 Vercel 域名而不是 localhost

## 🐛 故障排除

如果仍然重定向到 localhost：

1. 确认 Vercel 环境变量已正确设置
2. 重新部署应用
3. 清除浏览器缓存
4. 检查 `/auth-debug` 页面的错误信息
5. 查看 Vercel 函数日志

## 📝 获取您的 Vercel 域名

1. 在 Vercel Dashboard 中查看您的项目
2. 域名显示在项目卡片上，格式类似：`your-app-name.vercel.app`
3. 如果您有自定义域名，使用自定义域名代替
