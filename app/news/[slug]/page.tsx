import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { Metadata } from 'next';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
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


const customRenderOptions: Partial<Options> = {

    // 1. 📝 テキストノードの処理 (ラインブレイク対応)
    renderText: (text: string) => {
        // Shift + Enter (\n) を <br /> に変換するロジックは共通
        return text.split('\n').map((item, i) => (
            <React.Fragment key={i}>
                {item}
                {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    },

    // 2. 🧱 ブロックノードの定義 (BLOCKS)
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
            <p className="text-gray-700 leading-loose tracking-wide mb-6 text-sm md:text-base text-text-primary">{children}</p>
        ),
        [BLOCKS.HEADING_1]: (node: any, children: any) => (
            <h2 className="text-4xl font-bold mt-16 mb-6 border-l-4 border-red-500 pl-4">{children}</h2>
        ),
        [BLOCKS.HEADING_2]: (node: any, children: any) => (
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-10 mt-5 lg:mt-40 pb-2 leading-normal">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: any, children: any) => (
            <h3 className="text-xl font-bold mt-18 mb-5 font-sans">{children}</h3>
        ),
        [BLOCKS.HEADING_4]: (node: any, children: any) => (
            <h4 className="text-sm md:text-base font-semibold text-text-primary mb-5 mt-5 leading-normal">{children}</h4>
        ),
        [BLOCKS.UL_LIST]: (node: any, children: any) => (
            <ul className="list-disc pl-5 mb-6 space-y-2">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: any) => (
            <ol className="list-decimal pl-5 mb-6 space-y-2">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
            <li className="text-gray-700 mb-0">{children}</li>
        ),
        [BLOCKS.QUOTE]: (node: any, children: any) => (
            <blockquote className="border-l-4 border-[#00ff00] pl-6 py-3 my-6 italic bg-gray-50 text-gray-600">
                {children}
            </blockquote>
        ),
        [BLOCKS.HR]: () => (
            <hr className="my-12 border-t border-gray-300" />
        ),
        [BLOCKS.TABLE]: (node: any, children: any) => (
            <div className="overflow-x-auto my-8 border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">{children}</table>
            </div>
        ),
        [BLOCKS.TABLE_ROW]: (node: any, children: any) => <tr className="divide-x divide-gray-200">{children}</tr>,
        [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) => (
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-700 uppercase">{children}</th>
        ),
        [BLOCKS.TABLE_CELL]: (node: any, children: any) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{children}</td>
        ),

        // --- 🖼️ 埋め込みアセット (画像) ---
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            const target = node.data.target;
            if (!target || !target.fields) return null;

            // 【修正】withAllLocales: true の影響で、埋め込みアセットのフィールドもローカライズされたオブジェクトになっています
            // { ja: { ... }, en-US: { ... } } の形式から値を取り出すヘルパー
            const getLocalizedValue = (field: any) => {
                return field?.['ja'] || field?.['en-US'] || field;
            };

            const fileField = getLocalizedValue(target.fields.file);
            const titleField = getLocalizedValue(target.fields.title);

            // ファイル情報がない場合は何も表示しない
            if (!fileField || !fileField.url) return null;

            const imageUrl = fileField.url.startsWith('//') ? `https:${fileField.url}` : fileField.url;
            const width = fileField.details?.image?.width || 800;
            const height = fileField.details?.image?.height || 600;

            // ----------------------------------------------------
            // 💡 特殊コマンドの解析ロジック
            // ----------------------------------------------------
            let displayCaption = titleField;
            // デフォルトはやや広めの幅を設定
            let customWidthClass = 'max-w-4xl';
            let showCaption = false;

            // 抽象サイズと Tailwind max-w クラスのマッピング
            const sizeMap: { [key: string]: string } = {
                'xs': 'max-w-xs',
                'sm': 'max-w-sm',
                'md': 'max-w-xl',      // 例: md は xl にマッピング
                'lg': 'max-w-3xl',
                'full': 'w-full max-w-none', // full の場合は max-w を無効化
            };

            // 1. 幅コマンドの解析: [w:値]
            // 値は、アルファベット (sm, md) またはピクセル値 (250px)
            const widthMatch = titleField.match(/\[w:(sm|md|lg|full)\]/);
            if (widthMatch) {
                const value = widthMatch[1];

                // if/else if 形式で静的なクラス名を割り当てる
                if (value === 'sm') {
                    customWidthClass = 'max-w-50'; // 例: 顔写真など小さな画像
                } else if (value === 'md') {
                    customWidthClass = 'max-w-80'; // 例: 中程度の画像
                } else if (value === 'lg') {
                    customWidthClass = 'max-w-130'; // 例: 広めの画像
                } else if (value === 'full') {
                    customWidthClass = 'w-full max-w-none'; // 全幅（親要素いっぱい）
                }
                // デフォルトは 'max-w-4xl' のまま維持
            }

            // 2. キャプション表示コマンドの解析: [caption]
            if (titleField.includes('[caption]')) {
                showCaption = true;
            }

            // 3. キャプションからコマンド部分を削除
            // [w:...] と [caption] を削除
            displayCaption = titleField
                .replace(/\[w:(sm|md|lg|full)\]/g, '')
                .replace(/\[caption\]/g, '')
                .trim();

            // コンテナクラス: 幅クラスと中央寄せ（w-full/max-w-none 以外の場合）を適用
            // w-full が適用されている場合は、mx-auto は不要
            const isFullWidth = customWidthClass.includes('w-full');
            const containerClasses = `my-2 flex w-full ${customWidthClass}`;

            return (
                <div className={containerClasses}>
                    <Image
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={titleField || 'Embedded Image'}
                        className="w-full h-auto object-cover"
                        unoptimized={true}
                    />

                    {/* キャプション表示の制御 */}
                    {displayCaption && showCaption && (
                        <p className="text-sm text-gray-500 mt-2">{displayCaption}</p>
                    )}
                </div>
            );
        },

        // --- 外部リンク ---
        [INLINES.HYPERLINK]: (node: any, children: any) => {
            return <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors">{children}</a>;
        },

        // --- 内部リンク (エントリー) ---
        [INLINES.ENTRY_HYPERLINK]: (node: any, children: any) => {
            // 内部リンクは、Contentful IDからNext.jsのパスに変換するロジックが必要です
            const entryId = node.data.target?.sys?.id;
            // 🚨 ここを実際のルーティングに合わせる
            const linkPath = `/articles/${entryId}`;

            return <a href={linkPath} className="text-green-600 hover:underline transition-colors">{children}</a>;
        },
        // INLINES.ASSET_HYPERLINK: (node: any, children: any) => { /* ダウンロードリンクなど */ },

        // --- 🔗 埋め込みエントリー ---
        // BLOCKS.EMBEDDED_ENTRY: (node: any) => { /* 内部リンクのカスタムコンポーネント定義 */ },
    },

    // 3. ✍️ テキストマークアップの定義
    renderMark: {
        [MARKS.BOLD]: children => <strong className="font-bold font-dnp">{children}</strong>,
        [MARKS.ITALIC]: children => <em className="italic">{children}</em>,
        [MARKS.UNDERLINE]: children => <u className="underline">{children}</u>,
        [MARKS.CODE]: children => <code className="bg-gray-100 p-1 rounded text-sm font-mono text-red-700">{children}</code>,
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
                        <div className="mt-20 lg:mt-50">
                            {contentBody ? documentToReactComponents(contentBody, customRenderOptions) : (
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