// 场景模板定义 — 输出两版完整中文AI提示词（短视频分镜 + 宣传海报）

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
  videoPrompt: string;       // AI短视频完整提示词（中文，450字以内，可直接粘贴到Sora/可灵等）
  posterPrompt: string;      // 宣传海报完整提示词（中文，可直接粘贴到Midjourney/DALL-E等）
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
  posterGenerator: (data: FormData, localLabel?: string, photoDesc?: string) => string;
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
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '乡村好物';
      const ref = photoDesc ? `画面参考用户提供的照片风格和内容。` : '';
      const prompt = `15秒竖屏短视频，9:16比例。讲述${name}的故事：第1段，你站在${loc}的田间山头，手里捧着刚采摘的${name}，身后是连绵的山和梯田，阳光照在脸上，笑着向镜头展示手中的好东西；第2段，你蹲在晾晒架旁，翻动${name}，展示自然晾晒的过程，风吹过来，你能闻到阳光的味道；第3段，你走进自家作坊，亲手打包${name}，用稻草和布包好，动作熟练又认真；第4段，你端着打包好的${name}走出院门，夕阳洒在泥墙上，回头对着镜头说：${data.slogan || '就是好吃'}；第5段，远景收尾，${loc}的全貌，炊烟升起，你站在村口挥手告别。整体风格：温暖、真实、有烟火气，只有旁白配音，不要出现任何字幕和文字，画质4K电影感。${ref}`;
      return prompt.slice(0, 450);
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '乡村好物';
      const ref = photoDesc ? `参考用户提供的照片风格。` : '';
      return `一张${name}的宣传海报，竖版3:4比例。画面中央是你本人站在${loc}的田野间，手里端着一盘${name}，身后是金色梯田和远山，阳光从侧面打过来，温暖又真实。前景点缀稻草和竹篮，${name}在盘中色泽诱人、细节清晰。整体色调暖黄大地色，复古纸张质感。画面上方用书法风格写"${name}"，下方写"${data.slogan || '来自乡村的好味道'}"。风格：中国乡村纪实摄影与民间年画融合，温暖质朴，4K高清。${ref}`;
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
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '乡村民宿';
      const ref = photoDesc ? `画面参考用户提供的照片风格和内容。` : '';
      const prompt = `15秒竖屏短视频，9:16比例。带你走进${name}：第1段，你沿着${loc}的石板路走来，两旁是老屋和红灯笼，溪水在脚边流淌，你边走边回头看镜头微笑；第2段，你推开${name}的木门，走进房间，木质家具、白床品、窗外是山和溪，你坐在窗边深呼吸，表情满足；第3段，你在露台上泡茶，远处云雾缭绕的山谷，夕阳照在脸上，安静而惬意；第4段，夜幕降临，你在院子里抬头看星空，屋里暖光从窗户透出来，溪边有萤火虫飞舞；第5段，你站在门口挥手，身后灯笼光暖暖的，对着镜头说：${data.slogan || '来住一晚吧'}。整体风格：宁静、治愈、有归属感，只有旁白配音，不要出现任何字幕和文字，4K电影画质。${ref}`;
      return prompt.slice(0, 450);
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '乡村民宿';
      const ref = photoDesc ? `参考用户提供的照片风格。` : '';
      return `一张${name}的宣传海报，竖版3:4比例。画面中央是你本人坐在${loc}老屋的木门槛上，身旁是石板路和红灯笼，身后是溪水和对面的青山，暖光从屋里洒出来映在你脸上，悠闲自在。前景有茶杯和竹椅，远处有云雾绕山。整体色调暖琥珀色和森林绿，水墨渲染质感。画面上方写"${name}"，下方写"${data.slogan || '来乡村住一晚'}"。风格：中国水墨画与现代旅行摄影融合，静谧治愈，4K高清。${ref}`;
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
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '农家菜';
      const ref = photoDesc ? `画面参考用户提供的照片风格和内容。` : '';
      const prompt = `15秒竖屏短视频，9:16比例。带你吃${name}：第1段，你掀开大铁锅盖，热气腾腾的菜冒着白烟，你夹起一块放进嘴里，眼睛一亮，竖起大拇指；第2段，你蹲在柴火灶前添柴，火苗舔着锅底，你翻动着铁锅，动作利落，脸上被火光照得通红；第3段，你带镜头走进自家菜地，弯腰摘菜，菜叶上还有露珠，你对着镜头说：新鲜着呢；第4段，你端着一桌菜从厨房出来，家人朋友围坐在一起，热热闹闹，你举杯说：${data.slogan || '来吃！'}；第5段，${loc}的傍晚，你站在饭馆门口，身后是手写招牌和暖光，笑着招手。整体风格：食欲感、热闹、有烟火气，只有旁白配音，不要出现任何字幕和文字，4K画质。${ref}`;
      return prompt.slice(0, 450);
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '农家菜';
      const ref = photoDesc ? `参考用户提供的照片风格。` : '';
      return `一张${name}的宣传海报，竖版3:4比例。画面中央是你本人站在${loc}的柴火灶前，手里端着一盘冒着热气的招牌菜，灶火映在你脸上，笑容朴实。身后是传统土灶和挂着的腊肉，前景有粗瓷碗和竹筷，桌上摆满农家菜。整体色调暖橙色和棕红色，食欲感满满。画面上方写"${name}"，下方写"${data.slogan || '来吃一顿地道的'}"。风格：美食纪实摄影与民间画风融合，热气腾腾，4K高清。${ref}`;
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
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '传统手艺';
      const ref = photoDesc ? `画面参考用户提供的照片风格和内容。` : '';
      const prompt = `15秒竖屏短视频，9:16比例。记录${name}的传承：第1段，你站在${loc}的工作坊门口，身后的架子上摆满了${name}的作品，你拿起一件成品向镜头展示，满脸自豪；第2段，你坐下来开始制作，双手翻飞，动作行云流水，你偶尔抬头看镜头，眼里全是专注和热爱；第3段，你带着镜头看墙上的老照片和旧工具，指指这个摸摸那个，讲述传承了多少年；第4段，你手把手教一个年轻人，两人相视而笑，你点点头，眼神里有欣慰；第5段，你抱着成品走出工作坊，站在${loc}的石板路上，夕阳照在你和作品上，你说：${data.slogan || '手艺不能丢'}。整体风格：庄重、温暖、有文化厚度，只有旁白配音，不要出现任何字幕和文字，4K画质。${ref}`;
      return prompt.slice(0, 450);
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '传统手艺';
      const ref = photoDesc ? `参考用户提供的照片风格。` : '';
      return `一张${name}的宣传海报，竖版3:4比例。画面中央是你本人正在制作${name}，双手特写，身边环绕着成品和工具，身后是${loc}传统工作坊的木梁和老墙。你神情专注，光线从侧面打来，突出手上的动作和作品的细节。整体色调深靛蓝与暖金色交织，丝绸与古纸质感。画面上方写"${name}"篆书风格，下方写"${data.slogan || '匠心传承'}"。风格：国家地理纪实与中国文化遗产艺术融合，厚重典雅，4K高清。${ref}`;
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
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '乡村活动';
      const ref = photoDesc ? `画面参考用户提供的照片风格和内容。` : '';
      const prompt = `15秒竖屏短视频，9:16比例。带你逛${name}：第1段，你站在${loc}村口大牌坊下，头顶是红灯笼和彩旗，你兴奋地朝镜头招手说：快来！；第2段，你挤进人群看表演，跟着鼓点拍手，回头对镜头笑，眼里全是兴奋；第3段，你端着一碗热腾腾的小吃，边走边吃，路过一个又一个摊位，指指这个看看那个；第4段，你和一群人在田间地头参与活动，弯腰采摘、动手体验，笑声不断，你举着战利品向镜头展示；第5段，夕阳下你站在${loc}高处，身后是老屋和炊烟，你转过身对着镜头说：${data.slogan || '等你来'}。整体风格：喜庆、热闹、有人情味，只有旁白配音，不要出现任何字幕和文字，4K画质。${ref}`;
      return prompt.slice(0, 450);
    },
    posterGenerator: (data, localLabel, photoDesc) => {
      const loc = localLabel || data.location || '乡村';
      const name = data.name || '乡村活动';
      const ref = photoDesc ? `参考用户提供的照片风格。` : '';
      return `一张${name}的宣传海报，竖版3:4比例。画面中央是你本人站在${loc}的热闹街头，周围是红灯笼、彩旗和欢庆的人群，你笑着举起手中的特色物品，身后是传统古建筑和远山。前景有美食摊位和手工艺品，人们三五成群其乐融融。整体色调喜庆红金色配翠绿点缀，金色箔纸装饰。画面上方写"${name}"喜庆书法，下方写"${data.slogan || '等你来'}"。风格：中国传统年画与现代活动设计融合，欢庆热烈，4K高清。${ref}`;
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
  if (photoCount === 1) return '画面参考用户提供的照片风格和内容。';
  if (photoCount === 2) return '画面参考用户提供的两张照片的风格和内容细节。';
  if (photoCount <= 3) return '画面参考用户提供的多张照片，综合场景、细节和氛围。';
  if (photoCount <= 4) return '画面参考用户提供的多张照片，综合多角度场景、细节、氛围和整体感觉。';
  return '画面参考用户提供的丰富照片素材，综合多角度场景、细节、氛围和整体感觉来构建画面。';
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

  // 生成完整的AI短视频提示词（纯中文，450字以内）
  const videoPrompt = config.videoPromptGenerator(formData, localLabel, photoDesc);

  // 生成完整的海报图片提示词（纯中文）
  const posterPrompt = config.posterGenerator(formData, localLabel, photoDesc);

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
    posterPrompt,
    posterStyle: config.posterStyle,
    posterAspectRatio: config.posterAspectRatio,
    publishCopy,
    tags,
  };
}
