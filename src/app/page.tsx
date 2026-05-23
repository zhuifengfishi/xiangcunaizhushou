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

interface StoryboardItem {
  time: string;
  shot: string;
  text: string;
}

interface GenerateResult {
  script: string;
  storyboard: StoryboardItem[];
  subtitles: string[];
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
  const [videoGenerating, setVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotoNames, setUploadedPhotoNames] = useState<string[]>([]);

  // 步骤进度
  const progress = step <= 4 ? ((step - 1) / 3) * 100 : 100;

  // 选择类型
  const handleSelectType = useCallback((type: TemplateType) => {
    setSelectedType(type);
  }, []);

  // 选择地方案例方向
  const handleSelectLocalDirection = useCallback((caseKey: string, direction: string) => {
    setLocalCase(caseKey);
    setLocalDirection(direction);
  }, []);

  // 填写表单
  const handleFormChange = useCallback((key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  // 处理图片上传
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

  // 删除图片
  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // 加载演示案例
  const handleLoadDemo = useCallback((demoCase: DemoCase) => {
    setSelectedType(demoCase.type);
    setLocalCase(demoCase.localCase);
    setFormData({ ...demoCase.formData });
    setStep(2);
  }, []);

  // 生成内容
  const handleGenerate = useCallback(async () => {
    if (!selectedType) return;
    setGenerating(true);
    setResult(null);
    setVideoUrl('');

    try {
      // 先上传图片
      let photoNames: string[] = [];
      if (photos.length > 0) {
        const uploadFormData = new FormData();
        photos.forEach(photo => uploadFormData.append('photos', photo));
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          photoNames = uploadData.photos;
        }
      }
      setUploadedPhotoNames(photoNames);

      // 生成内容
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

  // 生成视频
  const handleGenerateVideo = useCallback(async () => {
    if (!result) return;
    setVideoGenerating(true);

    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: uploadedPhotoNames,
          subtitles: result.subtitles,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVideoUrl(data.videoUrl);
      } else {
        alert(data.error || '视频生成失败，请重试');
      }
    } catch {
      alert('视频生成出错，请重试');
    } finally {
      setVideoGenerating(false);
    }
  }, [result, uploadedPhotoNames]);

  // 重新开始
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
    setVideoUrl('');
    setUploadedPhotoNames([]);
  }, [photoPreviews]);

  // 兼容"龙塘古镇"
  const getDisplayLabel = useCallback((caseKey: string, label: string) => {
    if (caseKey === 'longtan' && formData.location?.includes('龙塘')) {
      return '龙塘古镇（龙潭）';
    }
    return label;
  }, [formData.location]);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 顶部标题栏 */}
      <header className="sticky top-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#E8D5C4]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <h1 className="text-xl font-bold text-[#3D2B1F]">追风少年</h1>
              <span className="text-sm text-[#8B7355] hidden sm:inline">乡村短视频生成助手</span>
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
          {/* 进度条 */}
          {step <= 4 && (
            <div className="mt-2 h-2 rounded-full bg-[#E8D5C4] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C4704B] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {step <= 4 && (
            <div className="flex justify-between mt-1 text-xs text-[#8B7355]">
              <span className={step >= 1 ? 'text-[#C4704B] font-medium' : ''}>①选类型</span>
              <span className={step >= 2 ? 'text-[#C4704B] font-medium' : ''}>②填信息</span>
              <span className={step >= 3 ? 'text-[#C4704B] font-medium' : ''}>③传照片</span>
              <span className={step >= 4 ? 'text-[#C4704B] font-medium' : ''}>④生成</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* ===== 步骤1：选类型 ===== */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">你想宣传什么？</h2>
            <p className="text-[#8B7355] mb-6 text-lg">选一个大类，我们帮你搭好框架</p>

            {/* 类型选择 */}
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
                      {getDisplayLabel(lc.key, lc.label)}
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

            {/* 下一步按钮 */}
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

            {/* 照片预览区 */}
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

              {/* 添加按钮 */}
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

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />

            <p className="text-sm text-[#8B7355] mb-6 text-center">
              最多上传6张，支持 JPG、PNG 格式。不上传照片也能生成文案。
            </p>

            <div className="flex gap-3 sticky bottom-4">
              <button
                onClick={() => setStep(2)}
                className="warm-btn flex-1 py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]"
              >
                ← 上一步
              </button>
              <button
                onClick={() => setStep(4)}
                className="warm-btn flex-[2] py-4 rounded-2xl text-xl font-bold bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg"
              >
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

            {/* 信息摘要 */}
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

            <div className="flex gap-3 sticky bottom-4">
              <button
                onClick={() => setStep(3)}
                className="warm-btn flex-1 py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]"
              >
                ← 修改
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`warm-btn flex-[2] py-4 rounded-2xl text-xl font-bold transition-all ${
                  generating
                    ? 'bg-[#E8D5C4] text-[#8B7355] cursor-wait'
                    : 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg'
                }`}
              >
                {generating ? '正在生成...' : '帮我生成视频草稿'}
              </button>
            </div>
          </div>
        )}

        {/* ===== 步骤5：生成结果 ===== */}
        {step === 5 && result && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">生成好了！</h2>
            <p className="text-[#8B7355] mb-6 text-lg">以下是你的视频草稿，照着做就行</p>

            {/* 照着说 */}
            <div className="result-card mb-4 animate-fade-in-up-delay-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎤</span>
                <h3 className="text-xl font-bold text-[#3D2B1F]">照着说</h3>
                <span className="text-sm text-[#8B7355]">15秒口播脚本</span>
              </div>
              <div className="bg-[#FFF8F0] rounded-xl p-4 text-lg leading-relaxed text-[#3D2B1F]">
                {result.script}
              </div>
            </div>

            {/* 照着拍 */}
            <div className="result-card mb-4 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎬</span>
                <h3 className="text-xl font-bold text-[#3D2B1F]">照着拍</h3>
                <span className="text-sm text-[#8B7355]">每3秒拍什么</span>
              </div>
              <div className="space-y-2">
                {result.storyboard.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-[#FFF8F0] rounded-xl p-3">
                    <span className="bg-[#C4704B] text-white text-sm font-bold px-2.5 py-1 rounded-lg whitespace-nowrap">
                      {item.time}
                    </span>
                    <div>
                      <div className="text-[#3D2B1F] font-medium">{item.shot}</div>
                      <div className="text-[#8B7355] text-sm mt-0.5">配文：{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 贴字幕 */}
            <div className="result-card mb-4 animate-fade-in-up-delay-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📝</span>
                <h3 className="text-xl font-bold text-[#3D2B1F]">贴字幕</h3>
                <span className="text-sm text-[#8B7355]">可直接放进视频</span>
              </div>
              <div className="space-y-2">
                {result.subtitles.map((sub, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-[#FFF8F0] rounded-xl p-3">
                    <span className="bg-[#D4A853] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[#3D2B1F] text-lg">{sub || '（停顿）'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 直接发 */}
            <div className="result-card mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚀</span>
                <h3 className="text-xl font-bold text-[#3D2B1F]">直接发</h3>
                <span className="text-sm text-[#8B7355]">抖音/视频号/小红书文案</span>
              </div>
              <div className="bg-[#FFF8F0] rounded-xl p-4 text-lg leading-relaxed text-[#3D2B1F] mb-3">
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

            {/* 视频生成 */}
            <div className="result-card mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎥</span>
                <h3 className="text-xl font-bold text-[#3D2B1F]">生成视频草稿</h3>
              </div>
              <p className="text-[#8B7355] mb-4">
                自动把照片和字幕合成一条15秒竖屏视频，可以直接发到短视频平台
              </p>

              {!videoUrl ? (
                <button
                  onClick={handleGenerateVideo}
                  disabled={videoGenerating}
                  className={`warm-btn w-full py-4 rounded-2xl text-xl font-bold transition-all ${
                    videoGenerating
                      ? 'bg-[#E8D5C4] text-[#8B7355] cursor-wait'
                      : 'bg-[#D4A853] text-white hover:bg-[#C49843] shadow-lg'
                  }`}
                >
                  {videoGenerating ? '视频生成中，请稍等...' : '生成15秒视频'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <video
                      src={videoUrl}
                      controls
                      className="rounded-xl max-h-[400px] shadow-md"
                      style={{ aspectRatio: '9/16', maxWidth: '225px' }}
                    />
                  </div>
                  <a
                    href={videoUrl}
                    download
                    className="warm-btn block w-full py-4 rounded-2xl text-xl font-bold bg-[#6B8F71] text-white hover:bg-[#5A7E60] shadow-lg text-center"
                  >
                    下载视频草稿
                  </a>
                </div>
              )}

              {videoGenerating && (
                <div className="mt-4 text-center text-[#8B7355]">
                  <p>视频正在生成，大约需要30秒...</p>
                  <p className="text-sm mt-1">（合成照片+字幕+转场效果）</p>
                </div>
              )}
            </div>

            {/* 配音文案提示 */}
            <div className="bg-[#FFF0E0] rounded-2xl p-4 mb-6 border border-[#E8D5C4]">
              <div className="flex items-center gap-2 mb-2">
                <span>💡</span>
                <span className="font-bold text-[#6B4226]">配音文案</span>
              </div>
              <p className="text-[#6B4226]">
                当前视频只有字幕没有配音。你可以照着"照着说"的脚本，用手机录一段语音，再合成到视频里就更完美了！
              </p>
            </div>

            {/* 重新开始 */}
            <button
              onClick={handleReset}
              className="warm-btn w-full py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]"
            >
              再做一条新视频
            </button>
          </div>
        )}
      </main>

      {/* 底部 */}
      <footer className="text-center py-6 text-sm text-[#C4B5A5]">
        追风少年 · 乡村短视频生成助手 · 简单好用，人人能上手
      </footer>
    </div>
  );
}
