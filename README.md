# Local Request MCP

一个专为本地网络请求设计的 MCP (Model Context Protocol) 工具，可以让 AI 助手安全地向本地网络地址发送 HTTP 请求。

## 功能特性

- 🔒 **安全限制**: 只允许访问本地地址（localhost、内网IP等）
- 🚀 **完整HTTP支持**: 支持 GET、POST、PUT、DELETE 等所有常用方法
- ⚡ **快速启动**: 通过 `npx` 命令即可直接使用
- 🛡️ **智能过滤**: 自动过滤敏感请求头，保护隐私
- 📊 **详细响应**: 返回完整的响应信息，包括状态码、头部、耗时等

## 快速开始

### 使用 npx (推荐)

```bash
npx local-request-mcp
```

### 本地安装

```bash
npm install -g local-request-mcp
local-request-mcp
```

## 工具说明

### `local_request`

向本地网络地址发送HTTP请求。

**参数:**

- `url` (必需): 请求的URL，必须是本地地址
- `method` (可选): HTTP方法，默认为 `GET`
- `headers` (可选): 请求头对象
- `body` (可选): 请求体内容
- `timeout` (可选): 超时时间（毫秒），默认 5000ms
- `params` (可选): URL查询参数

**支持的本地地址:**

- `localhost`、`127.0.0.1`、`::1`
- 内网地址：`10.x.x.x`、`172.16-31.x.x`、`192.168.x.x`
- 链路本地地址：`169.254.x.x`

**使用示例:**

```javascript
// GET 请求
{
  "url": "http://localhost:3000/api/users"
}

// POST 请求
{
  "url": "http://192.168.1.100:8080/api/data",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"name\": \"test\"}"
}
```

## 安全特性

1. **地址限制**: 严格限制只能访问本地网络地址
2. **协议限制**: 只支持 HTTP 和 HTTPS 协议
3. **头部过滤**: 自动过滤敏感的认证头部
4. **大小限制**: 限制请求和响应体大小（10MB）
5. **超时保护**: 防止长时间挂起的请求

## 开发

```bash
# 克隆项目
git clone <repository-url>
cd local-request-mcp

# 安装依赖
npm install

# 编译
npm run build

# 启动
npm start
```

## 作者

👨‍💻 **await29** - 项目创建者和维护者

## 许可证

MIT License