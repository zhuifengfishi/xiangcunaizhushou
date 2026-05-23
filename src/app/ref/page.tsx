'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ========== 类型 ==========
interface ImageItem {
  id: string;
  url: string;
  label: string;
}

type CategoryKey = 'person' | 'product' | 'storefront' | 'field';

interface Category {
  key: CategoryKey;
  icon: string;
  title: string;
  desc: string;
  maxCount: number;
}

// ========== 常量 ==========
const CATEGORIES: Category[] = [
  { key: 'person', icon: '🧑‍🌾', title: '人物形象', desc: '你的头像、工作照、生活照，让AI生成的视频里有你', maxCount: 3 },
  { key: 'product', icon: '🍊', title: '真实产品', desc: '你要卖的东西，实拍就好', maxCount: 4 },
  { key: 'storefront', icon: '🏠', title: '门头和店内', desc: '店铺门头、室内环境、民宿房间等', maxCount: 4 },
  { key: 'field', icon: '🌾', title: '田野和村庄', desc: '果园、田地、村庄风景、街道等', maxCount: 4 },
];

export default function RefPage() {
  const router = useRouter();
  const [images, setImages] = useState<Record<CategoryKey, ImageItem[]>>({
    person: [],
    product: [],
    storefront: [],
    field: [],
  });
  const [saved, setSaved] = useState(false);
  const fileInputRefs = useRef<Record<CategoryKey, HTMLInputElement | null>>({
    person: null,
    product: null,
    storefront: null,
    field: null,
  });

  // 读取localStorage中是否有已保存的数据
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('refImages');
      if (savedData) {
        setImages(JSON.parse(savedData));
      }
    } catch {}
  }, []);

  // 处理图片上传
  const handleUpload = (category: CategoryKey, files: FileList | null) => {
    if (!files) return;
    const cat = CATEGORIES.find(c => c.key === category)!;
    const current = images[category];
    const remaining = cat.maxCount - current.length;
    if (remaining <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remaining);
    const newItems: ImageItem[] = filesToProcess.map(file => ({
      id: `${category}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: URL.createObjectURL(file),
      label: file.name,
    }));

    setImages(prev => ({
      ...prev,
      [category]: [...prev[category], ...newItems],
    }));
  };

  // 删除图片
  const handleRemove = (category: CategoryKey, id: string) => {
    setImages(prev => ({
      ...prev,
      [category]: prev[category].filter(img => {
        if (img.id === id) {
          URL.revokeObjectURL(img.url);
          return false;
        }
        return true;
      }),
    }));
  };

  // 统计总数
  const totalCount = Object.values(images).flat().length;

  // 保存并返回
  const handleSave = () => {
    try {
      // 只保存元信息（url是blob的，页面关闭会失效，这里主要标记用户已操作）
      const saveData = {
        ...images,
        _savedAt: new Date().toISOString(),
        _totalCount: totalCount,
      };
      localStorage.setItem('refImages', JSON.stringify(saveData));
      setSaved(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch {
      // localStorage满了也不影响
      setSaved(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#E8D5C4] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-[#6B4226] hover:text-[#C4704B] text-lg font-bold flex items-center gap-1"
          >
            ← 返回
          </button>
          <h1 className="text-lg font-bold text-[#3D2B1F] flex-1 text-center">上传参考图</h1>
          <span className="text-sm text-[#8B7355]">{totalCount}张</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 说明 */}
        <div className="bg-[#FFF0E0] rounded-2xl p-5 border border-[#E8D5C4] mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📸</span>
            <span className="text-xl font-bold text-[#3D2B1F]">传几张照片，AI照着你的来</span>
          </div>
          <p className="text-[#6B4226] text-base leading-relaxed">
            上传你自己的照片和实景照片，AI生成的视频和海报就能还原真实场景。<br/>
            手机里已有的照片就行，不要求拍得好看。
          </p>
        </div>

        {/* 四个上传区 */}
        <div className="space-y-5">
          {CATEGORIES.map(cat => (
            <div key={cat.key} className="bg-white rounded-2xl border border-[#E8D5C4] p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#3D2B1F]">{cat.title}</h3>
                  <p className="text-sm text-[#8B7355]">{cat.desc}</p>
                </div>
              </div>

              {/* 已上传图片展示 */}
              {images[cat.key].length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {images[cat.key].map(img => (
                    <div key={img.id} className="relative group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#E8D5C4]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => handleRemove(cat.key, img.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 上传按钮 */}
              {images[cat.key].length < cat.maxCount ? (
                <div>
                  <input
                    ref={el => { fileInputRefs.current[cat.key] = el; }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleUpload(cat.key, e.target.files)}
                  />
                  <button
                    onClick={() => fileInputRefs.current[cat.key]?.click()}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-[#E8D5C4] text-[#8B7355] text-base font-bold hover:border-[#C4704B] hover:text-[#C4704B] transition-colors active:scale-[0.97]"
                  >
                    + 点击上传（还可传{cat.maxCount - images[cat.key].length}张）
                  </button>
                </div>
              ) : (
                <p className="text-center text-sm text-[#6B8F71] font-bold py-2">
                  ✓ 已传满{cat.maxCount}张
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 温馨提示 */}
        <div className="mt-6 bg-[#F5EDE4] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>💡</span>
            <span className="font-bold text-[#6B4226]">拍照小建议</span>
          </div>
          <ul className="text-[#6B4226] text-sm space-y-1">
            <li>• 人物照：正面、侧面各一张，干活时的照片最好</li>
            <li>• 产品照：摆在一起拍，不需要白底</li>
            <li>• 门头照：站在对面拍个全貌，店内拍一张氛围</li>
            <li>• 田野照：有山有水有田的风景，随手拍就行</li>
          </ul>
        </div>

        {/* 底部按钮 */}
        <div className="mt-8 space-y-3 pb-8">
          <button
            onClick={handleSave}
            disabled={totalCount === 0}
            className={`w-full py-5 rounded-2xl text-xl font-bold transition-all ${
              saved
                ? 'bg-[#6B8F71] text-white shadow-lg'
                : totalCount > 0
                  ? 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg active:scale-[0.97]'
                  : 'bg-[#E8D5C4] text-[#8B7355] cursor-not-allowed'
            }`}
          >
            {saved ? '已保存，正在返回...' : totalCount > 0 ? `保存${totalCount}张参考图` : '请先上传至少1张照片'}
          </button>

          {totalCount > 0 && !saved && (
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 rounded-2xl text-lg font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0] transition-colors"
            >
              先不上传，直接返回
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
