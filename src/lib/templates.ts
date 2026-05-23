// ========== 类型定义 ==========
export type TemplateType = 'rural-goods' | 'homestay' | 'rural-food' | 'craft' | 'village-event';

export interface FormData {
  name: string;
  highlights: string;
  price: string;
  location: string;
  contact: string;
  slogan: string;
}

export interface PosterStyleOption {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

export interface PublishStyleOption {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

export interface GenerateResult {
  videoPrompt: string;
  videoPromptPrivate: string;
  posterStyles: PosterStyleOption[];
  posterPrompts: Record<string, { prompt: string; promptPrivate: string; aspectRatio: string }>;
  publishStyles: PublishStyleOption[];
  publishCopies: Record<string, { copy: string; copyPrivate: string; tags: string[] }>;
}

// ========== 海报风格选项（1默认 + 10可选） ==========
export const POSTER_STYLES: PosterStyleOption[] = [
  { key: 'default', label: '清新自然', desc: '默认风格', icon: '🌿' },
  { key: 'ink-wash', label: '国风水墨', desc: '水墨画风格', icon: '🪶' },
  { key: 'vintage', label: '复古怀旧', desc: '老照片风格', icon: '📷' },
  { key: 'japanese', label: '日系小清新', desc: '日系淡雅', icon: '🌸' },
  { key: 'cyberpunk', label: '赛博朋克', desc: '科技未来感', icon: '🌃' },
  { key: 'minimalist', label: '极简主义', desc: '简约大气', icon: '◻️' },
  { key: 'oil-painting', label: '油画质感', desc: '厚重艺术感', icon: '🎨' },
  { key: 'film-photo', label: '胶片摄影', desc: '胶片颗粒感', icon: '🎞️' },
  { key: 'illustration', label: '手绘插画', desc: '温暖手绘风', icon: '✏️' },
  { key: 'pop-art', label: '波普艺术', desc: '大胆撞色', icon: '💥' },
  { key: 'movie-poster', label: '电影海报', desc: '大片质感', icon: '🎬' },
];

// ========== 发布文案风格选项（10种） ==========
export const PUBLISH_STYLES: PublishStyleOption[] = [
  { key: 'default', label: '朴实真诚', desc: '就像跟朋友聊天', icon: '🤝' },
  { key: 'enthusiastic', label: '热情推荐', desc: '感染力十足', icon: '🔥' },
  { key: 'storytelling', label: '故事叙事', desc: '用故事打动人', icon: '📖' },
  { key: 'educational', label: '知识科普', desc: '涨知识型', icon: '📚' },
  { key: 'suspense', label: '悬念吸引', desc: '让人忍不住看', icon: '❓' },
  { key: 'emotional', label: '情感共鸣', desc: '触动内心', icon: '💗' },
  { key: 'humorous', label: '幽默搞笑', desc: '轻松有趣', icon: '😄' },
  { key: 'poetic', label: '诗意文艺', desc: '文艺范儿', icon: '🌙' },
  { key: 'news', label: '新闻播报', desc: '正式报道风', icon: '📰' },
  { key: 'interactive', label: '互动提问', desc: '引导评论互动', icon: '💬' },
];

// ========== 海报风格视觉描述 ==========
const POSTER_STYLE_DESCS: Record<string, { visual: string; color: string; mood: string; technique: string }> = {
  'default': { visual: '自然光线，真实场景', color: '温暖大地色系，米白搭配暖棕', mood: '朴实温暖，亲切自然', technique: '高清摄影，自然光，浅景深' },
  'ink-wash': { visual: '水墨渲染，大量留白，远处山峦若隐若现', color: '黑白灰为主，局部点缀淡彩', mood: '淡雅古韵，意境悠远', technique: '水墨画风格，毛笔笔触，宣纸质感' },
  'vintage': { visual: '泛黄做旧，边角磨损，像翻出一张老照片', color: '泛黄色调，深棕暖褐，褪色感', mood: '怀旧岁月感，满满的回忆', technique: '老照片效果，暗角晕影，胶片色调' },
  'japanese': { visual: '柔光逆光，空气感十足，背景虚化', color: '浅粉、米白、淡蓝、柔绿', mood: '温柔治愈，安静美好', technique: '日系胶片风，柔焦效果，低对比度' },
  'cyberpunk': { visual: '霓虹灯光，暗色背景，光斑闪烁', color: '深蓝暗紫，霓虹粉蓝撞色', mood: '酷炫未来感，科技与乡村碰撞', technique: '赛博朋克风格，霓虹光效，HDR色调' },
  'minimalist': { visual: '大量留白，单一视觉焦点，极简构图', color: '黑白为主，少量点缀色', mood: '高级简约，宁静有力', technique: '极简主义设计，精确构图，克制的色彩' },
  'oil-painting': { visual: '厚重笔触，浓烈光影，层次丰富', color: '浓郁饱满，深红金黄暗绿', mood: '庄重典雅，艺术殿堂感', technique: '油画风格，厚重颜料质感，古典光影' },
  'film-photo': { visual: '胶片颗粒感，色彩偏移，偶尔漏光', color: '偏暖黄绿，低饱和，色调微偏', mood: '文艺随性，生活质感', technique: '胶片摄影效果，颗粒感，色彩偏移' },
  'illustration': { visual: '手绘线条，温暖色块，柔和圆润', color: '暖色系，橙色黄色柔绿', mood: '可爱温暖，充满童趣', technique: '手绘插画风格，柔和线条，平涂色块' },
  'pop-art': { visual: '大胆色块，几何分割，网点效果', color: '高饱和撞色，红蓝黄绿', mood: '张扬个性，视觉冲击', technique: '波普艺术风格，丝网印刷效果，网点纹理' },
  'movie-poster': { visual: '宽银幕构图，焦点人物居中，标题醒目', color: '电影调色，冷暗对比，局部高光', mood: '史诗大片感，故事感十足', technique: '电影海报风格，电影级调色，戏剧性光影' },
};

// ========== 文案风格模板 ==========
const PUBLISH_TEMPLATES: Record<string, {
  opening: (name: string, highlights: string) => string;
  body: (name: string, highlights: string, price: string, location: string, slogan: string) => string;
  closing: (slogan: string) => string;
}> = {
  'default': {
    opening: (n, h) => `${n}，${h}。`,
    body: (n, h, p, l, s) => `💰 ${p}\n📍 ${l}`,
    closing: (s) => `✨ ${s}`,
  },
  'enthusiastic': {
    opening: (n, h) => `太绝了！！${n}真的${h}！！！`,
    body: (n, h, p, l, s) => `💥 超值：${p}\n📍 导航：${l}`,
    closing: (s) => `🔥 ${s}！不来真的会后悔！`,
  },
  'storytelling': {
    opening: (n, h) => `那天在山里遇见${n}，才知道什么叫${h}。`,
    body: (n, h, p, l, s) => `花了${p}，换来的却是整个山野的味道。\n📍 ${l}`,
    closing: (s) => `${s}——这是属于山里的故事。`,
  },
  'educational': {
    opening: (n, h) => `你知道吗？${n}之所以${h}，是因为这里独有的自然条件。`,
    body: (n, h, p, l, s) => `📐 科普小课堂：好山好水出好东西\n💰 ${p}\n📍 ${l}`,
    closing: (s) => `💡 ${s}`,
  },
  'suspense': {
    opening: (n, h) => `藏在山里的好东西，99%的人不知道……`,
    body: (n, h, p, l, s) => `到底是什么？就是${n}！${h}！\n💰 ${p}\n📍 ${l}`,
    closing: (s) => `🤫 ${s}`,
  },
  'emotional': {
    opening: (n, h) => `每到这个季节，就会想起${n}的味道，${h}，是家的感觉。`,
    body: (n, h, p, l, s) => `💰 ${p}\n📍 ${l}`,
    closing: (s) => `🍂 ${s}`,
  },
  'humorous': {
    opening: (n, h) => `朋友们！我发现了${n}，${h}，我直接下单了三份！`,
    body: (n, h, p, l, s) => `💰 才${p}（比奶茶便宜）\n📍 ${l}`,
    closing: (s) => `😂 ${s}，钱包：我自愿的！`,
  },
  'poetic': {
    opening: (n, h) => `山风送来${n}的香气，${h}，是大地写给舌尖的情书。`,
    body: (n, h, p, l, s) => `💰 ${p}\n📍 ${l}`,
    closing: (s) => `🌙 ${s}`,
  },
  'news': {
    opening: (n, h) => `【乡村好物推荐】${n}——${h}，值得品尝。`,
    body: (n, h, p, l, s) => `💰 价格：${p}\n📍 产地：${l}`,
    closing: (s) => `📌 ${s}`,
  },
  'interactive': {
    opening: (n, h) => `有人尝过${n}吗？${h}，到底是啥味道？`,
    body: (n, h, p, l, s) => `💰 ${p}\n📍 ${l}`,
    closing: (s) => `👇 评论区告诉我，${s}你打几分？`,
  },
};

// ========== 照片参考描述 ==========
function photoDesc(photoCount: number): string {
  if (photoCount <= 0) return '你本人的人物形象要充分融入产品画面和乡村风景中，让看视频的人感受到真实亲切的参与感。';
  return `画面参考用户提供的${photoCount}张照片的风格和内容，将你本人的人物形象与产品风景充分融合，让人物自然地出现在每一个画面中。`;
}

function photoDescPoster(photoCount: number): string {
  if (photoCount <= 0) return '你本人的人物形象要充分融入产品画面和乡村风景中，展现真实亲切的参与感。';
  return `参考用户提供的${photoCount}张照片的风格和内容，将你本人的人物形象与产品风景充分融合。`;
}

// ========== 截断/补齐到指定字数 ==========
const PAD_PHRASES = [
  '镜头语言流畅自然',
  '画面节奏舒适',
  '人物表情真实生动',
  '光影变化丰富',
  '场景转换顺滑',
  '整体氛围温暖亲切',
  '细节展现到位',
  '人物动作自然',
  '画面构图精美',
  '色彩层次分明',
];

function clampText(text: string, min: number, max: number): string {
  // 如果字数不足，补充描述性短句
  if (text.length < min) {
    let padded = text;
    let i = 0;
    while (padded.length < min && i < PAD_PHRASES.length) {
      padded = padded + '，' + PAD_PHRASES[i];
      i++;
    }
    text = padded;
  }
  if (text.length <= max) return text;
  // 从末尾找最后一个句号/分号/逗号，在max内截断
  let cut = max;
  for (let i = max; i >= min; i--) {
    if ('。；，！？、'.includes(text[i])) {
      cut = i + 1;
      break;
    }
  }
  return text.slice(0, cut);
}

// ========== 视频提示词模板（350-400字） ==========
type VideoGen = (fd: FormData, lc: string, ld: string, pc: number) => string;

const videoPromptGenerators: Record<TemplateType, { pub: VideoGen; pri: VideoGen }> = {
  'rural-goods': {
    pub: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}讲述${fd.name}的故事：第1段，你站在${loc}的田间山头，手里捧着刚采摘的${fd.name}，身后是连绵的山和梯田，阳光洒在脸上，你笑着向镜头展示手中的好东西，动作自然大方；第2段，你蹲在晾晒架旁，翻动${fd.name}，展示${fd.highlights}的过程，微风吹过，你抬头对镜头微笑；第3段，你走进自家作坊，亲手打包${fd.name}，动作熟练又认真，偶尔抬头看看镜头；第4段，你端着打包好的${fd.name}走出院门，夕阳洒在泥墙上，你回头对着镜头说：${fd.slogan}；第5段，远景收尾，${loc}的全貌，炊烟升起，你站在村口挥手告别。整体风格：温暖、真实、有烟火气，只有旁白配音，不要出现任何字幕和文字，画面中不要出现任何联系方式、电话号码、二维码。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
    pri: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}讲述${fd.name}的故事：第1段，你站在${loc}的田间山头，手里捧着刚采摘的${fd.name}，身后是连绵的山和梯田，阳光洒在脸上，你笑着向镜头展示手中的好东西，动作自然大方亲切；第2段，你蹲在晾晒架旁，翻动${fd.name}，展示${fd.highlights}的过程，微风吹过，你抬头对镜头微笑，眼里满是自豪；第3段，你走进自家作坊，亲手打包${fd.name}，动作熟练又认真，偶尔抬头看看镜头，嘴角微微上扬；第4段，你端着打包好的${fd.name}走出院门，夕阳洒在泥墙上，你回头对着镜头说：${fd.slogan}；第5段，你举着写有联系方式${fd.contact}的牌子站在村口，身后炊烟升起，你微笑挥手告别。整体风格：温暖、真实、有烟火气，只有旁白配音，不要出现任何字幕和文字。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
  },

  'homestay': {
    pub: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}带你走进${fd.name}：第1段，你沿着${loc}的小路走来，两旁是老屋和绿树，溪水在脚边流淌，你边走边回头看镜头微笑，步伐轻松自在；第2段，你推开${fd.name}的木门，走进房间，木质家具、白床品、窗外是山和溪，你坐在窗边深呼吸，表情满足放松；第3段，你在露台或院子里泡茶，远处是云雾缭绕的山谷，夕阳照在脸上，安静而惬意；第4段，夜幕降临，你在院子里抬头看星空，屋里暖光从窗户透出来，你举杯对着镜头说：${fd.slogan}；第5段，你站在门口挥手，身后灯光暖暖的，你转身看了一眼夜色中的${loc}。整体风格：宁静、治愈、有归属感，只有旁白配音，不要出现任何字幕和文字，画面中不要出现任何联系方式、电话号码、二维码。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
    pri: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}带你走进${fd.name}：第1段，你沿着${loc}的小路走来，两旁是老屋和绿树，溪水在脚边流淌，你边走边回头看镜头微笑，步伐轻松自在；第2段，你推开${fd.name}的木门，走进房间，木质家具、白床品、窗外是山和溪，你坐在窗边深呼吸，表情满足放松；第3段，你在露台或院子里泡茶，远处是云雾缭绕的山谷，夕阳照在脸上，安静而惬意；第4段，夜幕降临，你在院子里抬头看星空，屋里暖光从窗户透出来，你举杯对着镜头说：${fd.slogan}；第5段，你站在门口展示联系方式${fd.contact}，身后灯笼光暖暖的，你微笑挥手。整体风格：宁静、治愈、有归属感，只有旁白配音，不要出现任何字幕和文字。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
  },

  'rural-food': {
    pub: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}带你吃${fd.name}：第1段，你掀开大铁锅盖，热气腾腾的菜冒着白烟，你夹起一块放进嘴里，眼睛一亮，竖起大拇指对着镜头；第2段，你蹲在柴火灶前添柴，火苗舔着锅底，你翻动着铁锅，脸上被火光照得通红，动作利落；第3段，你带镜头走进自家菜地，弯腰摘菜，菜叶上还有露珠，你举起新鲜的菜对着镜头说：新鲜着呢；第4段，你端着一桌菜从厨房出来，家人朋友围坐在一起，热热闹闹，你举杯对着镜头说：${fd.slogan}；第5段，${loc}的傍晚，你站在饭馆门口，身后是手写招牌和暖光。整体风格：食欲感、热闹、有烟火气，只有旁白配音，不要出现任何字幕和文字，画面中不要出现任何联系方式、电话号码、二维码。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
    pri: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}带你吃${fd.name}：第1段，你掀开大铁锅盖，热气腾腾的菜冒着白烟，你夹起一块放进嘴里，眼睛一亮，竖起大拇指对着镜头，满脸满足；第2段，你蹲在柴火灶前添柴，火苗舔着锅底，你翻动铁锅，脸上被火光照得通红，动作利落熟练；第3段，你带镜头走进自家菜地，弯腰摘菜，菜叶上还有露珠，你举起新鲜的菜对着镜头说：新鲜着呢；第4段，你端菜出来，家人朋友围坐在一起，热热闹闹，你举杯对着镜头说：${fd.slogan}；第5段，你站在门口展示联系方式${fd.contact}，身后手写招牌和暖光，你笑着招手。整体风格：食欲感、热闹、有烟火气，只有旁白配音，不要出现任何字幕和文字。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
  },

  'craft': {
    pub: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}记录${fd.name}的传承：第1段，你站在${loc}的工作坊门口，身后架子上摆满了${fd.name}的作品，你拿起一件成品向镜头展示，满脸自豪；第2段，你坐下来开始制作，双手翻飞，动作行云流水，你偶尔抬头看镜头，眼里全是专注和热爱；第3段，你带着镜头看墙上的老照片和旧工具，指指这个摸摸那个，讲述传承了多少年，表情动情；第4段，你手把手教一个年轻人，两人相视而笑，你点点头，眼神里有欣慰，对着镜头说：${fd.slogan}；第5段，你抱着成品走出工作坊，站在${loc}的石板路上，夕阳照在你和作品上。整体风格：庄重、温暖、有文化厚度，只有旁白配音，不要出现任何字幕和文字，画面中不要出现任何联系方式、电话号码、二维码。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
    pri: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}记录${fd.name}的传承：第1段，你站在${loc}的工作坊门口，身后架子上摆满了${fd.name}的作品，你拿起一件成品向镜头展示，满脸自豪和骄傲；第2段，你坐下来开始制作，双手翻飞，动作行云流水，你偶尔抬头看镜头，眼里全是专注和热爱；第3段，你带着镜头看墙上的老照片和旧工具，指指这个摸摸那个，讲述传承了多少年，表情动情而坚定；第4段，你手把手教一个年轻人，两人相视而笑，你点点头，眼神里有欣慰，对着镜头说：${fd.slogan}；第5段，你抱着成品站在门口展示联系方式${fd.contact}，夕阳照在你和作品上，你微微一笑。整体风格：庄重、温暖、有文化厚度，只有旁白配音，不要出现任何字幕和文字。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
  },

  'village-event': {
    pub: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}带你逛${fd.name}：第1段，你站在${loc}村口大牌坊下，头顶是红灯笼和彩旗，你兴奋地朝镜头招手：快来快来！身后人群熙熙攘攘；第2段，你挤进人群看表演，跟着鼓点拍手，回头对镜头笑，眼里全是兴奋，身边是热闹的人群；第3段，你端着一碗热腾腾的小吃，边走边吃，路过一个又一个摊位，指指这个看看那个，开心得像个孩子；第4段，你和一群人参与活动，弯腰采摘、动手体验，笑声不断，你举着战利品对着镜头说：${fd.slogan}；第5段，夕阳下你站在高处，身后是老屋和炊烟，你转过身对着镜头挥手。整体风格：喜庆、热闹、有人情味，只有旁白配音，不要出现任何字幕和文字，画面中不要出现任何联系方式、电话号码、二维码。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
    pri: (fd, lc, ld, pc) => {
      const loc = fd.location || '乡村';
      const prefix = ld ? `${loc}·${ld}——` : '';
      let text = `15秒竖屏短视频，9:16比例。${prefix}带你逛${fd.name}：第1段，你站在${loc}村口大牌坊下，头顶是红灯笼和彩旗，你兴奋地朝镜头招手：快来快来！身后人群熙熙攘攘；第2段，你挤进人群看表演，跟着鼓点拍手，回头对镜头笑，眼里全是兴奋，身边是热闹的人群；第3段，你端着热腾腾小吃边走边吃，路过一个又一个摊位，指指这个看看那个，开心得像个孩子；第4段，你和一群人参与活动，弯腰采摘动手体验，笑声不断，你举着战利品对着镜头说：${fd.slogan}；第5段，你站在高处展示联系方式${fd.contact}，身后老屋炊烟，你挥手告别。整体风格：喜庆、热闹、有人情味，只有旁白配音，不要出现任何字幕和文字。${photoDesc(pc)}`;
      return clampText(text, 350, 400);
    },
  },
};

// ========== 海报提示词生成（每种风格≤500字） ==========
function generatePosterPrompt(type: TemplateType, fd: FormData, styleKey: string, isPrivate: boolean): { prompt: string; aspectRatio: string } {
  const sd = POSTER_STYLE_DESCS[styleKey];
  const loc = fd.location || '乡村';
  const aspectRatio = styleKey === 'movie-poster' ? '16:9' : '3:4';

  // 根据类型生成构图描述
  const typeCompMap: Record<string, string> = {
    'rural-goods': `画面上半部分展示${fd.name}的特写，质感细腻，光泽诱人；你本人站在画面中央偏下，双手捧着${fd.name}，面带微笑，身后是${loc}的山水田园风光；画面下方可留出品牌名称区域`,
    'homestay': `画面上半部分是${loc}的全景山水，云雾缭绕；画面中央你本人站在${fd.name}的门口或窗边，手扶门框或端着茶杯，神态惬意放松；画面下方是民宿内景的叠影`,
    'rural-food': `画面上半部分是${fd.name}的美食特写，热气腾腾，色泽诱人；画面中央你本人端着一盘招牌菜，面带笑容，围裙还没来得及解；身后是${loc}的柴火灶和厨房烟火气`,
    'craft': `画面上半部分是${fd.name}的成品特写，细节精美，工艺精湛；画面中央你本人坐在工作台前，双手正在制作，神情专注，工具散落桌面；身后是${loc}的工作坊和老墙`,
    'village-event': `画面上半部分是${loc}活动现场的全景，彩旗飘扬，人头攒动；画面中央你本人站在活动标志前，兴奋地向镜头招手；身后是热闹的人群和乡村美景`,
  };
  const typeComposition = typeCompMap[type] || typeCompMap['rural-goods'];

  const contactPublic = '画面中不要出现任何联系方式、电话号码、二维码，只保留地址和品牌名称';
  const contactPrivate = `画面底部展示联系方式：${fd.contact}`;

  let prompt = `一张${fd.name}的宣传海报，${aspectRatio === '16:9' ? '横版16:9' : '竖版3:4'}比例。构图：${typeComposition}。产品亮点：${fd.highlights}。画面中你本人的形象要清晰自然，与产品和风景融为一体，展现真实亲切的人物参与感。背景环境要体现${loc}的地域特色，山水田园、老屋石路、炊烟田野，让看海报的人一眼就能感受到这里的乡土气息和生活温度。视觉风格：${sd.visual}，整体画面要有层次感，前景是人物和产品，中景是环境场景，远景是山水天空。配色：${sd.color}，色彩搭配要和谐统一，突出产品质感的同时保持乡村的自然美感。氛围：${sd.mood}，让人看了就想来、想吃、想住、想体验。技法：${sd.technique}，画面精度要高，细节丰富，适合打印和社交媒体传播。价格信息：${fd.price}。地址：${loc}。品牌标语：${fd.slogan}。${isPrivate ? contactPrivate : contactPublic}。${photoDescPoster(0)}`;

  return { prompt: clampText(prompt, 350, 500), aspectRatio };
}

// ========== 发布文案生成（10种风格×公域/私域） ==========
function generatePublishCopy(fd: FormData, styleKey: string, isPrivate: boolean): { copy: string; tags: string[] } {
  const tmpl = PUBLISH_TEMPLATES[styleKey] || PUBLISH_TEMPLATES['default'];
  const opening = tmpl.opening(fd.name, fd.highlights);
  const body = tmpl.body(fd.name, fd.highlights, fd.price, fd.location, fd.slogan);
  const closing = tmpl.closing(fd.slogan);
  const contact = isPrivate ? `\n📞 联系：${fd.contact}` : '';

  const copy = `${opening}\n${body}${contact}\n${closing}`;

  const tags = generateTags(fd);
  return { copy, tags };
}

function generateTags(fd: FormData): string[] {
  const loc = fd.location || '';
  const locShort = loc.replace(/^[省市县乡镇]+/, '').slice(0, 4);
  const nameShort = fd.name.slice(0, 6);
  return [
    '#乡村好物',
    '#乡村振兴',
    `#${locShort}`,
    `#${nameShort}`,
    '#乡村生活',
  ];
}

// ========== 主生成函数 ==========
export function generate(
  type: TemplateType,
  formData: FormData,
  photoCount: number,
  localCase?: string,
  localDirection?: string,
): GenerateResult {
  const lc = localCase || '';
  const ld = localDirection || '';

  // 视频提示词
  const vg = videoPromptGenerators[type];
  const videoPrompt = vg.pub(formData, lc, ld, photoCount);
  const videoPromptPrivate = vg.pri(formData, lc, ld, photoCount);

  // 海报提示词（11种风格）
  const posterPrompts: Record<string, { prompt: string; promptPrivate: string; aspectRatio: string }> = {};
  for (const style of POSTER_STYLES) {
    const pub = generatePosterPrompt(type, formData, style.key, false);
    const pri = generatePosterPrompt(type, formData, style.key, true);
    posterPrompts[style.key] = {
      prompt: pub.prompt,
      promptPrivate: pri.prompt,
      aspectRatio: pub.aspectRatio,
    };
  }

  // 发布文案（10种风格）
  const publishCopies: Record<string, { copy: string; copyPrivate: string; tags: string[] }> = {};
  for (const style of PUBLISH_STYLES) {
    const pub = generatePublishCopy(formData, style.key, false);
    const pri = generatePublishCopy(formData, style.key, true);
    publishCopies[style.key] = {
      copy: pub.copy,
      copyPrivate: pri.copy,
      tags: pub.tags,
    };
  }

  return {
    videoPrompt,
    videoPromptPrivate,
    posterStyles: POSTER_STYLES,
    posterPrompts,
    publishStyles: PUBLISH_STYLES,
    publishCopies,
  };
}
