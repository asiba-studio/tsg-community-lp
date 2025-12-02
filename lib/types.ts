// lib/types.ts

export type ProgramTerm = '2ND' | '3RD';

export interface ContentItem {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;

    // カード表示用・モザイク用
    coverImage: string;

    // 詳細ページヘッダー用
    headerImage: string;

    date: string;    // ISO string
    tags: string[];  // keywords
    excerpt?: string; // summary
    link?: string;   // 外部URL (NewsやOpenTalks用、ArticleではnoteUrl)

    type: 'article' | 'news' | 'open-talks';
    programTerms?: ProgramTerm[];
}

// Article型
export type Article = ContentItem & {
    type: 'article';
    body?: any; // RichText
};

// News型
export type News = ContentItem & {
    type: 'news';
    body?: any; // RichText
};

// OpenTalk型 (必要に応じて拡張)
export type OpenTalk = ContentItem & {
    type: 'open-talks';
};


// customDataについて
export interface CreativeLabData {
    programTerms: ProgramTerm[];
    // ... 他の creative-lab 関連のプロパティ
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