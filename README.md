# Fixlinx Industrial — 官网 (Next.js 15 / TypeScript)

## 本地运行

```bash
npm install
npm run build
npm start        # 或 npm run dev
```

打开 http://localhost:3000。Windows 一键启动：`start.bat` / `dev.bat`。

## 目录结构

- `src/app/` — 全部路由（首页 / about / quality / products / fasteners /
  diy-pack + 47 个 DIY 子页 / news / download / contact / manage / assets 重定向）
- `src/components/sites/dar-yu/` — 共享 header / footer / 卡片 / hero；
  `DiyLib.ts` 在请求时读取 `data/diy/*.json`
- `public/` — 图片、字体（IBM Plex Sans 5 个字重）、PDF、动画流程图
  `process-flow.html`
- `data/` — **运行时数据，必须随仓库提交**：
  `diy/`（47 个盒型页 json）、`news/`（3 篇文章）、`contact/`（表单记录）

## 部署

见 `DEPLOY.md`。核心结论：**必须部署到 Node 平台**（Vercel 最简单），
GitHub Pages 静态站跑不了 `/api` 与动态页。
