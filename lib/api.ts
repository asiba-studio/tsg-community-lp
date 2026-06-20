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
type CreativeLabLpSetting = {
    fieldId: 'creative-lab-lp';
    program_terms?: string;
    cover_square?: MicroCMSImage;
};

// Union type for all possible repeater items (currently only one we care about)
type LpSetting = CreativeLabLpSetting;

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

        const terms: ProgramTerm[] = [];
        if (lpSetting?.program_terms) {
            // Split by comma and trim
            const splitTerms = lpSetting.program_terms.split(',').map(t => t.trim()) as ProgramTerm[];
            terms.push(...splitTerms);
        } else {
            // Default to all terms if empty or undefined
            terms.push('2ND', '3RD');
        }

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || ''; // Square as coverImage (list view)
        const headerImage = entry.cover?.url || ''; // Horizontal as headerImage

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
            headerImage: headerImage,
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
        const title = entry.title_ja || '';
        const subtitle = entry.subtitle_ja;
        const slug = entry.id;
        const publishDate = entry.date || entry.publishedAt;
        const summary = entry.summary_ja;
        const link = entry.link;
        const body_ja = entry.body_ja;

        const coverUrl = entry.cover?.url || '';

        let tags: string[] = [];
        if (entry.keywords) {
            tags = entry.keywords.split(',').map(k => k.trim()).filter(k => k).slice(0, 3);
        }

        return {
            id: entry.id,
            slug: slug,
            title: title,
            subtitle: subtitle,
            coverImage: coverUrl,
            headerImage: coverUrl, // News uses same for both usually
            date: publishDate || new Date().toISOString(),
            tags: tags,
            excerpt: summary,
            link: link,
            type: 'news',
            body_ja: body_ja,
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
        const terms: ProgramTerm[] = [];
        if (lpSetting?.program_terms) {
            const splitTerms = lpSetting.program_terms.split(',').map(t => t.trim()) as ProgramTerm[];
            terms.push(...splitTerms);
        } else {
            terms.push('2ND', '3RD');
        }

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
            headerImage: entry.cover?.url || '',
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

        let tags: string[] = [];
        if (entry.keywords) {
            tags = entry.keywords.split(',').map(k => k.trim()).filter(k => k).slice(0, 3);
        }

        return {
            id: entry.id,
            slug: entry.id,
            title: entry.title_ja || '',
            subtitle: entry.subtitle_ja,
            coverImage: entry.cover?.url || '',
            headerImage: entry.cover?.url || '',
            date: entry.date || entry.publishedAt || new Date().toISOString(),
            tags,
            excerpt: entry.summary_ja,
            link: entry.link,
            type: 'news',
            body_ja: entry.body_ja,
        };
    } catch {
        return null;
    }
}