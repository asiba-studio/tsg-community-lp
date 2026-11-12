import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getHomeNews } from 'lib/api';
import { NewsDetailView } from 'components/articles/NewsDetailView';
import { DEFAULT_OGP_TITLE, DEFAULT_OGP_DESCRIPTION, DEFAULT_OGP_IMAGE } from 'lib/seo';

// 公開詳細ページは静的生成（generateStaticParams）+ ISR。searchParams/draftMode()は読まない。
// 下書きプレビューは /preview/news/[id]?draftKey=... （app/preview/）で扱う。
interface Props {
    params: Promise<{ slug: string }>;
}

async function getNewsItem(slug: string) {
    const items = await getHomeNews();
    return items.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const news = await getNewsItem(slug);

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
    const newsItems = await getHomeNews();
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

    return <NewsDetailView news={news} />;
}
