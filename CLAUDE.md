# TSG Creative-LAB. LP — CLAUDE.md

## プロジェクト概要

**TSG Creative-LAB.** は、ASIBAスタジオが運営する建築・デザイン・アート系インキュベーションプログラムのLP（ランディングページ）です。

- **本番URL**: https://tsg-community.asiba.or.jp
- **フレームワーク**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS v4
- **CMS**: MicroCMS（記事・ニュース）
- **ホスティング**: Netlify

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動（Turbopack使用）
npm run build  # 本番ビルド
npm run lint   # ESLint
```

## ディレクトリ構成

```
app/                    # Next.js App Router ページ
  page.tsx              # トップページ
  layout.tsx            # ルートレイアウト（メタデータ・GA・Adobe Fonts設定）
  about/page.tsx        # Creative-LAB.の説明ページ
  articles/             # 記事一覧・詳細
  news/                 # ニュース一覧・詳細
  open-talks/           # Open TALKsイベント一覧・詳細
  projects-fair/        # Projects Fair ページ
  archive/2nd/          # 2期生アーカイブ
  api/revalidate/       # MicroCMS Webhook によるキャッシュ再検証
  api/draft/            # Draft Mode 有効化（プレビュー用）
  api/disable-draft/    # Draft Mode 解除

components/
  home/                 # トップページ専用コンポーネント群
    HeroSection.tsx     # p5.js + WebGL インタラクティブキービジュアル（PC専用）
    Statement.tsx       # ステートメント文
    Tagline.tsx
    ProgramPhase.tsx    # プログラムの3フェーズ説明
    ProgramDetailSection.tsx
    ApllicationSection.tsx  # 応募セクション（typo注意: "Apllication"）
  layout/
    Header.tsx          # スティッキーナビゲーション（PC専用・'use client'）
    Footer.tsx          # フッター
    Menu.tsx            # スクロール用メニュー
  articles/
    ContentCard.tsx     # 記事・ニュース・OpenTalksのカードコンポーネント
    ContentList.tsx     # カードリスト（Masonryレイアウト対応）
    TagFilter.tsx
  InteractiveMosaic02.tsx  # canvas 2D API によるモザイク画像エフェクト（p5.js 不使用）

lib/
  api.ts                # MicroCMS APIクライアント（記事・ニュース取得・下書き取得）
  types.ts              # 型定義（ContentItem, Article, News, OpenTalk等）
  openTalks.ts          # Open Talks静的データ（ハードコード）
  date.ts               # 日付フォーマット
  markdown.ts           # Markdownパース

public/
  p5sketches/top-motion/    # HeroSectionのp5.jsテクスチャ画像
  gifs/                     # アニメーションGIF（green-mosaic.gifをアクセントに多用）
  images/                   # 静的画像
```

## データ取得

### MicroCMS（記事・ニュース）

`lib/api.ts` で `unstable_cache` を使ってキャッシュ。タグは `microcms-lp`。

```ts
// フィルター: publish_sites に 'tsg-creative-lab' が含まれるもののみ取得
filters: `publish_sites[contains]tsg-creative-lab`
```

キャッシュ再検証は `POST /api/revalidate` エンドポイント経由。
- ヘッダー: `x-microcms-secret: [MICROCMS_REVALIDATE_SECRET]`
- MicroCMS 管理画面の Webhook でこのヘッダーを設定する

### MicroCMS 下書きプレビュー（Draft Mode）

Next.js の Draft Mode を使用。記事・ニュースの下書きをブラウザで確認できる。

**フロー:**
1. MicroCMS のプレビューURLを設定: `http://localhost:3000/api/draft?secret=XXX&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=article`
2. `/api/draft` が Draft Mode を有効化（クッキーをセット）し `/articles/[slug]` にリダイレクト
3. ページが `draftMode().isEnabled` を確認し、`getArticleDraft(contentId, draftKey)` で下書きを取得
4. 画面下部に "DRAFT PREVIEW MODE" バナー + Exit リンクを表示

**ローカル確認:** `npm run dev` 後、MicroCMS の下書き記事URLから `CONTENT_ID` と `DRAFT_KEY` をコピーしてプレビューURLに貼り付けるだけで確認可能。

**複数LPの扱い:** MicroCMS はプレビューURLを1つしか設定できない。複数LPで共有している場合はスプレッドシート等にLPごとのURLテンプレートを用意し、メンバーが手動で `CONTENT_ID` と `DRAFT_KEY` を書き換えて使う運用を推奨。

### Open Talks

`lib/openTalks.ts` に静的配列としてハードコード。Peatixへの外部リンクを持つ。

### ContentItem共通型

```ts
interface ContentItem {
  id, slug, title, subtitle?,
  coverImage,    // リスト表示用（正方形）
  headerImage,   // 詳細ページヘッダー用（横長）
  date, tags, excerpt?, link?,
  type: 'article' | 'news' | 'open-talks',
  programTerms?: ('2ND' | '3RD')[]
}
```

## スタイリング規則

- **Tailwind v4**（`@import 'tailwindcss'` 形式）
- **カスタムテーマ** (`globals.css` の `@theme`):
  - `--color-primary: #00ff00`（蛍光グリーン）
  - `--color-secondary: #016969`
  - `--color-border: #d1d5db`
  - `--color-text-primary: #111111`（メインテキスト色。変更するならここだけ）
  - フォント: `--font-sans`（fot-cezanne-pron → Zen Kaku Gothic New）、`--font-en`（helvetica-neue-lt-pro → Inter）
- **流体テキストサイズ**: `text-fluid-xs` 〜 `text-fluid-9xl`（`clamp()` ベース）
- **セクション間隔**: `.section-spacing` クラスで統一
- **green-mosaic.gif**: 見出しの背景・ホバーエフェクトとして多用。`<Image>` で使う場合は必ず `unoptimized` を付ける

## フォント

- Adobe Fonts (Typekit kit ID: `qpe7cyw`): `fot-cezanne-pron`、`helvetica-neue-lt-pro`、`dnp-shuei-gothic-gin-std`
- Google Fonts: Zen Kaku Gothic New、Inter（フォールバック）

## ページ構成

| パス | 内容 |
|------|------|
| `/` | トップ（HeroSection, News, OpenTalks, Programs, Articles） |
| `/about` | Creative-LAB.の説明（簡素、要拡充） |
| `/articles` | 記事一覧 |
| `/articles/[slug]` | 記事詳細 |
| `/news` | ニュース一覧 |
| `/news/[slug]` | ニュース詳細 |
| `/open-talks` | Open Talks一覧 |
| `/open-talks/[slug]` | Open Talks詳細 |
| `/projects-fair` | Projects Fair |
| `/archive/2nd` | 2期生アーカイブ |

## 注意事項

- `Header.tsx` はPC（`lg:block`）のみ表示。モバイルはコメントアウト済み。
- モバイルのキービジュアルは静的画像 `/images/common/keyvisual-mobile.jpg`、PCは `HeroSection`（p5.js + WebGL）。
- `ContentCard` では Article は強制的に内部ページへ、News/OpenTalks は `link` フィールドがあれば外部リンク。
- MicroCMSの画像URLには自動でリサイズパラメータ（`?w=1200&h=1200`）が付与される（`ContentCard` の `getResizedImageUrl`）。
- `InteractiveMosaic02` は **canvas 2D API** で実装（p5.js/WebGL 不使用）。ホバーで0/1切り替え。WebGLコンテキスト枯渇・CORS問題の回避のため書き直した経緯あり。
- `.env.local` に `MICROCMS_SERVICE_DOMAIN`・`MICROCMS_API_KEY`・`MICROCMS_REVALIDATE_SECRET`・`MICROCMS_PREVIEW_SECRET` が必要（`.env.example` 参照）。
- `FloatingApplicationButton` はデスクトップ（`hidden md:block`）のみ表示。
- `ApllicationSection` ファイル名にtypo（"Apllication"）——変更しないこと（import多数）。
- テキスト色は原則 `text-text-primary` / `var(--color-text-primary)` を使うこと。`text-gray-*` や `text-black` のハードコードは避ける。

## ブランチ運用

- `main`: 本番
- `develop`: 開発ブランチ（通常はここから作業してPR）
