import { NextRequest, NextResponse } from 'next/server';
import { generate, type TemplateType, type FormData } from '@/lib/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, formData, photoCount, localCase, localDirection } = body;

    if (!type || !formData) {
      return NextResponse.json({ error: '缺少必填参数' }, { status: 400 });
    }

    const result = generate(
      type as TemplateType,
      formData as FormData,
      photoCount || 0,
      localCase || '',
      localDirection || '',
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('生成失败:', error);
    return NextResponse.json({ error: '生成失败，请重试' }, { status: 500 });
  }
}
