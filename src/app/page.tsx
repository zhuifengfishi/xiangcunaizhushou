'use client';

import { useState, useCallback, useRef } from 'react';

// ========== 类型定义 ==========
type TemplateType = 'rural-goods' | 'homestay' | 'rural-food' | 'craft' | 'village-event';

interface FormData {
  name: string;
  highlights: string;
  price: string;
  location: string;
  contact: string;
  slogan: string;
}

interface VideoScenePrompt {
  segment: number;
  timeRange: string;
  prompt: string;
  promptCN: string;
  subtitle: string;
}

interface PosterPrompt {
  prompt: string;
  promptCN: string;
  style: string;
  aspectRatio: string;
}

interface GenerateResult {
  videoPrompts: VideoScenePrompt[];
  posterPrompt: PosterPrompt;
  publishCopy: string;
  tags: string[];
}

interface DemoCase {
  id: string;
  title: string;
  type: TemplateType;
  localCase: string;
  formData: FormData;
}

// ========== 常量配置 ==========
const TYPE_OPTIONS: { type: TemplateType; label: string; icon: string; desc: string }[] = [
  { type: 'rural-goods', label: '卖农货', icon: '🍊', desc: '水果、茶叶、蜂蜜、腊味...' },
  { type: 'homestay', label: '推民宿', icon: '🏡', desc: '民宿、古村、露营、避暑...' },
  { type: 'rural-food', label: '发饭店', icon: '🍲', desc: '农家菜、土灶饭、小吃...' },
  { type: 'craft', label: '秀手艺', icon: '🎭', desc: '戏曲、酿造、木作、编织...' },
  { type: 'village-event', label: '宣传村子', icon: '🎊', desc: '丰收节、市集、民俗表演...' },
];

const LOCAL_CASES: { key: string; label: string; aliases?: string[]; directions: { label: string; type: TemplateType }[] }[] = [
  {
    key: 'pingnan', label: '屏南县',
    directions: [
      { label: '屏南周末游', type: 'homestay' },
      { label: '白水洋/鸳鸯溪 + 古村路线', type: 'homestay' },
      { label: '屏南乡村好物', type: 'rural-goods' },
      { label: '屏南非遗一分钟', type: 'craft' },
      { label: '屏南避暑康养', type: 'village-event' },
    ],
  },
  {
    key: 'xiling', label: '熙岭乡',
    directions: [
      { label: '熙岭乡一日慢游', type: 'homestay' },
      { label: '古村民宿合集', type: 'homestay' },
      { label: '乡村餐饮地图', type: 'rural-food' },
      { label: '新村民/主理人故事', type: 'craft' },
      { label: '村级文旅活动宣传', type: 'village-event' },
    ],
  },
  {
    key: 'siping', label: '四坪村',
    directions: [
      { label: '四坪柿子/柿饼宣传', type: 'rural-goods' },
      { label: '四坪慢生活', type: 'homestay' },
      { label: '亲子研学', type: 'village-event' },
      { label: '天文馆/大食物馆', type: 'village-event' },
      { label: '民宿、咖啡、文创店宣传', type: 'homestay' },
    ],
  },
  {
    key: 'longtan', label: '龙潭古镇', aliases: ['龙塘古镇'],
    directions: [
      { label: '龙潭古镇夜游', type: 'village-event' },
      { label: '石板街打卡路线', type: 'homestay' },
      { label: '黄酒故事', type: 'craft' },
      { label: '四平戏/非遗体验', type: 'craft' },
      { label: '古镇民宿住一晚', type: 'homestay' },
      { label: '古镇餐饮推荐', type: 'rural-food' },
    ],
  },
];

const DEMO_CASES: DemoCase[] = [
  {
    id: 'case1', title: '四坪村柿子', type: 'rural-goods', localCase: 'siping',
    formData: {
      name: '四坪村老柿饼',
      highlights: '老村古树上结的柿子，自然晾晒，不添加任何东西，甜糯软香，适合当伴手礼送人',
      price: '一盒6个装 58元，包邮',
      location: '福建省宁德市屏南县熙岭乡四坪村',
      contact: '微信：siping2024 / 电话：138XXXX1234',
      slogan: '尝一口四坪的秋天，把老村的味道带回家',
    },
  },
  {
    id: 'case2', title: '龙潭古镇民宿', type: 'homestay', localCase: 'longtan',
    formData: {
      name: '龙潭溪边小院',
      highlights: '石板街旁边的老屋民宿，推窗就能看到溪水，晚上能听到水声，适合周末来发呆',
      price: '平日 268元/晚，周末 358元/晚，含早餐',
      location: '福建省宁德市屏南县龙潭古镇',
      contact: '微信：longtan_inn / 电话：159XXXX5678',
      slogan: '来龙潭住一晚，听溪水讲故事',
    },
  },
  {
    id: 'case3', title: '熙岭乡农家饭', type: 'rural-food', localCase: 'xiling',
    formData: {
      name: '熙岭阿婆土灶饭',
      highlights: '柴火灶烧的饭，自家菜地里现摘的菜，土鸡土鸭都是散养的，10个人一桌也够吃',
      price: '人均 60-80元，10人桌餐 600元起，需提前一天预订',
      location: '福建省宁德市屏南县熙岭乡',
      contact: '微信：xilingfood / 电话：137XXXX9012',
      slogan: '城里吃不到的柴火香，来熙岭找阿婆',
    },
  },
];

const FORM_FIELDS: { key: keyof FormData; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'name', label: '这个东西叫什么？', placeholder: '比如：四坪村老柿饼、龙潭溪边民宿' },
  { key: 'highlights', label: '它好在哪里？', placeholder: '比如：自然晾晒、不添加、甜糯软香、适合伴手礼', multiline: true },
  { key: 'price', label: '多少钱 / 怎么预约？', placeholder: '比如：一盒6个装58元包邮 / 平日268元/晚' },
  { key: 'location', label: '在哪里？', placeholder: '比如：福建省宁德市屏南县熙岭乡四坪村' },
  { key: 'contact', label: '怎么联系你？', placeholder: '比如：微信：xxx / 电话：1XXXXXX1234' },
  { key: 'slogan', label: '有没有一句最想说的话？', placeholder: '比如：尝一口四坪的秋天，把老村的味道带回家' },
];

const emptyFormData: FormData = { name: '', highlights: '', price: '', location: '', contact: '', slogan: '' };

// ========== 复制按钮组件 ==========
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`warm-btn text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
        copied
          ? 'bg-[#6B8F71] text-white'
          : 'bg-[#FFF0E0] text-[#C4704B] hover:bg-[#C4704B] hover:text-white'
      }`}
    >
      {copied ? '已复制 ✓' : '复制提示词'}
    </button>
  );
}

// ========== 主组件 ==========
export default function HomePage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<TemplateType | null>(null);
  const [localCase, setLocalCase] = useState<string>('');
  const [localDirection, setLocalDirection] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({ ...emptyFormData });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [resultTab, setResultTab] = useState<'video' | 'poster' | 'publish'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progress = step <= 4 ? ((step - 1) / 3) * 100 : 100;

  const handleSelectType = useCallback((type: TemplateType) => setSelectedType(type), []);

  const handleSelectLocalDirection = useCallback((caseKey: string, direction: string) => {
    setLocalCase(caseKey);
    setLocalDirection(direction);
  }, []);

  const handleFormChange = useCallback((key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    for (let i = 0; i < files.length && newPhotos.length < 6; i++) {
      newPhotos.push(files[i]);
      newPreviews.push(URL.createObjectURL(files[i]));
    }
    setPhotos(newPhotos.slice(0, 6));
    setPhotoPreviews(newPreviews.slice(0, 6));
  }, [photos, photoPreviews]);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleLoadDemo = useCallback((demoCase: DemoCase) => {
    setSelectedType(demoCase.type);
    setLocalCase(demoCase.localCase);
    setFormData({ ...demoCase.formData });
    setStep(2);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedType) return;
    setGenerating(true);
    setResult(null);
    setResultTab('video');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          formData,
          photoCount: photos.length,
          localCase,
          localDirection,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setStep(5);
      } else {
        alert(data.error || '生成失败，请重试');
      }
    } catch {
      alert('网络出错，请重试');
    } finally {
      setGenerating(false);
    }
  }, [selectedType, formData, photos, localCase, localDirection]);

  const handleReset = useCallback(() => {
    setStep(1);
    setSelectedType(null);
    setLocalCase('');
    setLocalDirection('');
    setFormData({ ...emptyFormData });
    setPhotos([]);
    photoPreviews.forEach(p => URL.revokeObjectURL(p));
    setPhotoPreviews([]);
    setResult(null);
    setResultTab('video');
  }, [photoPreviews]);

  // 拼接完整视频提示词文本（用于一键复制）
  const fullVideoPromptText = result
    ? result.videoPrompts.map(s =>
        `【第${s.segment}段 ${s.timeRange}】\n中文说明：${s.promptCN}\nAI提示词：${s.prompt}\n配字幕：${s.subtitle}`
      ).join('\n\n')
    : '';

  // 海报提示词文本
  const fullPosterPromptText = result
    ? `宣传海报AI提示词：\n${result.posterPrompt.prompt}\n\n中文说明：${result.posterPrompt.promptCN}\n推荐风格：${result.posterPrompt.style}\n推荐比例：${result.posterPrompt.aspectRatio}`
    : '';

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 顶部标题栏 */}
      <header className="sticky top-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#E8D5C4]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <h1 className="text-xl font-bold text-[#3D2B1F]">乡村宣传AI助手</h1>
            </div>
            {step > 1 && step <= 5 && (
              <button
                onClick={handleReset}
                className="warm-btn text-sm text-[#C4704B] hover:text-[#A85A38] font-medium px-3 py-1.5 rounded-lg hover:bg-[#FFF0E0]"
              >
                重新开始
              </button>
            )}
          </div>
          {step <= 4 && (
            <>
              <div className="mt-2 h-2 rounded-full bg-[#E8D5C4] overflow-hidden">
                <div className="h-full rounded-full bg-[#C4704B] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-xs text-[#8B7355]">
                <span className={step >= 1 ? 'text-[#C4704B] font-medium' : ''}>①选类型</span>
                <span className={step >= 2 ? 'text-[#C4704B] font-medium' : ''}>②填信息</span>
                <span className={step >= 3 ? 'text-[#C4704B] font-medium' : ''}>③传照片</span>
                <span className={step >= 4 ? 'text-[#C4704B] font-medium' : ''}>④生成</span>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* ===== 步骤1：选类型 ===== */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">你想宣传什么？</h2>
            <p className="text-[#8B7355] mb-6 text-lg">选一个大类，我们帮你搭好框架</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.type}
                  onClick={() => handleSelectType(opt.type)}
                  className={`type-card ${selectedType === opt.type ? 'selected' : ''}`}
                >
                  <div className="text-4xl mb-2">{opt.icon}</div>
                  <div className="text-lg font-bold text-[#3D2B1F]">{opt.label}</div>
                  <div className="text-sm text-[#8B7355] mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* 地方案例 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#3D2B1F] mb-2 flex items-center gap-2">
                <span>📍</span> 地方案例
              </h3>
              <p className="text-[#8B7355] mb-4">选择一个地方，看看推荐的视频方向</p>
              <div className="space-y-4">
                {LOCAL_CASES.map(lc => (
                  <div key={lc.key} className="bg-white rounded-2xl border border-[#E8D5C4] p-4">
                    <div className="font-bold text-[#3D2B1F] text-lg mb-3">
                      {lc.label}
                      {lc.aliases && <span className="text-sm text-[#8B7355] font-normal ml-2">（输入"{lc.aliases[0]}"也行）</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lc.directions.map(dir => (
                        <button
                          key={dir.label}
                          onClick={() => handleSelectLocalDirection(lc.key, dir.label)}
                          className={`warm-btn text-sm px-4 py-2 rounded-full border transition-all ${
                            localCase === lc.key && localDirection === dir.label
                              ? 'bg-[#C4704B] text-white border-[#C4704B]'
                              : 'bg-[#FFF0E0] text-[#6B4226] border-[#E8D5C4] hover:border-[#C4704B]'
                          }`}
                        >
                          {dir.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 演示案例 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#3D2B1F] mb-2 flex items-center gap-2">
                <span>🎯</span> 试试演示案例
              </h3>
              <p className="text-[#8B7355] mb-4">点击一下，自动填好表单，马上看效果</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_CASES.map(dc => (
                  <button
                    key={dc.id}
                    onClick={() => handleLoadDemo(dc)}
                    className="warm-btn bg-white border-2 border-[#E8D5C4] rounded-xl p-4 text-left hover:border-[#C4704B] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="demo-tag">演示</span>
                      <span className="font-bold text-[#3D2B1F]">{dc.title}</span>
                    </div>
                    <div className="text-sm text-[#8B7355]">{dc.formData.slogan}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky bottom-4">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedType}
                className={`warm-btn w-full py-4 rounded-2xl text-xl font-bold transition-all ${
                  selectedType
                    ? 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg'
                    : 'bg-[#E8D5C4] text-[#8B7355] cursor-not-allowed'
                }`}
              >
                选好了，下一步 →
              </button>
            </div>
          </div>
        )}

        {/* ===== 步骤2：填信息 ===== */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">填几句实话</h2>
            <p className="text-[#8B7355] mb-6 text-lg">就像跟邻居聊天一样，有啥说啥</p>

            <div className="space-y-5">
              {FORM_FIELDS.map(field => (
                <div key={field.key}>
                  <label className="block text-lg font-bold text-[#3D2B1F] mb-2">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={formData[field.key]}
                      onChange={e => handleFormChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="village-input w-full resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[field.key]}
                      onChange={e => handleFormChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="village-input w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8 sticky bottom-4">
              <button
                onClick={() => setStep(1)}
                className="warm-btn flex-1 py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]"
              >
                ← 上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.name}
                className={`warm-btn flex-[2] py-4 rounded-2xl text-xl font-bold transition-all ${
                  formData.name
                    ? 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg'
                    : 'bg-[#E8D5C4] text-[#8B7355] cursor-not-allowed'
                }`}
              >
                填好了，下一步 →
              </button>
            </div>
          </div>
        )}

        {/* ===== 步骤3：传照片 ===== */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">传几张照片</h2>
            <p className="text-[#8B7355] mb-6 text-lg">手机里已有的照片就可以，不要求会拍大片</p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {photoPreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#E8D5C4]">
                  <img src={preview} alt={`照片${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] rounded-xl border-2 border-dashed border-[#D4A853] bg-[#FFF8F0] flex flex-col items-center justify-center gap-2 hover:border-[#C4704B] hover:bg-[#FFF0E0] transition-all"
                >
                  <span className="text-3xl text-[#D4A853]">+</span>
                  <span className="text-sm text-[#8B7355]">添加照片</span>
                  <span className="text-xs text-[#C4B5A5]">({photos.length}/6)</span>
                </button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />

            <p className="text-sm text-[#8B7355] mb-6 text-center">
              最多上传6张，支持 JPG、PNG 格式。不上传照片也能生成提示词。
            </p>

            <div className="flex gap-3 sticky bottom-4">
              <button onClick={() => setStep(2)} className="warm-btn flex-1 py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]">
                ← 上一步
              </button>
              <button onClick={() => setStep(4)} className="warm-btn flex-[2] py-4 rounded-2xl text-xl font-bold bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg">
                照片选好了，下一步 →
              </button>
            </div>
          </div>
        )}

        {/* ===== 步骤4：确认生成 ===== */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">检查一下，然后生成</h2>
            <p className="text-[#8B7355] mb-6 text-lg">确认信息没问题，点下面大按钮就行</p>

            <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5 mb-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#8B7355]">类型：</span>
                <span className="font-bold text-[#3D2B1F]">
                  {TYPE_OPTIONS.find(t => t.type === selectedType)?.icon}{' '}
                  {TYPE_OPTIONS.find(t => t.type === selectedType)?.label}
                </span>
                {localCase && localDirection && (
                  <span className="text-sm bg-[#FFF0E0] text-[#C4704B] px-2 py-0.5 rounded-full">
                    {LOCAL_CASES.find(lc => lc.key === localCase)?.label}·{localDirection}
                  </span>
                )}
              </div>
              {FORM_FIELDS.map(field => formData[field.key] ? (
                <div key={field.key}>
                  <span className="text-sm font-bold text-[#8B7355]">{field.label}</span>
                  <p className="text-[#3D2B1F]">{formData[field.key]}</p>
                </div>
              ) : null)}
              <div>
                <span className="text-sm font-bold text-[#8B7355]">照片：</span>
                <span className="text-[#3D2B1F]">{photos.length} 张</span>
              </div>
            </div>

            {/* 生成说明 */}
            <div className="bg-[#FFF0E0] rounded-2xl p-4 mb-6 border border-[#E8D5C4]">
              <div className="font-bold text-[#6B4226] mb-2">生成后会给你两版提示词：</div>
              <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-xl p-3 border border-[#E8D5C4]">
                  <div className="text-lg mb-1">🎬</div>
                  <div className="font-bold text-[#3D2B1F] text-sm">AI短视频分镜提示词</div>
                  <div className="text-xs text-[#8B7355]">5段场景，直接粘贴到Sora、可灵等</div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 border border-[#E8D5C4]">
                  <div className="text-lg mb-1">🖼️</div>
                  <div className="font-bold text-[#3D2B1F] text-sm">宣传海报图片提示词</div>
                  <div className="text-xs text-[#8B7355]">直接粘贴到Midjourney、DALL-E等</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 sticky bottom-4">
              <button onClick={() => setStep(3)} className="warm-btn flex-1 py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]">
                ← 修改
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`warm-btn flex-[2] py-4 rounded-2xl text-xl font-bold transition-all ${
                  generating ? 'bg-[#E8D5C4] text-[#8B7355] cursor-wait' : 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg'
                }`}
              >
                {generating ? '正在生成...' : '帮我生成提示词'}
              </button>
            </div>
          </div>
        )}

        {/* ===== 步骤5：生成结果 ===== */}
        {step === 5 && result && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">提示词生成好了！</h2>
            <p className="text-[#8B7355] mb-6 text-lg">复制下面的提示词，粘贴到AI工具里就能用</p>

            {/* 三个Tab切换 */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setResultTab('video')}
                className={`warm-btn flex-1 py-3 rounded-xl text-lg font-bold transition-all ${
                  resultTab === 'video' ? 'bg-[#C4704B] text-white shadow-md' : 'bg-white text-[#6B4226] border border-[#E8D5C4]'
                }`}
              >
                🎬 AI短视频分镜
              </button>
              <button
                onClick={() => setResultTab('poster')}
                className={`warm-btn flex-1 py-3 rounded-xl text-lg font-bold transition-all ${
                  resultTab === 'poster' ? 'bg-[#C4704B] text-white shadow-md' : 'bg-white text-[#6B4226] border border-[#E8D5C4]'
                }`}
              >
                🖼️ 宣传海报
              </button>
              <button
                onClick={() => setResultTab('publish')}
                className={`warm-btn flex-1 py-3 rounded-xl text-lg font-bold transition-all ${
                  resultTab === 'publish' ? 'bg-[#C4704B] text-white shadow-md' : 'bg-white text-[#6B4226] border border-[#E8D5C4]'
                }`}
              >
                🚀 发布文案
              </button>
            </div>

            {/* ===== AI短视频分镜提示词 ===== */}
            {resultTab === 'video' && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#3D2B1F]">AI短视频分镜提示词</h3>
                    <p className="text-sm text-[#8B7355]">5段场景，每段3秒，可直接粘贴到Sora、可灵、Runway等</p>
                  </div>
                  <CopyButton text={fullVideoPromptText} />
                </div>

                <div className="space-y-4">
                  {result.videoPrompts.map((scene) => (
                    <div key={scene.segment} className="result-card">
                      {/* 段落标题 */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-[#C4704B] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {scene.segment}
                        </span>
                        <span className="font-bold text-[#3D2B1F] text-lg">{scene.timeRange}</span>
                        <span className="text-sm text-[#8B7355]">配字幕：{scene.subtitle}</span>
                      </div>
                      {/* 中文说明 */}
                      <div className="bg-[#FFF8F0] rounded-xl p-3 mb-3">
                        <span className="text-xs font-bold text-[#8B7355]">中文说明</span>
                        <p className="text-[#3D2B1F] mt-1">{scene.promptCN}</p>
                      </div>
                      {/* AI提示词 */}
                      <div className="bg-[#1a1a2e] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#D4A853]">AI PROMPT（复制这段）</span>
                          <CopyButton text={scene.prompt} />
                        </div>
                        <p className="text-[#e0e0e0] text-sm leading-relaxed font-mono">{scene.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== 宣传海报图片提示词 ===== */}
            {resultTab === 'poster' && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#3D2B1F]">宣传海报图片提示词</h3>
                    <p className="text-sm text-[#8B7355]">可直接粘贴到Midjourney、DALL-E、Stable Diffusion等</p>
                  </div>
                  <CopyButton text={fullPosterPromptText} />
                </div>

                <div className="result-card">
                  {/* 海报参数信息 */}
                  <div className="flex gap-3 mb-4">
                    <div className="bg-[#FFF0E0] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#8B7355]">风格</span>
                      <p className="text-sm font-bold text-[#6B4226]">{result.posterPrompt.style}</p>
                    </div>
                    <div className="bg-[#FFF0E0] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#8B7355]">比例</span>
                      <p className="text-sm font-bold text-[#6B4226]">{result.posterPrompt.aspectRatio}</p>
                    </div>
                  </div>

                  {/* 中文说明 */}
                  <div className="bg-[#FFF8F0] rounded-xl p-4 mb-4">
                    <span className="text-xs font-bold text-[#8B7355]">中文说明</span>
                    <p className="text-[#3D2B1F] mt-1 text-lg leading-relaxed">{result.posterPrompt.promptCN}</p>
                  </div>

                  {/* AI提示词 */}
                  <div className="bg-[#1a1a2e] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D4A853]">AI PROMPT（复制这段）</span>
                      <CopyButton text={result.posterPrompt.prompt} />
                    </div>
                    <p className="text-[#e0e0e0] text-sm leading-relaxed font-mono">{result.posterPrompt.prompt}</p>
                  </div>
                </div>

                {/* 使用提示 */}
                <div className="mt-4 bg-[#FFF0E0] rounded-2xl p-4 border border-[#E8D5C4]">
                  <div className="flex items-center gap-2 mb-2">
                    <span>💡</span>
                    <span className="font-bold text-[#6B4226]">使用技巧</span>
                  </div>
                  <ul className="text-[#6B4226] text-sm space-y-1">
                    <li>• Midjourney：直接粘贴，末尾加 --ar 3:4 --v 6</li>
                    <li>• DALL-E：直接粘贴到ChatGPT图片生成</li>
                    <li>• Stable Diffusion：可作为正向提示词，建议配合权重调整</li>
                    <li>• 提示词中的英文引号内容会被AI理解为文字标签</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ===== 发布文案 ===== */}
            {resultTab === 'publish' && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#3D2B1F]">发布文案</h3>
                    <p className="text-sm text-[#8B7355]">抖音、视频号、小红书都可以直接发</p>
                  </div>
                  <CopyButton text={`${result.publishCopy}\n\n${result.tags.join(' ')}`} />
                </div>

                <div className="result-card">
                  <div className="bg-[#FFF8F0] rounded-xl p-4 text-lg leading-relaxed text-[#3D2B1F] mb-4">
                    {result.publishCopy}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#6B8F71]/10 text-[#6B8F71] px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 重新开始 */}
            <button
              onClick={handleReset}
              className="warm-btn w-full py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0] mt-8"
            >
              再做一条新的
            </button>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-[#C4B5A5]">
        乡村宣传AI助手 · 简单好用，人人能上手
      </footer>
    </div>
  );
}
