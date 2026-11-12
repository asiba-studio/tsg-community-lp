import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getHomeArticles } from 'lib/api';
import { ArticleDetailView } from 'components/articles/ArticleDetailView';
import { DEFAULT_OGP_TITLE, DEFAULT_OGP_DESCRIPTION, DEFAULT_OGP_IMAGE } from 'lib/seo';

// 公開詳細ページは静的生成（generateStaticParams）+ ISR。searchParams/draftMode()は読まない。
// 下書きプレビューは /preview/articles/[id]?draftKey=... （app/preview/）で扱う。
interface Props {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
    const items = await getHomeArticles();
    return items.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    const description = article.excerpt || DEFAULT_OGP_DESCRIPTION;

    return {
        title: { absolute: DEFAULT_OGP_TITLE },
        description,
        alternates: {
            canonical: `/articles/${article.slug}`,
        },
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
    const articles = await getHomeArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}


export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return <ArticleDetailView article={article} />;
}
