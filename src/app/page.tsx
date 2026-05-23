'use client';

import { useState, useCallback, useRef } from 'react';

// ========== 类型定义 ==========
type TemplateType = 'rural-goods' | 'homestay' | 'rural-food' | 'craft' | 'village-event';

interface FormData {
  q1: string;
  q2: string;
  q3: string;
}

interface PosterStyleOption {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

interface PublishStyleOption {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

interface GenerateResult {
  videoPrompt: string;
  videoPromptPrivate: string;
  posterStyles: PosterStyleOption[];
  posterPrompts: Record<string, { prompt: string; promptPrivate: string; aspectRatio: string }>;
  publishStyles: PublishStyleOption[];
  publishCopies: Record<string, { copy: string; copyPrivate: string; tags: string[] }>;
}

interface DemoCase {
  id: string;
  title: string;
  type: TemplateType;
  localCase: string;
  formData: FormData;
}

// ========== 常量 ==========
const TYPE_OPTIONS: { type: TemplateType; icon: string; label: string; desc: string }[] = [
  { type: 'rural-goods', icon: '🍊', label: '卖农货', desc: '水果、茶叶、蜂蜜、干货等' },
  { type: 'homestay', icon: '🏡', label: '推民宿', desc: '民宿、古村、露营、避暑' },
  { type: 'rural-food', icon: '🍲', label: '发饭店', desc: '农家菜、土灶饭、小吃、宴席' },
  { type: 'craft', icon: '🎭', label: '秀手艺', desc: '戏曲、酿造、木作、编织等' },
  { type: 'village-event', icon: '🎉', label: '宣传村子', desc: '丰收节、市集、音乐节、活动' },
];

const LOCAL_CASES = [
  {
    key: 'pingnan', label: '屏南县',
    directions: [
      { label: '屏南周末游', type: 'homestay' as TemplateType, formData: { q1: '屏南周末两日游，福建省宁德市屏南县', q2: '白水洋玩水+古村漫步+民宿体验，适合全家出行放松，人均300-500元含住宿和门票', q3: '微信：pingnan_travel / 电话：0593-XXXX888，周末就来屏南，山水之间过两天慢日子' } },
      { label: '白水洋/鸳鸯溪 + 古村路线', type: 'homestay' as TemplateType, formData: { q1: '白水洋鸳鸯溪古村路线，福建省宁德市屏南县双溪镇', q2: '白水洋踩水玩石+鸳鸯溪看鸟+周边古村落打卡，一条路线玩透屏南，白水洋门票120元鸳鸯溪80元古村免费', q3: '微信：bsy_guide / 电话：0593-XXXX666，踩过白水洋的石头，才算来过屏南' } },
      { label: '屏南乡村好物', type: 'rural-goods' as TemplateType, formData: { q1: '屏南乡村好物合集，福建省宁德市屏南县各乡镇', q2: '屏南老酒、米烧兔、秋菇干、笋干，都是山里土法做的外面买不到，伴手礼盒88-168元可快递', q3: '微信：pn_goods / 电话：138XXXX2345，屏南的山味，每一样都值得带回家' } },
      { label: '屏南非遗一分钟', type: 'craft' as TemplateType, formData: { q1: '屏南非遗一分钟，福建省宁德市屏南县', q2: '四平戏、木拱廊桥营造技艺、屏南老酒酿造，三项国家级非遗一分钟看完，免费参观体验课50-100元/人', q3: '微信：pn_heritage / 电话：0593-XXXX999，屏南的老手艺，每一分钟都是百年' } },
      { label: '屏南避暑康养', type: 'village-event' as TemplateType, formData: { q1: '屏南避暑康养之旅，福建省宁德市屏南县寿山乡', q2: '夏天22度的屏南，古村落里住几天，空气好水好，适合老人避暑养生，住宿150-300元/晚含早餐和药膳', q3: '微信：pn_kangyang / 电话：0593-XXXX777，22度的夏天，在屏南过一段好日子' } },
    ],
  },
  {
    key: 'xiling', label: '熙岭乡',
    directions: [
      { label: '熙岭乡一日慢游', type: 'homestay' as TemplateType, formData: { q1: '熙岭乡一日慢游，福建省宁德市屏南县熙岭乡', q2: '早上逛古村，中午吃土灶饭，下午泡茶发呆，傍晚看日落，一天就够了，人均150-200元含午餐', q3: '微信：xiling_tour / 电话：138XXXX3456，来熙岭，把日子过慢一点' } },
      { label: '古村民宿合集', type: 'homestay' as TemplateType, formData: { q1: '熙岭古村民宿，福建省宁德市屏南县熙岭乡', q2: '老房子改的民宿，石头墙木窗户，推门就是山，适合想远离城市的人，平日180-280元/晚周末280-380元/晚', q3: '微信：xiling_stay / 电话：159XXXX7890，在熙岭的石头屋里，睡一个好觉' } },
      { label: '乡村餐饮地图', type: 'rural-food' as TemplateType, formData: { q1: '熙岭乡乡村餐饮地图，福建省宁德市屏南县熙岭乡', q2: '阿婆的土灶饭、溪边的烧烤、自酿米酒配农家菜，跟着地图吃不踩雷，人均50-80元量大实在', q3: '微信：xiling_food / 电话：138XXXX4567，在熙岭，每一顿饭都是家宴' } },
      { label: '新村民/主理人故事', type: 'craft' as TemplateType, formData: { q1: '熙岭新村民故事，福建省宁德市屏南县熙岭乡', q2: '从城里来的人，在熙岭开民宿、做文创、种茶叶，他们为什么留下来的，免费观看', q3: '微信：xiling_story / 电话：0593-XXXX555，他们选择了熙岭，你也来看看' } },
      { label: '村级文旅活动宣传', type: 'village-event' as TemplateType, formData: { q1: '熙岭乡村文旅活动，福建省宁德市屏南县熙岭乡', q2: '春季采茶节、夏季纳凉会、秋季丰收宴、冬季年味市集，四季都有活动，大部分活动免费参加', q3: '微信：xiling_event / 电话：0593-XXXX444，熙岭四季有活动，随时来都赶趟' } },
    ],
  },
  {
    key: 'siping', label: '四坪村',
    directions: [
      { label: '四坪柿子/柿饼宣传', type: 'rural-goods' as TemplateType, formData: { q1: '四坪村老柿饼，福建省宁德市屏南县熙岭乡四坪村', q2: '老村古树上结的柿子，自然晾晒不添加任何东西，甜糯软香适合当伴手礼送人，一盒6个装58元两盒100元可快递', q3: '微信：siping2024 / 电话：138XXXX1234，尝一口四坪的秋天，把老村的味道带回家' } },
      { label: '四坪慢生活', type: 'homestay' as TemplateType, formData: { q1: '四坪慢生活体验，福建省宁德市屏南县熙岭乡四坪村', q2: '没有汽车的村庄，走路就能逛完，晒太阳、发呆、喝山泉水泡的茶，民宿120-200元/晚含早餐', q3: '微信：siping_life / 电话：159XXXX5678，来四坪，过一天没有闹钟的日子' } },
      { label: '亲子研学', type: 'village-event' as TemplateType, formData: { q1: '四坪村亲子研学营，福建省宁德市屏南县熙岭乡四坪村', q2: '带孩子来四坪做柿饼、看星空、逛大食物馆，在村里学课堂学不到的东西，一大一小398元/天含午餐和材料', q3: '微信：siping_edu / 电话：138XXXX9012，最好的课堂在村子里' } },
      { label: '天文馆/大食物馆', type: 'village-event' as TemplateType, formData: { q1: '四坪天文馆和大食物馆，福建省宁德市屏南县熙岭乡四坪村', q2: '乡村里居然有天文望远镜！大食物馆讲的是从田间到餐桌的故事，孩子超喜欢，天文馆门票30元大食物馆免费', q3: '微信：siping_museum / 电话：0593-XXXX333，四坪的惊喜，不止柿子' } },
      { label: '民宿、咖啡、文创店宣传', type: 'homestay' as TemplateType, formData: { q1: '四坪村民宿和文创小店，福建省宁德市屏南县熙岭乡四坪村', q2: '老房子改的民宿和咖啡馆，还有卖柿饼文创的小店，适合拍照发朋友圈，民宿150-250元/晚咖啡20-35元', q3: '微信：siping_shop / 电话：159XXXX6543，在四坪的老屋里喝一杯咖啡' } },
    ],
  },
  {
    key: 'longtan', label: '龙潭古镇', aliases: ['龙塘古镇'],
    directions: [
      { label: '龙潭古镇夜游', type: 'village-event' as TemplateType, formData: { q1: '龙潭古镇夜游，福建省宁德市屏南县龙潭古镇', q2: '灯笼亮起来，溪水映着光，石板街上有音乐和笑声，夜里的龙潭比白天更美，免费游览', q3: '微信：longtan_night / 电话：0593-XXXX111，龙潭的夜，来了就不想走' } },
      { label: '石板街打卡路线', type: 'homestay' as TemplateType, formData: { q1: '龙潭古镇石板街打卡路线，福建省宁德市屏南县龙潭古镇', q2: '从村口牌坊到溪边老桥，一条石板街走下来，每个角落都能拍出大片，免费游览导游讲解50元/次', q3: '微信：longtan_photo / 电话：138XXXX7890，龙潭的石板街，一步一景' } },
      { label: '黄酒故事', type: 'craft' as TemplateType, formData: { q1: '龙潭黄酒故事，福建省宁德市屏南县龙潭古镇', q2: '屏南老酒非遗酿造，糯米山泉水古法发酵，一坛酒要等三年，体验酿酒50元/人成品酒68-128元/坛', q3: '微信：longtan_wine / 电话：159XXXX2345，三年等一坛，龙潭黄酒喝的是时间' } },
      { label: '四平戏/非遗体验', type: 'craft' as TemplateType, formData: { q1: '龙潭四平戏非遗体验，福建省宁德市屏南县龙潭古镇', q2: '四平戏是国家级非遗，在龙潭古镇的戏台上老艺人还会唱你可以学两招，免费观看学戏体验80元/人', q3: '微信：longtan_opera / 电话：0593-XXXX222，百年老戏还在唱，你来听一段' } },
      { label: '古镇民宿住一晚', type: 'homestay' as TemplateType, formData: { q1: '龙潭古镇民宿，福建省宁德市屏南县龙潭古镇', q2: '石板街旁的老屋民宿，推窗看到溪水，晚上听水声入睡早上被鸟叫醒，平日268元/晚周末358元/晚含早餐', q3: '微信：longtan_inn / 电话：159XXXX5678，来龙潭住一晚，听溪水讲故事' } },
      { label: '古镇餐饮推荐', type: 'rural-food' as TemplateType, formData: { q1: '龙潭古镇美食推荐，福建省宁德市屏南县龙潭古镇', q2: '米烧兔、秋菇炖土鸡、农家手打面、自酿黄酒，龙潭人待客的拿手菜，人均60-100元丰俭由人', q3: '微信：longtan_food / 电话：138XXXX6789，龙潭的饭，吃饱了还想再来一碗' } },
    ],
  },
];

const DEMO_CASES: DemoCase[] = [
  {
    id: 'case1', title: '四坪村柿子', type: 'rural-goods', localCase: 'siping',
    formData: {
      q1: '四坪村老柿饼，福建省宁德市屏南县熙岭乡四坪村产的',
      q2: '老村古树上结的柿子，自然晾晒，不添加任何东西，甜糯软香，一盒6个装58元包邮，适合当伴手礼送人',
      q3: '微信：siping2024 / 电话：138XXXX1234，尝一口四坪的秋天，把老村的味道带回家',
    },
  },
  {
    id: 'case2', title: '龙潭古镇民宿', type: 'homestay', localCase: 'longtan',
    formData: {
      q1: '龙潭溪边小院，福建省宁德市屏南县龙潭古镇',
      q2: '石板街旁边的老屋民宿，推窗就能看到溪水，晚上能听到水声，平日268元/晚，周末358元/晚，含早餐',
      q3: '微信：longtan_inn / 电话：159XXXX5678，来龙潭住一晚，听溪水讲故事',
    },
  },
  {
    id: 'case3', title: '熙岭乡农家饭', type: 'rural-food', localCase: 'xiling',
    formData: {
      q1: '熙岭阿婆土灶饭，福建省宁德市屏南县熙岭乡',
      q2: '柴火灶烧的饭，自家菜地里现摘的菜，土鸡土鸭都是散养的，人均60-80元，10人桌餐600元起',
      q3: '微信：xilingfood / 电话：137XXXX9012，城里吃不到的柴火香，来熙岭找阿婆',
    },
  },
];

// 每个类型3个专属问题，每题1个输入框
const TYPE_QUESTIONS: Record<TemplateType, { label: string; key: string; placeholder: string }[]> = {
  'rural-goods': [
    { label: '你要卖的东西叫什么？哪里产的？', key: 'q1', placeholder: '比如：四坪村老柿饼，屏南县熙岭乡四坪村产的，老树上的柿子自然晾晒' },
    { label: '它好在哪？卖多少钱？', key: 'q2', placeholder: '比如：老村古树上的柿子，自然晾晒不添加，甜糯软香适合伴手礼，一盒6个装58元包邮' },
    { label: '怎么联系你？最想说的一句话？', key: 'q3', placeholder: '比如：微信siping2024，想跟你说：尝一口四坪的秋天，把老村的味道带回家' },
  ],
  'homestay': [
    { label: '你的民宿叫什么？在哪个村子？', key: 'q1', placeholder: '比如：龙潭溪边小院，在屏南县龙潭古镇，石板街旁边' },
    { label: '住这里最吸引人的是什么？多少钱一晚？', key: 'q2', placeholder: '比如：石板街旁的老屋民宿，推窗见溪水，晚上听水声入睡，平日268元/晚含早餐' },
    { label: '怎么预约？最想对客人说的一句话？', key: 'q3', placeholder: '比如：加微信longtan_inn预约，想跟你说：来龙潭住一晚，听溪水讲故事' },
  ],
  'rural-food': [
    { label: '你的店叫什么？在哪儿？', key: 'q1', placeholder: '比如：熙岭阿婆土灶饭，屏南县熙岭乡主街上' },
    { label: '招牌菜是什么？人均多少钱？', key: 'q2', placeholder: '比如：柴火灶烧的饭，自家菜地现摘，土鸡土鸭散养，人均60-80元' },
    { label: '怎么订位？最想对食客说的一句话？', key: 'q3', placeholder: '比如：加微信xilingfood订位，想跟你说：城里吃不到的柴火香，来熙岭找阿婆' },
  ],
  'craft': [
    { label: '这门手艺叫什么？在哪里能看到？', key: 'q1', placeholder: '比如：四平戏，在屏南县龙潭古镇可以看' },
    { label: '最打动人的是什么？体验要多少钱？', key: 'q2', placeholder: '比如：百年传承的戏曲，老艺人还在坚持，看一次少一次，免费观看，体验课150元/人' },
    { label: '怎么联系？最想对大家说的一句话？', key: 'q3', placeholder: '比如：现场就能看，想跟你说：老戏新唱，别让好手艺失传' },
  ],
  'village-event': [
    { label: '宣传的是什么？在哪里？', key: 'q1', placeholder: '比如：四坪柿子节，在屏南县四坪村' },
    { label: '最大的亮点是什么？参加要花钱吗？', key: 'q2', placeholder: '比如：一年一度的柿子节，满村红柿挂枝头，还有手作体验，免费参加' },
    { label: '怎么报名？最想对大家说的一句话？', key: 'q3', placeholder: '比如：自驾导航四坪村就能到，想跟你说：来看柿子，顺便住一晚' },
  ],
};

const FIELD_LABELS: Record<keyof FormData, string> = {
  q1: '基本信息',
  q2: '核心卖点',
  q3: '联系方式',
};
const emptyFormData: FormData = { q1: '', q2: '', q3: '' };

// ========== 复制按钮组件 ==========
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
      className={`w-full py-4 rounded-2xl text-xl font-bold transition-all ${
        copied
          ? 'bg-[#6B8F71] text-white shadow-lg'
          : 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg active:scale-[0.97]'
      }`}
    >
      {copied ? '已复制 ✓' : (label || '一键复制')}
    </button>
  );
}

// ========== 公域/私域切换标签 ==========
function TrafficToggle({ value, onChange }: { value: 'public' | 'private'; onChange: (v: 'public' | 'private') => void }) {
  return (
    <div className="flex bg-[#F5E6D8] rounded-xl p-1 mb-4">
      <button
        onClick={() => onChange('public')}
        className={`flex-1 py-2.5 rounded-lg text-base font-bold transition-all ${
          value === 'public' ? 'bg-[#C4704B] text-white shadow-md' : 'text-[#8B7355] hover:text-[#6B4226]'
        }`}
      >
        📢 公域获客引流
      </button>
      <button
        onClick={() => onChange('private')}
        className={`flex-1 py-2.5 rounded-lg text-base font-bold transition-all ${
          value === 'private' ? 'bg-[#6B8F71] text-white shadow-md' : 'text-[#8B7355] hover:text-[#6B4226]'
        }`}
      >
        💬 私域流量转化
      </button>
    </div>
  );
}

// ========== 风格选择器 ==========
function StyleSelector<T extends { key: string; label: string; desc: string; icon: string }>({
  styles, selected, onChange, label,
}: {
  styles: T[];
  selected: string;
  onChange: (key: string) => void;
  label: string;
}) {
  return (
    <div className="mb-4">
      <div className="text-base font-bold text-[#3D2B1F] mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {styles.map(s => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
              selected === s.key
                ? 'bg-[#C4704B] text-white border-[#C4704B] shadow-md'
                : 'bg-white text-[#6B4226] border-[#E8D5C4] hover:border-[#C4704B]'
            }`}
          >
            <span className="mr-1">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ========== 提示词展示区 ==========
function PromptDisplay({ text, wordCount }: { text: string; wordCount?: number }) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#D4A853]">提示词（一键复制）</span>
        {wordCount !== undefined && <span className="text-xs text-[#8B8BA0]">{wordCount}字</span>}
      </div>
      <p className="text-[#e0e0e0] text-base leading-[1.8] whitespace-pre-wrap">{text}</p>
    </div>
  );
}

// ========== 主组件 ==========
export default function HomePage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<TemplateType | null>(null);
  const [localCase, setLocalCase] = useState<string>('');
  const [localDirection, setLocalDirection] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({ ...emptyFormData });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [resultTab, setResultTab] = useState<'video' | 'poster' | 'publish'>('video');
  const [trafficMode, setTrafficMode] = useState<'public' | 'private'>('public');
  const [posterStyleKey, setPosterStyleKey] = useState('default');
  const [publishStyleKey, setPublishStyleKey] = useState('default');
  const progress = step <= 2 ? ((step - 1) / 1) * 100 : 100;

  const handleSelectType = useCallback((type: TemplateType) => setSelectedType(type), []);

  const handleSelectLocalDirection = useCallback((caseKey: string, directionLabel: string) => {
    const lc = LOCAL_CASES.find(c => c.key === caseKey);
    const dir = lc?.directions.find(d => d.label === directionLabel);
    if (dir) {
      setSelectedType(dir.type);
      setFormData({ ...dir.formData });
    }
    setLocalCase(caseKey);
    setLocalDirection(directionLabel);
    setStep(2); // 跳到填写信息步骤
  }, []);

  const handleFormChange = useCallback((key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
    setTrafficMode('public');
    setPosterStyleKey('default');
    setPublishStyleKey('default');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          formData,
          photoCount: 0,
          localCase,
          localDirection,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setStep(3);
      } else {
        alert(data.error || '生成失败，请重试');
      }
    } catch {
      alert('网络出错，请重试');
    } finally {
      setGenerating(false);
    }
  }, [selectedType, formData, localCase, localDirection]);

  const handleReset = useCallback(() => {
    setStep(1);
    setSelectedType(null);
    setLocalCase('');
    setLocalDirection('');
    setFormData({ ...emptyFormData });
    setResult(null);
    setResultTab('video');
    setTrafficMode('public');
    setPosterStyleKey('default');
    setPublishStyleKey('default');
  }, []);

  // 获取当前视频提示词
  const getCurrentVideoPrompt = useCallback((): string => {
    if (!result) return '';
    return trafficMode === 'public' ? result.videoPrompt : result.videoPromptPrivate;
  }, [result, trafficMode]);

  // 获取当前海报提示词
  const getCurrentPosterPrompt = useCallback((): string => {
    if (!result) return '';
    const styleData = result.posterPrompts[posterStyleKey];
    if (!styleData) return '';
    return trafficMode === 'public' ? styleData.prompt : styleData.promptPrivate;
  }, [result, trafficMode, posterStyleKey]);

  // 获取当前海报比例
  const getCurrentPosterAspectRatio = useCallback((): string => {
    if (!result) return '3:4';
    const styleData = result.posterPrompts[posterStyleKey];
    return styleData?.aspectRatio || '3:4';
  }, [result, posterStyleKey]);

  // 获取当前发布文案
  const getCurrentPublishCopy = useCallback((): { copy: string; tags: string[] } => {
    if (!result) return { copy: '', tags: [] };
    const styleData = result.publishCopies[publishStyleKey];
    if (!styleData) return { copy: '', tags: [] };
    return {
      copy: trafficMode === 'public' ? styleData.copy : styleData.copyPrivate,
      tags: styleData.tags,
    };
  }, [result, trafficMode, publishStyleKey]);

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
            {step > 1 && (
              <button
                onClick={handleReset}
                className="text-sm text-[#C4704B] hover:text-[#A85A38] font-medium px-3 py-1.5 rounded-lg hover:bg-[#FFF0E0]"
              >
                重新开始
              </button>
            )}
          </div>
          {step <= 3 && (
            <>
              <div className="mt-2 h-2 rounded-full bg-[#E8D5C4] overflow-hidden">
                <div className="h-full rounded-full bg-[#C4704B] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-xs text-[#8B7355]">
                <span className={step >= 1 ? 'text-[#C4704B] font-medium' : ''}>①选类型</span>
                <span className={step >= 2 ? 'text-[#C4704B] font-medium' : ''}>②填信息</span>
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
                      {lc.aliases && <span className="text-sm text-[#8B7355] font-normal ml-2">（输入&quot;{lc.aliases[0]}&quot;也行）</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lc.directions.map(dir => (
                        <button
                          key={dir.label}
                          onClick={() => handleSelectLocalDirection(lc.key, dir.label)}
                          className={`text-sm px-4 py-2 rounded-full border transition-all ${
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
                    className="bg-white border-2 border-[#E8D5C4] rounded-xl p-4 text-left hover:border-[#C4704B] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#D4A853] text-white text-xs px-2 py-0.5 rounded-full font-bold">演示</span>
                      <span className="font-bold text-[#3D2B1F]">{dc.title}</span>
                    </div>
                    <div className="text-sm text-[#8B7355]">{dc.formData.q3}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky bottom-4">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedType}
                className={`w-full py-4 rounded-2xl text-xl font-bold transition-all ${
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
              {(TYPE_QUESTIONS[selectedType!] || []).map((q, qi) => (
                <div key={qi} className="bg-white rounded-2xl border border-[#E8D5C4] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-[#C4704B] text-white text-sm font-bold flex items-center justify-center">{qi + 1}</span>
                    <label className="text-lg font-bold text-[#3D2B1F]">{q.label}</label>
                  </div>
                  <textarea
                    value={formData[q.key as keyof typeof formData] || ''}
                    onChange={e => {
                      handleFormChange(q.key as keyof FormData, e.target.value);
                    }}
                    placeholder={q.placeholder}
                    className="village-input w-full min-h-[80px] resize-y"
                    rows={3}
                  />
                </div>
              ))}
            </div>

            {/* 生成说明 */}
            <div className="bg-[#FFF0E0] rounded-2xl p-4 mt-6 border border-[#E8D5C4]">
              <div className="font-bold text-[#6B4226] mb-2">点按钮后会给你两种提示词，每种分公域/私域：</div>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <div className="flex-1 bg-white rounded-xl p-3 border border-[#E8D5C4]">
                    <div className="text-lg mb-1">🎬</div>
                    <div className="font-bold text-[#3D2B1F] text-sm">AI短视频分镜提示词</div>
                    <div className="text-xs text-[#8B7355]">350-400字，你本人出镜，粘贴到Sora/可灵</div>
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-3 border border-[#E8D5C4]">
                    <div className="text-lg mb-1">🖼️</div>
                    <div className="font-bold text-[#3D2B1F] text-sm">宣传海报图片提示词</div>
                    <div className="text-xs text-[#8B7355]">11种风格可选，≤500字，粘贴到MJ/DALL-E</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-white rounded-xl p-3 border border-[#E8D5C4]">
                    <div className="text-lg mb-1">🚀</div>
                    <div className="font-bold text-[#3D2B1F] text-sm">发布文案</div>
                    <div className="text-xs text-[#8B7355]">10种风格可选，抖音/视频号/小红书都能用</div>
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-3 border border-[#E8D5C4]">
                    <div className="font-bold text-[#3D2B1F] text-sm mb-1">每版分两种：</div>
                    <div className="text-xs text-[#C4704B]">📢 公域引流：无联系方式</div>
                    <div className="text-xs text-[#6B8F71]">💬 私域转化：含联系方式</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 sticky bottom-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0]"
              >
                ← 上一步
              </button>
              <button
                onClick={handleGenerate}
                disabled={!formData.q1 || generating}
                className={`flex-[2] py-4 rounded-2xl text-xl font-bold transition-all ${
                  formData.q1 && !generating
                    ? 'bg-[#C4704B] text-white hover:bg-[#A85A38] shadow-lg'
                    : 'bg-[#E8D5C4] text-[#8B7355] cursor-not-allowed'
                }`}
              >
                {generating ? '正在生成...' : '帮我生成提示词'}
              </button>
            </div>
          </div>
        )}

        {/* ===== 步骤3：生成结果 ===== */}
        {step === 3 && result && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">提示词生成好了！</h2>
            <p className="text-[#8B7355] mb-6 text-lg">复制下面的提示词，粘贴到AI工具里就能用</p>

            {/* 三个Tab切换 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setResultTab('video')}
                className={`flex-1 py-3 rounded-xl text-base font-bold transition-all ${
                  resultTab === 'video' ? 'bg-[#C4704B] text-white shadow-md' : 'bg-white text-[#6B4226] border border-[#E8D5C4]'
                }`}
              >
                🎬 AI短视频分镜
              </button>
              <button
                onClick={() => setResultTab('poster')}
                className={`flex-1 py-3 rounded-xl text-base font-bold transition-all ${
                  resultTab === 'poster' ? 'bg-[#C4704B] text-white shadow-md' : 'bg-white text-[#6B4226] border border-[#E8D5C4]'
                }`}
              >
                🖼️ 宣传海报
              </button>
              <button
                onClick={() => setResultTab('publish')}
                className={`flex-1 py-3 rounded-xl text-base font-bold transition-all ${
                  resultTab === 'publish' ? 'bg-[#C4704B] text-white shadow-md' : 'bg-white text-[#6B4226] border border-[#E8D5C4]'
                }`}
              >
                🚀 发布文案
              </button>
            </div>

            {/* ===== AI短视频完整提示词 ===== */}
            {resultTab === 'video' && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#3D2B1F]">AI短视频分镜提示词</h3>
                    <p className="text-sm text-[#8B7355] mt-1">完整一段，可直接粘贴到 Sora、可灵、Runway 等视频生成工具</p>
                  </div>

                  <TrafficToggle value={trafficMode} onChange={setTrafficMode} />

                  <div className={`text-sm px-3 py-2 rounded-lg mb-4 ${trafficMode === 'public' ? 'bg-[#C4704B]/10 text-[#C4704B]' : 'bg-[#6B8F71]/10 text-[#6B8F71]'}`}>
                    {trafficMode === 'public'
                      ? '📢 公域获客引流版：不包含联系方式、电话号码、二维码，只保留地址和品牌信息'
                      : '💬 私域流量转化版：包含联系方式，方便用户直接联系'}
                  </div>

                  <PromptDisplay text={getCurrentVideoPrompt()} wordCount={getCurrentVideoPrompt().length} />

                  <CopyButton
                    text={getCurrentVideoPrompt()}
                    label={trafficMode === 'public' ? '一键复制（公域引流版）' : '一键复制（私域转化版）'}
                  />
                </div>

                <div className="mt-4 bg-[#FFF0E0] rounded-2xl p-4 border border-[#E8D5C4]">
                  <div className="flex items-center gap-2 mb-2">
                    <span>💡</span>
                    <span className="font-bold text-[#6B4226]">使用方法</span>
                  </div>
                  <ul className="text-[#6B4226] text-sm space-y-1">
                    <li>• 公域引流版：发到抖音、视频号等公域平台，吸引关注和私信</li>
                    <li>• 私域转化版：发到微信群、朋友圈等私域场景，方便用户直接联系你</li>
                    <li>• 打开 Sora / 可灵 / Runway 等视频生成工具</li>
                    <li>• 粘贴提示词，设置比例为 9:16（竖屏），即可生成</li>
                    <li>• 如有上传照片，可在支持图片参考的工具中同时上传</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ===== 宣传海报提示词 ===== */}
            {resultTab === 'poster' && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#3D2B1F]">宣传海报图片提示词</h3>
                    <p className="text-sm text-[#8B7355] mt-1">完整一段，可直接粘贴到 Midjourney、DALL-E、Stable Diffusion 等</p>
                  </div>

                  {/* 风格选择 */}
                  <StyleSelector
                    styles={result.posterStyles}
                    selected={posterStyleKey}
                    onChange={setPosterStyleKey}
                    label="选择海报风格"
                  />

                  <TrafficToggle value={trafficMode} onChange={setTrafficMode} />

                  <div className={`text-sm px-3 py-2 rounded-lg mb-4 ${trafficMode === 'public' ? 'bg-[#C4704B]/10 text-[#C4704B]' : 'bg-[#6B8F71]/10 text-[#6B8F71]'}`}>
                    {trafficMode === 'public'
                      ? '📢 公域获客引流版：海报中不包含联系方式、电话号码、二维码'
                      : '💬 私域流量转化版：海报底部包含联系方式'}
                  </div>

                  {/* 当前风格和比例 */}
                  <div className="flex gap-3 mb-4">
                    <div className="bg-[#FFF0E0] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#8B7355]">当前风格</span>
                      <p className="text-sm font-bold text-[#6B4226]">
                        {result.posterStyles.find(s => s.key === posterStyleKey)?.icon}{' '}
                        {result.posterStyles.find(s => s.key === posterStyleKey)?.label}
                      </p>
                    </div>
                    <div className="bg-[#FFF0E0] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#8B7355]">推荐比例</span>
                      <p className="text-sm font-bold text-[#6B4226]">{getCurrentPosterAspectRatio()}</p>
                    </div>
                    <div className="bg-[#FFF0E0] rounded-lg px-3 py-1.5">
                      <span className="text-xs text-[#8B7355]">字数</span>
                      <p className="text-sm font-bold text-[#6B4226]">{getCurrentPosterPrompt().length}字</p>
                    </div>
                  </div>

                  <PromptDisplay text={getCurrentPosterPrompt()} wordCount={getCurrentPosterPrompt().length} />

                  <CopyButton
                    text={getCurrentPosterPrompt()}
                    label={`一键复制（${result.posterStyles.find(s => s.key === posterStyleKey)?.label}·${trafficMode === 'public' ? '公域' : '私域'}版）`}
                  />
                </div>

                <div className="mt-4 bg-[#FFF0E0] rounded-2xl p-4 border border-[#E8D5C4]">
                  <div className="flex items-center gap-2 mb-2">
                    <span>💡</span>
                    <span className="font-bold text-[#6B4226]">使用方法</span>
                  </div>
                  <ul className="text-[#6B4226] text-sm space-y-1">
                    <li>• 切换不同风格，选择你喜欢的视觉风格</li>
                    <li>• Midjourney：粘贴后末尾加 --ar {getCurrentPosterAspectRatio().replace(':', '')} --v 6</li>
                    <li>• DALL-E：直接粘贴到图片生成对话框</li>
                    <li>• 如有上传照片，可在支持图片参考的工具中同时上传</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ===== 发布文案 ===== */}
            {resultTab === 'publish' && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#3D2B1F]">发布文案</h3>
                    <p className="text-sm text-[#8B7355]">抖音、视频号、小红书都可以直接发</p>
                  </div>

                  {/* 风格选择 */}
                  <StyleSelector
                    styles={result.publishStyles}
                    selected={publishStyleKey}
                    onChange={setPublishStyleKey}
                    label="选择文案风格"
                  />

                  <TrafficToggle value={trafficMode} onChange={setTrafficMode} />

                  <div className={`text-sm px-3 py-2 rounded-lg mb-4 ${trafficMode === 'public' ? 'bg-[#C4704B]/10 text-[#C4704B]' : 'bg-[#6B8F71]/10 text-[#6B8F71]'}`}>
                    {trafficMode === 'public'
                      ? '📢 公域获客引流版：文案中不包含联系方式、电话号码'
                      : '💬 私域流量转化版：文案末尾包含联系方式'}
                  </div>

                  {/* 文案内容 */}
                  <div className="bg-[#FFF8F0] rounded-xl p-4 text-lg leading-relaxed text-[#3D2B1F] mb-4 border border-[#E8D5C4]">
                    {getCurrentPublishCopy().copy}
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {getCurrentPublishCopy().tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#6B8F71]/10 text-[#6B8F71] px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <CopyButton
                    text={`${getCurrentPublishCopy().copy}\n\n${getCurrentPublishCopy().tags.join(' ')}`}
                    label={`一键复制（${result.publishStyles.find(s => s.key === publishStyleKey)?.label}·${trafficMode === 'public' ? '公域' : '私域'}版）`}
                  />
                </div>
              </div>
            )}

            {/* 上传参考图入口 */}
            <div className="mt-8 bg-gradient-to-r from-[#C4704B] to-[#D4A853] rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📸</span>
                <span className="text-xl font-bold">想让AI照着你的实景来？</span>
              </div>
              <p className="text-white/90 text-base mb-4">
                上传你的人物照片、产品实拍、门头店内、田野村庄，AI生成的视频和海报就能还原真实场景
              </p>
              <button
                onClick={() => window.open('/ref', '_blank')}
                className="w-full py-4 rounded-xl text-lg font-bold bg-white text-[#C4704B] hover:bg-[#FFF8F0] shadow-md transition-all active:scale-[0.97]"
              >
                去上传参考图 →
              </button>
            </div>

            {/* 重新开始 */}
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-2xl text-xl font-bold bg-[#E8D5C4] text-[#6B4226] hover:bg-[#DDD0C0] mt-4"
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
