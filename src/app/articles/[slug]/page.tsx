// src/app/articles/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleWithReferences, getArticleSlugs } from '@/lib/cms';
import { markdownToHtml, generateToc, calculateReadingTime } from '@/lib/markdown';
import { formatDate } from '@/lib/date';
import ArticleHeader from '@/components/articles/ArticleHeader';
import ArticleContent from '@/components/articles/ArticleContent';
import ArticleSidebar from '@/components/articles/ArticleSidebar';
import RelatedArticles from '@/components/articles/RelatedArticles';

interface Props {
    params: Promise<{ slug: string }>;
}

// 静的パス生成
export async function generateStaticParams() {
    const slugs = await getArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

// メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleWithReferences((await params).slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${article.title} | TSG Community`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [article.coverImage],
            type: 'article',
            publishedTime: article.date,
            authors: [article.writerData?.name || article.writer],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [article.coverImage],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticleWithReferences((await params).slug);

    if (!article) {
        notFound();
    }

    const htmlContent = await markdownToHtml(article.content);
    const toc = generateToc(article.content);
    const readingTime = calculateReadingTime(article.content);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <ArticleHeader
                title={article.title}
                date={article.date}
                writer={article.writerData}
                collaborators={article.collaboratorsData}
                reviewer={article.reviewerData}
                coverImage={article.coverImage}
                tags={article.tags}
                readingTime={readingTime}
            />

            {/* メインコンテンツ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* 記事本文 */}
                    <main className="lg:col-span-3">
                        <ArticleContent
                            content={htmlContent}
                            excerpt={article.excerpt}
                        />
                    </main>

                    {/* サイドバー */}
                    <aside className="lg:col-span-1">
                        <ArticleSidebar
                            toc={toc}
                            writer={article.writerData}
                            tags={article.tags}
                            relatedProjects={article.relatedProjects}
                        />
                    </aside>
                </div>

                {/* 関連記事 */}
                <section className="mt-16">
                    <RelatedArticles
                        currentSlug={article.slug}
                        tags={article.tags}
                    />
                </section>
            </div>
        </div>
    );
}