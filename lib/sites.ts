// lib/sites.ts
// マルチサイト配信（home_site / listed_sites）の設定。

// このLP自身のsite content id。
// community-lab 専用のsite。creative-lab LP（`tsg-creative-lab`）とは別site。
export const SELF = 'tsg-community-lab';

// 展開されたsite（depth=1）の最小型
export type SiteRef = {
    id: string;
    url?: string | null;
    article_path?: string | null;
    news_path?: string | null;
};

// microCMSのfilters構文: 自サイトがhome、または一覧(listed)に含まれるもの
export const HOME_OR_LISTED_FILTER = `home_site[equals]${SELF}[or]listed_sites[contains]${SELF}`;

// home_siteが自サイトでなければ、その記事/ニュースへの外部URLを返す。自サイトがhomeならundefined。
export function getExternalUrl(
    homeSite: SiteRef | null | undefined,
    kind: 'article' | 'news',
    contentId: string,
): string | undefined {
    if (!homeSite || homeSite.id === SELF) return undefined;
    // siteエンドポイントのpathが未設定（null/undefined）ならリンクなし（undefined）
    const path = kind === 'article' ? homeSite.article_path : homeSite.news_path;
    if (!homeSite.url || path == null) return undefined;
    return `${homeSite.url.replace(/\/$/, '')}${path}/${contentId}`;
}
