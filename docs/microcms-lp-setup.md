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
MICROCMS_WEBHOOK_SECRET=（任意の文字列・Webhook署名検証用）
MICROCMS_DRAFT_SECRET=（任意の文字列・Draft Mode用）
```

環境変数名はASIBA系LP共通で統一する。値はLPごとに異なってよい。

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

MicroCMSの署名検証（`x-microcms-signature` ヘッダー、HMAC-SHA256）を使う。カスタムヘッダーでの平文一致比較は廃止。

```ts
import { createHmac, timingSafeEqual } from 'crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');
  if (expectedBuf.length !== signatureBuf.length) return false;
  return timingSafeEqual(expectedBuf, signatureBuf);
}

export async function POST(request: Request) {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET;
  if (!secret) {
    return new Response('MICROCMS_WEBHOOK_SECRET is not configured', { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-microcms-signature');
  if (!isValidSignature(rawBody, signature, secret)) {
    return new Response('Invalid signature', { status: 401 });
  }

  revalidateTag('microcms-lp', { expire: 0 });

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
1. MicroCMS 管理画面 → 対象 API の設定 → Webhook → **「Custom Notifications」タイプ**を選択
2. URL: `https://your-lp-domain/api/revalidate`
3. **Secret** に環境変数 `MICROCMS_WEBHOOK_SECRET` と同じ値を設定
   （MicroCMSがこの値でペイロードをHMAC-SHA256署名し、`x-microcms-signature` ヘッダーを付与する。カスタムヘッダーでの平文一致比較方式は使わない）
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
https://your-lp-domain/api/draft?secret={MICROCMS_DRAFT_SECRET}&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=article
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
