# deeplx-api

## 使用 Vercel 部署 `deeplx-api`

### 步骤 1：Fork 项目

1. 访问 [deeplx-api](https://github.com/libaxaun/deeplx-api) 项目页面。
2. 点击右上角 "Fork" 按钮，将项目复制到 GitHub 账户下。

### 步骤 2：连接 Vercel 和 GitHub

1. 登录到 Vercel 账户。
2. 在 Vercel Dashboard 中，点击 "New Project"。
3. 选择刚刚 fork 的 `deeplx-api` 项目。
4. Vercel 会请求访问 GitHub 账户以获取项目代码，同意授权。

### 步骤 3：配置环境变量

在 Vercel 项目设置中：

1. 找到 "Environment Variables" 部分。
2. 添加以下环境变量：
   以下是将你提供的信息整理为表格的格式：

| 键名          | 可选性 | 默认值                     | 说明                     |
|---------------|--------|---------------------------|--------------------------|
| `TARGET_URLS`| 可选   | `https://deeplx.vercel.app` | `success_.txt` 文件中的 URL |
| `SOURCE_LANG`| 可选   | `auto`                    | 你想要的源语言（例如 `zh`） |
| `TARGET_LANG`| 可选   | `en`                      | 你想要的目标语言（例如 `en`） |

这种格式可以清晰地展示每个键名的属性和说明。

### 步骤 4：部署项目

1. 完成环境变量设置后，Vercel 会自动开始部署过程。
2. 部署完成后，Vercel 会提供一个 URL，可以通过这个 URL 访问服务。

### 步骤 5：使用服务

通过发送 HTTP 请求到 Vercel 提供的 URL，可以开始使用 `deeplx-api` 服务进行文本翻译。

### 示例请求

可以使用 `curl` 或 Postman 发送请求，例如：

```bash
curl --location 'https://域名/translate' \
--header 'Content-Type: application/json' \
--data '{
    "text": "一只哈士奇",
    "source_lang": "auto",
    "target_lang": "en"
}'
```

替换 `<Vercel_URL>` 为 Vercel 提供的实际 URL。
