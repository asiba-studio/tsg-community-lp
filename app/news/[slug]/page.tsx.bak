import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { getNews } from 'lib/api';
import { Header, Menu } from 'components/layout';
import { formatDateDot } from 'lib/date';

interface Props {
    params: Promise<{ slug: string }>;
}

// ニュース取得ヘルパー
async function getNewsItem(slug: string) {
    const newsItems = await getNews();
    return newsItems.find((item) => item.slug === slug);
}

// RichTextのレンダリングオプション（ArticlePageと同様）
const renderOptions = {
    renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            const target = node.data.target;
            if (!target || !target.fields) return null;

            const getLocalizedValue = (field: any) => {
                return field?.['ja'] || field?.['en-US'] || field;
            };

            const fileField = getLocalizedValue(target.fields.file);
            const titleField = getLocalizedValue(target.fields.title);

            if (!fileField || !fileField.url) return null;

            const imageUrl = fileField.url.startsWith('//') ? `https:${fileField.url}` : fileField.url;
            const width = fileField.details?.image?.width || 800;
            const height = fileField.details?.image?.height || 600;

            return (
                <div className="my-10">
                    <Image
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={titleField || 'Embedded Image'}
                        className="w-full h-auto object-cover rounded-sm"
                        unoptimized={true}
                    />
                    {titleField && <p className="text-center text-sm text-gray-500 mt-2">{titleField}</p>}
                </div>
            );
        },
        [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
            return <p className="mb-6 leading-relaxed text-gray-800 tracking-wide">{children}</p>;
        },
        [BLOCKS.HEADING_2]: (node: any, children: any) => {
            return <h2 className="text-2xl font-bold mt-16 mb-8 font-sans">{children}</h2>;
        },
        [BLOCKS.HEADING_3]: (node: any, children: any) => {
            return <h3 className="text-xl font-bold mt-10 mb-5 font-sans">{children}</h3>;
        },
        [BLOCKS.UL_LIST]: (node: any, children: any) => (
            <ul className="list-disc pl-5 mb-6 space-y-2">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: any) => (
            <ol className="list-decimal pl-5 mb-6 space-y-2">{children}</ol>
        ),
        [INLINES.HYPERLINK]: (node: any, children: any) => {
            return <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">{children}</a>;
        }
    },
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

    // Rich Text Body
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
                        <div className="prose prose-lg mt-20 lg:mt-50 max-w-none">
                            {contentBody ? documentToReactComponents(contentBody, renderOptions) : (
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