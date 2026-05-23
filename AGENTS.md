# AGENTS.md - 追风少年：乡村短视频生成助手

## 项目概览

面向村民的极简短视频生成工具。4步流程：选类型→填信息→传照片→生成。支持离线模板生成 + FFmpeg 15秒竖屏视频合成。

## 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **视频合成**: FFmpeg (系统内置)
- **字体**: WenQuanYi Micro Hei (系统内置中文字体)

## 目录结构

```
├── data/
│   ├── cases.json          # 演示案例数据
│   └── templates.ts        # 模板生成逻辑（5种类型 + 地方案例）
├── uploads/                 # 上传图片临时目录
├── output/                  # 视频生成临时目录
├── public/videos/           # 生成的视频文件（可下载）
├── src/
│   ├── app/
│   │   ├── page.tsx         # 主页面（4步向导 + 结果展示）
│   │   ├── globals.css      # 全局样式（暖色乡村主题）
│   │   ├── layout.tsx       # 布局
│   │   └── api/
│   │       ├── generate/route.ts   # 文案生成接口
│   │       ├── upload/route.ts     # 图片上传接口
│   │       ├── video/route.ts      # FFmpeg视频合成接口
│   │       └── photos/[filename]/route.ts  # 图片访问接口
│   ├── components/ui/       # shadcn/ui组件库
│   └── lib/utils.ts         # 工具函数
├── DESIGN.md                # 设计规范
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

1. **POST /api/generate** - 生成文案（口播脚本、分镜、字幕、发布文案、标签）
   - 参数：type, formData, photoCount, localCase, localDirection
2. **POST /api/upload** - 上传图片（1-6张）
   - 参数：FormData with photos
3. **POST /api/video** - 生成15秒竖屏MP4视频
   - 参数：photos, subtitles
4. **GET /api/photos/[filename]** - 访问上传的图片

## 核心生成逻辑

- `data/templates.ts` 包含5种场景模板的生成规则
- 每种模板有：scriptTemplate, storyboardTemplate, publishTemplate, tagsTemplate
- 字幕自动拆分为5段（每段约3秒）
- 地方案例：屏南县、熙岭乡、四坪村、龙潭古镇（兼容"龙塘古镇"）

## 视频合成流程

1. 为每段准备1080x1920图片（上传图片缩放裁剪/纯色背景）
2. 每段3秒，添加淡入淡出+drawtext字幕
3. 合并5段为15秒视频，输出到 public/videos/

## 设计规范

- 配色：暖土色(#C4704B) + 麦穗金(#D4A853) + 米白(#FFF8F0)
- 字体：18px+正文，20px+按钮，禁止小字
- 大按钮、大输入框、无术语
- 手机和电脑适配

## 开发注意事项

- 视频合成使用原生 child_process.spawn 调用 ffmpeg，不使用 fluent-ffmpeg 的 complexFilter
- drawtext 字体使用 'WenQuanYi Micro Hei'
- 纯色背景图生成使用 lavfi color source，需加 -update 1 参数
- 上传目录和输出目录需要运行时创建
