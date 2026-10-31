# www.fixlinx.com 域名迁移 — 执行记录与手册

> 状态：**切换已执行**（2026-10-31）
> 当前线上：`https://www.fixlinx.com/`（正式域名，根路径部署）

---

## 0. 当前 DNS 现状（2026-10-31 已验证）

| 查询 | 结果 |
|---|---|
| `fixlinx.com` A | `185.199.108~111.153`（GitHub Pages 四个 IP，轮换解析） |
| `www.fixlinx.com` | CNAME → `fixlinx.com` → 同一组 GitHub Pages IP |
| `https://fixlinx.com/` | 301 → `https://www.fixlinx.com/`（GitHub Pages 自动 apex 跳转，已验证） |
| 第三方残留 | 无 Wix / `dar-yu` / `wixstatic` 域名残留 |

结论：Namecheap 侧 4 条 A + 1 条 CNAME 已全部生效，GitHub Pages 自定义域名验证通过，HTTPS 证书已签发。

## 1. 切换机制（已落地，代码默认值 = 正式域名）

2026-10-31 提交（`cutover`）将代码默认值直接改为正式域名，**无需设置任何 GitHub 仓库变量**，推送即生效：

| 配置点 | 默认值（cutover 后） | 旧 sub-path 重建方式 |
|---|---|---|
| `next.config.ts` basePath | 无（根路径） | 构建时设 `NEXT_PUBLIC_PAGES_BASE=/fixlinxcom` |
| `src/lib/seo.ts` SITE_ORIGIN | `https://www.fixlinx.com` | 构建时设 `NEXT_PUBLIC_SITE_ORIGIN=https://i5858555255.github.io` |
| `scripts/generate-seo.py` | `https://www.fixlinx.com` | 构建时设 `FIXLINX_SITEMAP_BASE_URL=https://i5858555255.github.io/fixlinxcom` |
| `src/lib/assetPath.ts` / `layout.tsx` 运行时脚本 | 无前缀（BUILD_BASE=""，脚本自守退化为 no-op） | 随 basePath 自动恢复 |

CI（`deploy-pages.yml`）读取 3 个**可选**仓库变量（`PAGES_BASE` / `SITE_ORIGIN` / `SITEMAP_BASE_URL`）：
- 全部不设置 → 按代码默认值 = **root + www.fixlinx.com**（当前行为）
- 需要重建 sub-path 时 → 临时设置 3 个变量为 `/fixlinxcom` + Pages URL + Pages sitemap URL，推送一次，再删除

## 2. 切换后两个 URL 的实际行为（重要）

同一个 Pages 部署产物同时挂在两个入口下：

| URL | 行为 |
|---|---|
| `https://www.fixlinx.com/...` | ✅ 正式入口。根路径产物：CSS/JS 在 `/_next/...`，canonical/sitemap/OG 全部指向 `www.fixlinx.com` |
| `https://i5858555255.github.io/fixlinxcom/...` | ⚠️ 仍返回 root build 的 HTML（200），但其中引用的 `/_next/...` CSS/JS 会解析到 `i5858555255.github.io/_next/` → 404（样式/脚本损坏）。**该旧入口不再是可用站点**，仅 www 是正式站点 |

如需让旧入口恢复可用：按第 1 节临时设 3 个仓库变量重建一次 sub-path 产物。但 sub-path 与 root 产物是同一 artifact，无法同时服务两种结构——二者只能取一，当前取 **root（正式域名优先）**。

## 3. 已完成的 Namecheap / GitHub 操作（人工）

- [x] Namecheap Advanced DNS：删除 parking A 记录，添加 4 条 GitHub Pages A 记录（@），添加 CNAME www → fixlinx.com
- [x] GitHub 仓库 Settings → Pages → Custom domain：`www.fixlinx.com`，DNS Check Successful
- [x] Enforce HTTPS 已启用（证书自动签发）
- [x] 代码默认值切换 + 推送（CI 自动部署）

## 4. 剩余人工事项（SEO 登记，约 10 分钟）

| 事项 | 位置 | 状态 |
|---|---|---|
| Google Search Console 添加 `www.fixlinx.com` 属性（DNS 验证：Namecheap 加 1 条 GSC 提供的 TXT 记录） | search.google.com/search-console | ⬜ 待办 |
| 提交 `https://www.fixlinx.com/sitemap.xml`（63 URL，已自动指向新域名） | GSC → Sitemaps | ⬜ 待办（属性创建后） |
| （可选）旧 Pages URL 在 GSC 中提交"网址更换"或 301 告知 | GSC | 可选 |
| （可选）Bing Webmaster Tools 注册 + 提交 sitemap | bingtools.microsoft.com | 可选 |
| GSC 若要求 meta 标签 / 验证文件 → 内容发给我 | 代码侧 | 随时 |

## 5. 已知遗留事项

- **OG 分享图**：当前为工厂图 `drone-interior-1.jpg`；如需品牌化 1200×630 图，提供素材后更新 `BRAND.ogImage` 一处即可
- **JSON-LD 待补字段**：成立年份、ISO 证书编号——按 TODO 要求不虚构，有准确信息后补上
- **`D:\projectAGI\fixlinx-nopages`**（node-server 版）未同步本次 SEO + 域名改动，独立运行不受影响；需同步时告诉我
