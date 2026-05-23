import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: '请至少上传1张照片' }, { status: 400 });
    }

    if (files.length > 6) {
      return NextResponse.json({ error: '最多上传6张照片' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uploadedPaths: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `photo_${Date.now()}_${i}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploadedPaths.push(filename);
    }

    return NextResponse.json({ success: true, photos: uploadedPaths });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
