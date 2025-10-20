import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleWithReferences, getArticleSlugs, getArticles, getRelatedArticles } from '@/lib/cms';
import { Metadata } from 'next';
import { Header, Menu } from '@/components/layout';
import InteractiveMosaic02 from '@/components/InteractiveMosaic02';
import { markdownToHtml, calculateReadingTime } from '@/lib/markdown';
import { formatDateDot } from '@/lib/date';
import { ContentList } from '@/components/articles';

interface Props {
    params: Promise<{ slug: string }>;
}

// メタデータの生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleWithReferences(slug);

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
                    width: 2350, //1200,
                    height: 1000, //630,
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

// 静的パラメータの生成（ビルド時に全記事のパスを生成）
export async function generateStaticParams() {
    const slugs = await getArticleSlugs();

    return slugs.map((slug) => ({
        slug,
    }));
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticleWithReferences(slug);


    if (!article) {
        notFound();
    }

    const relatedArticles = await getRelatedArticles(slug, 3);

    // MarkdownをHTMLに変換
    const htmlContent = await markdownToHtml(article.content);

    // 読了時間を計算
    const readingTime = calculateReadingTime(article.content);

    return (
        <article className="w-full pb-50">
            <Header />

            {/* ヘッダー部分 */}
            <header className="mb-8">

                <div className="relative w-full -mt-5">
                    {/* カバー画像 */}
                    {article.coverImage && (
                        <div>
                            <div className='hidden lg:block'>
                                <InteractiveMosaic02
                                    imageUrl={article.headerImage}
                                    width="100%"
                                    mosaicSize='large'
                                />
                            </div>
                            <div className='block lg:hidden'>
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    width={750}
                                    height={750}
                                    className="w-full h-auto object-cover"
                                    quality={60}
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    )}

                </div>

            </header>


            <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">
                <div className='flex-1 flex justify-center'>
                    <div className='max-w-200'>

                        {/* ニュースプロパティ一覧 */}
                        <section className='text-fluid-base'>
                            <h1 className='font-sans font-bold text-fluid-4xl leading-relaxed relative mb-8'>
                                {article.title}
                            </h1>
                            <div className='mb-4 leading-normal flex justify-end'>
                                {article.date ? formatDateDot(article.date) : ''}
                            </div>
                            <div className='mb-4 leading-normal w-3/4 '>
                                {article.excerpt}
                            </div>
                            <div className='leading-normal flex justify-start gap-2'>
                                {article.tags && article.tags.length > 0 ? (
                                    article.tags.map((tag, index) => (
                                        <span key={index}>
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
                        <div
                            className="prose prose-lg mt-12 lg:mt-36"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>

                </div>

                <div className='w-full lg:w-[20%]'>
                    {/* ニュースプロパティ一覧 */}
                    <section className='h-[300vh] relative hidden lg:block'>
                        <div className='text-fluid-sm sticky top-44 h-screen'>
                            <div className='border border-border px-1.5'>
                                <div className='font-en underline'>
                                    Title
                                </div>
                                <div className='mb-6 leading-normal'>
                                    {article.title}<br />
                                    {article.subtitle}
                                </div>
                                <div className='font-en underline'>
                                    Date
                                </div>
                                <div className='mb-6 leading-normal'>
                                    {article.date ? formatDateDot(article.date) : ''}
                                </div>
                                <div className='font-en underline'>
                                    Description
                                </div>
                                <div className='mb-6 leading-normal'>
                                    {article.excerpt}
                                </div>
                                <div className='font-en underline'>
                                    Key Word
                                </div>
                                <div className='leading-normal'>
                                    {article.tags && article.tags.length > 0 ? (
                                        article.tags.map((tag, index) => (
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

                    <section className="w-full section-spacing border-t border-border mt-40 lg:mt-100">
                        <h2 className="font-en font-bold text-fluid-2xl leading-none relative inline-block mb-8">
                            Related Articles
                        </h2>
                        <div className="w-full">
                            <div className="hidden lg:block w-full">
                                <ContentList contents={relatedArticles} basePath="/articles" columns={1} gap={100} enableMosaic={true} mosaicSize='small'  />
                            </div>
                            <div className="block lg:hidden w-full">
                                <ContentList contents={relatedArticles} basePath="/articles" columns={1} gap={100} enableMosaic={false} />
                            </div>
                        </div>
                    </section>

                </div>

            </div>


        </article >
    );
}