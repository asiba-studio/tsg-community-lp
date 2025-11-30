// src/lib/api.ts
import {
    createClient,
    EntryFieldTypes,
    Asset,
} from 'contentful';
import { Article } from './types';

// Skeleton定義（変更なし）
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

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// 多言語データから特定言語の値を取り出すヘルパー
// withAllLocalesを使うと、値が { ja: "...", en-US: "..." } のようなオブジェクトになります
function getLocValue<T>(field: any, locale: string = 'ja'): T | undefined {
    return field?.[locale];
}

// AssetのURL取得も多言語構造に対応
function getAssetUrl(assetField: any, locale: string = 'ja'): string {
    // 1. まずフィールド自体のローカライズを解決 (Link)
    const asset = assetField?.[locale];
    if (!asset) return '';

    // 2. Assetの中身のfileフィールドもローカライズされているため解決
    // Asset構造: asset.fields.file['ja'].url
    const file = asset.fields?.file?.[locale];
    const url = file?.url;

    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
}

export async function getArticles(): Promise<Article[]> {
    const response = await client
        .withoutUnresolvableLinks
        .withAllLocales // 全言語のデータを取得します
        .getEntries<ArticleSkeleton>({
            content_type: 'article',
            'fields.publishSite[in]': ['Creative-LAB-LP'],
            order: ['-fields.publishDate'] as any,
        });

    const articles: Article[] = response.items.map((entry) => {
        // entry.fields の中身はすべて { ja: ..., en-US: ... } の形になっています
        const fields = entry.fields;

        // 基本は 'ja' を指定して取得
        const title = getLocValue<string>(fields.title, 'ja') || '';
        const subtitle = getLocValue<string>(fields.subtitle, 'ja');
        const publishDate = getLocValue<string>(fields.publishDate, 'ja');
        const summary = getLocValue<string>(fields.summary, 'ja');
        const noteUrl = getLocValue<string>(fields.noteUrl, 'ja');
        const body = getLocValue<any>(fields.body, 'ja');

        // 画像も 'ja' のものを取得 (※画像自体がローカライズ不要設定でも、withAllLocales時はキー指定が必要)
        const coverImage = getAssetUrl(fields.cover2, 'ja');
        const headerImage = getAssetUrl(fields.cover, 'ja');

        // タグだけは 'en-US' を指定して取得
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

    return articles;
}