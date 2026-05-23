# AGENTS.md - 乡村宣传AI助手

## 项目概览

面向村民的极简AI提示词生成工具。4步流程：选类型→填信息→传照片→生成。输出两版AI提示词（短视频分镜+海报图片），可直接粘贴到Sora/可灵/Midjourney/DALL-E等工具使用。

## 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── data/
│   ├── cases.json          # 演示案例数据
│   └── templates.ts        # 模板生成逻辑（5种类型 + 地方案例）
├── src/
│   ├── app/
│   │   ├── page.tsx         # 主页面（4步向导 + 结果展示）
│   │   ├── globals.css      # 全局样式（暖色乡村主题）
│   │   ├── layout.tsx       # 布局
│   │   └── api/
│   │       └── generate/route.ts   # 提示词生成接口
│   ├── components/ui/       # shadcn/ui组件库
│   └── lib/utils.ts         # 工具函数
├── DESIGN.md                # 设计规范
├── AGENTS.md                # 本文件
├── next.config.ts           # Next.js配置
└── package.json
```

## 构建和测试命令

- 开发启动：`pnpm dev`
- 构建：`pnpm build`
- 类型检查：`pnpm ts-check`
- 代码检查：`pnpm lint`
- 生产启动：`pnpm start`

## API 接口

1. **POST /api/generate** - 生成AI提示词（短视频分镜+海报图片+发布文案+标签）
   - 参数：type, formData, photoCount, localCase, localDirection
   - 返回：videoPrompts(5段), posterPrompt, publishCopy, tags

## 核心生成逻辑

- `data/templates.ts` 包含5种场景模板的生成规则
- 每种模板有：videoSceneGenerator, posterGenerator, publishTemplate, tagsTemplate
- 视频分镜：5段场景，每段包含英文AI提示词+中文说明+配字幕
- 海报提示词：英文AI提示词+中文说明+推荐风格+推荐比例
- 地方案例：屏南县、熙岭乡、四坪村、龙潭古镇（兼容"龙塘古镇"）

## 设计规范

- 配色：暖土色(#C4704B) + 麦穗金(#D4A853) + 米白(#FFF8F0)
- 字体：18px+正文，20px+按钮，禁止小字
- 大按钮、大输入框、无术语
- 手机和电脑适配
- 提示词展示区用深色背景(#1a1a2e)，与浅色页面形成对比
- 每段提示词都有"复制提示词"按钮

## 开发注意事项

- 离线可用，所有生成逻辑基于本地模板
- 不依赖外部AI服务（如需AI增强可后续接入）
- 龙潭古镇的别名"龙塘古镇"需兼容显示
