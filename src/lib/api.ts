import {
    createClient,
    EntryFieldTypes,
    Asset,
} from 'contentful';
// News型もインポートに追加します
import { Article, News } from './types';

// Article Skeleton (既存)
type ArticleSkeleton = {
    contentTypeId: 'article';
    fields: {
        title: EntryFieldTypes.Symbol;
        subtitle: EntryFieldTypes.Symbol;
        cover: EntryFieldTypes.AssetLink;
        cover2: EntryFieldTypes.AssetLink;
        publishSite: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        summary: EntryFieldTypes.Text;
        body: EntryFieldTypes.RichText;
        keywords: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        publishDate: EntryFieldTypes.Date;
        noteUrl: EntryFieldTypes.Symbol;
    }
}

// 【追加】News Skeleton (共有いただいたJSON定義に基づく)
type NewsSkeleton = {
    contentTypeId: 'news';
    fields: {
        title: EntryFieldTypes.Symbol;
        subtitle: EntryFieldTypes.Symbol;
        slug: EntryFieldTypes.Symbol; // Newsにはスラッグフィールドがある
        publishSites: EntryFieldTypes.Array<EntryFieldTypes.Symbol>; // 複数形 & 値が異なる
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

// 多言語データから特定言語の値を取り出すヘルパー
function getLocValue<T>(field: any, locale: string = 'ja'): T | undefined {
    return field?.[locale];
}

// AssetのURL取得も多言語構造に対応
function getAssetUrl(assetField: any, locale: string = 'ja'): string {
    const asset = assetField?.[locale];
    if (!asset) return '';

    const file = asset.fields?.file?.[locale];
    const url = file?.url;

    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
}

// 記事取得 (既存)
export async function getArticles(): Promise<Article[]> {
    const response = await client
        .withoutUnresolvableLinks
        .withAllLocales
        .getEntries<ArticleSkeleton>({
            content_type: 'article',
            'fields.publishSite[in]': ['Creative-LAB-LP'],
            order: ['-fields.publishDate'] as any,
        });

    return response.items.map((entry) => {
        const fields = entry.fields;

        const title = getLocValue<string>(fields.title, 'ja') || '';
        const subtitle = getLocValue<string>(fields.subtitle, 'ja');
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
            slug: entry.sys.id,
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

// 【追加】News取得関数
export async function getNews(): Promise<News[]> {
    const response = await client
        .withoutUnresolvableLinks
        .withAllLocales
        .getEntries<NewsSkeleton>({
            content_type: 'news',
            // JSON定義によると News の値は 'Creative-LAB.' (ドットあり) です
            'fields.publishSites[in]': ['Creative-LAB.'],
            order: ['-fields.publishDate'] as any,
        });

    return response.items.map((entry) => {
        const fields = entry.fields;

        const title = getLocValue<string>(fields.title, 'ja') || '';
        const subtitle = getLocValue<string>(fields.subtitle, 'ja');
        // Newsはslugフィールドを優先使用、なければID
        const slug = getLocValue<string>(fields.slug, 'ja') || entry.sys.id;
        const publishDate = getLocValue<string>(fields.publishDate, 'ja');
        const summary = getLocValue<string>(fields.summary, 'ja');
        const link = getLocValue<string>(fields.link, 'ja');
        const body = getLocValue<any>(fields.body, 'ja');

        // Newsは cover と header 両方とも 'cover' フィールドを使用
        const coverUrl = getAssetUrl(fields.cover, 'ja');

        const keywordsEn = getLocValue<string[]>(fields.keywords, 'en-US');
        const tags = keywordsEn ? keywordsEn.slice(0, 3) : [];

        return {
            id: entry.sys.id,
            slug: slug,
            title: title,
            subtitle: subtitle,
            coverImage: coverUrl,  // coverフィールド
            headerImage: coverUrl, // coverフィールド
            date: publishDate || new Date().toISOString(),
            tags: tags,
            excerpt: summary,
            link: link,
            type: 'news', // type識別子
            body: body,
        };
    });
}