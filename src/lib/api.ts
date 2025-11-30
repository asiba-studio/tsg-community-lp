// src/lib/api.ts

import {
    createClient,
    EntryFieldTypes,
    Asset,
} from 'contentful';
import { Article, News } from './types';

// Site Skeleton
type SiteSkeleton = {
    contentTypeId: 'site';
    fields: {
        // nameかtitleかはどちらでもOKですが、前の会話に基づき定義
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
        // publishSites は Siteモデルへの参照配列
        publishSites: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SiteSkeleton>>;
        summary: EntryFieldTypes.Text;
        body: EntryFieldTypes.RichText;
        keywords: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        publishDate: EntryFieldTypes.Date;
        noteUrl: EntryFieldTypes.Symbol;
    }
}

// News Skeleton
type NewsSkeleton = {
    contentTypeId: 'news';
    fields: {
        title: EntryFieldTypes.Symbol;
        subtitle: EntryFieldTypes.Symbol;
        slug: EntryFieldTypes.Symbol;
        // publishSites は Siteモデルへの参照配列
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

// 記事取得
export async function getArticles(): Promise<Article[]> {

    // 1. まずSiteのIDを取得する
    const targetSiteSlug = 'creative-lab-lp'; // ← Siteのslugを指定
    const siteId = await getSiteIdBySlug(targetSiteSlug);

    // Siteが見つからない場合は空配列を返して終了（エラー回避）
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

            // 【重要】配列Referenceの検索は、中身ではなく「sys.id」で行う必要があります
            // 「publishSitesの中に、このIDが含まれているか」という検索になります
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
        };
    });
}

// News取得関数 (変更なし)
export async function getNews(): Promise<News[]> {

    // 1. まずSiteのIDを取得する
    const targetSiteSlug = 'creative-lab-lp'; // ← Siteのslugを指定
    const siteId = await getSiteIdBySlug(targetSiteSlug);

    // Siteが見つからない場合は空配列を返して終了（エラー回避）
    if (!siteId) {
        console.warn(`Site not found with slug: ${targetSiteSlug}`);
        return [];
    }

    const response = await client
        .withoutUnresolvableLinks
        .withAllLocales
        .getEntries<NewsSkeleton>({
            content_type: 'news',

            // 【重要】配列Referenceの検索は、中身ではなく「sys.id」で行う必要があります
            // 「publishSitesの中に、このIDが含まれているか」という検索になります
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
}