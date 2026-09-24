export type Locale = 'en' | 'zh'

export const LINKS = {
  email: 'Rugee.coder@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ruijie-fan-67a9ba271/',
  github: 'https://github.com/RugeeFan',
  resume: '/Ruijie_Fan_Resume.pdf',
  studio: '/studio',
} as const

export type WorkItem = {
  id: string
  index: string
  name: string
  year: string
  href?: string
  hrefLabel?: string
  image?: { src: string; alt: string; dark?: boolean }
  stack: string[]
  kind: Record<Locale, string>
  summary: Record<Locale, string>
  points: Record<Locale, string[]>
  metric?: { value: string; label: Record<Locale, string> }
}

export const WORK: WorkItem[] = [
  {
    id: 'cleaning-manager',
    index: '01',
    name: 'Cleaning Manager',
    year: '2025 — now',
    href: 'https://cleaning-manager-showcase.vercel.app',
    hrefLabel: 'cleaning-manager-showcase.vercel.app',
    image: { src: '/images/work/cleaning-admin.jpg', alt: 'Cleaning Manager weekly scheduling board' },
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
    kind: {
      en: 'Multi-role operations SaaS · sole developer',
      zh: '多角色运营 SaaS · 独立开发',
    },
    summary: {
      en: 'The platform my own cleaning business runs on every day — an admin console, a mobile-first crew app and a customer portal in one codebase.',
      zh: '我自己的清洁生意每天都在用的平台——老板后台、移动优先的队长端和客户门户，三端同一套代码。',
    },
    points: {
      en: [
        'Recurring-job engine with a 12-week rolling window and “this / future / all” scoped edits.',
        'Drag-and-drop weekly board, PDF & SMS invoicing with signed public links, receivables ageing, crew settlements.',
        'AI operations assistant (Claude tool-calling + voice) with confirm-before-execute and a full audit log.',
      ],
      zh: [
        '周期任务引擎：12 周滚动窗口，支持「仅本次 / 此后 / 全部」三种范围的修改。',
        '拖拽式周排班看板、PDF 与短信发票（带签名的公开链接）、应收账龄、团队结算。',
        'AI 运营助手（Claude 工具调用 + 语音），执行前必须确认，并保留完整审计日志。',
      ],
    },
    metric: { value: '2,250+', label: { en: 'real jobs processed', zh: '个真实任务已处理' } },
  },
  {
    id: 'royal-rose',
    index: '02',
    name: 'Royal Rose',
    year: '2025 — now',
    href: 'https://www.royalrose.com.au',
    hrefLabel: 'royalrose.com.au',
    image: { src: '/images/work/royalrose.jpg', alt: 'Royal Rose online flower store' },
    stack: ['Remix', 'React', 'TypeScript', 'Stripe', 'PostgreSQL', 'Docker'],
    kind: {
      en: 'E-commerce store & back office · paid client',
      zh: '电商网站与后台 · 付费客户',
    },
    summary: {
      en: 'A Sydney florist’s storefront and admin, from Stripe checkout to delivery-zone pricing the owner can change without calling me.',
      zh: '悉尼一家花店的线上商店与管理后台——从 Stripe 支付，到店主无需找我就能自己调整的分区配送费。',
    },
    points: {
      en: [
        'Stripe Checkout with webhook-driven order states and postcode-based shipping zones.',
        'Product, order and customer management, CMS-editable pages, image pipeline, multi-language.',
        'Migrated production from Fly.io to a self-hosted Docker + Nginx stack with automated backups.',
      ],
      zh: [
        'Stripe Checkout 支付，订单状态由 webhook 驱动；按邮编划分的配送区域与运费。',
        '商品、订单、客户管理，可编辑的页面内容，图片处理管线，多语言。',
        '将生产环境从 Fly.io 迁移到自托管 Docker + Nginx，并配置自动备份。',
      ],
    },
    metric: { value: 'Live', label: { en: 'taking real payments', zh: '线上真实收款' } },
  },
  {
    id: 'saunamind',
    index: '03',
    name: 'SaunaMind',
    year: '2026',
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Skia', 'Reanimated'],
    kind: {
      en: 'iOS wellness app · 3-person team',
      zh: 'iOS 健康应用 · 三人团队',
    },
    summary: {
      en: 'Joined an existing 800-commit codebase for a sauna and cold-plunge tracker with live heart-rate sessions — and made myself useful fast.',
      zh: '中途加入一个已有 800+ 次提交的桑拿 / 冷水浴训练应用（实时心率），并快速产出。',
    },
    points: {
      en: [
        'Closed P0 security gaps: Supabase row-level security, signature checks on Twilio and RevenueCat webhooks.',
        'Led the front-end redesign — design tokens, a real-time session UI in Skia / Reanimated, Dynamic Island Live Activity.',
        'Handed the work back with audit reports, a test guide and hand-over docs.',
      ],
      zh: [
        '修复 P0 级安全问题：Supabase 行级安全、Twilio 与 RevenueCat webhook 的签名校验。',
        '主导前端重设计——设计令牌、基于 Skia / Reanimated 的实时训练界面、灵动岛实时活动。',
        '交付时附带审计报告、测试指南与交接文档。',
      ],
    },
    metric: { value: '155', label: { en: 'commits in 4 weeks', zh: '次提交 · 4 周内' } },
  },
  {
    id: 'pureglim',
    index: '04',
    name: 'PureGlim',
    year: '2026',
    href: 'https://pureglim.com.au',
    hrefLabel: 'pureglim.com.au',
    image: { src: '/images/work/pureglim.jpg', alt: 'PureGlim cleaning booking website' },
    stack: ['Next.js 16', 'PostgreSQL', 'Prisma', 'Twilio Verify', 'Google Maps'],
    kind: {
      en: 'Booking site, referral platform & admin',
      zh: '预约网站、推荐返佣平台与后台',
    },
    summary: {
      en: 'The customer-facing side of the cleaning business: instant quotes, bookings, and a referral program that tracks its own commissions.',
      zh: '清洁生意面向客户的一侧：即时报价、在线预约，以及一套能自己核算佣金的推荐计划。',
    },
    points: {
      en: [
        'Quote flows with a live price estimator and Google address autocomplete.',
        'Referral program: phone-OTP sign-up, unique codes, commission tracking, payout dashboard.',
        'Rate limiting and brute-force lockout; 11 data-driven suburb pages with structured data for local SEO.',
      ],
      zh: [
        '报价流程带实时价格估算与 Google 地址自动补全。',
        '推荐计划：手机验证码注册、唯一推荐码、佣金追踪、结算看板。',
        '限流与防暴力破解；11 个数据驱动的区域落地页，带结构化数据做本地 SEO。',
      ],
    },
  },
  {
    id: 'effigy',
    index: '05',
    name: 'Effigy',
    year: '2026',
    href: 'https://effigies.vercel.app',
    hrefLabel: 'effigies.vercel.app',
    image: { src: '/images/work/effigy-gallery.jpg', alt: 'Effigy gallery of generated 3D coins', dark: true },
    stack: ['Next.js 16', 'React Three Fiber', 'wagmi / viem', 'Solidity', 'Foundry'],
    kind: {
      en: 'Generative on-chain NFT · personal project',
      zh: '链上生成式 NFT · 个人项目',
    },
    summary: {
      en: 'Your on-chain life, struck in effigy: a wallet’s history becomes a one-of-a-kind 3D antique coin you can mint.',
      zh: '每个钱包都是一枚被时间铸造的硬币：你的链上历史会生成一枚独一无二、可以铸造的 3D 古币。',
    },
    points: {
      en: [
        'ERC-721 with ERC-2981 royalties and EIP-712 signed vouchers that block forged traits; verified on Base Sepolia.',
        '17 Foundry tests including fuzzing.',
        'Coin models compressed 81 MB → 18 MB (meshopt) and fully preloaded; GPU-tier detection with a mobile WebGL fallback.',
      ],
      zh: [
        'ERC-721 + ERC-2981 版税，EIP-712 签名凭证防止伪造属性；已在 Base Sepolia 部署并验证。',
        '17 个 Foundry 测试，包含模糊测试。',
        '硬币模型经 meshopt 从 81 MB 压到 18 MB 并全量预载；GPU 分级检测与移动端 WebGL 降级。',
      ],
    },
  },
]

export const STACK_MARQUEE = [
  'TypeScript', 'React', 'Next.js', 'Remix', 'React Native', 'Node.js', 'PostgreSQL', 'Prisma',
  'Tailwind CSS', 'Stripe', 'Twilio', 'Supabase', 'Docker', 'Nginx', 'three.js', 'Solidity', 'Foundry', 'Claude API',
]

type Dict = {
  nav: { work: string; about: string; contact: string; resume: string; switchTo: string; switchHref: string }
  hero: {
    eyebrow: string
    lines: [string, string, string]
    avatarAfterLine: number
    intro: string
    status: string
    ctaWork: string
    ctaResume: string
    studioLead: string
    studioLink: string
    scroll: string
  }
  stats: { value: number; prefix?: string; suffix?: string; label: string }[]
  work: { eyebrow: string; title: string; note: string; visit: string; team: string; view: string }
  about: {
    eyebrow: string
    title: string
    paragraphs: string[]
    principlesTitle: string
    principles: { title: string; body: string }[]
  }
  offscreen: { eyebrow: string; title: string; body: string; hint: string; soundOn: string; soundOff: string }
  path: { eyebrow: string; title: string; items: { when: string; what: string; where: string }[] }
  contact: {
    eyebrow: string
    title: string
    hiringTitle: string
    hiringBody: string
    projectTitle: string
    projectBody: string
    projectCta: string
    copy: string
    copied: string
  }
  footer: { line: string; top: string }
}

export const DICT: Record<Locale, Dict> = {
  en: {
    nav: { work: 'Work', about: 'About', contact: 'Contact', resume: 'Résumé', switchTo: '中文', switchHref: '/zh' },
    hero: {
      eyebrow: 'Full-stack developer — Sydney, Australia',
      lines: ['I build software', 'small businesses', 'actually run on.'],
      avatarAfterLine: 0,
      intro:
        'I’m Ruijie — most people call me Rugee. I co-run a cleaning business in Sydney and wrote the platform it operates on, then started shipping stores and systems for other local businesses. TypeScript, React, Node and PostgreSQL, from database schema to deployment.',
      status: 'Open to full-stack & front-end roles · Australia-wide',
      ctaWork: 'See selected work',
      ctaResume: 'Download résumé',
      studioLead: 'Have a project instead?',
      studioLink: 'Work with me',
      scroll: 'Scroll',
    },
    stats: [
      { value: 2250, suffix: '+', label: 'jobs run through software I built' },
      { value: 146, label: 'customer accounts in production' },
      { value: 155, label: 'commits in 4 weeks on an inherited codebase' },
      { value: 5, label: 'products shipped, schema to server' },
    ],
    work: {
      eyebrow: 'Selected work',
      title: 'Real systems, real users.',
      note: 'Nothing here is a tutorial clone. Each one is live, paid for, or in daily use.',
      visit: 'Visit',
      team: 'Private beta · TestFlight',
      view: 'View',
    },
    about: {
      eyebrow: 'About',
      title: 'A developer who has also been the customer.',
      paragraphs: [
        'After my Master of Computer Science at the University of Wollongong, I started a cleaning business with my family. Running it taught me what software is actually for: fewer phone calls, fewer spreadsheets, fewer things held together by memory.',
        'So I built the system we needed, and it now schedules two crews and invoices 140+ customers. That turned into client work through my company, Ruge Solutions — and now I’m looking for a team where I can keep learning from stronger engineers.',
      ],
      principlesTitle: 'How I work',
      principles: [
        { title: 'Keep learning', body: 'React Native, Remix and Solidity were all new to me once. Each shipped within weeks.' },
        { title: 'Own the outcome', body: 'When production breaks I fix it first, then explain what happened. No blame-shifting.' },
        { title: 'Say it plainly', body: 'Years of dealing with customers, staff and clients. I write docs other people can pick up.' },
      ],
    },
    offscreen: {
      eyebrow: 'Off-screen',
      title: 'Guitar, bass, and a packed bag.',
      body: 'Away from the keyboard I play guitar and bass, and I travel whenever the calendar allows. Music taught me most of what I know about practice: slow, repeated, a little better each time.',
      hint: 'Go on — pluck the strings.',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
    },
    path: {
      eyebrow: 'Path',
      title: 'The short version.',
      items: [
        { when: '2026', what: 'Shipped Effigy and joined the SaunaMind team', where: 'Web3 · React Native' },
        { when: '2025', what: 'Client work through Ruge Solutions Pty Ltd', where: 'Royal Rose · Flower Hut' },
        { when: '2020 —', what: 'Co-founded and run a family cleaning business', where: 'PureGlim · Sydney' },
        { when: '2020', what: 'Master of Computer Science', where: 'University of Wollongong' },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Let’s talk.',
      hiringTitle: 'Hiring?',
      hiringBody: 'I have full work rights in Australia and I’m happy to relocate. Email is fastest.',
      projectTitle: 'Have a project?',
      projectBody: 'I still take on a small number of websites and business systems through Ruge Solutions.',
      projectCta: 'Work with me',
      copy: 'Copy email',
      copied: 'Copied',
    },
    footer: { line: 'Built by Rugee in Sydney.', top: 'Back to top' },
  },
  zh: {
    nav: { work: '作品', about: '关于', contact: '联系', resume: '简历', switchTo: 'EN', switchHref: '/' },
    hero: {
      eyebrow: '全栈开发者 — 澳大利亚 · 悉尼',
      lines: ['我写的软件，', '是小生意每天', '真正在用的。'],
      avatarAfterLine: 0,
      intro:
        '我是 Ruijie，大家叫我 Rugee。我在悉尼和家人一起经营一家清洁公司，并亲手写了它赖以运转的整套系统；之后开始为其他本地商家交付电商网站和业务系统。TypeScript、React、Node、PostgreSQL——从数据库设计一直做到上线部署。',
      status: '正在寻找全栈 / 前端岗位 · 全澳均可',
      ctaWork: '查看作品',
      ctaResume: '下载简历',
      studioLead: '有项目想做？',
      studioLink: '找我合作',
      scroll: '向下',
    },
    stats: [
      { value: 2250, suffix: '+', label: '个任务跑在我写的系统上' },
      { value: 146, label: '个生产环境客户账户' },
      { value: 155, label: '次提交 · 4 周 · 接手他人代码库' },
      { value: 5, label: '个上线产品，从建表到服务器' },
    ],
    work: {
      eyebrow: '精选作品',
      title: '真实的系统，真实的用户。',
      note: '这里没有教程仿写。每一个都是已上线、有人付费、或每天在用的。',
      visit: '访问',
      team: '内测中 · TestFlight',
      view: '查看',
    },
    about: {
      eyebrow: '关于我',
      title: '一个自己当过甲方的开发者。',
      paragraphs: [
        '在卧龙岗大学读完计算机硕士后，我和家人一起做起了清洁生意。经营它让我真正明白软件是拿来干什么的：少打几个电话，少填几张表，少一些只靠脑子记的事情。',
        '于是我把我们需要的系统写了出来——现在它为两支团队排班，给 140 多位客户开发票。这后来变成了我通过自己公司 Ruge Solutions 承接的客户项目。现在，我想加入一个团队，向更强的工程师学习。',
      ],
      principlesTitle: '我的做事方式',
      principles: [
        { title: '保持学习', body: 'React Native、Remix、Solidity 对我来说都曾是新东西，每一个都在几周内交付上线。' },
        { title: '对结果负责', body: '线上出问题，我先修，再讲清楚发生了什么。从不甩锅。' },
        { title: '有话直说', body: '多年和客户、员工、甲方打交道。我写的文档，别人能直接接手。' },
      ],
    },
    offscreen: {
      eyebrow: '屏幕之外',
      title: '吉他、贝斯，和一只随时能出发的包。',
      body: '不写代码的时候，我弹吉他和贝斯，日程允许就出去旅行。关于「练习」这件事，我懂的大部分是音乐教的：慢一点，多重复，每次好一点。',
      hint: '来，拨一下琴弦。',
      soundOn: '声音：开',
      soundOff: '声音：关',
    },
    path: {
      eyebrow: '经历',
      title: '简短版本。',
      items: [
        { when: '2026', what: '发布 Effigy，并加入 SaunaMind 团队', where: 'Web3 · React Native' },
        { when: '2025', what: '通过 Ruge Solutions Pty Ltd 承接客户项目', where: 'Royal Rose · Flower Hut' },
        { when: '2020 —', what: '与家人共同创办并经营清洁公司', where: 'PureGlim · 悉尼' },
        { when: '2020', what: '计算机科学硕士', where: '卧龙岗大学 (UOW)' },
      ],
    },
    contact: {
      eyebrow: '联系',
      title: '聊聊吧。',
      hiringTitle: '在招人？',
      hiringBody: '我在澳洲拥有完整工作权利，也愿意搬去其他城市。发邮件最快。',
      projectTitle: '有项目？',
      projectBody: '我仍通过 Ruge Solutions 承接少量网站与业务系统项目。',
      projectCta: '找我合作',
      copy: '复制邮箱',
      copied: '已复制',
    },
    footer: { line: 'Rugee 写于悉尼。', top: '回到顶部' },
  },
}
