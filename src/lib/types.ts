export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  country: string;
  city: string;
  email: string;
}

export interface Pillar {
  stem: string;
  branch: string;
  stemElement: string;
  branchElement: string;
  naYin: string;         // 纳音
  hiddenStems: string[];
  shiShen: string;       // 十神
}

export interface ElementProfile {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaZiResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: string;          // 日主
  dayMasterElement: string;
  dayMasterYinYang: string;
  elements: ElementProfile;
  luckyElement: string;
  unfavorableElement: string;
  personalityTraits: string[];
  careerInsight: string;
  relationshipInsight: string;
  wealthInsight: string;
  summary: string;
}

export interface ProductTier {
  id: string;
  name: string;
  price: number;
  priceUSD: number;
  description: string;
  features: string[];
  popular?: boolean;
}
