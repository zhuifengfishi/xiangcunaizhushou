// 场景模板定义与离线生成逻辑

export type TemplateType = 'rural-goods' | 'homestay' | 'rural-food' | 'craft' | 'village-event';
export type LocalCaseKey = 'pingnan' | 'xiling' | 'siping' | 'longtan' | '';

export interface FormData {
  name: string;
  highlights: string;
  price: string;
  location: string;
  contact: string;
  slogan: string;
}

export interface GenerateResult {
  script: string;       // 15秒口播脚本
  storyboard: StoryboardItem[];  // 分镜
  subtitles: string[];  // 字幕
  publishCopy: string;  // 发布文案
  tags: string[];       // 话题标签
}

export interface StoryboardItem {
  time: string;
  shot: string;
  text: string;
}

// 场景模板配置
export const templateConfig: Record<TemplateType, {
  label: string;
  icon: string;
  description: string;
  examples: string[];
  scriptTemplate: (data: FormData) => string;
  storyboardTemplate: (data: FormData, photoCount: number) => StoryboardItem[];
  publishTemplate: (data: FormData) => string;
  tagsTemplate: (data: FormData) => string[];
}> = {
  'rural-goods': {
    label: '卖农货',
    icon: '🍊',
    description: '水果、茶叶、蜂蜜、米面、菌菇、干货、腊味、手作食品',
    examples: ['屏南高山茶', '四坪柿饼', '土蜂蜜', '农家腊肉'],
    scriptTemplate: (data) => {
      const parts = [
        data.name ? `${data.name}，` : '',
        data.highlights ? `${data.highlights}。` : '',
        data.price ? `${data.price}。` : '',
        data.location ? `来自${data.location}。` : '',
        data.slogan ? data.slogan : '',
      ].filter(Boolean);
      return parts.join('');
    },
    storyboardTemplate: (data, photoCount) => {
      const totalShots = Math.max(photoCount, 5);
      const shots: StoryboardItem[] = [];
      for (let i = 0; i < totalShots; i++) {
        const sec = i * 3;
        if (i === 0) {
          shots.push({ time: `${sec}-${sec + 3}秒`, shot: `特写：${data.name || '产品'}的招牌或全景`, text: data.name || '好东西来了' });
        } else if (i === 1) {
          shots.push({ time: `${sec}-${sec + 3}秒`, shot: '展示产品细节、质感、颜色', text: data.highlights ? data.highlights.slice(0, 20) : '看看这品质' });
        } else if (i === 2) {
          shots.push({ time: `${sec}-${sec + 3}秒`, shot: '产地环境或制作过程', text: data.location ? `来自${data.location}` : '原产地直发' });
        } else if (i === 3) {
          shots.push({ time: `${sec}-${sec + 3}秒`, shot: '包装、发货、或顾客反馈', text: data.price || '实惠好价' });
        } else {
          shots.push({ time: `${sec}-${sec + 3}秒`, shot: `${i < photoCount ? '用户上传的图片' : '产品特写或环境'}`, text: data.slogan || '值得一试' });
        }
      }
      return shots.slice(0, 5);
    },
    publishTemplate: (data) => {
      return `${data.name || '乡村好物'}来啦！${data.highlights || ''} ${data.price ? `💰 ${data.price}` : ''} ${data.location ? `📍 ${data.location}` : ''} ${data.slogan ? `✨ ${data.slogan}` : ''} 想要的朋友${data.contact ? `联系：${data.contact}` : '私信我'}！`;
    },
    tagsTemplate: (data) => {
      const base = ['#乡村好物', '#助农', '#原产地直发'];
      if (data.location) base.push(`#${data.location.replace(/省市县乡镇/g, '').slice(0, 4)}`);
      if (data.name) base.push(`#${data.name.slice(0, 6)}`);
      return base.slice(0, 5);
    },
  },
  'homestay': {
    label: '推民宿',
    icon: '🏡',
    description: '民宿、古村、露营、避暑、亲子游、周末游',
    examples: ['龙潭溪边民宿', '古村露营地', '屏南避暑小院'],
    scriptTemplate: (data) => {
      const parts = [
        data.name ? `想找个地方放松？${data.name}，` : '',
        data.highlights ? `${data.highlights}。` : '',
        data.price ? `${data.price}。` : '',
        data.location ? `就在${data.location}。` : '',
        data.slogan ? data.slogan : '',
      ].filter(Boolean);
      return parts.join('');
    },
    storyboardTemplate: (data, photoCount) => {
      const shots: StoryboardItem[] = [
        { time: '0-3秒', shot: `民宿/景点外观全景`, text: data.name || '来这里住一晚' },
        { time: '3-6秒', shot: '房间内景或窗外风景', text: data.highlights ? data.highlights.slice(0, 20) : '看看这环境' },
        { time: '6-9秒', shot: '周边风景或活动场景', text: data.location ? `在${data.location}` : '山里好地方' },
        { time: '9-12秒', shot: '配套设施或特色体验', text: data.price || '住得舒服' },
        { time: '12-15秒', shot: '夜景或温馨画面收尾', text: data.slogan || '等你来住' },
      ];
      return shots;
    },
    publishTemplate: (data) => {
      return `周末不知道去哪？来${data.name || '这儿'}住一晚！${data.highlights || ''} ${data.price ? `💰 ${data.price}` : ''} ${data.location ? `📍 ${data.location}` : ''} ${data.slogan ? `✨ ${data.slogan}` : ''} ${data.contact ? `预订联系：${data.contact}` : '私信预约'}！`;
    },
    tagsTemplate: (data) => {
      const base = ['#民宿推荐', '#周末去哪儿', '#乡村民宿'];
      if (data.location) base.push(`#${data.location.replace(/省市县乡镇/g, '').slice(0, 4)}游`);
      if (data.name) base.push(`#${data.name.slice(0, 6)}`);
      return base.slice(0, 5);
    },
  },
  'rural-food': {
    label: '发饭店',
    icon: '🍲',
    description: '农家菜、土灶饭、地方小吃、宴席、黄酒、团餐',
    examples: ['土灶柴火饭', '屏南黄酒', '古村长桌宴'],
    scriptTemplate: (data) => {
      const parts = [
        data.name ? `${data.name}，` : '',
        data.highlights ? `${data.highlights}。` : '',
        data.price ? `${data.price}。` : '',
        data.location ? `地址在${data.location}。` : '',
        data.slogan ? data.slogan : '',
      ].filter(Boolean);
      return parts.join('');
    },
    storyboardTemplate: (data, photoCount) => {
      const shots: StoryboardItem[] = [
        { time: '0-3秒', shot: '招牌菜/招牌画面特写', text: data.name || '来尝尝' },
        { time: '3-6秒', shot: '烹饪过程或灶台场景', text: data.highlights ? data.highlights.slice(0, 20) : '现做现炒' },
        { time: '6-9秒', shot: '食材特写或菜园画面', text: '食材新鲜才好吃' },
        { time: '9-12秒', shot: '食客吃饭的热闹场景', text: data.price || '好吃不贵' },
        { time: '12-15秒', shot: '门面或全家福收尾', text: data.slogan || '等你来吃' },
      ];
      return shots;
    },
    publishTemplate: (data) => {
      return `吃货看过来！${data.name || '乡村美食'}，${data.highlights || ''} ${data.price ? `💰 ${data.price}` : ''} ${data.location ? `📍 ${data.location}` : ''} ${data.slogan ? `✨ ${data.slogan}` : ''} ${data.contact ? `预订联系：${data.contact}` : '欢迎来吃'}！`;
    },
    tagsTemplate: (data) => {
      const base = ['#乡村美食', '#农家菜', '#土灶饭'];
      if (data.location) base.push(`#${data.location.replace(/省市县乡镇/g, '').slice(0, 4)}美食`);
      if (data.name) base.push(`#${data.name.slice(0, 6)}`);
      return base.slice(0, 5);
    },
  },
  'craft': {
    label: '秀手艺',
    icon: '🎭',
    description: '戏曲、酿造、木作、编织、陶艺、传统工艺',
    examples: ['四平戏', '屏南老酒', '手工竹编', '陶艺体验'],
    scriptTemplate: (data) => {
      const parts = [
        data.name ? `${data.name}，` : '',
        data.highlights ? `${data.highlights}。` : '',
        data.price ? `${data.price}。` : '',
        data.location ? `在${data.location}。` : '',
        data.slogan ? data.slogan : '',
      ].filter(Boolean);
      return parts.join('');
    },
    storyboardTemplate: (data, photoCount) => {
      const shots: StoryboardItem[] = [
        { time: '0-3秒', shot: '手艺成品或表演开场', text: data.name || '老手艺' },
        { time: '3-6秒', shot: '制作过程或表演片段', text: data.highlights ? data.highlights.slice(0, 20) : '看看怎么做' },
        { time: '6-9秒', shot: '传承人/手艺人特写', text: '一代传一代' },
        { time: '9-12秒', shot: '体验场景或成品展示', text: data.price || '值得来看' },
        { time: '12-15秒', shot: '故事感画面收尾', text: data.slogan || '手艺不老' },
      ];
      return shots;
    },
    publishTemplate: (data) => {
      return `这手艺快失传了！${data.name || '非遗手艺'}，${data.highlights || ''} ${data.price ? `💰 ${data.price}` : ''} ${data.location ? `📍 ${data.location}` : ''} ${data.slogan ? `✨ ${data.slogan}` : ''} ${data.contact ? `体验联系：${data.contact}` : '欢迎来体验'}！`;
    },
    tagsTemplate: (data) => {
      const base = ['#非遗手艺', '#传统工艺', '#匠心传承'];
      if (data.location) base.push(`#${data.location.replace(/省市县乡镇/g, '').slice(0, 4)}`);
      if (data.name) base.push(`#${data.name.slice(0, 6)}`);
      return base.slice(0, 5);
    },
  },
  'village-event': {
    label: '宣传村子',
    icon: '🎊',
    description: '丰收节、市集、音乐节、采摘节、民俗表演、研学活动、古镇/古村宣传',
    examples: ['丰收节', '古村民俗表演', '亲子研学营'],
    scriptTemplate: (data) => {
      const parts = [
        data.name ? `${data.name}，` : '',
        data.highlights ? `${data.highlights}。` : '',
        data.price ? `${data.price}。` : '',
        data.location ? `地点在${data.location}。` : '',
        data.slogan ? data.slogan : '',
      ].filter(Boolean);
      return parts.join('');
    },
    storyboardTemplate: (data, photoCount) => {
      const shots: StoryboardItem[] = [
        { time: '0-3秒', shot: '活动/村子大门或标志性场景', text: data.name || '好消息' },
        { time: '3-6秒', shot: '活动亮点或村子风景', text: data.highlights ? data.highlights.slice(0, 20) : '看看多热闹' },
        { time: '6-9秒', shot: '人群互动或参与场景', text: data.location ? `就在${data.location}` : '欢迎来玩' },
        { time: '9-12秒', shot: '特色环节或美食展示', text: data.price || '免费参加' },
        { time: '12-15秒', shot: '全景或欢聚画面收尾', text: data.slogan || '不见不散' },
      ];
      return shots;
    },
    publishTemplate: (data) => {
      return `${data.name || '乡村活动'}来啦！${data.highlights || ''} ${data.price ? `💰 ${data.price}` : ''} ${data.location ? `📍 ${data.location}` : ''} ${data.slogan ? `✨ ${data.slogan}` : ''} ${data.contact ? `报名联系：${data.contact}` : '欢迎来玩'}！`;
    },
    tagsTemplate: (data) => {
      const base = ['#乡村活动', '#周末好去处', '#民俗文化'];
      if (data.location) base.push(`#${data.location.replace(/省市县乡镇/g, '').slice(0, 4)}`);
      if (data.name) base.push(`#${data.name.slice(0, 6)}`);
      return base.slice(0, 5);
    },
  },
};

// 地方案例配置
export const localCaseConfig: Record<string, {
  label: string;
  aliases?: string[];
  videoDirections: { label: string; type: TemplateType }[];
}> = {
  'pingnan': {
    label: '屏南县',
    videoDirections: [
      { label: '屏南周末游', type: 'homestay' },
      { label: '白水洋/鸳鸯溪 + 古村路线', type: 'homestay' },
      { label: '屏南乡村好物', type: 'rural-goods' },
      { label: '屏南非遗一分钟', type: 'craft' },
      { label: '屏南避暑康养', type: 'village-event' },
    ],
  },
  'xiling': {
    label: '熙岭乡',
    videoDirections: [
      { label: '熙岭乡一日慢游', type: 'homestay' },
      { label: '古村民宿合集', type: 'homestay' },
      { label: '乡村餐饮地图', type: 'rural-food' },
      { label: '新村民/主理人故事', type: 'craft' },
      { label: '村级文旅活动宣传', type: 'village-event' },
    ],
  },
  'siping': {
    label: '四坪村',
    videoDirections: [
      { label: '四坪柿子/柿饼宣传', type: 'rural-goods' },
      { label: '四坪慢生活', type: 'homestay' },
      { label: '亲子研学', type: 'village-event' },
      { label: '天文馆/大食物馆', type: 'village-event' },
      { label: '民宿、咖啡、文创店宣传', type: 'homestay' },
    ],
  },
  'longtan': {
    label: '龙潭古镇',
    aliases: ['龙塘古镇'],
    videoDirections: [
      { label: '龙潭古镇夜游', type: 'village-event' },
      { label: '石板街打卡路线', type: 'homestay' },
      { label: '黄酒故事', type: 'craft' },
      { label: '四平戏/非遗体验', type: 'craft' },
      { label: '古镇民宿住一晚', type: 'homestay' },
      { label: '古镇餐饮推荐', type: 'rural-food' },
    ],
  },
};

// 核心生成函数
export function generateContent(
  type: TemplateType,
  formData: FormData,
  photoCount: number,
  localCase?: string,
  localDirection?: string,
): GenerateResult {
  const config = templateConfig[type];

  // 生成口播脚本
  let script = config.scriptTemplate(formData);

  // 如果有地方案例方向，追加到脚本开头
  if (localCase && localDirection) {
    const caseConfig = localCaseConfig[localCase];
    if (caseConfig) {
      script = `${caseConfig.label}·${localDirection}——${script}`;
    }
  }

  // 生成分镜
  const storyboard = config.storyboardTemplate(formData, photoCount);

  // 生成字幕（5段，每段约3秒）
  const subtitles = splitToSubtitles(script);

  // 生成发布文案
  let publishCopy = config.publishTemplate(formData);

  // 如果有地方案例，追加到发布文案
  if (localCase) {
    const caseConfig = localCaseConfig[localCase];
    if (caseConfig) {
      publishCopy = `📍${caseConfig.label} | ${publishCopy}`;
    }
  }

  // 生成标签
  let tags = config.tagsTemplate(formData);
  if (localCase) {
    const caseConfig = localCaseConfig[localCase];
    if (caseConfig) {
      tags = [`#${caseConfig.label}`, ...tags.filter(t => !t.includes(caseConfig.label.replace(/县市乡镇/g, '')))].slice(0, 5);
    }
  }

  return { script, storyboard, subtitles, publishCopy, tags };
}

// 将脚本拆成5段字幕
function splitToSubtitles(script: string): string[] {
  if (!script) return ['...', '...', '...', '...', '...'];

  const targetSegments = 5;
  const charsPerSegment = Math.ceil(script.length / targetSegments);

  const segments: string[] = [];
  let remaining = script;

  for (let i = 0; i < targetSegments - 1; i++) {
    if (remaining.length <= charsPerSegment) break;

    let splitPoint = charsPerSegment;

    // 尝试在句号、逗号处断句
    const punctPositions = [remaining.indexOf('。', charsPerSegment - 5), remaining.indexOf('，', charsPerSegment - 5), remaining.indexOf('！', charsPerSegment - 5), remaining.indexOf('、', charsPerSegment - 5)].filter(p => p > 0 && p <= charsPerSegment + 5);

    if (punctPositions.length > 0) {
      splitPoint = Math.min(...punctPositions) + 1;
    }

    segments.push(remaining.slice(0, splitPoint).trim());
    remaining = remaining.slice(splitPoint).trim();
  }

  if (remaining) {
    segments.push(remaining);
  }

  // 补齐到5段
  while (segments.length < targetSegments) {
    segments.push('');
  }

  return segments.slice(0, targetSegments);
}
