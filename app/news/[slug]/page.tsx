import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { Metadata } from 'next';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { getNews } from 'lib/api';
import { Header, Menu } from 'components/layout';
import { formatDateDot } from 'lib/date';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getNewsItem(slug: string) {
    const newsItems = await getNews();
    return newsItems.find((item) => item.slug === slug);
}

// ----------------------------------------------------
// 📝 HTML Parsing Options
// ----------------------------------------------------
const options = {
    replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.type === 'tag') {
            // <p>
            if (domNode.name === 'p') {
                return (
                    <p className="text-gray-700 leading-loose tracking-wide mb-6 text-sm md:text-base text-text-primary">
                        {domToReact(domNode.children as DOMNode[], options)}
                    </p>
                );
            }
            // <h1> - <h4>
            if (domNode.name === 'h1') {
                return (
                    <h2 className="text-4xl font-bold mt-16 mb-6 border-l-4 border-red-500 pl-4">{domToReact(domNode.children as DOMNode[], options)}</h2>
                );
            }
            if (domNode.name === 'h2') {
                return (
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-10 mt-5 lg:mt-40 pb-2 leading-normal">
                        {domToReact(domNode.children as DOMNode[], options)}
                    </h2>
                );
            }
            if (domNode.name === 'h3') {
                return (
                    <h3 className="text-xl font-bold mt-18 mb-5 font-sans">{domToReact(domNode.children as DOMNode[], options)}</h3>
                );
            }
            if (domNode.name === 'h4') {
                return (
                    <h4 className="text-sm md:text-base font-semibold text-text-primary mb-5 mt-5 leading-normal">
                        {domToReact(domNode.children as DOMNode[], options)}
                    </h4>
                );
            }
            // <ul>, <ol>, <li>
            if (domNode.name === 'ul') {
                return <ul className="list-disc pl-5 mb-6 space-y-2">{domToReact(domNode.children as DOMNode[], options)}</ul>;
            }
            if (domNode.name === 'ol') {
                return <ol className="list-decimal pl-5 mb-6 space-y-2">{domToReact(domNode.children as DOMNode[], options)}</ol>;
            }
            if (domNode.name === 'li') {
                return <li className="text-gray-700 mb-0">{domToReact(domNode.children as DOMNode[], options)}</li>;
            }
            // <blockquote>
            if (domNode.name === 'blockquote') {
                return (
                    <blockquote className="border-l-4 border-[#00ff00] pl-6 py-3 my-6 italic bg-gray-50 text-gray-600">
                        {domToReact(domNode.children as DOMNode[], options)}
                    </blockquote>
                );
            }
            // <hr>
            if (domNode.name === 'hr') {
                return <hr className="my-12 border-t border-gray-300" />;
            }
            // <a>
            if (domNode.name === 'a') {
                return (
                    <a
                        href={domNode.attribs.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline transition-colors"
                    >
                        {domToReact(domNode.children as DOMNode[], options)}
                    </a>
                );
            }
            // <img>
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
                            alt={displayCaption || 'Article Image'}
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


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const news = await getNewsItem(slug);

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
            images: news.headerImage ? [
                {
                    url: news.headerImage,
                    width: 1200,
                    height: 630,
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
            images: news.headerImage ? [news.headerImage] : [],
        },
    };
}

export async function generateStaticParams() {
    const newsItems = await getNews();
    return newsItems.map((item) => ({
        slug: item.slug,
    }));
}

export default async function NewsPage({ params }: Props) {
    const { slug } = await params;
    const news = await getNewsItem(slug);

    if (!news) {
        notFound();
    }

    const contentBody = news.body;

    return (
        <article className="w-full pb-50">
            <Header />

            <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">
                <div className='flex-1 flex justify-center'>
                    <div className='max-w-200 w-full'>
                        {/* ヘッダー画像 (Desktop) */}
                        {news.headerImage && (
                            <Image
                                src={news.headerImage}
                                alt={news.title}
                                width={1200}
                                height={630}
                                className="w-full h-auto object-cover mb-8 border border-border hidden lg:block"
                                unoptimized={true}
                            />
                        )}
                        {/* ヘッダー画像 (Mobile) - coverImageを使用 (api.tsでheaderImageと同じURLがマッピングされています) */}
                        {news.coverImage && (
                            <Image
                                src={news.coverImage}
                                alt={news.title}
                                width={1200}
                                height={630}
                                className="w-full h-auto object-cover mb-8 border border-border block lg:hidden"
                                quality={60}
                                sizes="100vw"
                                unoptimized={true}
                            />
                        )}

                        {/* タイトル */}
                        <p className='text-lg font-bold'>
                            ニュース
                        </p>
                        <h1 className="leading-relaxed text-3xl lg:text-3xl font-bold">
                            {news.title}
                        </h1>
                        <p className="leading-relaxed text-3xl lg:text-3xl font-bold mb-4">
                            {news.subtitle}
                        </p>

                        {/* ニュースプロパティ一覧 (Mobile) */}
                        <section className='lg:hidden text-sm'>
                            <div className='mb-4 leading-normal flex justify-end font-en text-gray-500'>
                                {news.date ? formatDateDot(news.date) : ''}
                            </div>
                            <div className='mb-4 leading-normal w-3/4 '>
                                {news.excerpt}
                            </div>
                            <div className='leading-normal flex justify-start gap-2 flex-wrap'>
                                {news.tags && news.tags.length > 0 ? (
                                    news.tags.map((tag, index) => (
                                        <span key={index} className="text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                            #{tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className='text-gray-500'>No tags</span>
                                )}
                            </div>
                        </section>

                        <Menu className='lg:hidden mt-4 mb-50 translate-x-[14px]' />

                        {/* 記事本文 */}
                        <div className="mt-20 lg:mt-50">
                            {contentBody ? parse(contentBody, options) : (
                                <p className="text-gray-500 py-10 text-center">No content available</p>
                            )}
                        </div>
                    </div>

                </div>

                <div className='w-full lg:w-[20%]'>
                    {/* ニュースプロパティ一覧 (Desktop) */}
                    <section className='h-[300vh] relative hidden lg:block'>
                        <div className='text-fluid-sm sticky top-44 h-screen'>
                            <div className='border border-border px-1.5'>
                                <div className='font-en underline'>
                                    Title
                                </div>
                                <div className='mb-6 leading-normal'>
                                    {news.title}<br />
                                    {news.subtitle}
                                </div>
                                <div className='font-en underline'>
                                    Date
                                </div>
                                <div className='mb-6 leading-normal'>
                                    {news.date ? formatDateDot(news.date) : ''}
                                </div>
                                <div className='font-en underline'>
                                    Description
                                </div>
                                <div className='mb-6 leading-normal'>
                                    {news.excerpt}
                                </div>
                                <div className='font-en underline'>
                                    Key Word
                                </div>
                                <div className='leading-normal'>
                                    {news.tags && news.tags.length > 0 ? (
                                        news.tags.map((tag, index) => (
                                            <span key={index}>
                                                # {tag}<br />
                                            </span>
                                        ))
                                    ) : (
                                        <span className='text-gray-500'>No tags</span>
                                    )}
                                </div>
                            </div>

                        </div>
                    </section>

                    <Menu className='hidden lg:block translate-x-[4vw]' />

                </div>

            </div>

        </article>
    );
}