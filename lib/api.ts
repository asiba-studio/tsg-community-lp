// lib/api.ts

import {
    createClient,
    EntryFieldTypes,
    Asset,
} from 'contentful';
import { unstable_cache } from 'next/cache'; // ★追加
import { Article, News, CreativeLabData, CustomData, ProgramTerm } from './types';

// Site Skeleton
type SiteSkeleton = {
    contentTypeId: 'site';
    fields: {
        title: EntryFieldTypes.Symbol;
        slug: EntryFieldTypes.Symbol;
    }
}

// Article Skeleton
type ArticleSkeleton = {
    contentTypeId: 'article';
    fields: {
        title: EntryFieldTypes.Symbol;
        subtitle: EntryFieldTypes.Symbol;
        slug: EntryFieldTypes.Symbol;
        cover: EntryFieldTypes.AssetLink;
        cover2: EntryFieldTypes.AssetLink;
        publishSites: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SiteSkeleton>>;
        summary: EntryFieldTypes.Text;
        body: EntryFieldTypes.RichText;
        keywords: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        publishDate: EntryFieldTypes.Date;
        noteUrl: EntryFieldTypes.Symbol;
        customData?: EntryFieldTypes.Object;
    }
}

// News Skeleton
type NewsSkeleton = {
    contentTypeId: 'news';
    fields: {
        title: EntryFieldTypes.Symbol;
        subtitle: EntryFieldTypes.Symbol;
        slug: EntryFieldTypes.Symbol;
        publishSites: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SiteSkeleton>>;
        cover: EntryFieldTypes.AssetLink;
        summary: EntryFieldTypes.Text;
        body: EntryFieldTypes.RichText;
        keywords: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        publishDate: EntryFieldTypes.Date;
        link: EntryFieldTypes.Symbol;
    }
}

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// ヘルパー関数
function getLocValue<T>(field: any, locale: string = 'ja'): T | undefined {
    return field?.[locale];
}

function getAssetUrl(assetField: any, locale: string = 'ja'): string {
    const asset = assetField?.[locale];
    if (!asset) return '';
    const file = asset.fields?.file?.[locale];
    const url = file?.url;
    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
}

// SiteのSlugからIDを取得する関数
async function getSiteIdBySlug(slug: string): Promise<string | null> {
    const response = await client.withoutUnresolvableLinks.getEntries<SiteSkeleton>({
        content_type: 'site',
        'fields.slug': slug,
        limit: 1,
    });

    if (response.items.length > 0) {
        return response.items[0].sys.id;
    }
    return null;
}

// ----------------------------------------------------------------
// ★ここから変更: 元の処理を関数として定義し、unstable_cache でラップする
// ----------------------------------------------------------------

// Article取得の生ロジック
const fetchArticlesData = async (): Promise<Article[]> => {
    // 1. まずSiteのIDを取得する
    const targetSiteSlug = 'creative-lab-lp';
    const siteId = await getSiteIdBySlug(targetSiteSlug);

    if (!siteId) {
        console.warn(`Site not found with slug: ${targetSiteSlug}`);
        return [];
    }

    // 2. 取得したIDを使ってArticleを検索する
    const response = await client
        .withoutUnresolvableLinks
        .withAllLocales
        .getEntries<ArticleSkeleton>({
            content_type: 'article',
            'fields.publishSites.sys.id[in]': [siteId],
            order: ['-fields.publishDate'] as any,
        });

    return response.items.map((entry) => {
        const fields = entry.fields;

        const title = getLocValue<string>(fields.title, 'ja') || '';
        const subtitle = getLocValue<string>(fields.subtitle, 'ja');
        const slug = getLocValue<string>(fields.slug, 'ja') || entry.sys.id;
        const publishDate = getLocValue<string>(fields.publishDate, 'ja');
        const summary = getLocValue<string>(fields.summary, 'ja');
        const noteUrl = getLocValue<string>(fields.noteUrl, 'ja');
        const body = getLocValue<any>(fields.body, 'ja');

        // customData (JSONオブジェクト) を取得
        // .withAllLocales を使っているため、getLocValue で皮（ja）を剥く必要があります
        const customData = getLocValue<CustomData>(fields.customData, 'ja');
        // これで customData は純粋な JSON オブジェクトになります
        const creativeLabInfo = customData?.['creative-lab-lp'];

        let terms: ProgramTerm[] = [];

        if (creativeLabInfo?.programTerms) {
            const rawTerm = creativeLabInfo.programTerms;
            if (Array.isArray(rawTerm)) {
                // 既に配列の場合 (例: ["2ND", "3RD"])
                terms = rawTerm;
            } else {
                // 文字列の場合、配列に変換 (例: "2ND" -> ["2ND"])
                terms = [rawTerm];
            }
        }

        const coverImage = getAssetUrl(fields.cover2, 'ja');
        const headerImage = getAssetUrl(fields.cover, 'ja');

        const keywordsEn = getLocValue<string[]>(fields.keywords, 'en-US');
        const tags = keywordsEn ? keywordsEn.slice(0, 3) : [];

        return {
            id: entry.sys.id,
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
            body: body,
            programTerms: terms,
        };
    });
};

// ★エクスポートする関数 (キャッシュ付き)
export const getArticles = unstable_cache(
    fetchArticlesData,
    ['articles-list'], // 内部的なキャッシュキー (識別子)
    { tags: ['contentful-lp'] } // ★ Webhookで指定するタグ
);


// News取得の生ロジック
const fetchNewsData = async (): Promise<News[]> => {
    // 1. まずSiteのIDを取得する
    const targetSiteSlug = 'creative-lab-lp';
    const siteId = await getSiteIdBySlug(targetSiteSlug);

    if (!siteId) {
        console.warn(`Site not found with slug: ${targetSiteSlug}`);
        return [];
    }

    const response = await client
        .withoutUnresolvableLinks
        .withAllLocales
        .getEntries<NewsSkeleton>({
            content_type: 'news',
            'fields.publishSites.sys.id[in]': [siteId],
            order: ['-fields.publishDate'] as any,
        });

    return response.items.map((entry) => {
        const fields = entry.fields;
        const title = getLocValue<string>(fields.title, 'ja') || '';
        const subtitle = getLocValue<string>(fields.subtitle, 'ja');
        const slug = getLocValue<string>(fields.slug, 'ja') || entry.sys.id;
        const publishDate = getLocValue<string>(fields.publishDate, 'ja');
        const summary = getLocValue<string>(fields.summary, 'ja');
        const link = getLocValue<string>(fields.link, 'ja');
        const body = getLocValue<any>(fields.body, 'ja');

        const coverUrl = getAssetUrl(fields.cover, 'ja');
        const keywordsEn = getLocValue<string[]>(fields.keywords, 'en-US');
        const tags = keywordsEn ? keywordsEn.slice(0, 3) : [];

        return {
            id: entry.sys.id,
            slug: slug,
            title: title,
            subtitle: subtitle,
            coverImage: coverUrl,
            headerImage: coverUrl,
            date: publishDate || new Date().toISOString(),
            tags: tags,
            excerpt: summary,
            link: link,
            type: 'news',
            body: body,
        };
    });
};

// ★エクスポートする関数 (キャッシュ付き)
export const getNews = unstable_cache(
    fetchNewsData,
    ['news-list'], // 内部的なキャッシュキー
    { tags: ['contentful-lp'] } // ★ Webhookで指定するタグ
);