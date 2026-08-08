// lib/api.ts

import { createClient } from 'microcms-js-sdk';
import { unstable_cache } from 'next/cache';
import { Article, CreditItem, CreditType, News, PersonType, ProgramTerm } from './types';

// MicroCMS Types
type MicroCMSImage = {
    url: string;
    height: number;
    width: number;
};

// customFieldId: "social_link"
type SocialLinkItem = {
    fieldId: 'social_link';
    link_type?: string; // X / Instagram / Youtube / Facebook / Links / Website / note / App / Peatix / Link
    link_url?: string;
    link_label?: string;
};

// customFieldId: "link_text"（Newsの「リンク」フィールド。has_bodyがOFFで外部/内部の飛び先がある場合に使用）
type NewsLinkField = {
    fieldId: 'link_text';
    link?: string;
    text?: string;
};

// Repeater item type for "creative_lab_lp"
// program_terms: MicroCMSのフィールド設定によりカンマ区切り文字列(テキスト)または配列(複数選択)のどちらでも返ってくる
type CreativeLabLpSetting = {
    fieldId: 'creative_lab_lp';
    program_terms?: string | string[];
    cover_square?: MicroCMSImage;
    cover_sq_halftone?: MicroCMSImage;
    cover_landscape?: MicroCMSImage;
    cover_la_halftone?: MicroCMSImage;
    lp_subtitle?: string;
};

// Union type for all possible repeater items (currently only one we care about)
type LpSetting = CreativeLabLpSetting;

// customFieldId: "credit"（articleのcreditsリピーター内の各要素）
type CreditFieldItem = {
    fieldId: 'credit';
    credit_type?: string; // Author/Speaker/Lecturer/Guest/Work/Other
    name: string;
    person_type?: string; // asiba-member/collaborator/guest/league-player/other
    affiliation?: string;
    bio?: string;
    social_links?: SocialLinkItem[];
    profile_image?: MicroCMSImage;
};

const mapCredits = (raw?: CreditFieldItem[]): CreditItem[] => {
    if (!raw) return [];
    return raw.map((c) => ({
        name: c.name || '',
        creditType: c.credit_type as CreditType | undefined,
        personType: c.person_type as PersonType | undefined,
        affiliation: c.affiliation,
        bio: c.bio,
        profileImage: c.profile_image?.url,
        socialLinks: (c.social_links || []).map((l) => ({
            type: l.link_type,
            url: l.link_url,
            label: l.link_label,
        })),
    }));
};

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
    cover?: MicroCMSImage;
    description_ja?: string;
    description_en?: string;
    body_ja?: string; // HTML string
    categories?: string[]; // REPORT/INTERVIEW/DIALOGUE/ESSAY/STATEMENT/ANNOUNCEMENT
    social_links?: SocialLinkItem[]; // note記事へのリンクはこの中の link_type === 'note' を探す
    credits?: CreditFieldItem[]; // Repeater
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
    cover?: MicroCMSImage;
    description_ja?: string;
    body_ja?: string;
    has_body?: boolean;
    link?: NewsLinkField;
    publish_sites: any[];
    lp_settings?: LpSetting[]; // Repeater（Articleと共通仕様。cover_landscape/cover_la_halftoneはNewsでは未使用）
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
        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative_lab_lp');

        const title = entry.title_ja || '';
        const subtitle = entry.subtitle_ja;
        const slug = entry.id;
        const publishDate = entry.date || entry.publishedAt;
        const summary = entry.description_ja;
        const noteUrl = entry.social_links?.find(l => l.link_type === 'note')?.link_url;
        const body_ja = entry.body_ja;

        const terms = parseProgramTerms(lpSetting?.program_terms);

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || ''; // Square as coverImage (list view)
        const coverImageHalftone = lpSetting?.cover_sq_halftone?.url;
        const lpSubtitle = lpSetting?.lp_subtitle;
        const headerImage = lpSetting?.cover_landscape?.url || entry.cover?.url || ''; // Horizontal as headerImage
        const headerImageHalftone = lpSetting?.cover_la_halftone?.url;

        const tags = entry.categories || [];

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
            credits: mapCredits(entry.credits),
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
        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative_lab_lp');

        const title = entry.title_ja || '';
        const subtitle = entry.subtitle_ja;
        const slug = entry.id;
        const publishDate = entry.date || entry.publishedAt;
        const summary = entry.description_ja;
        const link = entry.link?.link;
        const body_ja = entry.body_ja;

        const terms = parseProgramTerms(lpSetting?.program_terms);

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || '';
        const coverImageHalftone = lpSetting?.cover_sq_halftone?.url;
        const lpSubtitle = lpSetting?.lp_subtitle;

        const tags: string[] = []; // newsにはcategories相当のタグ項目が無いため空

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

        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative_lab_lp');
        const terms = parseProgramTerms(lpSetting?.program_terms);

        const tags = entry.categories || [];
        const noteUrl = entry.social_links?.find(l => l.link_type === 'note')?.link_url;

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
            excerpt: entry.description_ja,
            link: noteUrl,
            type: 'article',
            body_ja: entry.body_ja,
            credits: mapCredits(entry.credits),
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

        const lpSetting = entry.lp_settings?.find(s => s.fieldId === 'creative_lab_lp');
        const terms = parseProgramTerms(lpSetting?.program_terms);

        const coverImage = lpSetting?.cover_square?.url || entry.cover?.url || '';

        const tags: string[] = []; // newsにはcategories相当のタグ項目が無いため空

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
            excerpt: entry.description_ja,
            link: entry.link?.link,
            type: 'news',
            body_ja: entry.body_ja,
            programTerms: terms,
        };
    } catch {
        return null;
    }
}