import { NextRequest, NextResponse } from 'next/server';
import { generateContent, type TemplateType, type FormData } from '../../../../data/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, formData, photoCount, localCase, localDirection } = body as {
      type: TemplateType;
      formData: FormData;
      photoCount: number;
      localCase?: string;
      localDirection?: string;
    };

    if (!type || !formData) {
      return NextResponse.json({ error: '请选择类型并填写信息' }, { status: 400 });
    }

    const result = generateContent(type, formData, photoCount || 0, localCase, localDirection);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('生成失败:', error);
    return NextResponse.json({ error: '生成失败，请重试' }, { status: 500 });
  }
}
