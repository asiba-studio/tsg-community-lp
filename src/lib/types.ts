
// src/lib/types.ts

export interface ContentItem {
    id: string;      // Contentfulのsys.id
    slug: string;    // 今回はsys.idを使用（fieldsにslugがないため）
    title: string;
    subtitle?: string;
    // 【重要】カード表示・モザイク用 (Contentfulの cover2 がここに入ります)
    coverImage: string;
    // 【重要】詳細ページヘッダー用 (Contentfulの cover がここに入ります)
    headerImage: string;

    date: string;    // publishDate
    tags: string[];  // keywords (3つに制限)
    excerpt?: string; // summary
    link?: string;   // noteUrlなどがあれば
    type: 'article' | 'news' | 'open-talks';
}

// Article型
export type Article = ContentItem & {
    type: 'article';
    // Article特有のRichText bodyなどが必要であればここに追加
    body?: any; // ContentfulのRichText型
};

export type News = ContentItem & { type: 'news' };
export type OpenTalk = ContentItem & { type: 'open-talks' };

/*
export interface News {
    slug: string;
    title: string;
    subtitle: string;
    date: string;
    excerpt: string;
    coverImage: string;
    headerImage: string;
    tags?: string[];
    lang: string;
    content: string;
}

export interface OpenTalk {
    slug: string;
    link: string;
    title: string;
    subtitle: string;
    date: string;
    excerpt: string;
    coverImage: string;
    lang: string;
    tags?: string[];
    content: string;
}

export interface Article {
    slug: string;
    title: string;
    subtitle: string;
    date: string;
    writer: string;
    collaborators?: string[];
    reviewer?: string;
    relatedProjects?: string[];
    excerpt: string;
    coverImage: string;
    headerImage: string;
    tags: string[];
    featured: boolean;
    lang: string;
    content: string;
}
*/


import p5 from "p5";
export interface P5SketchProps {
    preload?: (p5: p5) => void;
    setup?: (p5: p5, canvasParentRef: Element) => void;
    draw?: (p5: p5) => void;
    windowResized?: (p5: p5) => void;
    [key: string]: any;
}