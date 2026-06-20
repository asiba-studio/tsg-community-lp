# MicroCMS × Next.js LP — セットアップガイド（AI向け）

ASIBA の LP プロジェクト共通パターンを実装するための手順書です。
**tsg-community-lp が参照実装**です。不明点はそちらのコードを確認してください。

---

## 前提

- Next.js App Router + TypeScript
- MicroCMS でコンテンツを管理（複数 LP で同一 MicroCMS を共有）
- `publish_sites` フィールド（relationList）で LP ごとにコンテンツを絞り込む
- MicroCMS の **content ID = URL のスラッグ**として使用（`slug` フィールドは廃止予定）

---

## 1. 環境変数

`.env.local`（および本番環境の環境変数）に以下を追加：

```
MICROCMS_SERVICE_DOMAIN=（サービスドメイン）
MICROCMS_API_KEY=（APIキー）
MICROCMS_REVALIDATE_SECRET=（任意の文字列・Webhook認証用）
MICROCMS_PREVIEW_SECRET=（任意の文字列・Draft Mode用）
```

---

## 2. lib/api.ts の実装パターン

### ポイント
- `slug` には `entry.id`（content ID）をセットする（`entry.slug` は使わない）
- `unstable_cache` でキャッシュ、タグは `microcms-lp` で統一
- `publish_sites[contains]${TARGET_SITE_ID}` でこの LP のコンテンツだけ取得
  - `TARGET_SITE_ID` は MicroCMS 上の **site コンテンツの content ID**

```ts
import { createClient } from 'microcms-js-sdk';
import { unstable_cache } from 'next/cache';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

const TARGET_SITE_ID = 'your-lp-site-id'; // MicroCMS の site content ID

const fetchArticlesData = async () => {
  const response = await client.getList({
    endpoint: 'article',
    queries: {
      filters: `publish_sites[contains]${TARGET_SITE_ID}`,
      orders: '-date',
      limit: 100,
    },
  });

  return response.contents.map((entry) => ({
    id: entry.id,
    slug: entry.id,   // ← content ID を slug として使う（entry.slug は使わない）
    title: entry.title_ja || '',
    // ... 他フィールド
  }));
};

export const getArticles = unstable_cache(
  fetchArticlesData,
  ['articles-list-microcms'],
  { tags: ['microcms-lp'] }
);
```

---

## 3. /api/revalidate/route.ts の実装

```ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-microcms-secret');
  if (secret !== process.env.MICROCMS_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidateTag('microcms-lp');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

---

## 4. ページのルーティング

`app/articles/[slug]/page.tsx` などで content ID でコンテンツを検索する：

```ts
// URL パラメータ名は [slug] のままでよい（中身は content ID）
async function getArticle(slug: string) {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug); // slug = content ID
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug })); // slug = content ID
}
```

---

## 5. MicroCMS Webhook の設定

記事を公開・更新したときにキャッシュを自動で破棄するための設定です。
**APIエンドポイントごと**（article, news 等）に設定します。

### 手順
1. MicroCMS 管理画面 → 対象 API の設定 → Webhook → **「Custom」タイプ**を選択
   （「Vercel」タイプはカスタムヘッダー非対応のため使用不可）
2. URL: `https://your-lp-domain/api/revalidate`
3. **Custom Request Headers** に追加:
   - Key: `X-MICROCMS-SECRET`（`X-` プレフィックス必須・大文字で始める）
   - Value: 環境変数 `MICROCMS_REVALIDATE_SECRET` と同じ値
4. Notification Timing:
   - **Publish グループ**: 全チェック
   - **Unpublish グループ**: 「Unpublish content or revert it to draft in the editor」「Unpublish scheduled content」をチェック
   - **Delete published content**: 「Delete published content in the editor」をチェック
   - Draft 系・API 設定系: チェック不要

### 複数 LP での運用
- 同じ MicroCMS の article API を複数 LP で共有している場合、article API の Webhook に各 LP の URL を通知先として追加する
- `3 API × LP数` 分の Webhook 通知先が必要

---

## 6. Draft Mode（下書きプレビュー）

`app/api/draft/route.ts` で Draft Mode を有効化し、対象ページにリダイレクト。
`app/api/disable-draft/route.ts` で無効化。

MicroCMS のプレビュー URL テンプレート（例）:
```
https://your-lp-domain/api/draft?secret=MICROCMS_PREVIEW_SECRET&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=article
```

MicroCMS はプレビュー URL を 1 つしか設定できないため、複数 LP で共有する場合はスプレッドシート等に LP ごとの URL テンプレートをまとめ、手動で `CONTENT_ID` と `DRAFT_KEY` を書き換えて使う運用を推奨。

---

## 参照実装

`tsg-community-lp` リポジトリの以下のファイルが参考になります：

- `lib/api.ts` — MicroCMS クライアント・データ取得・ドラフト取得
- `lib/types.ts` — ContentItem 型定義
- `app/api/revalidate/route.ts` — Webhook 受信・キャッシュ破棄
- `app/api/draft/route.ts` — Draft Mode 有効化
- `app/articles/[slug]/page.tsx` — content ID によるページ取得パターン
