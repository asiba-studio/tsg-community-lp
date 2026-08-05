import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import parse, { DOMNode, Element, Text, domToReact } from 'html-react-parser';
import { getArticles, getArticleDraft } from 'lib/api';
import { Header } from 'components/layout';
import HalftoneHoverImage from 'components/HalftoneHoverImage';
import { formatDateDot } from 'lib/date';
import { DEFAULT_OGP_TITLE, DEFAULT_OGP_DESCRIPTION, DEFAULT_OGP_IMAGE } from 'lib/seo';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ draftKey?: string; contentId?: string }>;
}

async function getArticle(slug: string) {
    const articles = await getArticles();
    return articles.find((a) => a.slug === slug);
}

// ----------------------------------------------------
// 記事本文のタイポグラフィ設定（見た目は @tailwindcss/typography の prose- 修飾子に集約し、
// options.replace 側は「CSSだけでは表現できない」ロジック（img/a）のみを扱う）
// ----------------------------------------------------
const ARTICLE_PROSE_CLASSES = [
    'prose prose-base max-w-none',
    'prose-p:font-sans prose-p:text-sm prose-p:md:text-base prose-p:text-text-primary prose-p:leading-loose prose-p:tracking-wide prose-p:mb-4 prose-p:md:mb-8',
    'prose-headings:font-sans prose-headings:font-bold prose-headings:text-text-primary',
    'prose-h1:text-2xl prose-h1:md:text-4xl prose-h1:mt-16 prose-h1:mb-6 prose-h1:border-l-4 prose-h1:border-primary prose-h1:pl-4',
    'prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mb-10 prose-h2:mt-5 prose-h2:lg:mt-40 prose-h2:pb-2 prose-h2:leading-normal',
    'prose-h3:text-xl prose-h3:mt-18 prose-h3:mb-5',
    'prose-h4:text-lg prose-h4:md:text-xl prose-h4:font-semibold prose-h4:mb-5 prose-h4:mt-5 prose-h4:leading-normal',
    'prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:space-y-2',
    'prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6 prose-ol:space-y-2',
    'prose-li:text-sm prose-li:md:text-base prose-li:text-text-primary',
    'prose-strong:text-text-primary prose-strong:font-bold',
    'prose-em:text-text-primary',
    'prose-blockquote:italic prose-blockquote:border-none prose-blockquote:bg-gray-100 prose-blockquote:px-6 prose-blockquote:py-6 prose-blockquote:my-12',
    // Typographyプラグインはblockquote内の最初/最後のpにスマートクォートを::before/::afterで付与するため個別に無効化
    '[&_blockquote_p:first-of-type]:before:content-none [&_blockquote_p:last-of-type]:after:content-none',
    'prose-figcaption:italic prose-figcaption:text-sm prose-figcaption:text-text-primary prose-figcaption:-mt-4',
    'prose-figure:my-2',
    'prose-hr:my-12 prose-hr:border-gray-300',
    'prose-code:before:content-none prose-code:after:content-none',
    // speakerクラス（発言者名ラベル）とblockquote内の最初/最後の要素の余白リセットはprose-*修飾子の対象外のため個別に指定
    '[&_.speaker]:font-bold [&_.speaker]:pr-4',
    '[&_blockquote>*:first-child]:mt-0 [&_blockquote>*:last-child]:mb-0',
].join(' ');

// ----------------------------------------------------
// 📝 HTML Parsing Options（CSSでは表現できないロジックのみ）
// ----------------------------------------------------
const options = {
    replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.type === 'tag') {
            // <a>: 外部リンクとして新規タブで開く（見た目はサイト共通のリンクスタイルに任せる）
            if (domNode.name === 'a') {
                return (
                    <a
                        href={domNode.attribs.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {domToReact(domNode.children as DOMNode[], options)}
                    </a>
                );
            }

            // <figcaption>: 他サイト向けの特殊指定（例: [auto][2][250px]）が文頭に付与されていることがあるが、
            // このサイトでは常にw-full表示のため不要。文頭の[...]をまとめて除去する
            if (domNode.name === 'figcaption') {
                const [first, ...rest] = domNode.children as DOMNode[];
                if (first instanceof Text) {
                    const cleaned = first.data.replace(/^(\s*\[[^\]]*\])+\s*/, '');
                    return (
                        <figcaption>
                            {cleaned}
                            {domToReact(rest, options)}
                        </figcaption>
                    );
                }
            }

            // <img>
            // MicroCMS returns images as <img> tags. We can try to preserve the aspect ratio or styles.
            if (domNode.name === 'img') {
                const { src, alt, width, height } = domNode.attribs;

                // Parse commands from alt text if present (e.g. [w:sm] Caption)
                let customWidthClass = 'max-w-4xl'; // default
                // sm/md/lg指定時は本文幅に収めてセンタリングするため、mobileでもbleedさせない
                let bleedOnMobile = true;
                let showCaption = false;
                let displayCaption = alt || '';

                if (alt) {
                    const widthMatch = alt.match(/\[w:(sm|md|lg|full)\]/);
                    if (widthMatch) {
                        const value = widthMatch[1];
                        if (value === 'sm') { customWidthClass = 'max-w-50'; bleedOnMobile = false; }
                        else if (value === 'md') { customWidthClass = 'max-w-80'; bleedOnMobile = false; }
                        else if (value === 'lg') { customWidthClass = 'max-w-130'; bleedOnMobile = false; }
                        else if (value === 'full') customWidthClass = 'max-w-none';
                    }
                    if (alt.includes('[caption]')) {
                        showCaption = true;
                    }
                    displayCaption = alt
                        .replace(/\[w:(sm|md|lg|full)\]/g, '')
                        .replace(/\[caption\]/g, '')
                        .trim();
                }

                // mobileはpx-3の親パディングを打ち消して画面幅いっぱいに表示（-mx-3）。lg以上は通常のカラム内に収める
                const containerClasses = `my-2 flex flex-col items-center ${bleedOnMobile ? '-mx-3 lg:mx-0' : ''} ${customWidthClass}`;

                return (
                    <div className={containerClasses}>
                        <Image
                            src={src}
                            width={parseInt(width || '800')}
                            height={parseInt(height || '600')}
                            alt={displayCaption || 'Article Image'}
                            className="w-full h-auto object-cover"
                            unoptimized={true} // microCMS images
                        />
                        {showCaption && displayCaption && (
                            <p className="text-sm text-gray-500 mt-2">{displayCaption}</p>
                        )}
                    </div>
                );
            }
        }
    }
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { draftKey, contentId } = await searchParams;
    const { isEnabled } = await draftMode();

    const article = isEnabled && draftKey && contentId
        ? await getArticleDraft(contentId, draftKey)
        : await getArticle(slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    const description = article.excerpt || DEFAULT_OGP_DESCRIPTION;

    return {
        title: { absolute: DEFAULT_OGP_TITLE },
        description,
        openGraph: {
            title: DEFAULT_OGP_TITLE,
            description,
            images: [{ url: DEFAULT_OGP_IMAGE, width: 1200, height: 630 }],
            type: 'article',
            publishedTime: article.date,
            authors: [],
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: DEFAULT_OGP_TITLE,
            description,
            images: [DEFAULT_OGP_IMAGE],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default async function ArticlePage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { draftKey, contentId } = await searchParams;
    const { isEnabled: isDraft } = await draftMode();

    const article = isDraft && draftKey && contentId
        ? await getArticleDraft(contentId, draftKey)
        : await getArticle(slug);

    if (!article) {
        notFound();
    }

    const contentBody = article.body_ja;

    return (
        <article className="w-full pb-50">
            {isDraft && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black text-white text-sm font-en font-bold px-5 py-3 shadow-lg">
                    <span>DRAFT PREVIEW MODE</span>
                    <a href="/api/disable-draft" className="underline text-primary no-underline hover:opacity-80">
                        Exit
                    </a>
                </div>
            )}
            {/* カバー画像 (mobileは画面高さいっぱい、md以上は1440/756・画面内に入ったらハーフトーン→通常画像) */}
            {article.headerImage && (
                <HalftoneHoverImage
                    normalSrc={article.headerImage}
                    halftoneSrc={article.headerImageHalftone || article.headerImage}
                    alt={article.title}
                    sizeClassName="h-dvh md:h-auto md:aspect-[1440/756]"
                    sizes="100vw"
                    overlay={
                        <div className="absolute bottom-0 left-0 px-3 py-4 lg:p-8">
                            {article.lpSubtitle && (
                                <div className="font-bold mb-1 lg:mb-2 text-sm lg:text-base text-white">{article.lpSubtitle}</div>
                            )}
                            <div className="text-lg md:text-2xl lg:text-3xl font-bold leading-snug text-white">{article.title}</div>
                        </div>
                    }
                />
            )}

            {/* カバーの下に配置。Header自体はsticky top-0なので、スクロールで上端に達すると固定される */}
            <Header />

            <div className="w-full px-3 md:px-8 mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-[5fr_2fr] md:gap-x-[clamp(3rem,14vw,14rem)]">
                <div className="w-full">
                    <h1 className='hidden md:block font-sans font-bold text-3xl md:text-4xl leading-relaxed mb-4 md:mb-10'>
                        {article.title}
                    </h1>
                    <div className='mb-12 md:mb-10 font-semibold leading-normal font-en text-left md:text-right'>
                        {article.date ? formatDateDot(article.date) : ''}
                    </div>

                    {/* 記事本文 (MicroCMS HTML) */}
                    <div className={ARTICLE_PROSE_CLASSES}>
                        {contentBody ? parse(contentBody, options) : (
                            <p className="text-gray-500 py-10 text-center">No content available</p>
                        )}
                    </div>
                </div>

                {/* 右側は意図的に空 */}
                <div className="w-full" />
            </div>
        </article>
    );
}
