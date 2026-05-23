// 场景模板定义 — 输出AI短视频分镜提示词 + 海报图片提示词

export type TemplateType = 'rural-goods' | 'homestay' | 'rural-food' | 'craft' | 'village-event';

export interface FormData {
  name: string;
  highlights: string;
  price: string;
  location: string;
  contact: string;
  slogan: string;
}

// AI短视频分镜 — 每段3秒，共5段
export interface VideoScenePrompt {
  segment: number;       // 第几段 (1-5)
  timeRange: string;     // 时间范围
  prompt: string;        // AI视频生成提示词（英文，可直接用于Sora/Kling等）
  promptCN: string;      // 中文对照说明
  subtitle: string;      // 该段配的字幕
}

// 宣传海报图片提示词
export interface PosterPrompt {
  prompt: string;        // AI图片生成提示词（英文，可直接用于Midjourney/DALL-E等）
  promptCN: string;      // 中文对照说明
  style: string;         // 推荐风格
  aspectRatio: string;   // 推荐比例
}

export interface GenerateResult {
  videoPrompts: VideoScenePrompt[];   // AI短视频5段分镜提示词
  posterPrompt: PosterPrompt;          // 宣传海报图片提示词
  publishCopy: string;                 // 发布文案（抖音/视频号/小红书）
  tags: string[];                      // 话题标签
}

// ========== 场景模板配置 ==========
export const templateConfig: Record<TemplateType, {
  label: string;
  icon: string;
  description: string;
  examples: string[];
  videoSceneGenerator: (data: FormData, localLabel?: string) => VideoScenePrompt[];
  posterGenerator: (data: FormData, localLabel?: string) => PosterPrompt;
  publishTemplate: (data: FormData) => string;
  tagsTemplate: (data: FormData) => string[];
}> = {
  'rural-goods': {
    label: '卖农货',
    icon: '🍊',
    description: '水果、茶叶、蜂蜜、米面、菌菇、干货、腊味、手作食品',
    examples: ['屏南高山茶', '四坪柿饼', '土蜂蜜', '农家腊肉'],
    videoSceneGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'countryside';
      return [
        {
          segment: 1, timeRange: '0-3秒',
          prompt: `Close-up of ${data.name || 'local product'} displayed on a rustic wooden table, natural sunlight streaming through a window, warm golden hour lighting, shallow depth of field, photorealistic, 4K`,
          promptCN: `特写：${data.name || '产品'}摆在木桌上，阳光从窗户照进来，温暖自然光`,
          subtitle: data.name || '好东西来了',
        },
        {
          segment: 2, timeRange: '3-6秒',
          prompt: `Hands carefully arranging ${data.name || 'fresh local produce'}, showing texture and quality details, steam rising if hot food, droplets of moisture on surface, macro shot, cinematic lighting`,
          promptCN: `手展示${data.name || '产品'}细节，能看到质感和品质`,
          subtitle: data.highlights ? data.highlights.slice(0, 25) : '品质看得见',
        },
        {
          segment: 3, timeRange: '6-9秒',
          prompt: `Wide shot of beautiful ${loc} countryside landscape with terraced fields and traditional village houses, morning mist in the valley, lush green mountains, aerial drone view, cinematic 4K`,
          promptCN: `航拍${loc}乡村风景，山清水秀，云雾缭绕`,
          subtitle: data.location ? `来自${data.location}` : '产地直发',
        },
        {
          segment: 4, timeRange: '9-12秒',
          prompt: `Farmer or villager packing ${data.name || 'product'} into a rustic gift box with straw padding, hands tying a cloth ribbon, warm indoor light, authentic and handmade feel, photorealistic`,
          promptCN: `村民打包${data.name || '产品'}，用草编盒子装好，手工绑丝带`,
          subtitle: data.price || '实惠好价',
        },
        {
          segment: 5, timeRange: '12-15秒',
          prompt: `Beautifully packaged ${data.name || 'product'} gift box sitting on a sunlit doorstep, surrounded by autumn leaves and wildflowers, warm afternoon light, inviting and heartwarming atmosphere, product photography, 4K`,
          promptCN: `打包好的${data.name || '产品'}放在门口，周围秋叶和野花，温馨画面`,
          subtitle: data.slogan || '值得一试',
        },
      ];
    },
    posterGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'countryside';
      return {
        prompt: `A warm and inviting promotional poster for "${data.name || 'Local Product'}" from ${loc}. Center composition: the product displayed on a rustic wooden surface with natural props like woven baskets, dried flowers, and autumn leaves. Background: soft-focus ${loc} village landscape with terraced fields and traditional architecture. Warm golden color palette with earthy tones. Hand-drawn Chinese calligraphy style title text "${data.name || '乡村好物'}" at the top. Subtitle "${data.slogan || ''}" in elegant font at bottom. Vintage paper texture overlay. Professional product photography meets folk art style, 4K, high detail`,
        promptCN: `以${data.name || '产品'}为主体的宣传海报，${loc}乡村背景，暖色调，手工书法风标题，复古纸张质感`,
        style: '复古暖色 + 乡村实景 + 书法字体',
        aspectRatio: '3:4（竖版海报）',
      };
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
    videoSceneGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return [
        {
          segment: 1, timeRange: '0-3秒',
          prompt: `Establishing wide shot of ${data.name || 'countryside homestay'} nestled in ${loc} village, traditional stone and wood architecture, morning sunlight, surrounding mountains and streams, cinematic aerial view, warm and inviting, 4K`,
          promptCN: `全景：${data.name || '民宿'}坐落在${loc}，传统石木建筑，山水环绕`,
          subtitle: data.name || '来这里住一晚',
        },
        {
          segment: 2, timeRange: '3-6秒',
          prompt: `Interior shot of cozy ${data.name || 'homestay'} room, wooden furniture, white linen bedding, window with view of stream and green mountains, soft natural light, warm and peaceful atmosphere, architectural photography, 4K`,
          promptCN: `室内：温馨房间，木家具，白床品，窗外山水如画`,
          subtitle: data.highlights ? data.highlights.slice(0, 25) : '住得舒服',
        },
        {
          segment: 3, timeRange: '6-9秒',
          prompt: `Person walking along a stone-paved path in ${loc}, passing traditional village houses with hanging red lanterns, gentle stream flowing beside the path, dappled sunlight through old trees, slow motion walking, cinematic, 4K`,
          promptCN: `人在${loc}石板路上漫步，老屋红灯笼，溪水潺潺`,
          subtitle: data.location ? `在${data.location}` : '山里好地方',
        },
        {
          segment: 4, timeRange: '9-12秒',
          prompt: `Relaxing scene: person sitting on wooden terrace of ${data.name || 'homestay'}, drinking tea, overlooking misty mountain valley at golden hour, peaceful and contemplative mood, soft warm lighting, cinematic, 4K`,
          promptCN: `人在民宿露台喝茶，远眺云雾山谷，夕阳暖光`,
          subtitle: data.price || '住得安心',
        },
        {
          segment: 5, timeRange: '12-15秒',
          prompt: `Magical night scene of ${data.name || 'village homestay'} with warm interior lights glowing through windows, starry sky above, fireflies near the stream, stone path lit by lantern light, dreamy and romantic atmosphere, long exposure, 4K`,
          promptCN: `夜晚：民宿窗内暖光，星空满天，溪边萤火虫，灯笼映路`,
          subtitle: data.slogan || '等你来住',
        },
      ];
    },
    posterGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return {
        prompt: `A dreamy promotional poster for "${data.name || 'Countryside Homestay'}" in ${loc}. Main image: a charming traditional stone-and-wood house with warm window lights, set against misty green mountains and a clear stream. Foreground: stone path with red lanterns leading to the entrance. Color palette: warm amber and forest green. Title "${data.name || '民宿'}" in elegant brush calligraphy at top. Tagline "${data.slogan || ''}" at bottom. Soft watercolor texture overlay. Style: Chinese ink painting meets modern travel photography, premium feel, 4K`,
        promptCN: `${data.name || '民宿'}宣传海报，${loc}山水背景，石木老屋，红灯笼引路，水墨风+现代摄影融合`,
        style: '水墨风 + 实景摄影 + 暖光氛围',
        aspectRatio: '3:4（竖版海报）',
      };
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
    videoSceneGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return [
        {
          segment: 1, timeRange: '0-3秒',
          prompt: `Close-up of sizzling signature dish from ${data.name || 'village kitchen'}, steam rising, oil glistening, shot from above, dramatic food photography lighting, dark rustic background, photorealistic, 4K`,
          promptCN: `特写：${data.name || '招牌菜'}热气腾腾，油光发亮，俯拍美食`,
          subtitle: data.name || '来尝尝',
        },
        {
          segment: 2, timeRange: '3-6秒',
          prompt: `Cook stirring a large iron wok over wood fire in a traditional village kitchen, flames dancing beneath, smoke rising, hands skillfully tossing ingredients, warm firelight illuminating the cook's face, cinematic, 4K`,
          promptCN: `厨师在柴火灶前翻炒大铁锅，火苗跳跃，烟雾升腾`,
          subtitle: data.highlights ? data.highlights.slice(0, 25) : '现做现炒',
        },
        {
          segment: 3, timeRange: '6-9秒',
          prompt: `Fresh vegetables being harvested from a village garden, hands picking tomatoes and herbs, morning dew on leaves, vibrant green and red colors, natural sunlight, farm-to-table story, cinematic, 4K`,
          promptCN: `从菜地现摘新鲜蔬菜，叶子上还带着露珠`,
          subtitle: '食材新鲜才好吃',
        },
        {
          segment: 4, timeRange: '9-12秒',
          prompt: `Lively scene of family and friends gathered around a large round table full of ${data.name || 'village dishes'} in ${loc}, laughing and eating, chopsticks picking up food, warm indoor lighting, authentic and joyful atmosphere, cinematic, 4K`,
          promptCN: `一大家人围坐圆桌吃${data.name || '农家菜'}，笑声不断，热闹温馨`,
          subtitle: data.price || '好吃不贵',
        },
        {
          segment: 5, timeRange: '12-15秒',
          prompt: `Exterior of traditional ${data.name || 'village restaurant'} with a hand-painted wooden sign, warm light spilling from doorway, a few villagers chatting outside, ${loc} scenery in background, cozy and welcoming, golden hour, 4K`,
          promptCN: `${data.name || '饭馆'}门面，手写木招牌，门口村民聊天，${loc}风景`,
          subtitle: data.slogan || '等你来吃',
        },
      ];
    },
    posterGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return {
        prompt: `An appetizing promotional poster for "${data.name || 'Village Kitchen'}" in ${loc}. Center: a beautifully arranged rustic table with signature dishes in ceramic bowls and plates, steam rising, chopsticks, and a clay pot. Background: traditional wood-fire kitchen with iron wok, warm amber glow. Color palette: warm oranges, deep reds, and earthy browns. Title "${data.name || '农家菜'}" in bold brushstroke calligraphy. Tagline "${data.slogan || ''}" in smaller text. Texture: aged rice paper overlay. Style: mouth-watering food photography meets Chinese folk art, 4K`,
        promptCN: `${data.name || '农家菜'}美食海报，${loc}乡村厨房背景，土灶铁锅，粗碗盛菜，食欲感满满`,
        style: '美食摄影 + 民间画风 + 暖橙色调',
        aspectRatio: '3:4（竖版海报）',
      };
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
    videoSceneGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return [
        {
          segment: 1, timeRange: '0-3秒',
          prompt: `Artistic close-up of finished ${data.name || 'traditional craft'} piece, intricate details and textures, displayed on aged wooden surface, dramatic side lighting highlighting craftsmanship, museum-quality photography, 4K`,
          promptCN: `特写：${data.name || '手艺成品'}精美细节，陈列在旧木板上，侧光突出工艺`,
          subtitle: data.name || '老手艺',
        },
        {
          segment: 2, timeRange: '3-6秒',
          prompt: `Skilled elderly artisan's hands working on ${data.name || 'traditional craft'}, close-up of fingers and tools, sawdust or clay or thread, concentration and mastery visible in every movement, warm workshop lighting, cinematic, 4K`,
          promptCN: `老艺人双手制作${data.name || '手艺'}的特写，专注熟练，工作坊暖光`,
          subtitle: data.highlights ? data.highlights.slice(0, 25) : '匠心独运',
        },
        {
          segment: 3, timeRange: '6-9秒',
          prompt: `Portrait of the craft master in their ${loc} workshop, surrounded by tools and finished pieces, wearing traditional clothing, respectful and dignified composition, natural window light, documentary photography style, 4K`,
          promptCN: `传承人在${loc}工作坊的肖像，周围摆满工具和成品`,
          subtitle: '一代传一代',
        },
        {
          segment: 4, timeRange: '9-12秒',
          prompt: `Young visitor learning ${data.name || 'traditional craft'} from the master, hands being guided, smiles and focus, workshop interior with raw materials visible, warm and hopeful atmosphere, cinematic, 4K`,
          promptCN: `年轻人跟着传承人学做${data.name || '手艺'}，手把手教，希望与传承`,
          subtitle: data.price || '来体验',
        },
        {
          segment: 5, timeRange: '12-15秒',
          prompt: `Beautiful finished ${data.name || 'craft'} products displayed at a ${loc} village market stall, traditional cloth backdrop, visitors admiring and purchasing, warm afternoon light, vibrant yet authentic atmosphere, cinematic, 4K`,
          promptCN: `${data.name || '手艺成品'}在${loc}集市上展示，游客围观购买，暖光`,
          subtitle: data.slogan || '手艺不老',
        },
      ];
    },
    posterGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return {
        prompt: `A culturally rich promotional poster for "${data.name || 'Traditional Craft'}" from ${loc}. Main image: artisan's hands in motion creating the craft, with finished pieces displayed around. Background: traditional ${loc} village workshop interior with wooden beams and hanging tools. Color palette: deep indigo, warm gold, and aged paper white. Title "${data.name || '非遗手艺'}" in artistic seal-script calligraphy. Tagline "${data.slogan || ''}" in flowing script. Texture: silk fabric and aged rice paper overlay. Style: National Geographic meets Chinese cultural heritage art, 4K`,
        promptCN: `${data.name || '非遗手艺'}文化海报，${loc}工作坊背景，匠人双手创作，成品环绕，深蓝+金色`,
        style: '文化纪实 + 金蓝配色 + 篆书字体',
        aspectRatio: '3:4（竖版海报）',
      };
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
    videoSceneGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return [
        {
          segment: 1, timeRange: '0-3秒',
          prompt: `Grand establishing shot of ${data.name || 'village event'} at ${loc}, decorative banners and red lanterns hanging across traditional streets, crowds gathering, festive atmosphere, aerial view, golden hour, cinematic, 4K`,
          promptCN: `全景：${loc}${data.name || '活动'}现场，红旗灯笼，人群聚集，喜庆热闹`,
          subtitle: data.name || '好消息',
        },
        {
          segment: 2, timeRange: '3-6秒',
          prompt: `Dynamic shot of the main event activity at ${data.name || 'village festival'}, people participating and enjoying, traditional performances, music and dancing, vibrant energy, colorful costumes, slow motion highlights, cinematic, 4K`,
          promptCN: `活动亮点：表演、互动、热闹非凡，彩衣飞舞`,
          subtitle: data.highlights ? data.highlights.slice(0, 25) : '热闹非凡',
        },
        {
          segment: 3, timeRange: '6-9秒',
          prompt: `Visitors walking through ${loc} village scenic spots, families taking photos, children playing, couples enjoying the atmosphere, authentic village life meets tourism, warm and genuine interactions, cinematic, 4K`,
          promptCN: `游客在${loc}景点游览，拍照、玩耍，真实自然的互动`,
          subtitle: data.location ? `就在${data.location}` : '欢迎来玩',
        },
        {
          segment: 4, timeRange: '9-12秒',
          prompt: `Local specialty food stalls at ${data.name || 'village event'}, steaming snacks, colorful local products, vendors smiling and serving, close-up of delicious food being prepared, warm market atmosphere, cinematic, 4K`,
          promptCN: `特色美食摊位，冒着热气的小吃，五彩斑斓的土特产`,
          subtitle: data.price || '免费参加',
        },
        {
          segment: 5, timeRange: '12-15秒',
          prompt: `Sunset shot of ${loc} village with event decorations still glowing, families heading home with happy faces, warm sky colors reflecting on old rooftops, nostalgic and hopeful feeling, wide cinematic shot, 4K`,
          promptCN: `夕阳下${loc}，活动余晖，人们带着笑脸回家，暖色调`,
          subtitle: data.slogan || '不见不散',
        },
      ];
    },
    posterGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || 'village';
      return {
        prompt: `A vibrant promotional poster for "${data.name || 'Village Event'}" at ${loc}. Main image: festive village scene with red lanterns, traditional decorations, and crowds celebrating. Background: ${loc} traditional architecture and mountains. Color palette: festive red and gold with jade green accents. Title "${data.name || '乡村活动'}" in bold festive calligraphy at top. Date and location info in decorative frames. Tagline "${data.slogan || ''}" at bottom. Texture: red paper with gold foil accents. Style: Chinese New Year poster meets modern event design, celebratory and inviting, 4K`,
        promptCN: `${data.name || '乡村活动'}宣传海报，${loc}喜庆场景，红灯笼，金绿点缀，年画风+现代设计`,
        style: '喜庆红金 + 年画风格 + 装饰框',
        aspectRatio: '3:4（竖版海报）',
      };
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

// ========== 核心生成函数 ==========
export function generateContent(
  type: TemplateType,
  formData: FormData,
  photoCount: number,
  localCase?: string,
  localDirection?: string,
): GenerateResult {
  const config = templateConfig[type];
  const localLabel = localCase ? localCaseConfig[localCase]?.label : undefined;

  // 生成AI短视频分镜提示词
  const videoPrompts = config.videoSceneGenerator(formData, localLabel);

  // 生成海报图片提示词
  const posterPrompt = config.posterGenerator(formData, localLabel);

  // 生成发布文案
  let publishCopy = config.publishTemplate(formData);
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

  return { videoPrompts, posterPrompt, publishCopy, tags };
}
