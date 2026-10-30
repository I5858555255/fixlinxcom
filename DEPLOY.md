# 部署到 GitHub / 线上 — 完整清单

本仓库是 **Next.js 15 (App Router) Node 项目**，`/api/*`、`/manage` 的增删改、
以及 55 个 DIY 子页 / 新闻详情页都依赖 **Node 服务器运行时**（`next start`）。
所以正确部署分两步：

## 一、上传到 GitHub（源码）

仓库根 = 本 `website/` 目录。已经准备好的内容：

- `.gitignore`（已创建）：忽略 `.next/`、`node_modules/`；
  **保留 `data/`**（diy 47 个 json、news 3 个 json、contact 目录必须入库，
  否则 DIY 子页 / 新闻页 / 联系表单会拿不到数据）。
- `package.json` 名字已改为 `fixlinx-industrial`。
- `data/` 目录在 Git 中**必须被跟踪**（.gitignore 没有忽略它）。

命令行操作：

```bash
cd website
git init
git add .
git commit -m "Fixlinx Industrial site"
git remote add origin https://github.com/<你的账号>/fixlinx-site.git
git push -u origin main
```

> 关键检查：`git ls-files data` 能列出 50 个 json 才说明数据入库了。

## 二、线上运行（全部功能可用）

**GitHub Pages 不行**（静态，跑不了 Node 的 `/api` 和动态页）。
要"所有功能可用和正常展示"，需要托管到 Node 平台，任选其一：

| 平台 | 步骤 | 说明 |
|---|---|---|
| **Vercel**（推荐，最简单） | vercel.com → New Project → 导入该 GitHub 仓库 → 框架自动识别 Next.js → Deploy | 零配置，自动 `next build` + 跑 Node，所有 API/动态页/表单都可用 |
| **Render** | 新建 Web Service → 连 GitHub → Build `npm install`、Start `npm start` → 选 Node 20+ | 免费额度够演示，需设持久磁盘或注意 data 的读写 |
| **Railway / Fly.io / 云服务器** | `npm install && npm run build && npm start`，开放端口 | 完全自控 |

部署后验证：

- 首页、`/quality-en`、`/products-en`、`/diy-pack-en` 等静态页 → 正常
- `/05-1-blow-case-en` 等 47 个 DIY 子页 → 正常（Node 读 `data/diy/*.json`）
- `/news-en`、`/news-en/<slug>` → 正常
- `/manage` 三个 tab（News / DIY Pack / Media Registry）的增删改 → 正常
- 联系表单（`/contact-en`）→ 提交写 `data/contact/*.json`，正常

## 三、如果你坚持只用 GitHub（纯静态）

可以用 `next export` 出静态站放 GitHub Pages，但会**失去**：
`/api/contact`、`/api/manage/*`、`/api/replace-asset`，以及所有 `force-dynamic`
页面（55 个 DIY 子页、新闻列表/详情、`/manage`）会 404 或数据缺失。
**不推荐**——会和你"所有功能可用"的目标冲突。

## 四、可选加固

- 加 `vercel.json`（若用 Vercel，通常不需要，框架自动识别）。
- 加 `license`、`CONTRIBUTING.md`。
- 把 `start.bat`/`dev.bat`/`build-asset-catalog.py` 标为 Windows 专用（已在 .gitignore
  注释中说明；它们不影响非 Windows 部署）。
