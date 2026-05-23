import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '乡村宣传AI助手',
    template: '%s | 乡村宣传AI助手',
  },
  description:
    '选类型、填信息，一键生成AI短视频分镜提示词和宣传海报提示词，直接粘贴到AI工具就能用。',
  keywords: [
    '乡村宣传',
    'AI提示词',
    '短视频分镜',
    '宣传海报',
    '助农',
  ],
  authors: [{ name: '乡村宣传AI助手' }],
  generator: 'Coze Code',
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: '乡村宣传AI助手',
    description:
      '选类型、填信息，一键生成AI短视频分镜提示词和宣传海报提示词。',
    url: 'https://code.coze.cn',
    siteName: '扣子编程',
    locale: 'zh_CN',
    type: 'website',
    // images: [
    //   {
    //     url: '',
    //     width: 1200,
    //     height: 630,
    //     alt: '扣子编程 - 你的 AI 工程师',
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Coze Code | Your AI Engineer is Here',
  //   description:
  //     'Build and deploy full-stack applications through AI conversation. No env setup, just flow.',
  //   // images: [''],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
