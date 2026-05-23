'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ========== 类型 ==========
interface ImageItem {
  id: string;
  url: string;
  label: string;
  isPreset?: boolean;
}

type CategoryKey = 'person' | 'product' | 'storefront' | 'field';

interface Category {
  key: CategoryKey;
  icon: string;
  title: string;
  desc: string;
  maxCount: number;
}

interface PresetImage {
  id: string;
  url: string;
  label: string;
}

// ========== 预设素材 ==========
const PRESET_IMAGES: Record<CategoryKey, PresetImage[]> = {
  person: [
    {
      id: 'preset-person-1',
      url: '/ref-images/person-1.jpeg',
      label: '农民老爷爷 - 正面照',
    },
  ],
  product: [
    {
      id: 'preset-product-1',
      url: '/ref-images/product-1.jpeg',
      label: '柿饼/柿子 - 晾晒实拍',
    },
    {
      id: 'preset-product-2',
      url: '/ref-images/product-2.jpeg',
      label: '黄酒 - 传统酿造',
    },
  ],
  storefront: [
    {
      id: 'preset-store-1',
      url: '/ref-images/storefront-1.jpeg',
      label: '民宿门头 - 古村老屋',
    },
    {
      id: 'preset-store-2',
      url: '/ref-images/storefront-2.jpeg',
      label: '农家饭店 - 室内环境',
    },
  ],
  field: [
    {
      id: 'preset-field-1',
      url: '/ref-images/field-1.jpeg',
      label: '梯田村庄 - 秋收风景',
    },
  ],
};

// ========== 分类配置 ==========
const CATEGORIES: Category[] = [
  { key: 'person', icon: '🧑‍🌾', title: '人物形象', desc: '你的头像、工作照、生活照，让AI生成的视频里有你', maxCount: 3 },
  { key: 'product', icon: '🍊', title: '真实产品', desc: '你要卖的东西，实拍就好', maxCount: 4 },
  { key: 'storefront', icon: '🏠', title: '门头和店内', desc: '店铺门头、室内环境、民宿房间等', maxCount: 4 },
  { key: 'field', icon: '🌾', title: '田野和村庄', desc: '果园、田地、村庄风景、街道等', maxCount: 4 },
];

export default function RefPage() {
  const router = useRouter();
  const [selectedPresets, setSelectedPresets] = useState<Record<CategoryKey, Set<string>>>({
    person: new Set<string>(),
    product: new Set<string>(),
    storefront: new Set<string>(),
    field: new Set<string>(),
  });
  const [userImages, setUserImages] = useState<Record<CategoryKey, ImageItem[]>>({
    person: [],
    product: [],
    storefront: [],
    field: [],
  });
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
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
        const parsed = JSON.parse(savedData);
        if (parsed._selectedPresets) {
          const restored: Record<CategoryKey, Set<string>> = {
            person: new Set(parsed._selectedPresets.person || []),
            product: new Set(parsed._selectedPresets.product || []),
            storefront: new Set(parsed._selectedPresets.storefront || []),
            field: new Set(parsed._selectedPresets.field || []),
          };
          setSelectedPresets(restored);
        }
        if (parsed._userImages) {
          setUserImages(parsed._userImages);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // 切换预设图片选中
  const togglePreset = (category: CategoryKey, presetId: string) => {
    setSelectedPresets(prev => {
      const newSet = new Set(prev[category]);
      if (newSet.has(presetId)) {
        newSet.delete(presetId);
      } else {
        newSet.add(presetId);
      }
      return { ...prev, [category]: newSet };
    });
  };

  // 全选/取消该分类所有预设
  const toggleAllPresets = (category: CategoryKey) => {
    const allIds = PRESET_IMAGES[category].map(p => p.id);
    const currentSelected = selectedPresets[category];
    const allSelected = allIds.every(id => currentSelected.has(id));

    setSelectedPresets(prev => ({
      ...prev,
      [category]: allSelected ? new Set<string>() : new Set(allIds),
    }));
  };

  // 处理用户上传图片
  const handleUpload = (category: CategoryKey, files: FileList | null) => {
    if (!files) return;
    const cat = CATEGORIES.find(c => c.key === category)!;
    const currentTotal = selectedPresets[category].size + userImages[category].length;
    const remaining = cat.maxCount - currentTotal;
    if (remaining <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remaining);
    const newItems: ImageItem[] = filesToProcess.map(file => ({
      id: `${category}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: URL.createObjectURL(file),
      label: file.name,
    }));

    setUserImages(prev => ({
      ...prev,
      [category]: [...prev[category], ...newItems],
    }));
  };

  // 删除用户上传的图片
  const handleRemoveUserImage = (category: CategoryKey, id: string) => {
    setUserImages(prev => ({
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
  const totalCount = Object.entries(selectedPresets).reduce((sum, [key, set]) => {
    return sum + set.size + userImages[key as CategoryKey].length;
  }, 0);

  // 获取某个分类的已选总数
  const getCategoryCount = (key: CategoryKey) => selectedPresets[key].size + userImages[key].length;

  // 保存并返回
  const handleSave = () => {
    try {
      const saveData = {
        _selectedPresets: {
          person: Array.from(selectedPresets.person),
          product: Array.from(selectedPresets.product),
          storefront: Array.from(selectedPresets.storefront),
          field: Array.from(selectedPresets.field),
        },
        _userImages: userImages,
        _savedAt: new Date().toISOString(),
        _totalCount: totalCount,
      };
      localStorage.setItem('refImages', JSON.stringify(saveData));
      setSaved(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch {
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
          <h1 className="text-lg font-bold text-[#3D2B1F] flex-1 text-center">选参考图</h1>
          <span className="text-sm font-bold text-[#C4704B]">{totalCount}张已选</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 说明 */}
        <div className="bg-[#FFF0E0] rounded-2xl p-5 border border-[#E8D5C4] mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📸</span>
            <span className="text-xl font-bold text-[#3D2B1F]">选几张照片，AI照着你的来</span>
          </div>
          <p className="text-[#6B4226] text-base leading-relaxed">
            下面已经帮你准备好了一些样图，直接勾选就能用。<br/>
            也可以上传你自己的照片替换，手机里已有的就行。
          </p>
        </div>

        {/* 四个分类区 */}
        <div className="space-y-5">
          {CATEGORIES.map(cat => {
            const presets = PRESET_IMAGES[cat.key];
            const allSelected = presets.length > 0 && presets.every(p => selectedPresets[cat.key].has(p.id));
            const currentCount = getCategoryCount(cat.key);

            return (
              <div key={cat.key} className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden">
                {/* 分类标题 */}
                <div className="flex items-center justify-between p-5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-[#3D2B1F]">{cat.title}</h3>
                      <p className="text-sm text-[#8B7355]">{cat.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#C4704B]">{currentCount}/{cat.maxCount}</span>
                </div>

                {/* 预设样图 */}
                {presets.length > 0 && (
                  <div className="px-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-[#6B4226] bg-[#FFF0E0] px-3 py-1 rounded-full">
                        示例样图（可直接勾选）
                      </span>
                      {presets.length > 1 && (
                        <button
                          onClick={() => toggleAllPresets(cat.key)}
                          className="text-sm font-bold text-[#C4704B] hover:underline"
                        >
                          {allSelected ? '取消全选' : '全选'}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {presets.map(preset => {
                        const isSelected = selectedPresets[cat.key].has(preset.id);
                        const loaded = imageLoaded[preset.id];
                        return (
                          <button
                            key={preset.id}
                            onClick={() => togglePreset(cat.key, preset.id)}
                            className={`relative rounded-xl overflow-hidden border-3 transition-all active:scale-[0.97] ${
                              isSelected
                                ? 'border-[#C4704B] ring-2 ring-[#C4704B]/30 shadow-md'
                                : 'border-[#E8D5C4] hover:border-[#D4A853]'
                            }`}
                            style={{ width: '110px', height: '110px' }}
                          >
                            {!loaded && (
                              <div className="absolute inset-0 bg-[#F5EDE4] flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-[#E8D5C4] border-t-[#C4704B] rounded-full animate-spin" />
                              </div>
                            )}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                              onLoad={() => setImageLoaded(prev => ({ ...prev, [preset.id]: true }))}
                            />
                            {/* 选中标记 */}
                            <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all text-sm font-bold ${
                              isSelected
                                ? 'bg-[#C4704B] text-white shadow-md'
                                : 'bg-white/80 text-[#8B7355] border border-[#E8D5C4]'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </div>
                            {/* 标签 */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                              <span className="text-white text-xs font-bold leading-tight block">{preset.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 用户上传的图片 */}
                {userImages[cat.key].length > 0 && (
                  <div className="px-5 pb-3">
                    <span className="text-sm font-bold text-[#6B8F71] mb-2 block">你上传的</span>
                    <div className="flex flex-wrap gap-3">
                      {userImages[cat.key].map(img => (
                        <div key={img.id} className="relative" style={{ width: '110px', height: '110px' }}>
                          <div className="w-full h-full rounded-xl overflow-hidden border-2 border-[#6B8F71]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveUserImage(cat.key, img.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 上传按钮 */}
                {currentCount < cat.maxCount ? (
                  <div className="px-5 pb-5">
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
                      + 上传你自己的照片（还可传{cat.maxCount - currentCount}张）
                    </button>
                  </div>
                ) : (
                  <div className="px-5 pb-5">
                    <p className="text-center text-sm text-[#6B8F71] font-bold py-2">
                      ✓ 已选满{cat.maxCount}张
                    </p>
                  </div>
                )}
              </div>
            );
          })}
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
            className={`w-full py-5 rounded-2xl text-xl font-bold transition-all ${
              saved
                ? 'bg-[#6B8F71] text-white shadow-lg'
                : totalCount > 0
                  ? 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg active:scale-[0.97]'
                  : 'bg-[#C4704B]/80 text-white hover:bg-[#C4704B] shadow-lg active:scale-[0.97]'
            }`}
          >
            {saved ? '已保存，正在返回...' : totalCount > 0 ? `确认选好${totalCount}张，返回生成` : '直接确认，返回生成'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl text-lg font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0] transition-colors"
          >
            先不选，直接返回
          </button>
        </div>
      </main>
    </div>
  );
}
