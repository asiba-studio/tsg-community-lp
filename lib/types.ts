// lib/types.ts

export type ProgramTerm = '2ND' | '3RD' | 'Community Design-LAB.';

// 新しい期が先頭（複数のprogram_termsが設定されている場合、最新の期のみに出す判定に使用）
export const PROGRAM_TERM_ORDER: ProgramTerm[] = ['Community Design-LAB.', '3RD', '2ND'];

export function getPrimaryProgramTerm(terms?: ProgramTerm[]): ProgramTerm | undefined {
    if (!terms || terms.length === 0) return undefined;
    return PROGRAM_TERM_ORDER.find((term) => terms.includes(term));
}

export interface ContentItem {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;

    // カード表示用・モザイク用
    coverImage: string;
    coverImageHalftone?: string; // lp_settings.cover_sq_halftone（設定されている場合のみ）
    lpSubtitle?: string;         // lp_settings.lp_subtitle（LP用の別サブタイトル）

    // 詳細ページヘッダー用
    headerImage: string;
    headerImageHalftone?: string; // lp_settings.cover_la_halftone（設定されている場合のみ）

    date: string;    // ISO string
    tags: string[];  // Article: categories（News/OpenTalksは対応フィールドが無いため常に空配列）
    excerpt?: string; // description_ja
    link?: string;   // 外部URL (News.link.link や OpenTalks用、Articleはsocial_linksのlink_type==='note')

    type: 'article' | 'news' | 'open-talks';
    programTerms?: ProgramTerm[];
}

// credits（クレジット）関連
export type CreditType = 'Author' | 'Speaker' | 'Lecturer' | 'Guest' | 'Work' | 'Other';
export type PersonType = 'asiba-member' | 'collaborator' | 'guest' | 'league-player' | 'other';

export interface CreditSocialLink {
    type?: string; // X/Instagram/Youtube/Facebook/Links/Website/note/App/Peatix/Link
    url?: string;
    label?: string;
}

export interface CreditItem {
    name: string;
    creditType?: CreditType;
    personType?: PersonType;
    affiliation?: string;
    bio?: string;
    profileImage?: string;
    socialLinks: CreditSocialLink[];
}

// Article型
export type Article = ContentItem & {
    type: 'article';
    body_ja?: string; // HTML string
    credits?: CreditItem[];
};

// News型
export type News = ContentItem & {
    type: 'news';
    body_ja?: string; // HTML string
};

// OpenTalk型 (必要に応じて拡張)
export type OpenTalk = ContentItem & {
    type: 'open-talks';
};


// customDataについて
export interface CreativeLabData {
    programTerms: ProgramTerm[];
    coverSquare?: string;
    coverSquareHalftone?: string;
    coverLandscape?: string;
    coverLandscapeHalftone?: string;
    lpSubtitle?: string;
}

export interface CustomData {
    'creative-lab-lp'?: CreativeLabData;
    [key: string]: any; // 他のLPのデータも許容
}

import p5 from "p5";
export interface P5SketchProps {
    preload?: (p5: p5) => void;
    setup?: (p5: p5, canvasParentRef: Element) => void;
    draw?: (p5: p5) => void;
    windowResized?: (p5: p5) => void;
    [key: string]: any;
}