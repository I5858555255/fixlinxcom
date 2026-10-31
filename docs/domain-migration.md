# www.fixlinx.com 域名迁移 — 代码侧准备与切换手册

> 生成时间：2026-10-31
> 代码提交：`9e765fd`（SEO 套件）
> 当前线上：`https://i5858555255.github.io/fixlinxcom/`（GitHub Pages 项目站，仍有效）

---

## 1. 代码现状（已完成）

| 项目 | 状态 | 说明 |
|---|---|---|
| 站点基础 URL 环境变量化 | ✅ | `src/lib/seo.ts` 中 `NEXT_PUBLIC_SITE_ORIGIN`（默认 `https://i5858555255.github.io`）+ `NEXT_PUBLIC_PAGES_BASE`（默认 `/fixlinxcom`）。切域名时只需在构建时设两个环境变量，**无需改任何源码** |
| 每页 canonical 链接 | ✅ | 所有 63 个路由均输出 `rel="canonical"`，值由 `absoluteUrl()` 动态生成——切域名后自动跟随环境变量变化 |
| OpenGraph / Twitter 卡片 | ✅ | 每页 `og:url`、`og:image`、`twitter:card` 均用绝对 URL（基于 `SITE_BASE`） |
| sitemap.xml | ✅ | `scripts/generate-seo.py` 构建后生成，63 条 URL，域名从 `FIXLINX_SITEMAP_BASE_URL` 环境变量或默认值取 |
| robots.txt | ✅ | 同一脚本生成；Disallow `/manage/ /assets-en/ /api/`；显式允许 GPTBot / ClaudeBot / PerplexityBot；Sitemap 行自动跟随 |
| JSON-LD 结构化数据 | ✅ | 全站 `<head>` 注入 Organization；首页额外 WebSite；8 个主页面 BreadcrumbList；新闻详情页 Article |
| llms.txt（GEO） | ✅ | `public/llms.txt` 已上线，含公司事实、站点结构、LLM 可引用的关键信息 |
| 品牌事实单一来源 | ✅ | `BRAND` 常量在 `src/lib/seo.ts`：名称、邮箱、电话、办公室/工厂地址。注意：`BRAND.website` 已写为 `https://www.fixlinx.com`（**意图域名**），切域名前它是"指向未来"的字符串；目前未渲染到页面（仅 Organization 的 `url` 用 `absoluteUrl("/")`，仍指 Pages），所以无误导风险 |
| CI 构建时生成 | ✅ | workflow 中 `python scripts/generate-seo.py --output-dir out` + SEO smoke check（验证 sitemap/robots 存在、XML 合法、首页含 canonical） |

**关键设计**：切换域名时**不改一行代码**，只需：
1. GitHub Pages 设置里把自定义域名指向 `www.fixlinx.com`（见下节）
2. （可选）CI 中设 `FIXLINX_SITEMAP_BASE_URL=https://www.fixlinx.com` 并（可选）`NEXT_PUBLIC_PAGES_BASE=""`——但注意 **Pages 自定义域名配置完成后站点实际部署在 `/`（根路径）而非 `/fixlinxcom/`**，所以 sitemap 基础 URL 和 basePath 都需要对应切换（见第 3 节切换步骤）

## 2. 切换前你（人工）需要完成的 DNS 步骤

> 前提：`fixlinx.com` 域名已在你的域名注册商处（Cloudflare / Namecheap / 阿里云等），并且可以编辑 DNS 记录。

### 步骤 A — 在注册商添加 DNS 记录（让 GitHub 接管）

| 记录类型 | 名称 | 值 | 说明 |
|---|---|---|---|
| `A` | `@` | `185.199.108.153` | GitHub Pages IP（四个都要加，顺序无所谓） |
| `A` | `@` | `185.199.109.153` | |
| `A` | `@` | `185.199.110.153` | |
| `A` | `@` | `185.199.111.153` | |
| `CNAME` | `www` | `i5858555255.github.io` | 或同样用 4 条 A 记录指向 `www` |
| `TXT` | `@` | `github-pages-verification-site=i5858555255.fixlinxcom` | GitHub 所有权验证（格式见 GitHub 设置页提示，以 GitHub 实际显示为准） |

> ⚠️ 如果你当前在 **Cloudflare** 管理 DNS：将 A 记录的代理状态设为 **DNS only（灰色云朵）** 而不是 Proxied（橙色），否则 GitHub 验证会失败。

### 步骤 B — 在 GitHub 仓库启用自定义域名

1. 打开 `https://github.com/I5858555255/fixlinxcom/settings`（仓库 Settings）
2. 左侧 **Pages** 区块 → **Custom domain**
3. 填入 `www.fixlinx.com` → **Save**
4. 勾选 **Enforce HTTPS**（GitHub 会先下发临时证书；DNS 解析生效后证书自动换正式 Let's Encrypt 证书，通常几小时内完成）

### 步骤 C — 等 DNS 生效 + 验证

1. `ping www.fixlinx.com`（或 `nslookup`）返回上面四个 IP 之一
2. 浏览器访问 `https://www.fixlinx.com` → 应显示当前站点内容（注意此时**路径行为取决于 GitHub 的站点类型**，见第 3 节）
3. GitHub Settings → Pages 区块：domain 旁边显示绿色对勾 ✓

### 步骤 D — 切换构建配置（我执行，你确认后）

切到自定义域名后，GitHub Pages 会**在根路径 `/` 提供服务**（不再是 `/fixlinxcom/`）。需要：
- `NEXT_PUBLIC_PAGES_BASE` 设为 `""`（空，根路径）
- `FIXLINX_SITEMAP_BASE_URL` 设为 `https://www.fixlinx.com`
- 同时保留 `/fixlinxcom` 旧路径的兼容（按你的要求"不移除现有 /fixlinxcom 路径支持"）——方法见第 3 节

**这一步需要你确认后再做**，因为它会改变 basePath，必须与 GitHub Pages 自定义域名配置同步生效，否则会出现"框架资源 404"的中间状态。

## 3. 切换时的兼容方案（`/fixlinxcom` 旧链接不失效）

由于 `trailingSlash: true` + `basePath` 的约束，**同一套静态产物无法同时以 `/` 和 `/fixlinxcom` 两种 basePath 输出框架 URL**。推荐方案（按优先级）：

1. **方案一（推荐，零代码改动）**：GitHub Pages 自定义域名生效后，把 `www.fixlinx.com` 作为主入口；旧链接 `i5858555255.github.io/fixlinxcom/...` **保持原样继续运行**（GitHub 项目站不受自定义域名影响）。两个入口各自独立、内容相同——不需要 301，也符合"不移除 /fixlinxcom 支持"的要求。
2. **方案二（将来做）**：在注册商处把 `fixlinx.com`（裸域）做 301 → `www.fixlinx.com`；旧 Pages 项目站保留给存量外链，几个月后确认无流量再退役。

## 4. 切换后需要做的 SEO 登记（人工，5 分钟）

| 事项 | 位置 |
|---|---|
| Google Search Console 添加 `www.fixlinx.com` 属性，用 DNS TXT 或 HTML 标签验证 | search.google.com/search-console |
| 提交新 sitemap `https://www.fixlinx.com/sitemap.xml` | 同上，Sitemaps 区块 |
| 旧 Pages 属性保留，可加"更换网址"或提交 301（若采用方案二） | 同上 |
| Bing Webmaster Tools（可选） | bingtools.microsoft.com |
| 更新 `BRAND.website` 在 JSON-LD 中的体现（切换后自动正确，因为 `absoluteUrl` 跟随环境变量） | 无需手动 |

## 5. 当前验证结果（代码 + 线上）

- Pages 构建 exit 0；node-server 构建 exit 0
- CI `#41180588904` success（含新 SEO smoke check）
- 线上已验证：`sitemap.xml` 200（63 URL）、`robots.txt` 200、`llms.txt` 200
- 首页 canonical / OG / JSON-LD 全部输出正确，指向 `https://i5858555255.github.io/fixlinxcom/`
- 无 `dar-yu`、`wixstatic` 残留字符串

## 6. 已知限制 / 待办

- **OG 图片**：当前使用 `drone-interior-1.jpg`（工厂图，1600px 宽够用）。若想要品牌化的 1200×630 分享图（logo + slogan），需要设计一张新图放入 `public/images/` 并更新 `BRAND.ogImage`——待你提供素材。
- **`foundingDate`** 等 Organization 字段：为避免虚构事实，JSON-LD 中未填写未经验证的字段。若你有确切成立年份/ISO 证书编号，告诉我补上。
- **GSC 所有权验证文件**：等你在 Google Search Console 创建属性后，把验证用 meta 标签或 `googlexxxx.html` 文件给我，我加进 `public/` 并部署。
