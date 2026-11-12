# TSG Creative-LAB. LP — CLAUDE.md

## プロジェクト概要

**TSG Creative-LAB.** は、ASIBAスタジオが運営する建築・デザイン・アート系インキュベーションプログラムのLP（ランディングページ）です。

> **2026-08 注記**: 4期よりプログラム名・サイトブランドが **「Community Design-LAB.」**（コミュニティづくりにフォーカス）に変わっている。ヘッダーロゴ・フッター・metadata・トップページの本文は4期ブランドに更新済み（`docs/4th-info/4th.md` が原稿）。ただし `archive/2nd`・`archive/3rd`・`lib/openTalks.ts`・`app/open-talks/page.tsx`・`app/projects-fair/page.tsx` は過去期の記録なので **意図的に「Creative-LAB.」のまま**残している。ロゴ画像アセット（`logo-creative-lab.png`）は4期用の差し替えが無いため、Header/Footerは暫定的にテキストロゴ「COMMUNITY DESIGN-LAB.」で表示中。

- **本番URL**: https://tsg-community.asiba.or.jp
- **フレームワーク**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS v4
- **CMS**: MicroCMS（記事・ニュース）
- **ホスティング**: Vercel（Netlifyではない）

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
  articles/             # 記事一覧・詳細（詳細は静的生成 + ISR）
  news/                 # ニュース一覧・詳細（同上）
  preview/              # 下書きプレビュー（/preview/articles/[id]・/preview/news/[id]。force-dynamic・noindex）
  open-talks/           # Open TALKsイベント一覧・詳細
  projects-fair/        # Projects Fair ページ
  archive/2nd/          # 2期生アーカイブ
  archive/3rd/          # 3期生アーカイブ
  api/revalidate/       # MicroCMS Webhook によるキャッシュ再検証
  api/draft/            # プレビュー入口（secret検証 → /preview/<type>/<id>?draftKey=... へredirect）

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
  InteractiveMosaic02.tsx  # canvas 2D API によるモザイク画像エフェクト（p5.js 不使用。3期以前のProgramCard/記事カードで使用）
  HalftoneHoverImage.tsx   # 4期から採用のシンプルな画像切替（ホバー前=ハーフトーン、ホバー後=通常画像）。MicroCMSのlp_settings（cover_square/cover_sq_halftone等）を見据えた設計。現状は public/images/test/dummy-square(-halftone).png をダミーとして使用中

lib/
  microcms.ts           # CMSフェッチ共通ラッパー（getDetail/getList。revalidate・タグ・draftKey時no-store）
  api.ts                # 記事・ニュース取得・下書き取得（lp_settings等のマッピング）
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

`lib/microcms.ts` の `getDetail`/`getList` が全CMS取得を担う（asiba-studio-hp と同方式）。

- 通常fetch: `next: { revalidate: 3600, tags: [endpoint, `${endpoint}:${id}`（詳細のみ）] }`。3600秒はWebhook不達時の保険で、基本はWebhook→`revalidateTag`で即時反映
- `draftKey` 付きfetch: `cache: 'no-store'`・タグなし（下書きが公開キャッシュに混入しないように）
- 公開の一覧/詳細ページは静的生成（`generateStaticParams`）+ ISR。公開詳細ページは `searchParams` / `draftMode()` を読まない（読むと動的化するため）
- ルーティングは `slug`（現状 `api.ts` で `entry.id` をセット）
- `lp_settings`（`creative_lab_lp`）の処理は従来どおり。`publish_sites` は廃止予定でコードは参照しない（下記 home_site / listed_sites）

### 配信サイト絞り込み（home_site / listed_sites）

`lib/sites.ts` の `SELF`（このLPのsite content id）を使い、一覧は
`home_site[equals]SELF[or]listed_sites[contains]SELF` で取得する（`HOME_OR_LISTED_FILTER`）。

- **home**（`home_site` が自サイト）: 本文をこのLPで公開。詳細ページ・`generateStaticParams`・sitemapは `getHomeArticles()` / `getHomeNews()` のみ使用（listedは詳細ページを持たず、URL直打ちは404）
- **listed**（`home_site` が他サイト）: 一覧・Cardには載るが、`externalUrl`（`${home_site.url}${article_path|news_path}/${id}`）へ新しいタブ（`target="_blank" rel="noopener noreferrer"`、`lib/external-link.ts`の`listedLinkProps`）で外部遷移。Cardには↗マークとaria-label（「新しいタブで開く」付き）。`article_path`/`news_path` 未設定時は `lib/sites.ts` の `FALLBACK_SITE_PATHS` を使う（CMS側が揃ったら削除）
- `SELF` は `tsg-community-lab`（community-lab専用site。2026-11-12にcreative-labと分離。home_siteがこのsiteの記事は syllabus `lab-program` と report `cdl-meetup-report` のみ）
- プレビュー（`/preview/*`）はhome_siteが自サイトの前提で変更なし

### 環境変数（`.env.example` / Vercel）

`MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` / `MICROCMS_WEBHOOK_SECRET` / `MICROCMS_DRAFT_SECRET`（`.env.local` とVercelの両方に設定）。

### Webhook による再検証（`POST /api/revalidate`）

`x-microcms-signature` をHMAC-SHA256(`MICROCMS_WEBHOOK_SECRET`, rawBody)で検証（`timingSafeEqual`、不一致は401）。ペイロードの `api` をタグとして `revalidateTag(api, { expire: 0 })`、`id` があれば `${api}:${id}` も失効させる（Next.js 16 は第2引数必須。外部更新を次のリクエストで確実に反映するため `{ expire: 0 }`）。

**microCMS管理画面での設定（`article` と `news` の各APIごと）:**
1. API設定 > Webhook > 追加 > **「Custom Notifications」**
2. URL: `https://tsg-community.asiba.or.jp/api/revalidate`
3. Secret: `MICROCMS_WEBHOOK_SECRET` と同じ値（MicroCMSがHMAC-SHA256署名を `x-microcms-signature` に付与する）
4. Notification Timing:
   - Publish グループ: 全チェック
   - Unpublish グループ: 「Unpublish content or revert it to draft in the editor」「Unpublish scheduled content」をチェック
   - Delete published content: 「Delete published content in the editor」をチェック
   - Draft 系・API 設定系: 不要

複数LP運用時は、APIごとに各LPのrevalidate URLを通知先として追加する。

### 下書きプレビュー（draftKey方式）

`draftMode()` のcookieには依存せず、**URLの `draftKey` のみで認可**する（asiba-studio-hp と同方式）。

1. microCMSのプレビューURL → `/api/draft` が `MICROCMS_DRAFT_SECRET` を検証
2. `/preview/articles/{id}?draftKey=...`（news は `/preview/news/{id}?draftKey=...`）へredirect
3. `/preview/*` は `force-dynamic`・noindex。`getArticleDraft` / `getNewsDraft`（`cache: 'no-store'`）で下書き取得し、`DraftBanner`（画面上部固定）を表示。`draftKey` が無い、または取得失敗は404
4. 表示は公開ページと共通の `components/articles/ArticleDetailView.tsx` / `NewsDetailView.tsx`（`draft` prop でバナー表示）
5. リダイレクト後のURL（`?draftKey=` 付き）を共有すれば、cookieなしの別ブラウザでも下書きを開ける。反面、URLが漏れれば誰でも閲覧可能（トレードオフ）

**microCMS管理画面での設定（API設定 > 画面プレビュー）:**
- article: `https://tsg-community.asiba.or.jp/api/draft?secret=<MICROCMS_DRAFT_SECRET>&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=article`
- news: `https://tsg-community.asiba.or.jp/api/draft?secret=<MICROCMS_DRAFT_SECRET>&contentId={CONTENT_ID}&draftKey={DRAFT_KEY}&type=news`

`{CONTENT_ID}`/`{DRAFT_KEY}` はmicroCMSが実値に置換する。VercelのPreviewデプロイ（URLが毎回変わる）には対応できないため本番ドメインを登録する。microCMSはプレビューURLをAPIごとに1つしか持てないため、複数LPで同じAPIを共有する場合はURLテンプレートを手動で書き換えて使う。

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
- **テキストサイズ**: 2026-08に独自の `text-fluid-*`（旧: vwベースの`clamp()`可変サイズ）を廃止し、Tailwind標準の `text-xs`〜`text-9xl` にすべて置き換え済み（値が完全一致していたため機械的にリネーム）。`base`=16px(Body)/`lg`=18px(H4)/`3xl`=30px(H2)/`4xl`=36px(H1)がデザイン仕様の値と一致。13px相当のみTailwind標準に無いため `.text-caption` を独自定義。
- **h1〜h4のベーススタイル**: 36px/30px/23px/18px固定（`@layer base`）。ただしほとんどのコンポーネントはTailwind標準の `text-*` ユーティリティで上書きしているため、生の見出しタグへの依存は少ない。
- **見出しタグと見た目の分離**: `<h1>`〜`<h6>` はページの実際の文書構造（SEO/アクセシビリティ上のアウトライン）に合わせて選び、見た目のサイズ・ウェイトは `text-*`/`font-bold` 等のユーティリティで別途指定する。「大きく見せたいから」という理由だけでタグレベルを変えない。
- **セクション間隔**: `.section-spacing` クラスで統一
- **色のハードコード禁止**: `text-gray-*`/`text-black`に加え、ボタン枠線やホバーアクセントに直接 `#00ff00`/`#0000ff` 等の16進数を書かず、`--color-primary`/`--color-link` などのトークン経由にすること（2026-08にコード内の残存箇所は`bg-primary`/`border-primary`/`text-primary`等に置換済み）。ただし `green-mosaic.gif` などの画像アセット自体は対象外（緑のまま）。
- **GIF画像全般**: `<Image>` で GIF を使う場合は必ず `unoptimized` を付ける（Next.js はアニメーション GIF を最適化できないため警告が出る）。`<img>` タグや `PixelImage` コンポーネントは対象外。`MosaicIcon.tsx` など動的パスの場合も同様。
- **記事本文（MicroCMSのHTML）のスタイリング**: 2026-08より `@tailwindcss/typography`（`prose`）を採用。`app/articles/[slug]/page.tsx` の `ARTICLE_PROSE_CLASSES` に `prose-p:`/`prose-h2:`/`prose-blockquote:` 等の修飾子をまとめて定義し、`html-react-parser` の `options.replace()` 側はCSSだけでは表現できないロジック（`<img>` のalt記法パース、`<a>` の`target="_blank"`付与）だけを担当する。CMS側の `speaker` クラス（発言者名ラベル）や blockquote 内の余白調整は `prose-*` 修飾子の対象外のため、コンテナに直接 `[&_.speaker]:...` のような任意バリアントで指定している。Typographyプラグインは blockquote内の最初/最後の `<p>` にスマートクォートを `::before`/`::after` で自動付与するため、除去したい場合は `[&_blockquote_p:first-of-type]:before:content-none` 等で個別に無効化する必要がある（`prose-blockquote:before:content-none` だけでは効かない）。

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
- `.env.local` に `MICROCMS_SERVICE_DOMAIN`・`MICROCMS_API_KEY`・`MICROCMS_WEBHOOK_SECRET`・`MICROCMS_DRAFT_SECRET` が必要（`.env.example` 参照）。これらの環境変数名はASIBA系LP共通で統一（値はLPごとに異なってよい）。
- `FloatingApplicationButton` はデスクトップ（`hidden md:block`）のみ表示。
- `ApllicationSection` ファイル名にtypo（"Apllication"）——変更しないこと（import多数）。
- テキスト色は原則 `text-text-primary` / `var(--color-text-primary)` を使うこと。`text-gray-*` や `text-black` のハードコードは避ける。

## ブランチ運用

- `main`: 本番
- `develop`: 開発ブランチ（通常はここから作業してPR）
