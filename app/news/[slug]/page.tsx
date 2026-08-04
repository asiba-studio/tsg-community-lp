import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { getNews, getNewsDraft } from 'lib/api';
import { Header, Menu } from 'components/layout';
import HalftoneHoverImage from 'components/HalftoneHoverImage';
import { formatDateDot } from 'lib/date';

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
    'prose-p:font-sans prose-p:text-base prose-p:md:text-base prose-p:text-text-primary prose-p:leading-loose prose-p:tracking-wide prose-p:mb-8',
    'prose-headings:font-sans prose-headings:font-bold prose-headings:text-text-primary',
    'prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-6 prose-h1:border-l-4 prose-h1:border-primary prose-h1:pl-4',
    'prose-h2:text-2xl prose-h2:md:text-2xl prose-h2:mb-10 prose-h2:mt-5 prose-h2:lg:mt-40 prose-h2:pb-2 prose-h2:leading-normal',
    'prose-h3:text-xl prose-h3:mt-18 prose-h3:mb-5',
    'prose-h4:text-lg prose-h4:md:text-xl prose-h4:font-semibold prose-h4:mb-5 prose-h4:mt-5 prose-h4:leading-normal',
    'prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:space-y-2',
    'prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6 prose-ol:space-y-2',
    'prose-li:text-text-primary',
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

            if (domNode.name === 'img') {
                const { src, alt, width, height } = domNode.attribs;

                let customWidthClass = 'max-w-4xl';
                let showCaption = false;
                let displayCaption = alt || '';

                if (alt) {
                    const widthMatch = alt.match(/\[w:(sm|md|lg|full)\]/);
                    if (widthMatch) {
                        const value = widthMatch[1];
                        if (value === 'sm') customWidthClass = 'max-w-50';
                        else if (value === 'md') customWidthClass = 'max-w-80';
                        else if (value === 'lg') customWidthClass = 'max-w-130';
                        else if (value === 'full') customWidthClass = 'w-full max-w-none';
                    }
                    if (alt.includes('[caption]')) {
                        showCaption = true;
                    }
                    displayCaption = alt
                        .replace(/\[w:(sm|md|lg|full)\]/g, '')
                        .replace(/\[caption\]/g, '')
                        .trim();
                }

                const containerClasses = `my-2 flex w-full flex-col items-center ${customWidthClass.replace("max-w-none", "")}`;

                return (
                    <div className={containerClasses}>
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

    return {
        title: news.title,
        description: news.excerpt,
        openGraph: {
            title: news.title,
            description: news.excerpt,
            images: news.coverImage ? [
                {
                    url: news.coverImage,
                    width: 1200,
                    height: 1200,
                    alt: news.title,
                }
            ] : [],
            type: 'article',
            publishedTime: news.date,
            tags: news.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: news.title,
            description: news.excerpt,
            images: news.coverImage ? [news.coverImage] : [],
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

            <Menu className='lg:hidden mt-4 mb-20 translate-x-[14px]' />

            <div className="w-full px-[14px] lg:px-8 mt-8 lg:mt-16 grid grid-cols-1 lg:grid-cols-[5fr_2fr] lg:gap-x-[14vw]">
                <div className="w-full">
                    {/* カバー画像（cover_square・ホバーでハーフトーン→通常画像、無ければcoverでフォールバック） */}
                    {news.coverImage && (
                        <div className="w-full max-w-xs md:max-w-sm mb-10">
                            <HalftoneHoverImage
                                normalSrc={news.coverImage}
                                halftoneSrc={news.coverImageHalftone || news.coverImage}
                                alt={news.title}
                            />
                        </div>
                    )}

                    <h1 className='font-sans font-bold text-4xl leading-relaxed mb-2'>
                        {news.title}
                    </h1>
                    {(news.lpSubtitle || news.subtitle) && (
                        <div className='font-bold text-lg leading-normal mb-10'>
                            {news.lpSubtitle || news.subtitle}
                        </div>
                    )}
                    <div className='mb-10 font-semibold leading-normal font-en text-right'>
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
