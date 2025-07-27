import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleWithReferences, getArticleSlugs, getArticles } from '@/lib/cms';
import { Metadata } from 'next';
import { Header, Menu } from '@/components/layout';
import InteractiveMosaic02 from '@/components/InteractiveMosaic02';
import { markdownToHtml, calculateReadingTime } from '@/lib/markdown';
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
                    width: 1200,
                    height: 630,
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
    const relatedArticles = (await getArticles());

    if (!article) {
        notFound();
    }

    // MarkdownをHTMLに変換
    const htmlContent = await markdownToHtml(article.content);

    // 読了時間を計算
    const readingTime = calculateReadingTime(article.content);

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
                                />
                            </div>
                            <div className='block lg:hidden'>
                                <InteractiveMosaic02
                                    imageUrl={article.coverImage}
                                    width="100%"
                                />
                            </div>
                        </div>
                    )}

                    <div className='absolute left-0 md:left-20 px-2 bottom-14'>
                        <Image
                            src="/images/common/mosaic-text/article-white.png"
                            alt="article"
                            width={450}
                            height={120}
                            className="w-[15vw]"
                        />

                        {/* タイトル */}
                        <h1 className="text-2xl md:text-4xl font-bold text-white mt-12 mb-4">
                            {article.title}
                        </h1>

                        {/* サブタイトル */}
                        {article.subtitle && (
                            <p className="text-base font-bold text-white">
                                {article.subtitle}
                            </p>
                        )}

                    </div>

                </div>

            </header>

            <Menu className='lg:hidden mb-30' />


            <div className="w-full p-[14px] lg:p-[4vw] flex flex-col lg:flex-row gap-[8vw]">
                <div className='flex-1 flex justify-center'>
                    {/* 記事本文 */}
                    <div
                        className="prose prose-lg max-w-200"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                </div>

                <div className='w-full lg:w-[20%] pt-50'>
                    <Menu className='hidden lg:block'/>

                    <section className="w-full section-spacing border-t border-border mt-150">
                        <h2>
                            <img src="/gifs/article.gif" className="h-12 mb-10" alt="" />
                            <span className="sr-only">Article</span>
                        </h2>
                        <ContentList contents={relatedArticles} basePath="/articles" columns={1} gap={100} />
                    </section>

                </div>

            </div>




        </article>
    );
}