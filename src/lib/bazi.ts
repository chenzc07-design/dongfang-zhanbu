import { Solar } from 'lunar-typescript';
import type { BaZiResult, Pillar, ElementProfile } from './types';

// ========== Translation Maps ==========

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STEM_EN: Record<string, string> = {
  '甲': 'Jia (Yang Wood)',
  '乙': 'Yi (Yin Wood)',
  '丙': 'Bing (Yang Fire)',
  '丁': 'Ding (Yin Fire)',
  '戊': 'Wu (Yang Earth)',
  '己': 'Ji (Yin Earth)',
  '庚': 'Geng (Yang Metal)',
  '辛': 'Xin (Yin Metal)',
  '壬': 'Ren (Yang Water)',
  '癸': 'Gui (Yin Water)',
};

const BRANCH_EN: Record<string, string> = {
  '子': 'Zi (Rat)',
  '丑': 'Chou (Ox)',
  '寅': 'Yin (Tiger)',
  '卯': 'Mao (Rabbit)',
  '辰': 'Chen (Dragon)',
  '巳': 'Si (Snake)',
  '午': 'Wu (Horse)',
  '未': 'Wei (Goat)',
  '申': 'Shen (Monkey)',
  '酉': 'You (Rooster)',
  '戌': 'Xu (Dog)',
  '亥': 'Hai (Pig)',
};

const STEM_SIMPLE: Record<string, string> = {
  '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding',
  '戊': 'Wu', '己': 'Ji', '庚': 'Geng', '辛': 'Xin',
  '壬': 'Ren', '癸': 'Gui',
};

const BRANCH_SIMPLE: Record<string, string> = {
  '子': 'Zi', '丑': 'Chou', '寅': 'Yin', '卯': 'Mao',
  '辰': 'Chen', '巳': 'Si', '午': 'Wu', '未': 'Wei',
  '申': 'Shen', '酉': 'You', '戌': 'Xu', '亥': 'Hai',
};

const STEM_ELEMENT: Record<string, string> = {
  '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth', '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water',
};

const BRANCH_ELEMENT: Record<string, string> = {
  '子': 'Water', '丑': 'Earth', '寅': 'Wood', '卯': 'Wood',
  '辰': 'Earth', '巳': 'Fire', '午': 'Fire', '未': 'Earth',
  '申': 'Metal', '酉': 'Metal', '戌': 'Earth', '亥': 'Water',
};

const BRANCH_ANIMAL: Record<string, string> = {
  '子': 'Rat', '丑': 'Ox', '寅': 'Tiger', '卯': 'Rabbit',
  '辰': 'Dragon', '巳': 'Snake', '午': 'Horse', '未': 'Goat',
  '申': 'Monkey', '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig',
};

const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

const HIDDEN_STEM_EN: Record<string, string> = {
  '甲': 'Jia (Wood)', '乙': 'Yi (Wood)', '丙': 'Bing (Fire)',
  '丁': 'Ding (Fire)', '戊': 'Wu (Earth)', '己': 'Ji (Earth)',
  '庚': 'Geng (Metal)', '辛': 'Xin (Metal)', '壬': 'Ren (Water)',
  '癸': 'Gui (Water)',
};

// Ten Gods (十神) relationships - simplified
function getShiShen(dayStem: string, targetStem: string): string {
  const relation = getElementRelation(dayStem, targetStem);
  const dayYinYang = STEMS.indexOf(dayStem) % 2 === 0 ? 'Yang' : 'Yin';
  const targetYinYang = STEMS.indexOf(targetStem) % 2 === 0 ? 'Yang' : 'Yin';
  const same = dayYinYang === targetYinYang;

  const map: Record<string, Record<string, string>> = {
    'Same': { 'true': 'Bi Jian (Peer)', 'false': 'Jie Cai (Rob Wealth)' },
    'Produces': { 'true': 'Shi Shen (Eating God)', 'false': 'Shang Guan (Hurt Officer)' },
    'Overcomes': { 'true': 'Pian Cai (Partial Wealth)', 'false': 'Zheng Cai (Direct Wealth)' },
    'Produced By': { 'true': 'Pian Yin (Partial Seal)', 'false': 'Zheng Yin (Direct Seal)' },
    'Overcome By': { 'true': 'Qi Sha (Seven Kill)', 'false': 'Zheng Guan (Direct Officer)' },
  };

  return map[relation]?.[String(same)] ?? '—';
}

function getElementRelation(dayStem: string, targetStem: string): string {
  const dayEl = STEM_ELEMENT[dayStem];
  const targetEl = STEM_ELEMENT[targetStem];
  if (dayEl === targetEl) return 'Same';
  if (
    (dayEl === 'Wood' && targetEl === 'Fire') ||
    (dayEl === 'Fire' && targetEl === 'Earth') ||
    (dayEl === 'Earth' && targetEl === 'Metal') ||
    (dayEl === 'Metal' && targetEl === 'Water') ||
    (dayEl === 'Water' && targetEl === 'Wood')
  ) return 'Produces';
  if (
    (dayEl === 'Wood' && targetEl === 'Earth') ||
    (dayEl === 'Earth' && targetEl === 'Water') ||
    (dayEl === 'Water' && targetEl === 'Fire') ||
    (dayEl === 'Fire' && targetEl === 'Metal') ||
    (dayEl === 'Metal' && targetEl === 'Wood')
  ) return 'Overcomes';
  if (
    (targetEl === 'Wood' && dayEl === 'Fire') ||
    (targetEl === 'Fire' && dayEl === 'Earth') ||
    (targetEl === 'Earth' && dayEl === 'Metal') ||
    (targetEl === 'Metal' && dayEl === 'Water') ||
    (targetEl === 'Water' && dayEl === 'Wood')
  ) return 'Produced By';
  return 'Overcome By';
}

const ELEMENT_COLORS: Record<string, string> = {
  'Wood': '#4CAF50',
  'Fire': '#F44336',
  'Earth': '#FF9800',
  'Metal': '#9E9E9E',
  'Water': '#2196F3',
};

// ========== Personality Traits by Day Master ==========

const TRAITS: Record<string, string[]> = {
  '甲': [
    'Natural leader with strong initiative',
    'Independent and decisive thinker',
    'Growth-oriented, always expanding horizons',
    'Can be stubborn when challenged',
  ],
  '乙': [
    'Adaptable and flexible like a vine',
    'Creative with a strong aesthetic sense',
    'Patient and persistent in achieving goals',
    'Excellent negotiator and mediator',
  ],
  '丙': [
    'Charismatic and warm personality',
    'Generous and enthusiastic about life',
    'Natural motivator who inspires others',
    'Can be impulsive and scattered',
  ],
  '丁': [
    'Refined and elegant with inner warmth',
    'Deeply intuitive and perceptive',
    'Cultured with appreciation for beauty',
    'Can be overly sensitive to criticism',
  ],
  '戊': [
    'Stable, reliable, and trustworthy',
    'Patient with great endurance',
    'Generous and magnanimous',
    'Can be resistant to change',
  ],
  '己': [
    'Thoughtful and considerate of others',
    'Adaptable with a nurturing nature',
    'Detail-oriented and organized',
    'Can be indecisive or overly cautious',
  ],
  '庚': [
    'Strong-willed and determined',
    'Decisive with sharp analytical mind',
    'Protective of loved ones',
    'Can be confrontational',
  ],
  '辛': [
    'Refined with excellent taste',
    'Perfectionist with attention to detail',
    'Eloquent and persuasive communicator',
    'Can be overly critical',
  ],
  '壬': [
    'Strategic and visionary thinker',
    'Adaptable like flowing water',
    'Wise with broad perspective',
    'Can be unpredictable',
  ],
  '癸': [
    'Deeply intuitive and insightful',
    'Quiet but highly observant',
    'Resourceful in difficult situations',
    'Can be overly secretive',
  ],
};

// ========== Career Insights ==========

const CAREER: Record<string, string> = {
  '甲': 'You thrive in leadership roles — management, entrepreneurship, or any position where you can pioneer new paths. Forestry, education, and creative directing suit your Wood element.',
  '乙': 'Your adaptability shines in creative fields, diplomacy, counseling, or design. You excel as a mediator, artist, or strategist working behind the scenes.',
  '丙': 'Careers in entertainment, sales, marketing, education, or public speaking leverage your natural radiance. You are built for visibility and influence.',
  '丁': 'You excel in roles requiring refined judgment — academia, literary arts, spiritual guidance, research, or quality control. Your intuition is your superpower.',
  '戊': 'Real estate, agriculture, construction, banking, and large-scale project management suit your stabilizing Earth energy. You build lasting foundations.',
  '己': 'You thrive in service-oriented roles — healthcare, counseling, hospitality, administration, or any career that supports and nurtures others.',
  '庚': 'Law, finance, engineering, surgery, the military, or competitive sports align with your Metal-edged decisiveness. You are made for precision and authority.',
  '辛': 'Your refinement suits careers in luxury goods, jewelry, curation, writing, editing, or any field requiring taste and precision.',
  '壬': 'You excel in strategy-heavy fields — consulting, technology, logistics, international relations, or any career requiring big-picture vision.',
  '癸': 'Research, psychology, spirituality, data analysis, detective work, or artistic pursuits align with your depth and intuitive powers.',
};

const RELATIONSHIP: Record<string, string> = {
  '甲': 'You are a protective partner who leads with strength. You need someone who respects your independence while offering warmth.',
  '乙': 'You give love flexibly and adapt to your partner\'s needs. You need a partner who provides stability and appreciates your gentleness.',
  '丙': 'You are passionate and generous in love. You need a partner who can match your energy and give you the admiration you quietly crave.',
  '丁': 'You love deeply and with refinement. You need emotional security and a partner who appreciates your sensitivity.',
  '戊': 'You are loyal and reliable in relationships. You need a partner who values stability and doesn\'t rush your emotional pace.',
  '己': 'You are nurturing and attentive in relationships. You need a partner who reciprocates your thoughtfulness.',
  '庚': 'You are fiercely loyal and protective. You need a partner who can handle your directness and match your strength.',
  '辛': 'You are romantic with high standards. You need a partner who appreciates quality and depth over superficial connection.',
  '壬': 'You need intellectual stimulation and freedom in relationships. A partner who understands your need for space is essential.',
  '癸': 'You form deep, almost psychic bonds. You need a partner who respects your emotional depth and doesn\'t push for surface-level connection.',
};

const WEALTH: Record<string, string> = {
  '甲': 'Wealth comes through bold initiatives and leadership. You earn best when you create new systems rather than follow existing ones.',
  '乙': 'Wealth flows through networking, creativity, and strategic partnerships. Your ability to adapt is your financial superpower.',
  '丙': 'Wealth follows visibility — you earn through your reputation, presence, and ability to inspire others to action.',
  '丁': 'Wealth comes from your specialized knowledge and refined skills. You profit through expertise, not volume.',
  '戊': 'Wealth accumulates steadily through real assets, land, and long-term investments. Your patience is your financial advantage.',
  '己': 'Wealth comes through service and attention to detail. You earn by making things better, smoother, and more organized.',
  '庚': 'Wealth comes through decisive action and authority. You earn best in competitive environments where precision is rewarded.',
  '辛': 'Wealth comes through quality and discernment. You profit from premium offerings and your ability to distinguish excellence.',
  '壬': 'Wealth flows through strategy and big-picture thinking. You earn best by navigating complex systems and timing markets.',
  '癸': 'Wealth comes through depth — deep research, deep strategy, and deep connections. Your intuition guides profitable decisions.',
};

// ========== Main Calculation Function ==========

export function calculateBaZi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  country: string,
): BaZiResult {
  // Convert to Beijing time (UTC+8)
  // For simplicity in MVP, we assume the user provides local time
  // and we convert based on timezone offset
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // Extract raw data
  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const timeGan = eightChar.getTimeGan();
  const timeZhi = eightChar.getTimeZhi();

  const dayMaster = STEM_EN[dayGan] || dayGan;

  function makePillar(gan: string, zhi: string): Pillar {
    const hiddenRaw = HIDDEN_STEMS[zhi] || [];
    return {
      stem: STEM_EN[gan] || gan,
      branch: BRANCH_EN[zhi] || zhi,
      stemElement: STEM_ELEMENT[gan] || '',
      branchElement: BRANCH_ELEMENT[zhi] || '',
      naYin: eightChar.getDayNaYin(),
      hiddenStems: hiddenRaw.map(s => HIDDEN_STEM_EN[s] || s),
      shiShen: getShiShen(dayGan, gan),
    };
  }

  const yearPillar = makePillar(yearGan, yearZhi);
  const monthPillar = makePillar(monthGan, monthZhi);
  const dayPillar = makePillar(dayGan, dayZhi);
  const hourPillar = makePillar(timeGan, timeZhi);

  // Element scores
  const elements: ElementProfile = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const allStems = [yearGan, monthGan, dayGan, timeGan];
  const allBranches = [yearZhi, monthZhi, dayZhi, timeZhi];

  for (const s of allStems) {
    const el = STEM_ELEMENT[s];
    if (el) elements[el.toLowerCase() as keyof ElementProfile] += 2;
  }
  for (const b of allBranches) {
    const el = BRANCH_ELEMENT[b];
    if (el) elements[el.toLowerCase() as keyof ElementProfile] += 1;
    // Hidden stems count too
    const hidden = HIDDEN_STEMS[b] || [];
    for (const h of hidden) {
      const hel = STEM_ELEMENT[h];
      if (hel) elements[hel.toLowerCase() as keyof ElementProfile] += 0.5;
    }
  }

  // Find the most and least dominant elements
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const luckyElement = sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1);
  const unfavorableElement = sorted[sorted.length - 1][0].charAt(0).toUpperCase() + sorted[sorted.length - 1][0].slice(1);

  // Personality
  const personalityTraits = TRAITS[dayGan] || [
    'Balanced and adaptable personality',
    'Good at navigating different situations',
  ];

  const careerInsight = CAREER[dayGan] || 'Your career path benefits from following your natural inclinations and strengths.';
  const relationshipInsight = RELATIONSHIP[dayGan] || 'You value genuine connection and mutual respect in relationships.';
  const wealthInsight = WEALTH[dayGan] || 'Your wealth grows when you align your work with your natural element strengths.';

  const dayStemIndex = STEMS.indexOf(dayGan);
  const dayMasterElement = STEM_ELEMENT[dayGan] || '';
  const dayMasterYinYang = dayStemIndex % 2 === 0 ? 'Yang' : 'Yin';

  // Summary
  const summary = `Your Day Master is ${dayMaster} (${dayMasterElement}, ${dayMasterYinYang}). `
    + `Your BaZi chart shows a ${luckyElement}-dominant personality with ${unfavorableElement} as your balancing element. `
    + `The Four Pillars reveal a person of ${personalityTraits[0]?.toLowerCase() || 'unique character'}.`;

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    dayMasterElement,
    dayMasterYinYang,
    elements,
    luckyElement,
    unfavorableElement,
    personalityTraits,
    careerInsight,
    relationshipInsight,
    wealthInsight,
    summary,
  };
}

export function getZodiacAnimal(year: number): string {
  const solar = Solar.fromYmd(year, 1, 1);
  const lunar = solar.getLunar();
  return lunar.getYearShengXiao();
}
