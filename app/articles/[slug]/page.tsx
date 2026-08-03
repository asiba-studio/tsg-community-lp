import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import React from 'react';
import { draftMode } from 'next/headers';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { getArticles, getArticleDraft } from 'lib/api';
import { Header, Menu } from 'components/layout';
import InteractiveMosaic02 from 'components/InteractiveMosaic02';
import CTAButton from 'components/CTAButton';
import { formatDateDot } from 'lib/date';
import { ContentList } from 'components/articles';

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ draftKey?: string; contentId?: string }>;
}

async function getArticle(slug: string) {
    const articles = await getArticles();
    return articles.find((a) => a.slug === slug);
}

async function getRelatedPosts(currentSlug: string) {
    const articles = await getArticles();
    return articles
        .filter((a) => a.slug !== currentSlug)
        .slice(0, 3);
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
                    <p className="text-gray-700 leading-relaxed tracking-wide mb-6 text-sm md:text-base text-text-primary">
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
                    <h3 className="text-xl font-bold mt-18 mb-5 font-sans">
                        {domToReact(domNode.children as DOMNode[], options)}
                    </h3>
                );
            }
            if (domNode.name === 'h4') {
                return (
                    <h4 className="text-lg md:text-xl font-semibold text-text-primary mb-5 mt-5 leading-normal">
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
                return <li className="text-gray-700">{domToReact(domNode.children as DOMNode[], options)}</li>;
            }
            // <blockquote>
            if (domNode.name === 'blockquote') {
                return (
                    <blockquote className="border-l-4 border-primary pl-6 py-3 my-6 italic bg-gray-50 text-gray-600">
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
                        className="hover:underline transition-colors"
                    >
                        {domToReact(domNode.children as DOMNode[], options)}
                    </a>
                );
            }

            // <img>
            // MicroCMS returns images as <img> tags. We can try to preserve the aspect ratio or styles.
            if (domNode.name === 'img') {
                const { src, alt, width, height } = domNode.attribs;

                // Parse commands from alt text if present (e.g. [w:sm] Caption)
                let customWidthClass = 'max-w-4xl'; // default
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

                const containerClasses = `my-2 flex w-full flex-col items-center ${customWidthClass.replace("max-w-none", "")}`; // straightforward adjustment

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

            // <br>
            if (domNode.name === 'br') {
                return <br className="my-2 block content-['']" />;
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

    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: article.headerImage ? [
                {
                    url: article.headerImage,
                    width: 2350,
                    height: 1000,
                    alt: article.title,
                }
            ] : [],
            type: 'article',
            publishedTime: article.date,
            authors: [],
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: article.headerImage ? [article.headerImage] : [],
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

    const relatedArticles = await getRelatedPosts(slug);
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
            <Header />

            {/* ヘッダー部分 */}
            <header className="mb-8">
                <div className="relative w-full -mt-5">
                    {/* カバー画像 (Header Image: 2350x1000) */}
                    {article.headerImage && (
                        <div>
                            {/* PC: Mosaic (aspect ratio 2.35) */}
                            <div className='hidden lg:block w-full'>
                                <InteractiveMosaic02
                                    imageUrl={article.headerImage}
                                    width="100%"
                                    mosaicSize='large'
                                    aspectRatio={2.35}
                                    objectFit="contain"
                                    background="#FF0067"
                                />
                            </div>
                            {/* Mobile: 通常画像 */}
                            <div className='block lg:hidden w-full aspect-[2.35/1] relative bg-primary'>
                                <Image
                                    src={article.headerImage}
                                    alt={article.title}
                                    fill
                                    className="object-contain"
                                    priority
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">
                <div className='flex-1 flex justify-center'>
                    <div className='max-w-200 w-full'>

                        {/* 記事ヘッダー情報（SP用・本文上） */}
                        <section className='text-base'>
                            <h1 className='font-sans font-bold text-4xl leading-relaxed relative mb-8'>
                                {article.title}
                            </h1>
                            <div className='mb-4 leading-normal flex justify-end text-gray-500 font-en'>
                                {article.date ? formatDateDot(article.date) : ''}
                            </div>

                            {/* SPのみ表示する情報 */}
                            <div className="lg:hidden mb-10">
                                <div className='mb-6 leading-normal text-gray-700 font-medium'>
                                    {article.excerpt}
                                </div>
                                <div className='leading-normal flex justify-start gap-2 flex-wrap'>
                                    {article.tags && article.tags.length > 0 ? (
                                        article.tags.map((tag, index) => (
                                            <span key={index} className="text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded">
                                                #{tag}
                                            </span>
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        </section>

                        <Menu className='lg:hidden mt-4 mb-50 translate-x-[14px]' />

                        {/* 記事本文 (MicroCMS HTML) */}
                        <div className="max-w-none mt-8 lg:mt-20">
                            {contentBody ? parse(contentBody, options) : (
                                <p className="text-gray-500 py-10 text-center">No content available</p>
                            )}
                        </div>

                        {article.link && (
                            <div className="mt-40">
                                <CTAButton href={article.link} className="font-en">
                                    Read on Note
                                </CTAButton>
                            </div>
                        )}
                    </div>
                </div>

                {/* サイドバー（PC用） */}
                <div className='w-full lg:w-[20%]'>
                    <section className='h-[300vh] relative hidden lg:block'>
                        <div className='text-sm sticky top-44 h-screen'>
                            <div className='border border-border px-4 py-5 bg-white/50 backdrop-blur-sm'>
                                <div className='font-en underline mb-2 text-gray-500'>
                                    Title
                                </div>
                                <div className='mb-6 leading-normal font-bold'>
                                    {article.title}<br />
                                    {article.subtitle && <span className="text-gray-600 font-normal mt-1 block text-sm">{article.subtitle}</span>}
                                </div>

                                <div className='font-en underline mb-2 text-gray-500'>
                                    Date
                                </div>
                                <div className='mb-6 leading-normal font-en'>
                                    {article.date ? formatDateDot(article.date) : ''}
                                </div>

                                {article.excerpt && (
                                    <>
                                        <div className='font-en underline mb-2 text-gray-500'>
                                            Summary
                                        </div>
                                        <div className='mb-6 leading-normal text-gray-700 text-sm'>
                                            {article.excerpt}
                                        </div>
                                    </>
                                )}

                                <div className='font-en underline mb-2 text-gray-500'>
                                    Keywords
                                </div>
                                <div className='leading-normal font-en'>
                                    {article.tags && article.tags.length > 0 ? (
                                        article.tags.map((tag, index) => (
                                            <div key={index} className="mb-1 text-gray-600 hover:text-black transition-colors">
                                                # {tag}
                                            </div>
                                        ))
                                    ) : (
                                        <span className='text-gray-400'>-</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <Menu className='hidden lg:block translate-x-[4vw]' />

                    {/* 関連記事 */}
                    {relatedArticles.length > 0 && (
                        <section className="w-full section-spacing border-t border-border mt-40 lg:mt-100 pt-10">
                            <h2 className="font-en font-bold text-2xl leading-none relative inline-block mb-12">
                                Related Articles
                            </h2>
                            <div className="w-full">
                                <div className="hidden lg:block w-full">
                                    <ContentList
                                        contents={relatedArticles}
                                        basePath="/articles"
                                        columns={1}
                                        gap={80}
                                        enableMosaic={true}
                                        mosaicSize='small'
                                    />
                                </div>
                                <div className="block lg:hidden w-full">
                                    <ContentList
                                        contents={relatedArticles}
                                        basePath="/articles"
                                        columns={1}
                                        gap={60}
                                        enableMosaic={false}
                                    />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </article >
    );
}