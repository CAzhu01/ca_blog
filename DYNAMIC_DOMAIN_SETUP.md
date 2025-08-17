# 🚀 动态域名解决方案配置指南

## ✅ 已解决的问题

代码现在会自动使用当前访问的域名作为 GitHub OAuth 回调地址，无需手动配置环境变量！

## 🔧 Supabase 配置（重要！）

### 1. 登录 Supabase Dashboard

访问：https://supabase.com/dashboard

### 2. 进入您的项目设置

选择您的项目 > Authentication > Settings

### 3. 配置 Site URL

**Site URL**: 设置为您的主要生产域名

```
https://your-main-domain.vercel.app
```

### 4. 配置 Redirect URLs（关键）

在 "Redirect URLs" 部分添加以下通配符模式：

```
http://localhost:3000/auth/callback
https://*.vercel.app/auth/callback
https://your-custom-domain.com/auth/callback
```

**重要**：`https://*.vercel.app/auth/callback` 这个通配符会匹配所有 Vercel 子域名！

### 5. GitHub OAuth App 配置

#### 选项 A：使用通配符（推荐）

如果 GitHub 支持，在 OAuth App 设置中使用：

- **Homepage URL**: `https://your-main-domain.vercel.app`
- **Authorization callback URL**: `https://*.vercel.app/auth/callback`

#### 选项 B：添加多个回调 URL

在 GitHub OAuth App 中添加多个回调 URL：

```
https://your-main-domain.vercel.app/auth/callback
https://your-app-git-main.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## 🧪 测试步骤

1. 部署到 Vercel（任何分支/PR 都行）
2. 访问新生成的预览域名
3. 尝试 GitHub 登录
4. 检查浏览器控制台的日志，确认使用了正确的回调 URL
5. 应该成功重定向到当前域名而不是 localhost

## 🎯 代码改进说明

现在代码会：

- ✅ 自动检测当前访问的域名
- ✅ 动态生成正确的回调 URL
- ✅ 在控制台输出详细日志便于调试
- ✅ 支持任何 Vercel 预览域名
- ✅ 支持本地开发环境

## 🐛 如果仍有问题

1. 检查浏览器控制台日志
2. 访问 `/auth-debug` 页面查看详细信息
3. 确认 Supabase 的通配符配置是否正确
4. 检查 GitHub OAuth App 的回调 URL 配置

## 📝 注意事项

- 不再需要在 Vercel 中设置 `NEXT_PUBLIC_SITE_URL` 环境变量
- 每次部署都会自动适配新的域名
- 本地开发时会自动使用 `localhost:3000`
