import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photos, subtitles } = body as {
      photos: string[];
      subtitles: string[];
    };

    if (!subtitles || subtitles.length === 0) {
      return NextResponse.json({ error: '请先生成文案内容' }, { status: 400 });
    }

    const outputDir = path.join(process.cwd(), 'output');
    const uploadDir = path.join(process.cwd(), 'uploads');
    const publicDir = path.join(process.cwd(), 'public', 'videos');
    await mkdir(outputDir, { recursive: true });
    await mkdir(publicDir, { recursive: true });

    // 查找可用图片
    const imageFiles: string[] = [];
    if (photos && photos.length > 0) {
      for (const photo of photos) {
        const fullPath = path.join(uploadDir, photo);
        if (existsSync(fullPath)) {
          imageFiles.push(fullPath);
        }
      }
    }

    const targetSegments = 5;
    const durationPerSegment = 3;
    const bgColor = '0xFFF8F0';
    const textColor = '0x3D2B1F';
    const fontName = 'WenQuanYi Micro Hei';

    // 步骤1：为每段准备一张 1080x1920 的图片
    const preparedImages: string[] = [];

    for (let i = 0; i < targetSegments; i++) {
      const outPath = path.join(outputDir, `frame_${i}.png`);

      if (i < imageFiles.length) {
        // 真实图片：缩放裁剪到 1080x1920
        await runFFmpeg([
          '-y',
          '-i', imageFiles[i],
          '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
          '-frames:v', '1',
          outPath,
        ]);
      } else {
        // 生成纯色背景图
        await runFFmpeg([
          '-y',
          '-f', 'lavfi',
          '-i', `color=c=${bgColor}:s=1080x1920:d=1`,
          '-frames:v', '1',
          '-update', '1',
          outPath,
        ]);
      }
      preparedImages.push(outPath);
    }

    // 步骤2：为每段图片生成3秒视频（带淡入淡出+字幕）
    const segmentPaths: string[] = [];

    for (let i = 0; i < targetSegments; i++) {
      const segmentPath = path.join(outputDir, `segment_${i}.mp4`);
      const subtitle = subtitles[i] || '';

      // 构建 vf 滤镜链
      const filters: string[] = [
        'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
        'fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5',
      ];

      if (subtitle) {
        // drawtext 转义
        const escaped = subtitle
          .replace(/\\/g, '\\\\\\\\')
          .replace(/'/g, "\\\\'")
          .replace(/:/g, '\\\\:')
          .replace(/%/g, '\\\\%');
        filters.push(
          `drawtext=text='${escaped}':fontcolor=${textColor}:fontsize=42:borderw=2:bordercolor=0xFFFFFF:x=(w-text_w)/2:y=h-180:font='${fontName}'`
        );
      }

      await runFFmpeg([
        '-y',
        '-loop', '1',
        '-i', preparedImages[i],
        '-t', String(durationPerSegment),
        '-vf', filters.join(','),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        '-preset', 'fast',
        segmentPath,
      ]);

      segmentPaths.push(segmentPath);
    }

    // 步骤3：合并所有分段
    const concatListPath = path.join(outputDir, 'concat.txt');
    const concatContent = segmentPaths.map(p => `file '${p}'`).join('\n');
    await writeFile(concatListPath, concatContent, 'utf-8');

    const timestamp = Date.now();
    const finalOutputPath = path.join(outputDir, `video_${timestamp}.mp4`);
    const publicOutputPath = path.join(publicDir, `video_${timestamp}.mp4`);

    await runFFmpeg([
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath,
      '-c', 'copy',
      '-movflags', '+faststart',
      finalOutputPath,
    ]);

    // 复制到 public 目录供下载
    const videoBuffer = await readFile(finalOutputPath);
    await writeFile(publicOutputPath, videoBuffer);

    // 清理临时文件
    for (const p of [...segmentPaths, ...preparedImages]) {
      try { await unlink(p); } catch { /* ignore */ }
    }
    try { await unlink(concatListPath); } catch { /* ignore */ }
    try { await unlink(finalOutputPath); } catch { /* ignore */ }

    const videoFilename = path.basename(publicOutputPath);

    return NextResponse.json({
      success: true,
      videoUrl: `/videos/${videoFilename}`,
      filename: videoFilename,
    });
  } catch (error) {
    console.error('视频生成失败:', error);
    const message = error instanceof Error ? error.message : '视频生成失败，请重试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 使用原生 ffmpeg 命令行执行，避免 fluent-ffmpeg 的 filter 参数传递问题
function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });

    let stderrOutput = '';
    proc.stderr.on('data', (data: Buffer) => {
      stderrOutput += data.toString();
    });

    proc.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderrOutput.slice(-200)}`));
      }
    });

    proc.on('error', (err: Error) => {
      reject(err);
    });
  });
}
