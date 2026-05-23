// 场景模板定义 — 输出两版完整AI提示词（短视频分镜 + 宣传海报）

export type TemplateType = 'rural-goods' | 'homestay' | 'rural-food' | 'craft' | 'village-event';

export interface FormData {
  name: string;
  highlights: string;
  price: string;
  location: string;
  contact: string;
  slogan: string;
}

export interface GenerateResult {
  videoPrompt: string;       // AI短视频完整提示词（一段完整英文，可直接粘贴到Sora/可灵等）
  videoPromptCN: string;     // 短视频提示词中文说明
  posterPrompt: string;      // 宣传海报完整提示词（一段完整英文，可直接粘贴到Midjourney/DALL-E等）
  posterPromptCN: string;    // 海报提示词中文说明
  posterStyle: string;       // 海报推荐风格
  posterAspectRatio: string; // 海报推荐比例
  publishCopy: string;       // 发布文案（抖音/视频号/小红书）
  tags: string[];            // 话题标签
}

// ========== 场景模板配置 ==========
export const templateConfig: Record<TemplateType, {
  label: string;
  icon: string;
  description: string;
  examples: string[];
  videoPromptGenerator: (data: FormData, localLabel?: string, photoDesc?: string) => string;
  videoPromptCNGenerator: (data: FormData, localLabel?: string) => string;
  posterGenerator: (data: FormData, localLabel?: string, photoDesc?: string) => string;
  posterCNGenerator: (data: FormData, localLabel?: string) => string;
  posterStyle: string;
  posterAspectRatio: string;
  publishTemplate: (data: FormData) => string;
  tagsTemplate: (data: FormData) => string[];
}> = {
  'rural-goods': {
    label: '卖农货',
    icon: '🍊',
    description: '水果、茶叶、蜂蜜、米面、菌菇、干货、腊味、手作食品',
    examples: ['屏南高山茶', '四坪柿饼', '土蜂蜜', '农家腊肉'],
    videoPromptGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'countryside';
      const ref = photoDesc ? ` Reference style: ${photoDesc}.` : '';
      return `A 15-second cinematic vertical video (9:16) showcasing "${data.name || 'local product'}" from ${loc}. Scene 1 (0-3s): Close-up of ${data.name || 'the product'} displayed on a rustic wooden table, natural sunlight streaming through a window, warm golden hour lighting, shallow depth of field. Scene 2 (3-6s): Hands carefully arranging and presenting ${data.name || 'the product'}, showing texture and quality details, droplets of moisture on surface, macro shot, cinematic lighting. Scene 3 (6-9s): Wide shot of beautiful ${loc} countryside landscape with terraced fields and traditional village houses, morning mist in the valley, aerial drone view. Scene 4 (9-12s): Farmer packing ${data.name || 'the product'} into a rustic gift box with straw padding, hands tying a cloth ribbon, warm indoor light, authentic handmade feel. Scene 5 (12-15s): Beautifully packaged gift box on a sunlit doorstep, surrounded by autumn leaves and wildflowers, warm afternoon light, inviting and heartwarming atmosphere. Transitions: smooth crossfade between scenes. Overall mood: warm, authentic, trustworthy. Photorealistic, 4K quality.${ref}`;
    },
    videoPromptCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `15秒竖屏短视频：第1段特写${data.name || '产品'}摆木桌上暖光；第2段手展示产品细节质感；第3段航拍${loc}乡村山水；第4段村民打包产品手工包装；第5段打包成品门口秋叶野花温馨收尾。转场平滑淡入淡出，整体温暖真实可信。`;
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'countryside';
      const ref = photoDesc ? ` Visual reference from user photos: ${photoDesc}.` : '';
      return `A warm and inviting promotional poster for "${data.name || 'Local Product'}" from ${loc}. Center composition: the product displayed on a rustic wooden surface with natural props like woven baskets, dried flowers, and autumn leaves. Background: soft-focus ${loc} village landscape with terraced fields and traditional architecture. Warm golden color palette with earthy tones. Hand-drawn Chinese calligraphy style title text "${data.name || '乡村好物'}" at the top. Subtitle "${data.slogan || ''}" in elegant font at bottom. Vintage paper texture overlay. Professional product photography meets folk art style, 4K, high detail.${ref}`;
    },
    posterCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `以${data.name || '产品'}为主体的宣传海报，${loc}乡村背景，暖色调手工书法风标题，复古纸张质感，专业摄影+民间艺术风格`;
    },
    posterStyle: '复古暖色 + 乡村实景 + 书法字体',
    posterAspectRatio: '3:4（竖版海报）',
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
    videoPromptGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Reference style: ${photoDesc}.` : '';
      return `A 15-second cinematic vertical video (9:16) showcasing "${data.name || 'countryside homestay'}" in ${loc}. Scene 1 (0-3s): Establishing aerial wide shot of ${data.name || 'the homestay'} nestled in ${loc} village, traditional stone and wood architecture, morning sunlight, surrounding mountains and streams. Scene 2 (3-6s): Interior shot of cozy room, wooden furniture, white linen bedding, window with view of stream and green mountains, soft natural light, peaceful atmosphere. Scene 3 (6-9s): Person walking along a stone-paved path in ${loc}, passing traditional village houses with hanging red lanterns, gentle stream flowing, dappled sunlight through old trees, slow motion. Scene 4 (9-12s): Person sitting on wooden terrace drinking tea, overlooking misty mountain valley at golden hour, peaceful and contemplative mood. Scene 5 (12-15s): Magical night scene with warm interior lights glowing through windows, starry sky above, fireflies near the stream, stone path lit by lantern light, dreamy and romantic atmosphere. Transitions: smooth crossfade. Overall mood: serene, romantic, inviting. Cinematic, 4K.${ref}`;
    },
    videoPromptCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `15秒竖屏短视频：第1段航拍${data.name || '民宿'}坐落在${loc}山水间；第2段室内温馨房间窗含山水；第3段石板路漫步红灯笼溪水潺潺；第4段露台品茶远眺云雾山谷；第5段夜色暖光星空萤火虫灯笼引路。转场平滑，整体宁静浪漫。`;
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Visual reference from user photos: ${photoDesc}.` : '';
      return `A dreamy promotional poster for "${data.name || 'Countryside Homestay'}" in ${loc}. Main image: a charming traditional stone-and-wood house with warm window lights, set against misty green mountains and a clear stream. Foreground: stone path with red lanterns leading to the entrance. Color palette: warm amber and forest green. Title "${data.name || '民宿'}" in elegant brush calligraphy at top. Tagline "${data.slogan || ''}" at bottom. Soft watercolor texture overlay. Style: Chinese ink painting meets modern travel photography, premium feel, 4K.${ref}`;
    },
    posterCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `${data.name || '民宿'}宣传海报，${loc}山水背景，石木老屋红灯笼引路，水墨风+现代摄影融合`;
    },
    posterStyle: '水墨风 + 实景摄影 + 暖光氛围',
    posterAspectRatio: '3:4（竖版海报）',
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
    videoPromptGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Reference style: ${photoDesc}.` : '';
      return `A 15-second cinematic vertical video (9:16) showcasing "${data.name || 'village kitchen'}" in ${loc}. Scene 1 (0-3s): Close-up of sizzling signature dish, steam rising, oil glistening, dramatic food photography lighting, shot from above, dark rustic background. Scene 2 (3-6s): Cook stirring a large iron wok over wood fire, flames dancing beneath, smoke rising, hands skillfully tossing ingredients, warm firelight illuminating the cook's face. Scene 3 (6-9s): Fresh vegetables being harvested from a village garden, hands picking produce, morning dew on leaves, vibrant colors, farm-to-table story. Scene 4 (9-12s): Family and friends gathered around a large round table full of dishes, laughing and eating, chopsticks picking up food, warm indoor lighting, authentic and joyful atmosphere. Scene 5 (12-15s): Exterior of traditional restaurant with hand-painted wooden sign, warm light spilling from doorway, ${loc} scenery in background, cozy and welcoming, golden hour. Transitions: smooth crossfade. Overall mood: appetizing, warm, lively. Cinematic, 4K.${ref}`;
    },
    videoPromptCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `15秒竖屏短视频：第1段招牌菜特写热气腾腾俯拍；第2段柴火灶大铁锅翻炒火苗跳跃；第3段菜地现摘新鲜蔬菜带露珠；第4段一大家人围坐圆桌吃${data.name || '农家菜'}热闹温馨；第5段${loc}饭馆门面手写招牌暖光。转场平滑，整体食欲感满满。`;
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Visual reference from user photos: ${photoDesc}.` : '';
      return `An appetizing promotional poster for "${data.name || 'Village Kitchen'}" in ${loc}. Center: a beautifully arranged rustic table with signature dishes in ceramic bowls and plates, steam rising, chopsticks, and a clay pot. Background: traditional wood-fire kitchen with iron wok, warm amber glow. Color palette: warm oranges, deep reds, and earthy browns. Title "${data.name || '农家菜'}" in bold brushstroke calligraphy. Tagline "${data.slogan || ''}" in smaller text. Texture: aged rice paper overlay. Style: mouth-watering food photography meets Chinese folk art, 4K.${ref}`;
    },
    posterCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `${data.name || '农家菜'}美食海报，${loc}乡村厨房背景，土灶铁锅，粗碗盛菜，食欲感满满`;
    },
    posterStyle: '美食摄影 + 民间画风 + 暖橙色调',
    posterAspectRatio: '3:4（竖版海报）',
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
    videoPromptGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Reference style: ${photoDesc}.` : '';
      return `A 15-second cinematic vertical video (9:16) showcasing "${data.name || 'traditional craft'}" from ${loc}. Scene 1 (0-3s): Artistic close-up of finished ${data.name || 'craft'} piece, intricate details and textures, displayed on aged wooden surface, dramatic side lighting highlighting craftsmanship. Scene 2 (3-6s): Skilled elderly artisan's hands working on ${data.name || 'the craft'}, close-up of fingers and tools, concentration and mastery visible in every movement, warm workshop lighting. Scene 3 (6-9s): Portrait of the craft master in their ${loc} workshop, surrounded by tools and finished pieces, wearing traditional clothing, respectful composition, natural window light, documentary style. Scene 4 (9-12s): Young visitor learning from the master, hands being guided, smiles and focus, workshop interior with raw materials, warm and hopeful atmosphere. Scene 5 (12-15s): Finished products displayed at a ${loc} village market stall, traditional cloth backdrop, visitors admiring and purchasing, warm afternoon light, vibrant yet authentic atmosphere. Transitions: smooth crossfade. Overall mood: reverent, cultural, hopeful. Cinematic, 4K.${ref}`;
    },
    videoPromptCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `15秒竖屏短视频：第1段${data.name || '手艺成品'}精美细节特写侧光；第2段老艺人双手制作专注熟练工作坊暖光；第3段传承人${loc}工作坊肖像工具成品环绕；第4段年轻人跟着传承人学手把手教传承希望；第5段成品在${loc}集市展示游客围观暖光。转场平滑，整体文化厚重感。`;
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Visual reference from user photos: ${photoDesc}.` : '';
      return `A culturally rich promotional poster for "${data.name || 'Traditional Craft'}" from ${loc}. Main image: artisan's hands in motion creating the craft, with finished pieces displayed around. Background: traditional ${loc} village workshop interior with wooden beams and hanging tools. Color palette: deep indigo, warm gold, and aged paper white. Title "${data.name || '非遗手艺'}" in artistic seal-script calligraphy. Tagline "${data.slogan || ''}" in flowing script. Texture: silk fabric and aged rice paper overlay. Style: National Geographic meets Chinese cultural heritage art, 4K.${ref}`;
    },
    posterCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `${data.name || '非遗手艺'}文化海报，${loc}工作坊背景，匠人双手创作，成品环绕，深蓝+金色`;
    },
    posterStyle: '文化纪实 + 金蓝配色 + 篆书字体',
    posterAspectRatio: '3:4（竖版海报）',
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
    videoPromptGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Reference style: ${photoDesc}.` : '';
      return `A 15-second cinematic vertical video (9:16) promoting "${data.name || 'village event'}" at ${loc}. Scene 1 (0-3s): Grand establishing aerial shot of ${data.name || 'the event'} at ${loc}, decorative banners and red lanterns hanging across traditional streets, crowds gathering, festive atmosphere, golden hour. Scene 2 (3-6s): Dynamic shot of the main event activity, people participating and enjoying, traditional performances, music and dancing, vibrant energy, colorful costumes, slow motion highlights. Scene 3 (6-9s): Visitors walking through ${loc} scenic spots, families taking photos, children playing, couples enjoying the atmosphere, warm and genuine interactions. Scene 4 (9-12s): Local specialty food stalls, steaming snacks, colorful local products, vendors smiling and serving, close-up of delicious food being prepared, warm market atmosphere. Scene 5 (12-15s): Sunset shot of ${loc} with event decorations still glowing, families heading home with happy faces, warm sky colors reflecting on old rooftops, nostalgic and hopeful feeling. Transitions: smooth crossfade. Overall mood: festive, warm, community. Cinematic, 4K.${ref}`;
    },
    videoPromptCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `15秒竖屏短视频：第1段航拍${loc}${data.name || '活动'}现场红旗灯笼人群聚集喜庆；第2段活动亮点表演互动热闹彩衣飞舞；第3段游客${loc}景点游览拍照玩耍真实互动；第4段特色美食摊位热气小吃五彩特产；第5段夕阳下${loc}活动余晖笑脸回家暖色。转场平滑，整体喜庆热闹。`;
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || 'village';
      const ref = photoDesc ? ` Visual reference from user photos: ${photoDesc}.` : '';
      return `A vibrant promotional poster for "${data.name || 'Village Event'}" at ${loc}. Main image: festive village scene with red lanterns, traditional decorations, and crowds celebrating. Background: ${loc} traditional architecture and mountains. Color palette: festive red and gold with jade green accents. Title "${data.name || '乡村活动'}" in bold festive calligraphy at top. Date and location info in decorative frames. Tagline "${data.slogan || ''}" at bottom. Texture: red paper with gold foil accents. Style: Chinese New Year poster meets modern event design, celebratory and inviting, 4K.${ref}`;
    },
    posterCNGenerator: (data, localLabel) => {
      const loc = localLabel || data.location || '乡村';
      return `${data.name || '乡村活动'}宣传海报，${loc}喜庆场景红灯笼，金绿点缀，年画风+现代设计`;
    },
    posterStyle: '喜庆红金 + 年画风格 + 装饰框',
    posterAspectRatio: '3:4（竖版海报）',
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

// ========== 根据上传照片生成参考描述 ==========
function buildPhotoDescription(photoCount: number): string {
  if (photoCount === 0) return '';
  if (photoCount === 1) return 'based on the single reference photo showing the main subject and environment';
  if (photoCount === 2) return 'based on the two reference photos showing the subject details and surrounding environment';
  if (photoCount <= 3) return 'based on the reference photos showing the subject, environment, and contextual details';
  if (photoCount <= 4) return 'based on the reference photos showing the subject from multiple angles, environment, details, and atmosphere';
  return 'based on the comprehensive reference photos showing the subject from multiple angles, environment, details, atmosphere, and contextual elements';
}

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
  const photoDesc = buildPhotoDescription(photoCount);

  // 生成完整的AI短视频提示词
  const videoPrompt = config.videoPromptGenerator(formData, localLabel, photoDesc);
  const videoPromptCN = config.videoPromptCNGenerator(formData, localLabel);

  // 生成完整的海报图片提示词
  const posterPrompt = config.posterGenerator(formData, localLabel, photoDesc);
  const posterPromptCN = config.posterCNGenerator(formData, localLabel);

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

  return {
    videoPrompt,
    videoPromptCN,
    posterPrompt,
    posterPromptCN,
    posterStyle: config.posterStyle,
    posterAspectRatio: config.posterAspectRatio,
    publishCopy,
    tags,
  };
}
