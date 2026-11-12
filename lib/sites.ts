// lib/sites.ts
// マルチサイト配信（home_site / listed_sites）の設定。

// このLP自身のsite content id。
// community-lab 専用のsite。creative-lab LP（`tsg-creative-lab`）とは別site。
export const SELF = 'tsg-community-lab';

type SitePaths = { article_path: string; news_path: string };

// siteエンドポイントの article_path / news_path が未設定(null/undefined)の場合のフォールバック既定値。
// CMS側に項目が揃ったら、このテーブルごと削除してよい。
const FALLBACK_SITE_PATHS: Record<string, SitePaths> = {
    'league-lp': { article_path: '/articles', news_path: '/news' },
    'tsg-creative-lab': { article_path: '/articles', news_path: '/news' },
    'tsg-community-lab': { article_path: '/articles', news_path: '/news' },
    'morigoto-crayon': { article_path: '/articles', news_path: '/news' },
    'nessum-award': { article_path: '/articles', news_path: '/news' },
    'challenge-lp': { article_path: '/articles', news_path: '/news' },
    'corporate-hp': { article_path: '/texts', news_path: '/news' },
};

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
    const fallback = FALLBACK_SITE_PATHS[homeSite.id];
    const path = (kind === 'article'
        ? homeSite.article_path ?? fallback?.article_path
        : homeSite.news_path ?? fallback?.news_path);
    if (!homeSite.url || path == null) return undefined;
    return `${homeSite.url.replace(/\/$/, '')}${path}/${contentId}`;
}
