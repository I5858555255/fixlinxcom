# www.fixlinx.com 域名迁移 — 代码侧准备与切换手册

> 更新时间：2026-10-31（补充：Namecheap DNS 现状 + 根路径构建机制）
> 当前线上：`https://i5858555255.github.io/fixlinxcom/`（GitHub Pages 项目站，仍有效）

---

## 0. 当前 DNS 现状（2026-10-31 公开查询结果）

| 查询 | 结果 |
|---|---|
| `fixlinx.com` A | `192.64.119.84`（Namecheap 默认未启用解析 / parking IP） |
| `fixlinx.com` NS | 当前注册商 Namecheap（DNS 记录在 Namecheap 面板管理） |
| `www.fixlinx.com` A / CNAME | **无记录**（超时 / NXDOMAIN） |
| 第三方残留 | 无 Wix / `dar-yu` / `wixstatic` 域名残留 |

结论：`www` 是全新记录，添加 A 记录不影响任何现有服务；裸域 `fixlinx.com` 目前指向 Namecheap 的 parking IP（`192.64.119.84`），**替换为 GitHub Pages IP 前该地址无实际服务，可以安全覆盖**。

## 1. 切换机制（全部由 GitHub 仓库变量控制，不改源码）

本次代码改动后，整个切换只需要在 GitHub 仓库设置里改 **3 个 Variables**：

| 仓库变量（Settings → Secrets and variables → Variables） | 当前值（不设置 = 默认） | 切域名时设为 | 作用 |
|---|---|---|---|
| `PAGES_BASE` | 未设置 → 默认 `/fixlinxcom` | `root` | 构建产物从 sub-path 切换为根路径（`basePath` 省略，CSS 前缀关闭，运行时脚本自动关闭） |
| `SITE_ORIGIN` | 未设置 → `https://i5858555255.github.io` | `https://www.fixlinx.com` | canonical / OG / JSON-LD 的绝对 URL 基础 |
| `SITEMAP_BASE_URL` | 未设置 → `https://i5858555255.github.io/fixlinxcom` | `https://www.fixlinx.com` | sitemap.xml / robots.txt 里的域名 |

三个变量读取链路（已验证）：
- `PAGES_BASE` → `next.config.ts`（basePath + CSS url() 前缀开关）+ `src/lib/seo.ts`（SITE_BASE）+ `src/lib/assetPath.ts`（运行时前缀检测）
- `SITE_ORIGIN` → `src/lib/seo.ts`（canonical / OG / Twitter / JSON-LD 绝对 URL）
- `SITEMAP_BASE_URL` → `scripts/generate-seo.py`（sitemap + robots）

**注意哨兵值**：`PAGES_BASE` 必须填字符串 `root`（不是空字符串），空字符串 = 未设置 = 保持 `/fixlinxcom` 默认行为。

## 2. 你（人工）在 Namecheap 完成的 DNS 步骤

> 路径：Namecheap 账户 → **Domain List** → `fixlinx.com` → **Manage** → **Advanced DNS**

### 步骤 A — 删除 Namecheap 默认的 A 记录（可选但建议）

Advanced DNS 里通常有一条 `A` / `@` / `192.64.119.84`（Namecheap parking）。删除它，避免切换后裸域仍指向 parking。

### 步骤 B — 添加 GitHub Pages 的 4 条 A 记录（各 1 条）

在 **Add New Record** 中依次添加 4 条 A 记录（Host 留空 = 裸域 `fixlinx.com`）：

| Type | Host | Value | TTL |
|---|---|---|---|
| A | （空） | `185.199.108.153` | Auto |
| A | （空） | `185.199.109.153` | Auto |
| A | （空） | `185.199.110.153` | Auto |
| A | （空） | `185.199.111.153` | Auto |

### 步骤 C — 添加 www 的 CNAME 记录

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `fixlinx.com` | Auto |

> 用 CNAME → `fixlinx.com`（而不是直接 CNAME 到 `i5858555255.github.io`）的好处：以后如果 GitHub 换 IP 或换服务，只需改上面 4 条 A 记录，www 自动跟随。

### 步骤 D — 验证 DNS 生效

等 5–10 分钟（TTL）后，Namecheap 面板外执行（或用 [dnschecker.org](https://dnschecker.org)）：

```
nslookup fixlinx.com    → 应返回 185.199.108/109/110/111.153
nslookup www.fixlinx.com → 应先解析到 fixlinx.com，再解析到同一组 IP
```

## 3. GitHub 侧操作（DNS 生效后）

1. 打开 `https://github.com/I5858555255/fixlinxcom/settings`
2. 左侧 **Pages** 区块 → **Custom domain**（如果没显示，先确认 Pages 已启用且来源为 `main` 分支 + `/` 根目录）
3. 输入 `www.fixlinx.com` → **Save**
4. 勾选 **Enforce HTTPS**，等待 10–30 分钟证书自动签发
5. 页面顶部出现绿色 "This domain is verified" / 黄色 "pending" 提示——pending 属正常，等 DNS 传播 + 证书完成即可

## 4. 切换构建（我在你确认 DNS + GitHub 验证通过后执行）

在 GitHub 仓库 **Settings → Secrets and variables → Variables → Add repository variable** 添加 / 修改：

| Variable name | Value |
|---|---|
| `PAGES_BASE` | `root` |
| `SITE_ORIGIN` | `https://www.fixlinx.com` |
| `SITEMAP_BASE_URL` | `https://www.fixlinx.com` |

然后推送一次任意改动（或 workflow_dispatch）触发重建。构建后：
- 站点部署在 `https://www.fixlinx.com/`（根路径，无 `/fixlinxcom/` 前缀）
- 旧地址 `https://i5858555255.github.io/fixlinxcom/` **同时继续可用**（GitHub 项目站与自定义域名独立并存，满足"不移除 /fixlinxcom 路径支持"）

## 5. 切换后 5 分钟 SEO 登记（人工）

| 事项 | 位置 |
|---|---|
| Google Search Console 添加 `www.fixlinx.com` 属性（DNS 验证：加一条 TXT 记录到 Namecheap） | search.google.com/search-console |
| 提交 `https://www.fixlinx.com/sitemap.xml` | GSC → Sitemaps |
| （可选）Bing Webmaster Tools 注册 + 提交 sitemap | bingtools.microsoft.com |
| GSC 验证文件 / meta 标签 → 给我内容，我加进 `public/` 部署 | 代码侧 |

## 6. 已知遗留事项

- **OG 分享图**：当前为工厂图 `drone-interior-1.jpg`；如需品牌化 1200×630 图，提供素材后更新 `BRAND.ogImage` 即可
- **JSON-LD 待补字段**：成立年份、ISO 证书编号——按 TODO 要求不虚构，有准确信息后补上
- **`D:\projectAGI\fixlinx-nopages`**（node-server 版）未同步 SEO 改动，独立运行不受影响
