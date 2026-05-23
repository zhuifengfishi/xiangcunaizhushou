import { NextRequest, NextResponse } from 'next/server';
import { generateContent, TemplateType, FormData } from '../../../../data/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, formData, photoCount = 0, localCase, localDirection } = body;

    if (!type || !formData) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const result = generateContent(
      type as TemplateType,
      formData as FormData,
      photoCount as number,
      localCase as string | undefined,
      localDirection as string | undefined,
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('生成失败:', error);
    return NextResponse.json({ error: '生成失败，请重试' }, { status: 500 });
  }
}
