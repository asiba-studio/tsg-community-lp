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
            images: article.coverImage ? [
                {
                    url: article.coverImage,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ] : [],
            type: 'article',
            publishedTime: article.date,
            authors: article.writerData ? [article.writerData.name] : [],
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: article.coverImage ? [article.coverImage] : [],
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
        <article className="w-full">
            <Header />

            {/* ヘッダー部分 */}
            <header className="mb-8">

                <div className="relative w-full -mt-5">
                    {/* カバー画像 */}
                    {article.coverImage && (
                        <div>
                            <InteractiveMosaic02
                                imageUrl={article.headerImage}
                                width="100%"
                            />
                        </div>
                    )}

                    <div className='absolute left-20 bottom-14'>
                        <Image
                            src="/images/common/mosaic-text/article-white.png"
                            alt="article"
                            width={450}
                            height={120}
                            className="w-[15vw]"
                        />

                        {/* タイトル */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mt-12 mb-4">
                            {article.title}
                        </h1>

                        {/* サブタイトル */}
                        {article.subtitle && (
                            <p className="text-xl font-bold text-white">
                                {article.subtitle}
                            </p>
                        )}

                    </div>

                </div>

            </header>


            <div className='w-full px-30 flex gap-60 my-50'>
                <div className='flex-1'>
                    {/* 記事本文 */}
                    <div
                        className="prose prose-lg max-w-none
          [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8
          [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-28 [&>h2]:pb-2
          [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:mt-5
          [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
          [&>a]:text-blue-600 [&>a]:underline hover:[&>a]:text-blue-800
          [&>strong]:text-gray-900 [&>strong]:font-semibold
          [&>em]:text-gray-700 [&>em]:italic
          [&>code]:text-pink-600 [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
          [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto
          [&>blockquote]:border-l-4 [&>blockquote]:border-green-500 [&>blockquote]:bg-gray-50 [&>blockquote]:p-4 [&>blockquote]:italic [&>blockquote]:my-6
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
          [&>li]:mb-2
          [&>img]:rounded-lg [&>img]:shadow-md [&>img]:mx-auto [&>img]:my-6
          [&>table]:border-collapse [&>table]:border [&>table]:border-gray-300
          [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:font-semibold
          [&_td]:border [&_td]:border-gray-300 [&_td]:p-2"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                </div>

                <div className='w-[20%] pt-50'>
                    <Menu />

                    <section className="w-full section-spacing border-t border-border mt-150">
                        <h2>
                            <img src="/gifs/article.gif" className="h-16 mb-10" alt="" />
                            <span className="sr-only">Article</span>
                        </h2>
                        <ContentList contents={relatedArticles} basePath="/articles" columns={1} gap={100} />
                    </section>

                </div>

            </div>




        </article>
    );
}