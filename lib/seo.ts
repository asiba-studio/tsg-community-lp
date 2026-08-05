// lib/seo.ts

// 本番ドメイン固定だとVercelのdevelop/PRプレビューでOGP画像がプレビュー先のURLで404になるため、
// プレビュー環境ではVercelが自動注入するVERCEL_URL（自分自身のホスト）を使う。
// プレビューはVercel側で自動的にx-robots-tag: noindexが付与されるためSEO上の実害は無い。
export const SITE_URL =
    process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_URL
        ? 'https://tsg-community.asiba.or.jp'
        : `https://${process.env.VERCEL_URL}`;

// サイト共通のOGP/metadataデフォルト値。
// article/newsの個別ページもCMSのcover/titleではなくこれらを使用する（cover画像はOGP用途では不採用）。
export const DEFAULT_OGP_TITLE = 'Community Design-LAB.｜私らしい"場"をデザインする。';
export const DEFAULT_OGP_DESCRIPTION = 'Community Design-LAB.は、自らの世界観や問いを深め、持続可能で、面白く、魅力的なコミュニティをつくるために実践を繰り返す、場づくりの実験室です。';
export const DEFAULT_OGP_IMAGE = '/images/og/og.png';
