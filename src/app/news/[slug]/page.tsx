import Image from 'next/image';
import { getNews, getNewsBySlug } from '@/lib/cms';
import { Metadata } from 'next';
import { Header, Menu } from '@/components/layout';
import { markdownToHtml, calculateReadingTime } from '@/lib/markdown';
import { formatDateDot } from '@/lib/date';

interface Props {
    params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const news = await getNewsBySlug(slug);

    if (!news) {
        return {
            title: 'Article Not Found',
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
            images: news.coverImage ? [news.coverImage] : [],
        },
    };
}


// 静的パラメータの生成（ビルド時に全記事のパスを生成）
export async function generateStaticParams() {
    const slugs = await getNews();

    return slugs.map((item) => ({
        slug: item.slug,
    }));
}


export default async function NewsPage({ params }: Props) {
    const { slug } = await params;
    const news = await getNewsBySlug(slug);

    if (!news) {
        return <div>News not found</div>;
    }

    // MarkdownをHTMLに変換
    const htmlContent = await markdownToHtml(news.content);

    // 読了時間を計算
    const readingTime = calculateReadingTime(news.content);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <article className="w-full pb-50">
            <Header />

            <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">
                <div className='flex-1 flex justify-center'>
                    <div className='max-w-200'>
                        {/* ヘッダー画像 */}
                        {news.headerImage && (
                            <Image
                                src={news.headerImage}
                                alt={news.title}
                                width={1200}
                                height={630}
                                className="w-full h-auto object-cover mb-8 border border-border hidden lg:block"
                            />
                        )}
                        {news.headerImage && (
                            <Image
                                src={news.coverImage}
                                alt={news.title}
                                width={1200}
                                height={630}
                                className="w-full h-auto object-cover mb-8 border border-border block lg:hidden"
                            />
                        )}

                        {/* タイトル */}
                        <p className='text-lg font-bold'>
                            ニュース
                        </p>
                        <h1 className="leading-relaxed text-3xl lg:text-3xl font-bold mb-4">
                            {news.title}
                        </h1>

                        {/* ニュースプロパティ一覧 */}
                        <section className='lg:hidden text-sm'>
                            <div className='mb-4 leading-normal flex justify-end'>
                                {news.date ? formatDateDot(news.date) : ''}
                            </div>
                            <div className='mb-4 leading-normal w-3/4 '>
                                {news.excerpt}
                            </div>
                            <div className='leading-normal flex justify-start gap-2'>
                                {news.tags && news.tags.length > 0 ? (
                                    news.tags.map((tag, index) => (
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
                            className="prose prose-lg mt-20 lg:mt-50"
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

                    <Menu className='hidden lg:block translate-x-[4vw]'/>

                </div>

            </div>




        </article>
    );
}