import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import parse, { DOMNode, Element, Text, domToReact } from 'html-react-parser';
import { getNews, getNewsDraft } from 'lib/api';
import { Header } from 'components/layout';
import HalftoneHoverImage from 'components/HalftoneHoverImage';
import { formatDateDot } from 'lib/date';
import { DEFAULT_OGP_TITLE, DEFAULT_OGP_DESCRIPTION, DEFAULT_OGP_IMAGE } from 'lib/seo';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ draftKey?: string; contentId?: string }>;
}

async function getNewsItem(slug: string) {
    const newsItems = await getNews();
    return newsItems.find((item) => item.slug === slug);
}

// ----------------------------------------------------
// 記事本文のタイポグラフィ設定（articles/[slug]と同様、見た目はprose-修飾子に集約）
// ----------------------------------------------------
const NEWS_PROSE_CLASSES = [
    'prose prose-base max-w-none',
    'prose-p:font-sans prose-p:text-sm prose-p:md:text-base prose-p:text-text-primary prose-p:leading-loose prose-p:tracking-wide prose-p:mb-4 prose-p:md:mb-8',
    'prose-a:text-link prose-a:font-normal',
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
    '[&_blockquote_p:first-of-type]:before:content-none [&_blockquote_p:last-of-type]:after:content-none',
    'prose-figcaption:italic prose-figcaption:text-sm prose-figcaption:text-text-primary prose-figcaption:-mt-4',
    'prose-figure:my-2',
    'prose-hr:my-12 prose-hr:border-gray-300',
    'prose-code:before:content-none prose-code:after:content-none',
    '[&_.speaker]:font-bold [&_.speaker]:pr-4',
    '[&_blockquote>*:first-child]:mt-0 [&_blockquote>*:last-child]:mb-0',
].join(' ');

// ----------------------------------------------------
// 📝 HTML Parsing Options（CSSでは表現できないロジックのみ）
// ----------------------------------------------------
// <img>（本文中の画像）を描画する。figure配下から呼ばれる場合はfigcaption先頭の[Npx]指定を
// maxWidthPxとして受け取り、幅を上書きする（他サイト共通コマンドのうち[Npx]のみこのサイトで採用。
// [auto]はCMSのwidth/height属性をそのままaspect比として使う本サイトでは常に有効な挙動のため、
// 追加のスタイル処理は不要）。
function renderNewsImage(imgNode: Element, maxWidthPx: number | null) {
    const { src, alt, width, height } = imgNode.attribs;

    let customWidthClass = 'max-w-4xl';
    // sm/md/lg/px指定時は本文幅に収めてセンタリングするため、mobileでもbleedさせない
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

    // figcaptionの[Npx]指定はalt側の[w:sm/md/lg]指定より優先する
    if (maxWidthPx !== null) bleedOnMobile = false;

    // mobileはpx-[14px]の親パディングを打ち消して画面幅いっぱいに表示。lg以上は通常のカラム内に収める
    const containerClasses = `my-2 flex flex-col items-center ${bleedOnMobile ? '-mx-[14px] lg:mx-0' : ''} ${maxWidthPx !== null ? '' : customWidthClass}`;
    const containerStyle = maxWidthPx !== null ? { maxWidth: `${maxWidthPx}px`, width: '100%' } : undefined;

    return (
        <div className={containerClasses} style={containerStyle}>
            <Image
                src={src}
                width={parseInt(width || '800')}
                height={parseInt(height || '600')}
                alt={displayCaption || 'News Image'}
                className="w-full h-auto object-cover"
                unoptimized={true}
            />
            {showCaption && displayCaption && (
                <p className="text-sm text-gray-500 mt-2">{displayCaption}</p>
            )}
        </div>
    );
}

const options = {
    replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.type === 'tag') {
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

            // <figure>: 他サイト共通の特殊指定（例: [2][auto][250px]）がfigcaption文頭に付与されていることがある。
            // [2]（カラム数）はこのサイトでは常に1カラム表示のため無視。[auto]は常に有効な挙動のため無視。
            // [Npx]のみ画像の最大幅として反映する。
            if (domNode.name === 'figure') {
                const children = domNode.children as DOMNode[];
                const imgNode = children.find((c) => c instanceof Element && c.name === 'img') as Element | undefined;
                const figcaptionNode = children.find((c) => c instanceof Element && c.name === 'figcaption') as Element | undefined;

                if (imgNode) {
                    let maxWidthPx: number | null = null;
                    let cleanedCaption = '';
                    let captionRest: DOMNode[] = [];

                    if (figcaptionNode) {
                        const [first, ...rest] = figcaptionNode.children as DOMNode[];
                        captionRest = rest;
                        if (first instanceof Text) {
                            const tagMatch = first.data.match(/^(\s*\[[^\]]*\])+/);
                            if (tagMatch) {
                                const pxMatch = tagMatch[0].match(/\[(\d+)px\]/);
                                if (pxMatch) maxWidthPx = parseInt(pxMatch[1], 10);
                            }
                            cleanedCaption = first.data.replace(/^(\s*\[[^\]]*\])+\s*/, '');
                        }
                    }

                    return (
                        <figure>
                            {renderNewsImage(imgNode, maxWidthPx)}
                            {figcaptionNode && (
                                <figcaption>
                                    {cleanedCaption}
                                    {domToReact(captionRest, options)}
                                </figcaption>
                            )}
                        </figure>
                    );
                }
            }

            // <img>: figureに包まれていない単体画像
            if (domNode.name === 'img') {
                return renderNewsImage(domNode, null);
            }
        }
    }
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { draftKey, contentId } = await searchParams;
    const { isEnabled } = await draftMode();

    const news = isEnabled && draftKey && contentId
        ? await getNewsDraft(contentId, draftKey)
        : await getNewsItem(slug);

    if (!news) {
        return {
            title: 'News Not Found',
        };
    }

    const description = news.excerpt || DEFAULT_OGP_DESCRIPTION;

    return {
        title: { absolute: DEFAULT_OGP_TITLE },
        description,
        alternates: {
            canonical: `/news/${news.slug}`,
        },
        openGraph: {
            title: DEFAULT_OGP_TITLE,
            description,
            images: [{ url: DEFAULT_OGP_IMAGE, width: 1200, height: 630 }],
            type: 'article',
            publishedTime: news.date,
            tags: news.tags,
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
    const newsItems = await getNews();
    return newsItems.map((item) => ({
        slug: item.slug,
    }));
}

export default async function NewsPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { draftKey, contentId } = await searchParams;
    const { isEnabled: isDraft } = await draftMode();

    const news = isDraft && draftKey && contentId
        ? await getNewsDraft(contentId, draftKey)
        : await getNewsItem(slug);

    if (!news) {
        notFound();
    }

    const contentBody = news.body_ja;

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

            <Header />

            <div className="w-full px-3 md:px-8 mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-[5fr_2fr] md:gap-x-[clamp(3rem,14vw,14rem)]">
                <div className="w-full">
                    {/* カバー画像（cover_square・ホバーでハーフトーン→通常画像、無ければcoverでフォールバック） */}
                    {news.coverImage && (
                        <div className="w-full md:max-w-sm mb-10">
                            <HalftoneHoverImage
                                normalSrc={news.coverImage}
                                halftoneSrc={news.coverImageHalftone || news.coverImage}
                                alt={news.title}
                            />
                        </div>
                    )}

                    <h1 className='font-sans font-bold text-3xl md:text-4xl leading-normal mb-4'>
                        {news.title}
                    </h1>
                    {(news.lpSubtitle || news.subtitle) && (
                        <div className='font-bold text-base md:text-lg leading-normal mb-10'>
                            {news.lpSubtitle || news.subtitle}
                        </div>
                    )}
                    <div className='mb-24 md:mb-10 font-semibold leading-normal font-en text-left md:text-right'>
                        {news.date ? formatDateDot(news.date) : ''}
                    </div>

                    {/* ニュース本文 (MicroCMS HTML) */}
                    <div className={NEWS_PROSE_CLASSES}>
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
