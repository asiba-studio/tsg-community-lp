// lib/api.ts

import { createClient } from 'microcms-js-sdk';
import { unstable_cache } from 'next/cache';
import { Article, News, ProgramTerm } from './types';

// MicroCMS Types
type MicroCMSImage = {
    url: string;
    height: number;
    width: number;
};

// Repeater item type for "creative-lab-lp"
// program_terms: MicroCMSのフィールド設定によりカンマ区切り文字列(テキスト)または配列(複数選択)のどちらでも返ってくる
type CreativeLabLpSetting = {
    fieldId: 'creative-lab-lp';
    program_terms?: string | string[];
    cover_square?: MicroCMSImage;
    cover_sq_halftone?: MicroCMSImage;
    cover_landscape?: MicroCMSImage;
    cover_la_halftone?: MicroCMSImage;
    lp_subtitle?: string;
};

// Union type for all possible repeater items (currently only one we care about)
type LpSetting = CreativeLabLpSetting;

// program_termsが文字列(カンマ区切り)・配列のどちらで返ってきても対応し、未設定時は全期をデフォルトとする
const parseProgramTerms = (raw: string | string[] | undefined): ProgramTerm[] => {
    if (!raw) return ['2ND', '3RD'];
    const list = Array.isArray(raw) ? raw : raw.split(',');
    const terms = list.map(t => t.trim()).filter(Boolean) as ProgramTerm[];
    return terms.length > 0 ? terms : ['2ND', '3RD'];
};

type ArticleSkeleton = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title_ja: string;
    title_en?: string;
    subtitle_ja?: string;
    subtitle_en?: string;
    slug: string;
    cover: MicroCMSImage;
    summary_ja?: string;
    summary_en?: string;
    body_ja?: string; // HTML string
    note_url?: string;
    keywords?: string; // Comma separated? or specific format? JSON says "textArea" and "keyword, keyword"
    publish_sites: any[]; // relationList
    lp_settings?: LpSetting[]; // Repeater
    date: string;
};

type NewsSkeleton = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title_ja: string;
    subtitle_ja?: string;
    slug: string;
    cover?: MicroCMSImage;
    summary_ja?: string;
    body_ja?: string;
    link?: string; // Assuming 'link' or similar for external link? JSON for article didn't show news structure but assumed similar
    publish_sites: any[];
    lp_settings?: LpSetting[]; // Repeater（Articleと共通仕様。cover_landscape/cover_la_halftoneはNewsでは未使用）
    keywords?: string;
    date: string;
};

// Initialize MicroCMS Client
if (!process.env.MICROCMS_SERVICE_DOMAIN) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('MICROCMS_SERVICE_DOMAIN is required in environment variables.');
    }
    console.warn('MICROCMS_SERVICE_DOMAIN is missing. MicroCMS client will not work correctly.');
}

if (!process.env.MICROCMS_API_KEY) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('MICROCMS_API_KEY is required in environment variables.');
    }
    console.warn('MICROCMS_API_KEY is missing. MicroCMS client will not work correctly.');
}

export const client = createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || 'MISSING_DOMAIN',
    apiKey: process.env.MICROCMS_API_KEY || 'MISSING_KEY',
});

const TARGET_SITE_ID = 'tsg-creative-lab';

// ----------------------------------------------------------------
// Article Fetching
// ----------------------------------------------------------------

const fetchArticlesData = async (): Promise<Article[]> => {
    const response = await client.getList<ArticleSkeleton>({
        endpoint: 'article',
        queries: {
            filters: `publish_sites[contains]${TARGET_SITE_ID}`,
            orders: '-date',
            limit: 100, // Adjust as needed
        },
    });

    return response.contents.map((entry) => {
        // Extract LP specific settings
        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative-lab-lp');

        const title = entry.title_ja || '';
        const subtitle = entry.subtitle_ja;
        const slug = entry.id;
        const publishDate = entry.date || entry.publishedAt;
        const summary = entry.summary_ja;
        const noteUrl = entry.note_url; // Check field name in typical usage, JSON said 'note_url'
        const body_ja = entry.body_ja;

        const terms = parseProgramTerms(lpSetting?.program_terms);

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || ''; // Square as coverImage (list view)
        const coverImageHalftone = lpSetting?.cover_sq_halftone?.url;
        const lpSubtitle = lpSetting?.lp_subtitle;
        const headerImage = lpSetting?.cover_landscape?.url || entry.cover?.url || ''; // Horizontal as headerImage
        const headerImageHalftone = lpSetting?.cover_la_halftone?.url;

        // Keywords from string to array
        // JSON description: "都市, 建築計画, XXX"
        let tags: string[] = [];
        if (entry.keywords) {
            tags = entry.keywords.split(',').map(k => k.trim()).filter(k => k).slice(0, 3);
        }

        return {
            id: entry.id,
            slug: slug,
            title: title,
            subtitle: subtitle,
            coverImage: coverImage,
            coverImageHalftone: coverImageHalftone,
            lpSubtitle: lpSubtitle,
            headerImage: headerImage,
            headerImageHalftone: headerImageHalftone,
            date: publishDate || new Date().toISOString(),
            tags: tags,
            excerpt: summary,
            link: noteUrl,
            type: 'article',
            body_ja: body_ja, // Now HTML string
            programTerms: terms,
        };
    });
};

export const getArticles = unstable_cache(
    fetchArticlesData,
    ['articles-list-microcms'],
    { tags: ['microcms-lp'] }
);

// ----------------------------------------------------------------
// News Fetching
// ----------------------------------------------------------------

// Assuming 'news' endpoint exists and has similar fields.
// User didn't provide 'microcms-api-news.json' but asked to fix "CMS lookup".
// I will assume standard fields for now.

const fetchNewsData = async (): Promise<News[]> => {
    const response = await client.getList<NewsSkeleton>({
        endpoint: 'news',
        queries: {
            filters: `publish_sites[contains]${TARGET_SITE_ID}`,
            orders: '-date',
            limit: 100,
        },
    });

    return response.contents.map((entry) => {
        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative-lab-lp');

        const title = entry.title_ja || '';
        const subtitle = entry.subtitle_ja;
        const slug = entry.id;
        const publishDate = entry.date || entry.publishedAt;
        const summary = entry.summary_ja;
        const link = entry.link;
        const body_ja = entry.body_ja;

        const terms = parseProgramTerms(lpSetting?.program_terms);

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || '';
        const coverImageHalftone = lpSetting?.cover_sq_halftone?.url;
        const lpSubtitle = lpSetting?.lp_subtitle;

        let tags: string[] = [];
        if (entry.keywords) {
            tags = entry.keywords.split(',').map(k => k.trim()).filter(k => k).slice(0, 3);
        }

        return {
            id: entry.id,
            slug: slug,
            title: title,
            subtitle: subtitle,
            coverImage: coverImage,
            coverImageHalftone: coverImageHalftone,
            lpSubtitle: lpSubtitle,
            headerImage: coverImage, // Newsはcover_landscapeを使わないためcoverImageと同一
            date: publishDate || new Date().toISOString(),
            tags: tags,
            excerpt: summary,
            link: link,
            type: 'news',
            body_ja: body_ja,
            programTerms: terms,
        };
    });
};

export const getNews = unstable_cache(
    fetchNewsData,
    ['news-list-microcms'],
    { tags: ['microcms-lp'] }
);

// ----------------------------------------------------------------
// Draft Fetching (no cache — for Draft Mode preview)
// ----------------------------------------------------------------

export async function getArticleDraft(contentId: string, draftKey: string): Promise<Article | null> {
    try {
        const entry = await client.get<ArticleSkeleton>({
            endpoint: 'article',
            contentId,
            queries: { draftKey },
        });

        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative-lab-lp');
        const terms = parseProgramTerms(lpSetting?.program_terms);

        let tags: string[] = [];
        if (entry.keywords) {
            tags = entry.keywords.split(',').map(k => k.trim()).filter(k => k).slice(0, 3);
        }

        return {
            id: entry.id,
            slug: entry.id,
            title: entry.title_ja || '',
            subtitle: entry.subtitle_ja,
            coverImage: lpSetting?.cover_square?.url || entry.cover?.url || '',
            coverImageHalftone: lpSetting?.cover_sq_halftone?.url,
            lpSubtitle: lpSetting?.lp_subtitle,
            headerImage: lpSetting?.cover_landscape?.url || entry.cover?.url || '',
            headerImageHalftone: lpSetting?.cover_la_halftone?.url,
            date: entry.date || entry.publishedAt || new Date().toISOString(),
            tags,
            excerpt: entry.summary_ja,
            link: entry.note_url,
            type: 'article',
            body_ja: entry.body_ja,
            programTerms: terms,
        };
    } catch {
        return null;
    }
}

export async function getNewsDraft(contentId: string, draftKey: string): Promise<News | null> {
    try {
        const entry = await client.get<NewsSkeleton>({
            endpoint: 'news',
            contentId,
            queries: { draftKey },
        });

        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative-lab-lp');
        const terms = parseProgramTerms(lpSetting?.program_terms);

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || '';

        let tags: string[] = [];
        if (entry.keywords) {
            tags = entry.keywords.split(',').map(k => k.trim()).filter(k => k).slice(0, 3);
        }

        return {
            id: entry.id,
            slug: entry.id,
            title: entry.title_ja || '',
            subtitle: entry.subtitle_ja,
            coverImage: coverImage,
            coverImageHalftone: lpSetting?.cover_sq_halftone?.url,
            lpSubtitle: lpSetting?.lp_subtitle,
            headerImage: coverImage,
            date: entry.date || entry.publishedAt || new Date().toISOString(),
            tags,
            excerpt: entry.summary_ja,
            link: entry.link,
            type: 'news',
            body_ja: entry.body_ja,
            programTerms: terms,
        };
    } catch {
        return null;
    }
}