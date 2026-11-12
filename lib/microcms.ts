// lib/microcms.ts
// CMSフェッチの共通ラッパー（asiba-studio-hp の libs/microcms.ts と同方針）。
// - 通常fetch: next: { revalidate: 3600, tags: [endpoint, `${endpoint}:${id}`] }
//   （3600秒はWebhook不達時の保険。通常はWebhook→revalidateTagで即時反映）
// - draftKey付きfetch: cache: 'no-store'・タグなし（下書きが公開キャッシュに混入しないように）

import { createClient, MicroCMSQueries } from 'microcms-js-sdk';

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

export const getDetail = async <T>(endpoint: string, contentId: string, queries?: MicroCMSQueries) => {
    const isDraft = Boolean(queries?.draftKey);
    return await client.get<T>({
        endpoint,
        contentId,
        queries,
        customRequestInit: isDraft
            ? { cache: 'no-store' }
            : { next: { revalidate: 3600, tags: [endpoint, `${endpoint}:${contentId}`] } },
    });
};

export const getList = async <T>(endpoint: string, queries?: MicroCMSQueries) => {
    const isDraft = Boolean(queries?.draftKey);
    return await client.getList<T>({
        endpoint,
        queries,
        customRequestInit: isDraft
            ? { cache: 'no-store' }
            : { next: { revalidate: 3600, tags: [endpoint] } },
    });
};
