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
    body?: string; // HTML string
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
    body?: string;
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
        const slug = entry.slug || entry.id;
        const publishDate = entry.date || entry.publishedAt;
        const summary = entry.summary_ja;
        const noteUrl = entry.note_url; // Check field name in typical usage, JSON said 'note_url'
        const body = entry.body;

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
            body: body, // Now HTML string
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
    // If news is in the same 'article' endpoint with a different filter?
    // Or a separate 'news' endpoint?
    // The previous code had `content_type: 'news'`.
    // I shall assume there is a 'news' endpoint in microCMS.

    try {
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
            const slug = entry.slug || entry.id;
            const publishDate = entry.date || entry.publishedAt;
            const summary = entry.summary_ja;
            const link = entry.link;
            const body = entry.body;

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
                body: body,
            };
        });
    } catch (e) {
        console.warn('Failed to fetch news or news endpoint does not exist:', e);
        return [];
    }
};

export const getNews = unstable_cache(
    fetchNewsData,
    ['news-list-microcms'],
    { tags: ['microcms-lp'] }
);