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
  archive/3rd/          # 3期生アーカイブ
  api/revalidate/       # MicroCMS Webhook によるキャッシュ再検証
  api/draft/            # Draft Mode 有効化（プレビュー用）
  api/disable-draft/    # Draft Mode 解除

components/
  home/                 # トップページ専用コンポーネント群
    HeroSection.tsx     # p5.js + WebGL インタラクティブキービジュアル（PC専用・4期からトップページでは不使用。/projects-fair では使用中）
    Statement.tsx       # ステートメント文
    Tagline.tsx
    ProgramPhase.tsx    # プログラムの3フェーズ説明
    ProgramDetailSection.tsx
    ApllicationSection.tsx  # 応募セクション（typo注意: "Apllication"）
  archive/2nd/, archive/3rd/  # 各期アーカイブページ専用のコンポーネント群（home配下のスナップショットをコピーして保持）
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
// publish_sites[contains] は関連コンテンツの content ID で絞り込む（slug ではない）
filters: `publish_sites[contains]tsg-creative-lab`
```

キャッシュ再検証は `POST /api/revalidate` エンドポイント経由。

**MicroCMS Webhook 設定手順（APIエンドポイントごとに設定）:**
1. Webhook タイプは **「Custom」** を選択（「Vercel」タイプはカスタムヘッダー非対応のため不可）
2. URL: `https://tsg-community.asiba.or.jp/api/revalidate`
3. Custom Request Headers に追加:
   - Key: `X-MICROCMS-SECRET`（MicroCMSの仕様上 `X-` プレフィックス必須・大文字）
   - Value: 環境変数 `MICROCMS_REVALIDATE_SECRET` と同じ値
4. Notification Timing の推奨設定:
   - Publish グループ: 全チェック
   - Unpublish グループ: 「Unpublish content or revert it to draft in the editor」「Unpublish scheduled content」をチェック
   - Delete published content: 「Delete published content in the editor」をチェック
   - Draft 系・API 設定系: 不要

**複数LP運用時:** 同一 MicroCMS で複数 LP を運用している場合、APIエンドポイント（article/news 等）ごとに各 LP の revalidate URL を Webhook 通知先として追加する（3 API × LP数 = 合計 Webhook 数）。

### MicroCMS 下書きプレビュー（Draft Mode）

Next.js の Draft Mode を使用。記事・ニュースの下書きをブラウザで確認できる。

**フロー:**
1. MicroCMS のプレビューURLを設定: `http://localhost:3000/api/draft?secret=XXX&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=article`
2. `/api/draft` が Draft Mode を有効化（クッキーをセット）し `/articles/[contentId]` にリダイレクト
3. ページが `draftMode().isEnabled` を確認し、`getArticleDraft(contentId, draftKey)` で下書きを取得
4. 画面下部に "DRAFT PREVIEW MODE" バナー + Exit リンクを表示

**ローカル確認:** `npm run dev` 後、MicroCMS の下書き記事URLから `CONTENT_ID` と `DRAFT_KEY` をコピーしてプレビューURLに貼り付けるだけで確認可能。

**複数LPの扱い:** MicroCMS はプレビューURLを1つしか設定できない。複数LPで共有している場合はスプレッドシート等にLPごとのURLテンプレートを用意し、メンバーが手動で `CONTENT_ID` と `DRAFT_KEY` を書き換えて使う運用を推奨。

### Open Talks

`lib/openTalks.ts` に静的配列としてハードコード。Peatixへの外部リンクを持つ。

### ContentItem共通型

```ts
interface ContentItem {
  id,            // MicroCMS content ID
  slug,          // URL識別子 = content ID（api.ts で entry.id をセット。MicroCMS の slug フィールドは廃止予定）
  title, subtitle?,
  coverImage,    // リスト表示用（正方形）
  headerImage,   // 詳細ページヘッダー用（横長）
  date, tags, excerpt?, link?,
  type: 'article' | 'news' | 'open-talks',
  programTerms?: ('2ND' | '3RD')[]
}
```

## スタイリング規則

- **Tailwind v4**（`@import 'tailwindcss'` 形式）
- **カスタムテーマ** (`globals.css` の `@theme`)（2026-08 改訂。デザイン仕様書に合わせて統一）:
  - `--color-primary: #ff0067`（アクセントレッド。`.btn`背景・`bg-primary`等で使用。文字色は `--color-primary-content: #ffffff`）
  - `--color-text-primary: #252525`（メインテキスト色。変更するならここだけ）
  - `--color-link: #0000ff`（テキストリンク色。`a:not(.btn)` に base layer で適用済み）
  - `--color-border` / `--color-border-light`: 区切り線用の中立グレー（ブランドカラーではないため変更対象外）
  - フォント: `--font-sans`（日本語・既定 = Noto Sans JP）、`--font-en`（英語見出し用 = Helvetica Neue / Helvetica / Arial）、`--font-zen`（旧Zen Kaku Gothic New。現在はNoto Sans JPと同一、既存コンポーネント互換のため残置）
  - 旧 `--color-secondary` / `--color-text-secondary` は未使用だったため削除
- **テキストサイズ**: `text-fluid-xs` 〜 `text-fluid-9xl`。旧デザインはvwベースの`clamp()`による可変サイズだったが、固定px（非レスポンシブ）に統一済み。クラス名は互換性のため維持。`base`=16px(Body)/`lg`=18px(H4)/`3xl`=30px(H2)/`4xl`=36px(H1)がデザイン仕様の値と一致。13px相当は新設の `.text-caption` を使う。
- **h1〜h4のベーススタイル**: 36px/30px/23px/18px固定（`@layer base`）。ただしほとんどのコンポーネントは `text-fluid-*` 等のユーティリティで上書きしているため、生の見出しタグへの依存は少ない。
- **セクション間隔**: `.section-spacing` クラスで統一
- **色のハードコード禁止**: `text-gray-*`/`text-black`に加え、ボタン枠線やホバーアクセントに直接 `#00ff00`/`#0000ff` 等の16進数を書かず、`--color-primary`/`--color-link` などのトークン経由にすること（2026-08にコード内の残存箇所は`bg-primary`/`border-primary`/`text-primary`等に置換済み）。ただし `green-mosaic.gif` などの画像アセット自体は対象外（緑のまま）。
- **GIF画像全般**: `<Image>` で GIF を使う場合は必ず `unoptimized` を付ける（Next.js はアニメーション GIF を最適化できないため警告が出る）。`<img>` タグや `PixelImage` コンポーネントは対象外。`MosaicIcon.tsx` など動的パスの場合も同様。

## フォント

- **2026-08にAdobe Fonts (Typekit) を廃止**。`fot-cezanne-pron`/`helvetica-neue-lt-pro`/`dnp-shuei-gothic-gin-std`、および旧Google Fonts（Zen Kaku Gothic New、Inter）は使用しない。
- 現行: Google Fonts の **Noto Sans JP**（日本語）＋ システムフォントの **Helvetica Neue / Helvetica / Arial**（英語見出し）。`app/layout.tsx` の `<head>` で Noto Sans JP を読み込み。
- Typekitのwebfontloaderが `<html>` に付与していた `wf-loading`/`wf-active` クラスも無くなったため、旧環境で発生していたハイドレーション不一致の警告も解消。

## ページ構成

| パス | 内容 |
|------|------|
| `/` | トップ（キービジュアルはプレースホルダー div、News, OpenTalks, Programs, Articles） |
| `/about` | Creative-LAB.の説明（簡素、要拡充） |
| `/articles` | 記事一覧 |
| `/articles/[slug]` | 記事詳細（`[slug]` は MicroCMS の content ID） |
| `/news` | ニュース一覧 |
| `/news/[slug]` | ニュース詳細（`[slug]` は MicroCMS の content ID） |
| `/open-talks` | Open Talks一覧 |
| `/open-talks/[slug]` | Open Talks詳細 |
| `/projects-fair` | Projects Fair |
| `/archive/2nd` | 2期生アーカイブ |
| `/archive/3rd` | 3期生アーカイブ |

## 注意事項

- `Header.tsx` はPC（`lg:block`）のみ表示。モバイルはコメントアウト済み。
- トップページ（4期）のキービジュアルは未定のためプレースホルダー div（`app/page.tsx` 冒頭）。旧キービジュアル（`HeroSection` p5.js/WebGL + モバイル静止画 `/images/common/keyvisual-mobile.jpg`）は `/projects-fair` で現役使用中のため削除しないこと。archive/2nd, archive/3rd の各アーカイブページも将来的にキービジュアルを動画か静止画に置き換え予定（未着手）。
- アーカイブページを新規追加する場合は `app/archive/2nd/page.tsx` を雛形にする（Header/Menu/タイトル文 + Phase1-3 + OpenTalks + Program詳細 + 応募要項 + Statement + Article一覧、Hero/News/Taglineは無し）。使用するコンポーネントはそのタイミングの `components/home/*` をコピーして `components/archive/{期}/` に保存するスナップショット方式。
- MicroCMS の article スキーマに `lp_settings`（creative-lab-lp用カスタムフィールド。`cover_square`/`cover_sq_halftone`/`cover_landscape`/`cover_la_halftone` 等）が追加された。既存の `InteractiveMosaic02`（canvasでのリアルタイムモザイク処理）を、ホバー前=ハーフトーン画像・ホバー後=通常画像という単純な画像差し替えに置き換える計画があるが、詳細仕様は未確定・未実装（2026-08時点）。
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
